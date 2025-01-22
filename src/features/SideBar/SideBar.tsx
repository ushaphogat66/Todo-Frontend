import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
  isCollapsed: boolean;
}

const isBrowser = typeof window !== 'undefined';

const initialState: SidebarState = {
  isCollapsed: isBrowser ? localStorage.getItem('isCollapsed') === 'true' : false,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleCollapse(state) {
      state.isCollapsed = !state.isCollapsed;
      if (isBrowser) {
        localStorage.setItem('isCollapsed', state.isCollapsed.toString());
      }
    },
  },
});

export const { toggleCollapse } = sidebarSlice.actions;
export default sidebarSlice.reducer;