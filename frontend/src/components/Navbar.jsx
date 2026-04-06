import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 shadow-sm bg-white">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Interview Prep AI
      </h1>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-600"
        >
          Dashboard
        </button>

        <button
          onClick={logout}
          className="bg-black text-white px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;