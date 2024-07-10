import React, { useState } from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const loginSubmitHandler = (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        if (email === '' || password === '') {
            setError('Please enter all credentials');
            setLoading(false);
            return;
        }

        fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBWzmP1mDV0IYFqZ9kSV67TmRB3RoqdMgE', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
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
            setLoading(false);
            navigate('/welcome');
        })
        .catch((error) => {
            setError(error.message);
            setLoading(false);
        });
    };

    return (
        <>
            <form onSubmit={loginSubmitHandler}>
                <h1>Login</h1>
                {error && <p className="error">{error}</p>}
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <button type="button" variant="link">Forgot Password</button>
            </form>
        </>
    );
};

export default Login;
