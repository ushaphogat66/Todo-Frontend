

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/auth';
import themeReducer from '../../features/theme/theme'; 
import sideBarReducer from '../../features/SideBar/SideBar'; 
import taskReducer from '../../features/tasks/tasks';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    sidebar: sideBarReducer, 
    tasks : taskReducer,
  },
});

//*  Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
