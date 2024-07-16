import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fullname: '',
  profileURL: '',
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.fullname = action.payload.fullname;
      state.profileURL = action.payload.profileURL;
    },
    updateProfile(state, action) {
      state.fullname = action.payload.fullname;
      state.profileURL = action.payload.profileURL;
    },
  },
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;
