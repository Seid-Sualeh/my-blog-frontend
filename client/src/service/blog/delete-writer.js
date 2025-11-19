
import axios from "axios";
import { API_CONFIG } from "../../utils/configs/api-config";

export const deleteWriter = async (id) => {
  try {
    const response = await axios.delete(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WRITERS}/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete writer");
  }
};
