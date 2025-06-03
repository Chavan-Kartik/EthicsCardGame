import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface DilemmaData {
  dilemma: string;
  choices: string[];
}

export default function Game() {
  const [dilemma, setDilemma] = useState<string>("");
  const [choices, setChoices] = useState<string[]>([]);
  
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const period = params.get("period") || "Modern Era"; 

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/get-dilemma?period=${encodeURIComponent(period)}`)
      .then((response) => response.json())
      .then((data: DilemmaData) => {
        setDilemma(data.dilemma);
        setChoices(data.choices);
      })
      .catch((error) => console.error("Error fetching dilemma:", error));
  }, [period]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Ethics in AI</h1>
      <h2 className="text-xl mt-4">{period}</h2>

      {dilemma ? (
        <p className="mt-4">{dilemma}</p>
      ) : (
        <p className="mt-4 text-gray-500">Loading dilemma...</p>
      )}

      <div className="mt-6">
        {choices.length > 0 ? (
          choices.map((choice, index) => (
            <button 
              key={index} 
              className="block w-full px-4 py-2 my-2 text-left bg-blue-500 text-white rounded-lg"
            >
              {choice}
            </button>
          ))
        ) : (
          <p className="text-gray-500">Loading choices...</p>
        )}
      </div>
    </div>
  );
}
