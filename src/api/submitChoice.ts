// submitChoice.ts
import axios from "../utils/axios";

export interface ChoiceSubmitData {
  period: string;
  question: string;
  selected_answer: string;
}

export const submitChoice = async (data: ChoiceSubmitData) => {
  const response = await axios.post("/api/submit", data);  // ✅ FIXED URL
  return response.data;
};
