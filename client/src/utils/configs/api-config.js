

export const API_CONFIG = {
  

  
  BASE_URL: 'https://seid-blog-website.onrender.com/api',

  ENDPOINTS: {
    BLOGS: "/blog",
    WRITERS: "/writer",
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
