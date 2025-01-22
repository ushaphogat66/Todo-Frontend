"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/todo/store';
import themes from '@/utils/themes';

export type ThemeName = 'Dark' | 'Light';

interface ThemeState {
  theme: ThemeName;
}

const savedTheme = (typeof window !== 'undefined' && (localStorage.getItem('theme') as ThemeName)) || 'Light';
const initialState: ThemeState = {
  theme: savedTheme,
};

export const themeProperties = {
  Dark: themes.Dark,
  Light: themes.Light,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeName>) => {
      state.theme = action.payload;
      const properties = themeProperties[state.theme];
      localStorage.setItem('theme', state.theme);
      document.body.style.backgroundColor = properties.backgroundColor;
      document.body.style.color = properties.textColor;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme.theme;
export const selectThemeProperties = (state: RootState) => themeProperties[state.theme.theme];
export default themeSlice.reducer;