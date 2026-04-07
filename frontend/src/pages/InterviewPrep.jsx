import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import QAItem from "../components/QAItems";
import EmptyState from "../components/EmptyState";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const InterviewPrep = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${API_PATHS.SESSION.GET_ONE}/${id}`);
      setQuestions(res.data.session?.questions || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions ❌");
    }
  };

  const generateQuestions = async () => {
    try {
      setLoading(true);

      const res = await axios.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        sessionId: id,
      });

      setQuestions(res.data.questions);

      toast.success("Questions generated successfully ✅");
    } catch (err) {
      console.error(err);

      const status = err.response?.status;

      if (status === 503) {
        toast.error("Server busy 😓 Please try again in a few seconds");
      } else if (status === 429) {
        toast.error("Daily limit reached 🚫 Try again after some time");
      } else {
        toast.error(
          err.response?.data?.message || "Failed to generate questions ❌",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto pt-10">
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-2xl font-bold">Interview Questions</h1>
        </div>

        {questions.length === 0 ? (
          <EmptyState onGenerate={generateQuestions} generating={loading} />
        ) : (
          questions.map((q) => <QAItem key={q._id} item={q} />)
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;
