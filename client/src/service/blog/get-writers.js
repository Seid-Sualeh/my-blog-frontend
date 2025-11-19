
import axios from "axios";
import { API_CONFIG } from "../../utils/configs/api-config";

export const getWriters = async (params = {}) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WRITERS}`,
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch writers");
  }
};
