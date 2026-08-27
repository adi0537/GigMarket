import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Submit a bid
export const submitBid = createAsyncThunk(
  'bids/submitBid',
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bids', bidData);
      return response.data.bid;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit bid');
    }
  }
);

// Get bids for a gig (owner only)
export const fetchBidsForGig = createAsyncThunk(
  'bids/fetchBidsForGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bids/${gigId}`);
      return { gigId, bids: response.data.bids };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids');
    }
  }
);

// Get my bids (as freelancer)
export const fetchMyBids = createAsyncThunk(
  'bids/fetchMyBids',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bids/my-bids');
      return response.data.bids;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your bids');
    }
  }
);

// Hire a freelancer
export const hireBid = createAsyncThunk(
  'bids/hireBid',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bids/${bidId}/hire`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to hire freelancer');
    }
  }
);

// Reject a bid
export const rejectBid = createAsyncThunk(
  'bids/rejectBid',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bids/${bidId}/reject`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject bid');
    }
  }
);

const initialState = {
  bidsForGig: {},
  myBids: [],
  isLoading: false,
  error: null,
  hireLoading: false,
  rejectLoading: false,
};

const bidSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addBidToGig: (state, action) => {
      const { gigId, bid } = action.payload;
      if (state.bidsForGig[gigId]) {
        state.bidsForGig[gigId].unshift(bid);
      }
    },
    updateBidStatus: (state, action) => {
      const { bidId, status } = action.payload;
      // Update in myBids
      const myBidIndex = state.myBids.findIndex(b => b._id === bidId);
      if (myBidIndex !== -1) {
        state.myBids[myBidIndex].status = status;
      }
      // Update in bidsForGig
      Object.keys(state.bidsForGig).forEach(gigId => {
        const bidIndex = state.bidsForGig[gigId].findIndex(b => b._id === bidId);
        if (bidIndex !== -1) {
          state.bidsForGig[gigId][bidIndex].status = status;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Bid
      .addCase(submitBid.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBids.unshift(action.payload);
      })
      .addCase(submitBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Bids for Gig
      .addCase(fetchBidsForGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBidsForGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bidsForGig[action.payload.gigId] = action.payload.bids;
      })
      .addCase(fetchBidsForGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch My Bids
      .addCase(fetchMyBids.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBids = action.payload;
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Hire Bid
      .addCase(hireBid.pending, (state) => {
        state.hireLoading = true;
        state.error = null;
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        state.hireLoading = false;
        const { bid, gig } = action.payload;
        // Update bids for this gig
        if (state.bidsForGig[gig._id]) {
          state.bidsForGig[gig._id] = state.bidsForGig[gig._id].map(b => ({
            ...b,
            status: b._id === bid._id ? 'hired' : 'rejected'
          }));
        }
      })
      .addCase(hireBid.rejected, (state, action) => {
        state.hireLoading = false;
        state.error = action.payload;
      })
      // Reject Bid
      .addCase(rejectBid.pending, (state) => {
        state.rejectLoading = true;
        state.error = null;
      })
      .addCase(rejectBid.fulfilled, (state, action) => {
        state.rejectLoading = false;
        const { bid } = action.payload;
        // Update bid status in bidsForGig
        if (state.bidsForGig[bid.gigId._id || bid.gigId]) {
          state.bidsForGig[bid.gigId._id || bid.gigId] = state.bidsForGig[bid.gigId._id || bid.gigId].map(b => 
            b._id === bid._id ? { ...b, status: 'rejected' } : b
          );
        }
      })
      .addCase(rejectBid.rejected, (state, action) => {
        state.rejectLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, addBidToGig, updateBidStatus } = bidSlice.actions;
export default bidSlice.reducer;
