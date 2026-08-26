import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchGigMessages = createAsyncThunk(
  'messages/fetchGigMessages',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/messages/${gigId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch messages'
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ gigId, receiverId, text }, { rejectWithValue }) => {
    try {
      const response = await api.post('/messages', { gigId, receiverId, text });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message'
      );
    }
  }
);

const initialState = {
  messages: [],
  isLoading: false,
  sendLoading: false,
  error: null,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addIncomingMessage: (state, action) => {
      const exists = state.messages.some(m => m._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGigMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchGigMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sendLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendLoading = false;
        const exists = state.messages.some(m => m._id === action.payload._id);
        if (!exists) {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addIncomingMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
