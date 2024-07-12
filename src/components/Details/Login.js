// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);

  const loginSubmitHandler = (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBWzmP1mDV0IYFqZ9kSV67TmRB3RoqdMgE', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            let errorMessage = 'Authentication failed!';
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Logged in successfully:', data);
        localStorage.setItem('idToken', data.idToken);
        setEmailVerified(data.emailVerified);
        setLoading(false);
        navigate('/welcome');
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <form onSubmit={loginSubmitHandler}>
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <button type="button" onClick={() => navigate('/forgot-password')}>Forgot Password</button>

    </form>
  );
};

export default Login;
