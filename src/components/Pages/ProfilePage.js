import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const [profileURL, setProfileURL] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      const idToken = localStorage.getItem('idToken');
      if (!idToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBWzmP1mDV0IYFqZ9kSV67TmRB3RoqdMgE`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: idToken,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          let errorMessage = 'Failed to fetch profile data!';
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        if (data.users.length > 0) {
          setFullname(data.users[0].displayName || '');
          setProfileURL(data.users[0].photoUrl || '');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const updateProfileHandler = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const idToken = localStorage.getItem('idToken');

    try {
      // Update profile in Firebase Authentication
      const authResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBWzmP1mDV0IYFqZ9kSV67TmRB3RoqdMgE`, {
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

      if (!authResponse.ok) {
        const data = await authResponse.json();
        let errorMessage = 'Profile update failed!';
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }

      const authData = await authResponse.json();
      console.log('Profile updated in Firebase Authentication', authData);

      // Save profile data in Firebase Realtime Database
      const dbResponse = await fetch(`https://expense-tracker-1c231-default-rtdb.firebaseio.com/users/${authData.localId}.json?auth=${idToken}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: fullname,
          profileURL: profileURL,
        }),
      });

      if (!dbResponse.ok) {
        const data = await dbResponse.json();
        let errorMessage = 'Saving profile data failed!';
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }

      const dbData = await dbResponse.json();
      console.log('Profile data saved in Firebase Realtime Database', dbData);

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
        <input type="text" id="contact" value={fullname} onChange={(e) => setFullname(e.target.value)}/>
        <label htmlFor="photo">Profile photo URL</label>
        <input type="text" id="url" value={profileURL} onChange={(e) => setProfileURL(e.target.value)}/>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
        <button type="button">cancel</button>
      </form>
    </>
  );
};

export default ProfilePage;
