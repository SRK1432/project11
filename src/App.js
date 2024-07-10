import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import WelcomePage from './components/WelcomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path='/welcome' element={<WelcomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
