import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import LogoutButton from "../components/LogoutButton";
import { History } from "lucide-react";

// Add this to get the username from localStorage (if available)
const getUsername = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    // If you store the username separately, use that. Otherwise, skip.
    const username = localStorage.getItem("username");
    return username;
  } catch {
    return null;
  }
};

export default function PeriodSelection() {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const username = getUsername();

  const periods = [
    {
      name: "Modern Era",
      description: "AI, ethics, global conflicts & futuristic dilemmas.",
      color: "from-cyan-500 to-blue-600",
    },
    {
      name: "Medieval Era",
      description: "Kingdom betrayals, war strategies & survival ethics.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      name: "Historical Era",
      description: "Major ethical decisions that shaped human history.",
      color: "from-pink-500 to-red-600",
    },
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900 px-4 py-6 md:py-10 flex flex-col">
      
      {/* 🔐 Top Navigation */}
      <div className="flex justify-end items-center gap-4 mb-6">
        <Link to="/history">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg transition-colors"
            title="View History"
          >
            <History className="w-6 h-6" />
          </motion.button>
        </Link>
        <LogoutButton />
      </div>

      {/* 🧠 Hero Header */}
      {username && (
        <div className="text-center mb-2">
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow">
            Hi, {username}!
          </span>
        </div>
      )}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-5xl md:text-6xl font-extrabold tracking-tight mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow-lg"
      >
        Select Your Time Period
      </motion.h1>

      {/* 🎴 Period Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full"
      >
        {periods.map((period, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedPeriod(period.name)}
            className={`relative p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-2xl backdrop-blur-md bg-white/40 border border-white/20 hover:border-blue-400 group ${
              selectedPeriod === period.name ? "ring-4 ring-blue-400" : ""
            }`}
          >
            {/* Glow Border Effect */}
            <div
              className={`absolute -inset-[2px] z-0 rounded-3xl opacity-30 blur-md pointer-events-none bg-gradient-to-br ${period.color}`}
            ></div>

            {/* Card Content */}
            <div className="relative z-10 flex flex-col justify-center text-center space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 drop-shadow-sm">{period.name}</h2>
              <p className="text-base text-gray-700/80 leading-relaxed">{period.description}</p>
            </div>

            {/* Floating Glow Ring */}
            {selectedPeriod === period.name && (
              <motion.div
                layoutId="glow-ring"
                className="absolute inset-0 border-4 border-blue-400 rounded-3xl z-20 pointer-events-none"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* 🚀 Start Game Button */}
      {selectedPeriod && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-14 flex justify-center"
        >
          <Link to={`/game/${encodeURIComponent(selectedPeriod)}`}>
            <motion.button
              whileHover={{ scale: 1.07 }}
              className="px-12 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl shadow-xl hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Start Game in {selectedPeriod}
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
