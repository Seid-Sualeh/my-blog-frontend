
import axios from "axios";
import { API_CONFIG } from "../../utils/configs/api-config";

export const updateWriter = async (id, writerData) => {
  try {
    const response = await axios.put(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WRITERS}/${id}`,
      writerData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update writer");
  }
};
