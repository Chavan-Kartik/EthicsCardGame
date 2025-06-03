import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { token, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-100 text-gray-900 text-center px-6 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-white/40 blur-3xl rounded-full w-[80vw] h-[80vw] top-[-30%] left-[-40%] z-0"></div>

      {/* Title */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="text-6xl font-black mb-6 z-10 tracking-tight drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600"
      >
        Ethical Dilemma Game
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
        className="text-2xl text-gray-700 max-w-2xl z-10 leading-relaxed mb-8"
      >
        Test your moral compass through time. Face ethical dilemmas across different historical eras and see how you decide!
      </motion.p>

      {/* Auth Buttons */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1.2 }}
        className="mt-10 flex flex-col sm:flex-row gap-4 z-10"
      >
        {token ? (
          <>
            <Link to="/select-period">
              <button className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 rounded-full shadow-xl transition-all transform hover:scale-105">
                Start Game
              </button>
            </Link>
            <Link to="/history">
              <button className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 rounded-full shadow-xl transition-all transform hover:scale-105">
                View History
              </button>
            </Link>
            <button 
              onClick={logout}
              className="text-sm text-red-400 underline hover:text-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="px-8 py-3 text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-full shadow-lg transition-transform transform hover:scale-105">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-8 py-3 text-lg font-medium bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-full shadow-lg transition-transform transform hover:scale-105">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-500 text-sm z-10">
        © 2025 Ethical Dilemma Game. All Rights Reserved.
      </footer>
    </div>
  );
}