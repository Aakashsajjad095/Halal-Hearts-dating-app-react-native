import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  profileImage?: string;
  location: {
    city: string;
    state: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  interests: string[];
  education: string;
  occupation: string;
  height: number;
  lookingFor: 'serious' | 'casual' | 'friends' | 'unsure';
  preferences: {
    ageRange: [number, number];
    maxDistance: number;
    genderPreference: 'men' | 'women' | 'everyone';
  };
  isComplete: boolean;
}

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  editMode: boolean;
}

const initialState: ProfileState = {
  profile: {
    id: '1',
    name: 'John Doe',
    age: 28,
    bio: 'Love traveling, photography, and meeting new people. Always up for an adventure!',
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
    location: {
      city: 'San Francisco',
      state: 'CA',
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    },
    interests: ['Travel', 'Photography', 'Coffee', 'Hiking'],
    education: 'UC Berkeley',
    occupation: 'Software Engineer',
    height: 180,
    lookingFor: 'serious',
    preferences: {
      ageRange: [25, 35],
      maxDistance: 25,
      genderPreference: 'women'
    },
    isComplete: true
  },
  isLoading: false,
  error: null,
  editMode: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    addPhoto: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.photos.push(action.payload);
      }
    },
    removePhoto: (state, action: PayloadAction<number>) => {
      if (state.profile) {
        state.profile.photos.splice(action.payload, 1);
      }
    },
    addInterest: (state, action: PayloadAction<string>) => {
      if (state.profile && !state.profile.interests.includes(action.payload)) {
        state.profile.interests.push(action.payload);
      }
    },
    removeInterest: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.interests = state.profile.interests.filter(
          interest => interest !== action.payload
        );
      }
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.editMode = action.payload;
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
  setProfile,
  updateProfile,
  addPhoto,
  removePhoto,
  addInterest,
  removeInterest,
  setEditMode,
  setLoading,
  setError,
} = profileSlice.actions;

export default profileSlice.reducer;