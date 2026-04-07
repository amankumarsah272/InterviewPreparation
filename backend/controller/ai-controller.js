import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import Question from "../models/question-model.js";
import Session from "../models/session-model.js";
import { conceptExplainPrompt,questionAnswerPrompt } from "../utils/prompts-util.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to handle retries and fallback
const generateWithRetry = async (prompt, retries = 3) => {
  try {
    return await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
  } catch (err) {
    // Retry only for 503 error
    if (retries > 0 && err.status === 503) {
      console.log("Gemini busy... retrying in 2 sec");

      await new Promise((res) => setTimeout(res, 2000));

      return generateWithRetry(prompt, retries - 1);
    }

    //Handle 429 (quota exceeded)
    if (retries > 0 && err.status === 429) {
      console.log("⏳ Quota hit... waiting 50 sec");

      await new Promise((res) => setTimeout(res, 50000)); // 50 sec wait

      return generateWithRetry(prompt, retries - 1);
    }

    // fallback to another model
    if (err.status === 503) {
      console.log("Switching to fallback model...");

      return await ai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: prompt,
      });
    }

    throw err;
  }
};


export const generateInterviewQuestions = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "sessionId is required" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const { role, experience, topicsToFocus } = session;

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, 10);

    const response = await generateWithRetry(prompt);

    const parts = response.candidates?.[0]?.content?.parts ?? [];

    const rawText = parts
      .map((p) => p.text || "")
      .join("");

    // Clean markdown
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let questions;

    try {
      questions = JSON.parse(cleanedText);
    } catch (err) {
      // Try extracting JSON array
      let match = cleanedText.match(/\[[\s\S]*\]/);

      if (!match) {
        // Try object fallback
        match = cleanedText.match(/\{[\s\S]*\}/);
      }

      if (match) {
        try {
          const parsed = JSON.parse(match[0]);

          questions = Array.isArray(parsed)
            ? parsed
            : parsed.questions || [];
        } catch (e) {
          throw new Error("Invalid JSON structure from AI");
        }
      } else {
        throw new Error("No valid JSON found in AI response");
      }
    }

    if (!Array.isArray(questions)) {
      throw new Error("Response is not an array");
    }

    const saved = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer || "",
        note: "",
        isPinned: false,
      })),
    );

    session.questions.push(...saved.map((q) => q._id));
    await session.save();

    res.status(201).json({
      success: true,
      questions: saved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};


export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await generateWithRetry(prompt);

    let rawText = response.text || "";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let explanation;

    try {
      explanation = JSON.parse(cleanedText);
    } catch (err) {
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        explanation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    if (!explanation.title || !explanation.explanation) {
      throw new Error(
        "Response missing required fields: title and explanation",
      );
    }

    res.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};


export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("questions");

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};