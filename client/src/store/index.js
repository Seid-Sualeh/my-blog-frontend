import { configureStore } from '@reduxjs/toolkit';
import { blogApi } from './api/blogApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [blogApi.reducerPath]: blogApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(blogApi.middleware),
});