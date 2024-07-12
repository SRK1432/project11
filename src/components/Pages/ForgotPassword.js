
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const resetPasswordHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBWzmP1mDV0IYFqZ9kSV67TmRB3RoqdMgE', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestType: 'PASSWORD_RESET',
        email: email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            let errorMessage = 'Password reset failed!';
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
        setMessage('A password reset email has been sent to your email address. Please check your inbox.');
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <form onSubmit={resetPasswordHandler}>
      <h1>Forgot Password</h1>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
      <button type="button" onClick={() => navigate('/login')}>Back to Login</button>
    </form>
  );
};

export default ForgotPassword;
