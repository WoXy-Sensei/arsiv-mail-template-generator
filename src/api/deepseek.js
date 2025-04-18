import instance from "./axios";

export const chat = async (message) => {
  try {
    const response = await instance.post("/chat", { message });
    return response.data;
  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
};
