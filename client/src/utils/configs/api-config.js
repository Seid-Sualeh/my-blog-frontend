// export const API_CONFIG = {
//   BASE_URL: "http://localhost:3000/api",
//   ENDPOINTS: {
//     BLOGS: "/blog",
//     WRITERS: "/writer",
//   },
// };

export const API_CONFIG = {
  // For development - connect to local backend
  BASE_URL: "http://localhost:3000/api",

  // For production - you'll update this later
  // BASE_URL: 'https://your-backend-url.herokuapp.com/api',

  ENDPOINTS: {
    BLOGS: "/blog",
    WRITERS: "/writer",
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
