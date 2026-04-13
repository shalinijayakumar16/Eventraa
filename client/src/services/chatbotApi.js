import axios from "axios";
import { apiUrl } from "../constants/api";

export const sendChatbotMessage = async ({ userId, message }) => {
  const response = await axios.post(apiUrl("/api/chatbot"), {
    userId,
    message,
  });

  return response.data;
};