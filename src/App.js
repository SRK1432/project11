import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/Details/SignUp';
import Login from './components/Details/Login';
import WelcomePage from './components/Pages/WelcomePage';
import ProfilePage from './components/Pages/ProfilePage';
import ForgotPassword from './components/Pages/ForgotPassword';

function App() {
  return (
    <Router>
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
