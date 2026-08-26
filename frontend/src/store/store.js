import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gigReducer from './slices/gigSlice';
import bidReducer from './slices/bidSlice';
import notificationReducer from './slices/notificationSlice';
import messageReducer from './slices/messageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gigs: gigReducer,
    bids: bidReducer,
    notifications: notificationReducer,
    messages: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
