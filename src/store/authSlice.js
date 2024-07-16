// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('idToken'),
  userId: localStorage.getItem('userId'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      localStorage.setItem('idToken', action.payload.token);
      localStorage.setItem('userId', action.payload.userId);
    },
    logout(state) {
      state.token = null;
      state.userId = null;
      localStorage.removeItem('idToken');
      localStorage.removeItem('userId');
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
