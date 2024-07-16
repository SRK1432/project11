import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { profileActions } from '../../store/profileSlice';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fullname, profileURL } = useSelector((state) => state.profile);
  const token = useSelector((state) => state.auth.token);
  const [localFullname, setLocalFullname] = useState(fullname);
  const [localProfileURL, setLocalProfileURL] = useState(profileURL);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBWzmP1mDV0IYFqZ9kSV67TmRB3RoqdMgE`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: token }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error.message || 'Failed to fetch profile data!');
        }

        const data = await response.json();
        if (data.users.length > 0) {
          dispatch(profileActions.setProfile({
            fullname: data.users[0].displayName || '',
            profileURL: data.users[0].photoUrl || '',
          }));
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProfileData();
  }, [token, navigate, dispatch]);

  const updateProfileHandler = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBWzmP1mDV0IYFqZ9kSV67TmRB3RoqdMgE`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken: token,
          displayName: localFullname,
          photoUrl: localProfileURL,
          returnSecureToken: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error.message || 'Profile update failed!');
      }

      dispatch(profileActions.updateProfile({
        fullname: localFullname,
        profileURL: localProfileURL,
      }));

      const authData = await response.json();
      await fetch(`https://expense-tracker-1c231-default-rtdb.firebaseio.com/users/${authData.localId}.json?auth=${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: localFullname,
          profileURL: localProfileURL,
        }),
      });

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
        <div className="left">Winners never quit, Quitters never win..</div>
        <div className="right">
          <p>Your profile is 64% completed. A complete profile</p>
          <p> has higher chances of landing a job <a href="##">complete now</a></p>
        </div>
      </nav>
      <h1>Contact Details</h1>
      <form className="profile-form" onSubmit={updateProfileHandler}>
        {error && <p className="error">{error}</p>}
        <label htmlFor="contact">Full Name:</label>
        <input type="text" id="contact" value={localFullname} onChange={(e) => setLocalFullname(e.target.value)} />
        <label htmlFor="photo">Profile photo URL:</label>
        <input type="text" id="url" value={localProfileURL} onChange={(e) => setLocalProfileURL(e.target.value)} />
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
        <button type="button" onClick={() => navigate('/welcome')}>Cancel</button>
      </form>
    </>
  );
};

export default ProfilePage;
