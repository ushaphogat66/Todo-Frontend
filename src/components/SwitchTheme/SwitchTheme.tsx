"use client"

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/todo/store';
import { setTheme, selectTheme } from '@/features/theme/theme';
import { ThemeName } from '@/features/theme/theme';
import { FiMoon } from "react-icons/fi";
import { LuSunMedium } from "react-icons/lu";

interface ThemeToggleProps {
  themeProperties: any;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ themeProperties }) => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.theme);
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as ThemeName) || 'Light';
    dispatch(setTheme(savedTheme));
  }, [dispatch]);

  const toggleTheme = () => {
    const newTheme: ThemeName = currentTheme === 'Dark' ? 'Light' : 'Dark';
    dispatch(setTheme(newTheme));
  };

  return (
    <button onClick={toggleTheme}>
      {currentTheme === 'Dark' ? <LuSunMedium size={22} 
          style={{ color: themeProperties.textColor }}
          /> : <FiMoon size={22} 
          style={{ color: themeProperties.textColor }}
      />}
    </button>
  );
};

export default ThemeToggle;