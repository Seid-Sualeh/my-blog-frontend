
import axios from "axios";
import { API_CONFIG } from "../../utils/configs/api-config";

const getBlogs = async (params = {}) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BLOGS}`,
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
};
export default getBlogs;



