import axios from "axios";

export const sendChatbotMessage = async ({ userId, message }) => {
  const response = await axios.post("/api/chatbot", {
    userId,
    message,
  });

  return response.data;
};