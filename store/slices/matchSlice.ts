import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from './profileSlice';

export interface Match {
  id: string;
  user: UserProfile;
  matchedAt: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    senderId: string;
  };
  isRead: boolean;
}

interface MatchState {
  matches: Match[];
  newMatches: Match[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MatchState = {
  matches: [],
  newMatches: [],
  isLoading: false,
  error: null,
};

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<Match[]>) => {
      state.matches = action.payload;
    },
    addMatch: (state, action: PayloadAction<Match>) => {
      state.matches.unshift(action.payload);
      state.newMatches.unshift(action.payload);
    },
    removeMatch: (state, action: PayloadAction<string>) => {
      state.matches = state.matches.filter(match => match.id !== action.payload);
      state.newMatches = state.newMatches.filter(match => match.id !== action.payload);
    },
    updateLastMessage: (state, action: PayloadAction<{ matchId: string; message: { text: string; timestamp: string; senderId: string } }>) => {
      const match = state.matches.find(m => m.id === action.payload.matchId);
      if (match) {
        match.lastMessage = action.payload.message;
        match.isRead = false;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const match = state.matches.find(m => m.id === action.payload);
      if (match) {
        match.isRead = true;
      }
    },
    clearNewMatches: (state) => {
      state.newMatches = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMatches,
  addMatch,
  removeMatch,
  updateLastMessage,
  markAsRead,
  clearNewMatches,
  setLoading,
  setError,
} = matchSlice.actions;

export default matchSlice.reducer;