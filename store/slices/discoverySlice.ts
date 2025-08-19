import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from './profileSlice';

export interface DiscoveryCard {
  id: string;
  user: UserProfile;
  distance: number;
  commonInterests: string[];
  mutualFriends: number;
}

interface DiscoveryState {
  cards: DiscoveryCard[];
  currentCardIndex: number;
  likedUsers: string[];
  passedUsers: string[];
  superLikesRemaining: number;
  isLoading: boolean;
  error: string | null;
  filters: {
    ageRange: [number, number];
    maxDistance: number;
    showMe: 'men' | 'women' | 'everyone';
  };
}

const initialState: DiscoveryState = {
  cards: [],
  currentCardIndex: 0,
  likedUsers: [],
  passedUsers: [],
  superLikesRemaining: 5,
  isLoading: false,
  error: null,
  filters: {
    ageRange: [18, 35],
    maxDistance: 50,
    showMe: 'everyone',
  },
};

const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    setCards: (state, action: PayloadAction<DiscoveryCard[]>) => {
      state.cards = action.payload;
      state.currentCardIndex = 0;
    },
    addCards: (state, action: PayloadAction<DiscoveryCard[]>) => {
      state.cards.push(...action.payload);
    },
    swipeRight: (state, action: PayloadAction<string>) => {
      state.likedUsers.push(action.payload);
      state.currentCardIndex += 1;
    },
    swipeLeft: (state, action: PayloadAction<string>) => {
      state.passedUsers.push(action.payload);
      state.currentCardIndex += 1;
    },
    superLike: (state, action: PayloadAction<string>) => {
      if (state.superLikesRemaining > 0) {
        state.likedUsers.push(action.payload);
        state.superLikesRemaining -= 1;
        state.currentCardIndex += 1;
      }
    },
    resetSuperLikes: (state) => {
      state.superLikesRemaining = 5;
    },
    updateFilters: (state, action: PayloadAction<Partial<DiscoveryState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetDiscovery: (state) => {
      state.cards = [];
      state.currentCardIndex = 0;
      state.likedUsers = [];
      state.passedUsers = [];
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
  setCards,
  addCards,
  swipeRight,
  swipeLeft,
  superLike,
  resetSuperLikes,
  updateFilters,
  resetDiscovery,
  setLoading,
  setError,
} = discoverySlice.actions;

export default discoverySlice.reducer;