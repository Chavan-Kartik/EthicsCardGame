import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const token = localStorage.getItem("token");

  let username = "";
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    username = payload.sub;
  }

  return (
    <div className="flex items-center gap-4">
      {username && <span className="text-sm text-gray-300">Hi, {username}</span>}
      <button
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
