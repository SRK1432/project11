import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { themeActions } from '../store/themeSlice';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const toggleThemeHandler = () => {
    dispatch(themeActions.toggleTheme());
  };

  return (
    <button onClick={toggleThemeHandler}>
      Switch to {isDarkMode ? 'Light' : 'Dark'} Theme
    </button>
  );
};

export default ThemeToggle;
