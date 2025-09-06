
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/Details/SignUp';
import Login from './components/Details/Login';
import WelcomePage from './components/Pages/WelcomePage';
import ProfilePage from './components/Pages/ProfilePage';
import ForgotPassword from './components/Pages/ForgotPassword';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
