
import axios from "axios";
import { API_CONFIG } from "../../utils/configs/api-config";

export const createWriter = async (writerData) => {
  try {
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WRITERS}`,
      writerData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create writer");
  }
};
