import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

interface GameSession {
  period: string;
  total_score: number;
  timestamp: string;
}

interface HistoryData {
  username: string;
  games: GameSession[];
}

const toIST = (utcString: string) => {
  return new Date(utcString).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
};

export default function History() {
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 text-red-700 underline"
            >
              Please login to view history
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!history) {
    return null;
  }

  // Calculate average score per game
  const avgScore =
    history.games.length > 0
      ? history.games.reduce((sum, g) => sum + g.total_score, 0) / history.games.length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/select-period")}
          className="mb-8 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition-colors font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Selection
        </button>
        <div className="bg-white/80 rounded-2xl shadow-2xl p-8 mb-10 text-center backdrop-blur-md">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight drop-shadow-sm">
            Game History
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Welcome, <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow">{history.username}</span>!
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-4">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold shadow">
              Games Played: {history.games.length}
            </span>
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold shadow">
              Avg. Score: <span className="font-bold">{avgScore.toFixed(1)}</span>
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {history.games.map((game, index) => {
            const finalScore = game.total_score / 5;
            return (
              <div
                key={index}
                className="bg-white/90 rounded-xl shadow-xl p-6 sm:p-8 border border-gray-200 hover:shadow-2xl transition-all relative"
              >
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                  <span className="inline-block bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-2 rounded-full font-bold text-lg shadow">
                    {game.period}
                  </span>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-lg font-bold shadow ${
                      finalScore >= 80
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : finalScore >= 50
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    Final Score: {finalScore.toFixed(1)} / 100
                  </span>
                </div>
                <div className="flex justify-end">
                  <span className="text-sm text-gray-500 italic">
                    {toIST(game.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {history.games.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center mt-10">
            <p className="text-gray-600">No history available yet.</p>
            <button
              onClick={() => navigate("/select-period")}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Playing
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 