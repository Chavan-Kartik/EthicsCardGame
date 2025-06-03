import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/signup", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Signup successful! Please login.");
      navigate("/login");
    } else {
      alert("Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 drop-shadow-lg">
          ✨ Sign Up
        </h2>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-green-900">Username</label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-white/70 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow"
              placeholder="Enter your username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-green-900">Email</label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-white/70 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-green-900">Password</label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-white/70 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg text-lg font-bold shadow-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-green-600 hover:underline hover:text-green-500 font-semibold"
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}