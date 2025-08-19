import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  text?: string;
  senderId: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'gif' | 'audio';
  imageUrl?: string;
  audioUrl?: string;
  duration?: number;
  replyTo?: string;
}

export interface Conversation {
  id: string;
  matchId: string;
  messages: Message[];
  lastActivity: string;
  isTyping: boolean;
  typingUserId?: string;
}

interface ChatState {
  conversations: { [matchId: string]: Conversation };
  activeConversation: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: {
    '1': {
      id: '1',
      matchId: '1',
      messages: [
        {
          id: 'test-audio-1',
          text: '',
          senderId: '2',
          timestamp: new Date().toISOString(),
          isRead: true,
          type: 'audio',
          audioUrl: 'test-audio-url',
          duration: 15,
        },
      ],
      lastActivity: new Date().toISOString(),
      isTyping: false,
    },
  },
  activeConversation: null,
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<{ [matchId: string]: Conversation }>) => {
      state.conversations = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ matchId: string; message: Message }>) => {
      const { matchId, message } = action.payload;
      console.log('Redux addMessage called with:', { matchId, message });
      
      if (!state.conversations[matchId]) {
        console.log('Creating new conversation for matchId:', matchId);
        state.conversations[matchId] = {
          id: matchId,
          matchId,
          messages: [],
          lastActivity: message.timestamp,
          isTyping: false,
        };
      }
      
      state.conversations[matchId].messages.push(message);
      state.conversations[matchId].lastActivity = message.timestamp;
      
      console.log('Updated conversation:', state.conversations[matchId]);
      console.log('All conversations:', state.conversations);
    },
    markMessagesAsRead: (state, action: PayloadAction<{ matchId: string; userId: string }>) => {
      const { matchId, userId } = action.payload;
      const conversation = state.conversations[matchId];
      if (conversation) {
        conversation.messages.forEach(message => {
          if (message.senderId !== userId) {
            message.isRead = true;
          }
        });
      }
    },
    setTyping: (state, action: PayloadAction<{ matchId: string; isTyping: boolean; userId?: string }>) => {
      const { matchId, isTyping, userId } = action.payload;
      const conversation = state.conversations[matchId];
      if (conversation) {
        conversation.isTyping = isTyping;
        conversation.typingUserId = userId;
      }
    },
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      console.log('setActiveConversation called with:', action.payload);
      state.activeConversation = action.payload;
      console.log('activeConversation set to:', state.activeConversation);
    },
    deleteConversation: (state, action: PayloadAction<string>) => {
      delete state.conversations[action.payload];
      if (state.activeConversation === action.payload) {
        state.activeConversation = null;
      }
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
  setConversations,
  addMessage,
  markMessagesAsRead,
  setTyping,
  setActiveConversation,
  deleteConversation,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;