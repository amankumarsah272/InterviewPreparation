// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { API_PATHS } from "../utils/apiPaths";
// import axios from "../utils/axiosInstance";
// import Navbar from "../components/Navbar";
// import { toast } from "react-toastify";

// const Dashboard = () => {
//   const [sessions, setSessions] = useState([]);
//   const [role, setRole] = useState("");
//   const [experience, setExperience] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const fetchSessions = async () => {
//     try {
//       const res = await axios.get(API_PATHS.SESSION.GET_ALL);
//       setSessions(res.data.sessions);
//     } catch (err) {
//       console.log(err.response);
//       toast.error("Failed to load sessions ❌");
//     }
//   };

//   const createSession = async () => {
//     if (!role || !experience) {
//       return toast.error("Please fill all fields ⚠️");
//     }

//     try {
//       setLoading(true);

//       await axios.post(API_PATHS.SESSION.CREATE, {
//         role,
//         experience,
//         questions: [],
//       });

//       toast.success("Session created successfully 🎉");

//       setRole("");
//       setExperience("");
//       fetchSessions();
//     } catch (error) {
//       console.log(error.response);
//       toast.error(
//         error.response?.data?.message || "Failed to create session ❌"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSessions();
//   }, []);

//   return (
//     <div>
//       <Navbar />

//       <div className="max-w-6xl mx-auto pt-10">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold">Dashboard</h1>
//           <p className="text-gray-500 mt-1">
//             Manage your interview preparation sessions
//           </p>
//         </div>

//         {/* Create Session Card */}
//         <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
//           <h2 className="text-lg font-semibold mb-4">Create New Session</h2>

//           <div className="flex flex-col md:flex-row gap-4">
//             <input
//               placeholder="Enter Role (Frontend Developer)"
//               value={role}
//               className="border border-gray-200 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
//               onChange={(e) => setRole(e.target.value)}
//             />

//             <input
//               placeholder="Experience (2 yrs)"
//               value={experience}
//               className="border border-gray-200 p-3 rounded-lg w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-orange-400"
//               onChange={(e) => setExperience(e.target.value)}
//             />

//             <button
//               onClick={createSession}
//               disabled={loading}
//               className={`px-6 py-3 rounded-lg cursor-pointer transition ${
//                 loading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-orange-500 text-white hover:bg-orange-600"
//               }`}
//             >
//               {loading ? "Creating..." : "+ Create"}
//             </button>
//           </div>
//         </div>

//         {/* Sessions */}
//         {sessions.length === 0 ? (
//           <div className="text-center text-gray-500 mt-20">
//             <p className="text-lg">No sessions yet 😕</p>
//             <p className="text-sm">
//               Create your first session to get started
//             </p>
//           </div>
//         ) : (
//           <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {sessions.map((s) => (
//               <div
//                 key={s._id}
//                 onClick={() => navigate(`/interview/${s._id}`)}
//                 className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md hover:scale-[1.02] transition cursor-pointer"
//               >
//                 <h2 className="font-semibold text-lg mb-2">{s.role}</h2>
//                 <p className="text-gray-500 text-sm">
//                   {s.experience} experience
//                 </p>
//                 <div className="mt-4 text-xs text-gray-400">
//                   Click to start →
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../utils/apiPaths";
import axios from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      const res = await axios.get(API_PATHS.SESSION.GET_ALL);
      setSessions(res.data.sessions);
    } catch (err) {
      console.log(err.response);
      toast.error("Failed to load sessions ❌");
    }
  };

  const createSession = async () => {
    if (!role || !experience) {
      return toast.error("Please fill all fields ⚠️");
    }

    try {
      setLoading(true);

      await axios.post(API_PATHS.SESSION.CREATE, {
        role,
        experience,
        questions: [],
      });

      toast.success("Session created successfully 🎉");

      setRole("");
      setExperience("");
      fetchSessions();
    } catch (error) {
      console.log(error.response);
      toast.error(
        error.response?.data?.message || "Failed to create session ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  //DELETE FUNCTION
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // ❗ important (prevent card click)

    if (!window.confirm("Delete this session?")) return;

    try {
      await axios.delete(API_PATHS.SESSION.DELETE(id));
      toast.success("Session deleted 🗑️");
      fetchSessions();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed ❌");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto pt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage your interview preparation sessions
          </p>
        </div>

        {/* Create Session Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Session</h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              placeholder="Enter Role (Frontend Developer)"
              value={role}
              className="border border-gray-200 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={(e) => setRole(e.target.value)}
            />

            <input
              placeholder="Experience (2 yrs)"
              value={experience}
              className="border border-gray-200 p-3 rounded-lg w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onChange={(e) => setExperience(e.target.value)}
            />

            <button
              onClick={createSession}
              disabled={loading}
              className={`px-6 py-3 rounded-lg cursor-pointer transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {loading ? "Creating..." : "+ Create"}
            </button>
          </div>
        </div>

        {/* Sessions */}
        {sessions.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">No sessions yet 😕</p>
            <p className="text-sm">
              Create your first session to get started
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sessions.map((s) => (
              <div
                key={s._id}
                onClick={() => navigate(`/interview/${s._id}`)}
                className="relative group bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md hover:scale-[1.02] transition cursor-pointer"
              >
                {/* 🗑️ DELETE ICON */}
                <button
                  onClick={(e) => handleDelete(e, s._id)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700"
                >
                  <FaTrash size={14} />
                </button>

                <h2 className="font-semibold text-lg mb-2">{s.role}</h2>
                <p className="text-gray-500 text-sm">
                  {s.experience} experience
                </p>
                <div className="mt-4 text-xs text-gray-400">
                  Click to start →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Dashboard;