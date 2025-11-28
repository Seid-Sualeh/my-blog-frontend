import { createSlice } from '@reduxjs/toolkit';

// Helper function to get initial auth state from localStorage
const getInitialAuthState = () => {
  try {
    const storedAuth = localStorage.getItem('writerAuth');
    return storedAuth ? JSON.parse(storedAuth) : {
      isAuthenticated: false,
      writerId: null,
      email: null,
      writer: null,
    };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {
      isAuthenticated: false,
      writerId: null,
      email: null,
      writer: null,
    };
  }
};

const initialState = getInitialAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { writerId, email, writer } = action.payload;
      state.isAuthenticated = true;
      state.writerId = writerId;
      state.email = email;
      state.writer = writer;
      
      // Save to localStorage
      try {
        localStorage.setItem('writerAuth', JSON.stringify({
          isAuthenticated: true,
          writerId,
          email,
          writer,
        }));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.writerId = null;
      state.email = null;
      state.writer = null;
      
      // Remove from localStorage
      try {
        localStorage.removeItem('writerAuth');
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    },
    updateWriter: (state, action) => {
      state.writer = { ...state.writer, ...action.payload };
      
      // Update localStorage
      try {
        const storedAuth = localStorage.getItem('writerAuth');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          authData.writer = { ...authData.writer, ...action.payload };
          localStorage.setItem('writerAuth', JSON.stringify(authData));
        }
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    },
  },
});

export const { setCredentials, logout, updateWriter } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentWriter = (state) => state.auth.writer;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectWriterId = (state) => state.auth.writerId;