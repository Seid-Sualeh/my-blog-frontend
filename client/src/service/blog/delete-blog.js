import axios from "axios";
import { API_CONFIG } from "../../utils/configs/api-config";

export const deleteBlog = async (id) => {
  try {
    const response = await axios.delete(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BLOGS}/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete blog");
  }
};
