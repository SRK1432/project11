import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const [profileURL, setProfileURL] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateProfileHandler = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const idToken = localStorage.getItem('idToken');

    try {
      const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBWzmP1mDV0IYFqZ9kSV67TmRB3RoqdMgE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
          displayName: fullname,
          photoUrl: profileURL,
          returnSecureToken: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        let errorMessage = 'Profile update failed!';
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Profile updated', data);
      setLoading(false);
      navigate('/welcome');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="left">Winners never quit,Quitters never win..</div>
        <div className="right">
          <p>Your profile is 64% completed. A complete profile</p> 
          <p> has higher chances of landing a job <a href="##">complete now</a></p>
        </div>
      </nav>
      <h1>Contact Details</h1>
      <form className="profile-form" onSubmit={updateProfileHandler}>
        {error && <p className="error">{error}</p>}
        <label htmlFor="contact">Full Name:</label>
        <input type="text" id="contact" value={fullname} onChange={(e) => setFullname(e.target.value)} />
        <label htmlFor="photo">Profile photo URL</label>
        <input type="text" id="url" value={profileURL} onChange={(e) => setProfileURL(e.target.value)} />
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
        <button type="button">cancel</button>
      </form>
    </>
  );
};

export default ProfilePage;
