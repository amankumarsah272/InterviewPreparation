export const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions,
) => {
  return `You are a senior engineer conducting a technical interview.

Generate exactly ${numberOfQuestions} interview questions for the following profile:
- Role: ${role}
- Experience: ${experience} years
- Topics to focus on: ${topicsToFocus || "general topics for this role"}

Rules for each question:
1. The "answer" must be formatted as a string using \\n for line breaks.
2. Use **bold** text and bullet points (-) where needed.
3. If code is needed, include it as plain text (DO NOT use triple backticks).
4. Keep answers structured and readable.
5. Difficulty should match ${experience} years of experience.

STRICT RULES:
- Return ONLY valid JSON
- Do NOT use backticks (\`\`\`)
- Do NOT add extra text
- Ensure proper commas and quotes

Example:
[
  {
    "question": "What is React?",
    "answer": "**Definition:** React is a library.\\n\\n**Key Points:**\\n- Component-based\\n- Virtual DOM\\n\\nCode Example:\\nconst App = () => <div>Hello</div>;"
  }
]`;
};

export const conceptExplainPrompt = (question) => {
  return `You are a senior developer explaining a concept to a junior developer.

Explain the following interview question in depth:
"${question}"

Structure your explanation like this:
1. Start with a **one-line definition** in bold.
2. Explain the concept in 2–3 short paragraphs.
3. Use bullet points for any list of features, pros/cons, or steps.
4. If relevant, include a small code example (under 10 lines) in a \`\`\`js block.
5. End with a **"Key Takeaway"** line summarizing the concept in one sentence.

Return ONLY a valid JSON object in this exact shape. No extra text outside the JSON:

{
  "title": "Short, clear concept title (5 words max)",
  "explanation": "**Definition:** ...\\n\\n Paragraph...\\n\\n**Key Takeaway:** ..."
}`;
};
