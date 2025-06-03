import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Dilemma {
  question: string;
  choices: { text: string; score: number; explanation: string }[];
}

interface GameState {
  currentQuestion: number;
  totalQuestions: number;
  scores: number[];
  answers: string[];
  explanations: string[];
  isGameComplete: boolean;
}

const GamePage = () => {
  const { period } = useParams<{ period?: string }>();
  const navigate = useNavigate();

  const [dilemma, setDilemma] = useState<Dilemma | null>(null);
  const [error, setError] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 1,
    totalQuestions: 5,
    scores: [],
    answers: [],
    explanations: [],
    isGameComplete: false,
  });

  useEffect(() => {
    if (!period) {
      navigate("/periods");
      return;
    }
    fetchDilemma();
  }, [period, gameState.currentQuestion]);

  const fetchDilemma = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/get-dilemma?period=${encodeURIComponent(period!)}`);
      const data = await res.json();
      setDilemma(data);
      setSelectedAnswer(""); // Reset selected answer for new question
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dilemma.");
    }
  };

  const handleAnswer = async (answerIdx: number) => {
    if (!dilemma) return;
    const answerObj = dilemma.choices[answerIdx];
    setSelectedAnswer(answerObj.text);
    const token = localStorage.getItem("token");
    const answerLetter = String.fromCharCode(65 + answerIdx); // 0->A, 1->B, 2->C, 3->D

    // No need to call backend for scoring, but keep submission for history
    try {
      const res = await fetch("http://127.0.0.1:8000/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          period,
          question: dilemma.question,
          selected_answer: answerLetter, // Store the letter for history
        }),
      });

      // Use local score/explanation for display
      const newScore = answerObj.score;
      const explanation = answerObj.explanation;

      setGameState(prev => {
        const newScores = [...prev.scores, newScore];
        const newAnswers = [...prev.answers, `${answerLetter}: ${answerObj.text}`];
        const newExplanations = [...prev.explanations, explanation];
        const isLastQuestion = prev.currentQuestion === prev.totalQuestions;
        return {
          ...prev,
          scores: newScores,
          answers: newAnswers,
          explanations: newExplanations,
          isGameComplete: isLastQuestion,
          currentQuestion: isLastQuestion ? prev.currentQuestion : prev.currentQuestion + 1
        };
      });
    } catch (err) {
      console.error("Error submitting answer:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const calculateAverageScore = () => {
    if (gameState.scores.length === 0) return 0;
    return gameState.scores.reduce((a, b) => a + b, 0) / gameState.scores.length;
  };

  const getScoreColor = (score: number) => {
    if (score >= 100.0) return "text-green-400";
    if (score >= 75.0) return "text-green-300";
    if (score >= 50.0) return "text-yellow-400";
    if (score >= 10.0) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 100.0) return "Best Ethical Decision";
    if (score >= 75.0) return "Balanced Decision";
    if (score >= 50.0) return "Risky Decision";
    if (score >= 10.0) return "Immoral Decision";
    return "Invalid Decision";
  };

  if (gameState.isGameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white/80 rounded-2xl p-10 shadow-2xl backdrop-blur-md"
        >
          <h1 className="text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow-lg">Game Complete!</h1>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-900">Your Results</h2>
            <div className="space-y-4">
              {gameState.scores.map((score, index) => (
                <div key={index} className="bg-white/90 rounded-xl p-4 shadow border border-gray-200">
                  <p className="text-gray-700 mb-2 font-semibold">Question {index + 1}</p>
                  <p className="text-gray-500 mb-2">Your answer: <span className="font-medium text-blue-700">{gameState.answers[index]}</span></p>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`font-semibold ${getScoreColor(score)}`}>{getScoreLabel(score)}</p>
                    <p className={`font-bold ${getScoreColor(score)}`}>{score.toFixed(0)} Points</p>
                  </div>
                  <p className="text-gray-600 italic">{gameState.explanations[index]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-xl mb-2 text-blue-900 font-semibold">Total Score</p>
            <p className={`text-4xl font-extrabold ${getScoreColor(calculateAverageScore())} drop-shadow-lg`}>
              {calculateAverageScore().toFixed(0)} Points
            </p>
            <p className="text-gray-500 mt-2">{getScoreLabel(calculateAverageScore())}</p>
          </div>

          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/select-period")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-700 transition-colors"
            >
              Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/history")}
              className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg font-semibold shadow hover:from-gray-500 hover:to-gray-700 transition-colors"
            >
              View History
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow">{period} Dilemma</h1>
          <div className="text-gray-500 font-semibold">
            Question {gameState.currentQuestion} of {gameState.totalQuestions}
          </div>
        </div>

        {dilemma ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 rounded-2xl p-8 shadow-xl backdrop-blur-md"
          >
            <p className="text-xl mb-6 text-blue-900 font-semibold">{dilemma.question}</p>
            <div className="grid grid-cols-1 gap-4">
              {dilemma.choices.map((choice, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-4 rounded-xl font-semibold text-lg transition shadow-lg border border-gray-200 backdrop-blur-md ${
                    selectedAnswer === choice.text
                      ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                      : "bg-gradient-to-r from-blue-400 to-purple-400 text-gray-900 hover:from-blue-500 hover:to-purple-500"
                  }`}
                  onClick={() => handleAnswer(idx)}
                  disabled={!!selectedAnswer}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> {choice.text}
                </motion.button>
              ))}
            </div>
            {selectedAnswer && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-lg text-green-600 font-semibold text-center"
              >
                Loading next question...
              </motion.p>
            )}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500">{error || "Loading dilemma..."}</p>
        )}
      </div>
    </div>
  );
};

export default GamePage;
