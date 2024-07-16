import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import expensesReducer from './expensesSlice';
import profileReducer from './profileSlice';
import themeReducer from './themeSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    profile: profileReducer,
    theme: themeReducer,
  },
});

export default store;
