
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from './ExpenseForm';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [emailVerified, setEmailVerified] = useState(true);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const idToken = localStorage.getItem('idToken');
    if (!idToken) {
      navigate('/login');
      return;
    }

    // Fetch the user's profile to check if the email is verified
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBWzmP1mDV0IYFqZ9kSV67TmRB3RoqdMgE', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: idToken,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.users && data.users.length > 0) {
          setEmailVerified(data.users[0].emailVerified);
        }
      })
      .catch((error) => {
        setError('Failed to fetch user data');
      });
  }, [navigate]);

  const sendVerificationEmail = () => {
    setError(null);
    const idToken = localStorage.getItem('idToken');
    if (!idToken) {
      navigate('/login');
      return;
    }

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBWzmP1mDV0IYFqZ9kSV67TmRB3RoqdMgE', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestType: 'VERIFY_EMAIL',
        idToken: idToken,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            let errorMessage = 'Failed to send verification email!';
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
        setVerificationSent(true);
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  const logoutHandler = () => {
    localStorage.removeItem('idToken');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="left">Welcome to Expense Tracker!!!</div>
        <div className="right">
          {!emailVerified && (
            <>
              <p>Your email is not verified. Please verify your email to continue using the platform.</p>
              <button onClick={sendVerificationEmail}>Verify Email</button>
              {verificationSent && <p>A verification email has been sent to your email address. Please check your inbox.</p>}
            </>
          )}
          <button onClick={logoutHandler}>Logout</button>
        </div>
      </nav>
      {error && <p className="error">{error}</p>}
       <ExpenseForm />
    </div>
  );
};

export default WelcomePage;
