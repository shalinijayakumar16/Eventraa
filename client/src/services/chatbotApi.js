import axios from "axios";
import { apiUrl } from "../constants/api";

export const sendChatbotMessage = async ({ userId, message }) => {
  if (userId) {
    try {
      const response = await axios.post(apiUrl("/api/chatbot"), {
        userId,
        message,
      });

      return response.data;
    } catch (error) {
      // Fall back to semantic FAQ endpoint if personalized chat fails
    }
  }

  const response = await axios.post(apiUrl("/api/chatbot/query"), {
    message,
  });

  return response.data;
};