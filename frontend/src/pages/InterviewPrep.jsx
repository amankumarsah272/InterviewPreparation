import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import QAItem from "../components/QAItems";
import Navbar from "../components/Navbar";

const InterviewPrep = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);

  const fetchQuestions = async () => {
    const res = await axios.get(`${API_PATHS.SESSION.GET_ALL}/${id}`);
    setQuestions(res.data.questions || []);
  };

  const generateQuestions = async () => {
    await axios.post(API_PATHS.AI.GENERATE, { sessionId: id });
    fetchQuestions();
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto pt-10">
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-2xl font-bold">Interview Questions</h1>

          <button
            onClick={generateQuestions}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Generate
          </button>
        </div>

        {questions.length === 0 ? (
          <p className="text-gray-500">No questions yet. Generate now 🚀</p>
        ) : (
          questions.map((q) => <QAItem key={q._id} item={q} />)
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;
