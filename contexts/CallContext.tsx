import React, { createContext, useContext, useState, useEffect } from 'react';

interface CallState {
  isActive: boolean;
  type: 'audio' | 'video';
  status: 'calling' | 'connected' | 'ended';
  duration: number;
  isMinimized: boolean;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isVideoOn: boolean;
  userName: string;
  userPhoto: string;
  userId: string;
}

interface CallContextType {
  callState: CallState;
  startCall: (type: 'audio' | 'video', user: { id: string; name: string; photo: string }) => void;
  endCall: () => void;
  minimizeCall: () => void;
  expandCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleSpeaker: () => void;
  acceptCall: () => void;
}

const initialCallState: CallState = {
  isActive: false,
  type: 'audio',
  status: 'ended',
  duration: 0,
  isMinimized: false,
  isMuted: false,
  isSpeakerOn: false,
  isVideoOn: true,
  userName: '',
  userPhoto: '',
  userId: '',
};

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [callState, setCallState] = useState<CallState>(initialCallState);
  const [callTimer, setCallTimer] = useState<ReturnType<typeof setInterval> | null>(null);

  // Timer for call duration
  useEffect(() => {
    if (callState.isActive && callState.status === 'connected') {
      const timer = setInterval(() => {
        setCallState(prev => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);
      setCallTimer(timer);
      return () => {
        clearInterval(timer);
        setCallTimer(null);
      };
    } else if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
  }, [callState.isActive, callState.status]);

  const startCall = (type: 'audio' | 'video', user: { id: string; name: string; photo: string }) => {
    setCallState({
      isActive: true,
      type,
      status: 'calling',
      duration: 0,
      isMinimized: false,
      isMuted: false,
      isSpeakerOn: false,
      isVideoOn: type === 'video',
      userName: user.name,
      userPhoto: user.photo,
      userId: user.id,
    });

    // Simulate call connection after 3 seconds
    setTimeout(() => {
      setCallState(prev => ({
        ...prev,
        status: 'connected',
      }));
    }, 3000);
  };

  const endCall = () => {
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    setCallState(initialCallState);
  };

  const minimizeCall = () => {
    setCallState(prev => ({
      ...prev,
      isMinimized: true,
    }));
  };

  const expandCall = () => {
    setCallState(prev => ({
      ...prev,
      isMinimized: false,
    }));
  };

  const toggleMute = () => {
    setCallState(prev => ({
      ...prev,
      isMuted: !prev.isMuted,
    }));
  };

  const toggleVideo = () => {
    setCallState(prev => ({
      ...prev,
      isVideoOn: !prev.isVideoOn,
    }));
  };

  const toggleSpeaker = () => {
    setCallState(prev => ({
      ...prev,
      isSpeakerOn: !prev.isSpeakerOn,
    }));
  };

  const acceptCall = () => {
    setCallState(prev => ({
      ...prev,
      status: 'connected',
    }));
  };

  const value: CallContextType = {
    callState,
    startCall,
    endCall,
    minimizeCall,
    expandCall,
    toggleMute,
    toggleVideo,
    toggleSpeaker,
    acceptCall,
  };

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
};

export default CallProvider;