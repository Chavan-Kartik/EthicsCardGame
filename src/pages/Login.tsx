import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      body: new URLSearchParams({
        username: username,
        password: password,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      alert("Login successful!");
      navigate("/select-period");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow-lg">
          🔐 Log In
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-900">Username</label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-white/70 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
              placeholder="Enter your username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-blue-900">Password</label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-white/70 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg text-lg font-bold shadow-lg transition duration-300"
          >
            Log In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <a
            href="/signup"
            className="text-blue-600 hover:underline hover:text-blue-500 font-semibold"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}