import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import expensesReducer from './expensesSlice';
import profileReducer from './profileSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    profile: profileReducer,
  },
});

export default store;
