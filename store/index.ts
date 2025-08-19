import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import profileSlice from './slices/profileSlice';
import matchSlice from './slices/matchSlice';
import chatSlice from './slices/chatSlice';
import discoverySlice from './slices/discoverySlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
    match: matchSlice,
    chat: chatSlice,
    discovery: discoverySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;