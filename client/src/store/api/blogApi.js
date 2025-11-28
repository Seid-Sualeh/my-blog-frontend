import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "../../utils/configs/api-config";

// Define the base query
const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Create the API
export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery,
  tagTypes: ["Blog", "Writer"],
  endpoints: (builder) => ({
    // Blog endpoints
    getAllBlogs: builder.query({
      query: (params = {}) => ({
        url: API_CONFIG.ENDPOINTS.BLOGS,
        method: "GET",
        params,
      }),
      // Normalize different possible backend shapes so frontend consumers
      // always receive an object like: { blogs: [...] }
      transformResponse: (response) => {
        const extractBlogs = (resp) => {
          if (!resp) return [];
          if (Array.isArray(resp)) return resp;
          if (resp.blogs && Array.isArray(resp.blogs)) return resp.blogs;
          if (resp.data && Array.isArray(resp.data)) return resp.data;
          if (resp._id || resp.id) return [resp];
          return [];
        };

        return { blogs: extractBlogs(response) };
      },
      providesTags: ["Blog"],
    }),

    getBlogById: builder.query({
      query: (id) => ({
        url: `${API_CONFIG.ENDPOINTS.BLOGS}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    createBlog: builder.mutation({
      query: (blogData) => ({
        url: API_CONFIG.ENDPOINTS.BLOGS,
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: ["Blog"],
    }),

    updateBlog: builder.mutation({
      query: ({ id, ...blogData }) => ({
        url: `${API_CONFIG.ENDPOINTS.BLOGS}/${id}`,
        method: "PUT",
        body: blogData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Blog", id },
        "Blog",
      ],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `${API_CONFIG.ENDPOINTS.BLOGS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    // Writer endpoints
    getAllWriters: builder.query({
      query: () => ({
        url: API_CONFIG.ENDPOINTS.WRITERS,
        method: "GET",
      }),
      // Normalize different possible backend shapes so frontend consumers
      // always receive an object like: { writers: [...] }
      transformResponse: (response) => {
        const extractWriters = (resp) => {
          if (!resp) return [];
          if (Array.isArray(resp)) return resp;
          if (resp.writers && Array.isArray(resp.writers)) return resp.writers;
          // Some APIs wrap payload under `data` or nested objects
          if (resp.data) return extractWriters(resp.data);
          // If response has a single writer object, wrap it into an array
          if (resp._id || resp.id) return [resp];
          return [];
        };

        return { writers: extractWriters(response) };
      },
      providesTags: ["Writer"],
    }),

    getWriterById: builder.query({
      query: (id) => ({
        url: `${API_CONFIG.ENDPOINTS.WRITERS}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Writer", id }],
    }),

    createWriter: builder.mutation({
      query: (writerData) => ({
        url: API_CONFIG.ENDPOINTS.WRITERS,
        method: "POST",
        body: writerData,
      }),
      invalidatesTags: ["Writer"],
    }),

    updateWriter: builder.mutation({
      query: ({ id, ...writerData }) => ({
        url: `${API_CONFIG.ENDPOINTS.WRITERS}/${id}`,
        method: "PUT",
        body: writerData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Writer", id },
        "Writer",
      ],
    }),

    deleteWriter: builder.mutation({
      query: (id) => ({
        url: `${API_CONFIG.ENDPOINTS.WRITERS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Writer", id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetAllWritersQuery,
  useGetWriterByIdQuery,
  useCreateWriterMutation,
  useUpdateWriterMutation,
  useDeleteWriterMutation,
} = blogApi;
