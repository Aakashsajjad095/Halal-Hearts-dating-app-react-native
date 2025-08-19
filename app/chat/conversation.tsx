import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Modal,
  PanResponder,
  Vibration,
  Easing,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAudioRecorder, useAudioPlayer, AudioModule, RecordingPresets, setAudioModeAsync } from 'expo-audio';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addMessage, setActiveConversation } from '../../store/slices/chatSlice';
import { useCall } from '../../contexts/CallContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Call types are now handled by the global context

interface ChatMessage {
  id: string;
  text?: string;
  imageUri?: string;
  audioUri?: string;
  timestamp: Date;
  isFromMe: boolean;
  isRead: boolean;
  type: 'text' | 'image' | 'audio';
  duration?: number;
  replyTo?: string;
  senderId: string;
}

interface User {
  id: string;
  name: string;
  photo: string;
  isOnline: boolean;
}

const mockUser: User = {
  id: '1',
  name: 'Emma Wilson',
  photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  isOnline: true,
};

const currentUser: User = {
  id: '2',
  name: 'You',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  isOnline: true,
};

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Hey! How are you doing today?',
    timestamp: new Date(Date.now() - 3600000),
    isFromMe: false,
    isRead: true,
    type: 'text',
    senderId: '1',
  },
  {
    id: '2',
    text: 'I\'m doing great! Just finished a workout. How about you?',
    timestamp: new Date(Date.now() - 3500000),
    isFromMe: true,
    isRead: true,
    type: 'text',
    senderId: '2',
  },
  {
    id: '3',
    text: 'That\'s awesome! I love staying active too. What kind of workout did you do?',
    timestamp: new Date(Date.now() - 3400000),
    isFromMe: false,
    isRead: true,
    type: 'text',
    senderId: '1',
  },
  {
    id: '4',
    text: 'Just some cardio and strength training. Nothing too intense 😊',
    timestamp: new Date(Date.now() - 3300000),
    isFromMe: true,
    isRead: true,
    type: 'text',
    replyTo: '3',
    senderId: '2',
  },
  {
    id: '5',
    text: 'Sounds like a great workout! 💪',
    timestamp: new Date(Date.now() - 3200000),
    isFromMe: false,
    isRead: true,
    type: 'text',
    replyTo: '4',
    senderId: '1',
  },
  {
    id: 'test-audio-mock-1',
    audioUri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    timestamp: new Date(Date.now() - 3100000),
    isFromMe: false,
    isRead: true,
    type: 'audio',
    duration: 3,
    senderId: '1',
  },
];

const emojis = ['😀', '😂', '😍', '🥰', '😘', '😊', '😉', '😎', '🤔', '😢', '😭', '😡', '👍', '👎', '❤️', '💕', '🔥', '💯', '🎉', '🙌'];

export default function ConversationScreen() {
  const router = useRouter();
  // const params = useLocalSearchParams();
  const userId = '1'; // Fixed userId for now to avoid useLocalSearchParams error
  
  // Use simple state instead of ref to avoid unmounting issues
  const [isMounted, setIsMounted] = useState(true);
  const [isUnmounting, setIsUnmounting] = useState(false);
  
  // Get chat data from Redux with error boundary
  let dispatch, conversations, activeConversationId, activeConversation;
  try {
    dispatch = useDispatch();
    const chatState = useSelector((state: RootState) => state.chat);
    conversations = chatState.conversations;
    activeConversationId = chatState.activeConversation;
    activeConversation = activeConversationId ? conversations[activeConversationId] : null;
  } catch (error) {
    console.log('Redux hook error during unmounting:', error);
    // Fallback values
    dispatch = () => {};
    conversations = {};
    activeConversationId = null;
    activeConversation = null;
  }
  
  console.log('Redux state - conversations:', conversations);
  console.log('Redux state - activeConversationId:', activeConversationId);
  console.log('Redux state - activeConversation:', activeConversation);
  
  // Set active conversation if not set
  useEffect(() => {
    if (userId && !activeConversationId && !isUnmounting && isMounted && dispatch) {
      dispatch(setActiveConversation(userId as string));
    }
  }, [userId, activeConversationId, dispatch, isUnmounting, isMounted]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsMounted(false);
      setIsUnmounting(true);
    };
  }, []);
  
  // Safe back navigation handler
  const handleBackPress = useCallback(() => {
    try {
      setIsMounted(false);
      setIsUnmounting(true);
      router.back();
    } catch (error) {
      console.log('Navigation error:', error);
      // Fallback navigation
      router.replace('/(tabs)/matches');
    }
  }, [router]);
  
  // Convert Redux messages to ChatMessage format
  const convertToLocalMessage = (msg: any): ChatMessage => {
    console.log('Converting Redux message to local format:', msg);
    const converted = {
      ...msg,
      isFromMe: msg.senderId === currentUser.id,
      timestamp: new Date(msg.timestamp),
      imageUri: msg.imageUrl, // Map imageUrl to imageUri
      audioUri: msg.audioUrl, // Map audioUrl to audioUri if it exists
    };
    console.log('Converted message:', converted);
    return converted;
  };
  
  // Combine Redux messages with mock messages
  const reduxMessages = activeConversation?.messages.map(convertToLocalMessage) || [];
  console.log('Redux messages after conversion:', reduxMessages);
  const messages: ChatMessage[] = [...mockMessages, ...reduxMessages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  console.log('Final messages array:', messages);
  
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showRecordingPopup, setShowRecordingPopup] = useState(false);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const player = useAudioPlayer();
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [longPressedMessage, setLongPressedMessage] = useState<string | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [showMessageActions, setShowMessageActions] = useState<string | null>(null);
  const [showUserActions, setShowUserActions] = useState(false);
  const [isFirstTimeChat] = useState(false);
  const [hasAcceptedRequest, setHasAcceptedRequest] = useState(true);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  
  // Use global call context
  const { callState, startCall, endCall, minimizeCall, toggleMute, toggleVideo, toggleSpeaker } = useCall();
  
  const flatListRef = useRef<FlatList>(null);
  const recordingAnimation = useRef(new Animated.Value(1)).current;
  const swipeAnimations = useRef<{[key: string]: Animated.Value}>({}).current;
  const waveformAnimations = useRef(
    Array.from({ length: 20 }, () => new Animated.Value(0))
  ).current;
  const audioPlayAnimations = useRef<{[key: string]: Animated.Value}>({}).current;
  const audioWaveformAnimations = useRef<{[key: string]: Animated.Value[]}>({}).current;
  const audioProgressAnimations = useRef<{[key: string]: Animated.Value}>({}).current;
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Format call duration for display
  const formatCallDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    // Request audio permissions on component mount
    const requestPermissions = async () => {
      try {
        await AudioModule.requestRecordingPermissionsAsync();
        // Set basic audio mode for general use
        await setAudioModeAsync({
          playsInSilentMode: true,
        });
      } catch (error) {
        console.error('Failed to get audio permissions:', error);
      }
    };
    requestPermissions();

    // Set active conversation based on userId parameter
    if (userId && typeof userId === 'string' && !isUnmounting && isMounted && dispatch) {
      dispatch(setActiveConversation(userId));
    }

    // Cleanup function
    return () => {
      // Clean up audio resources with error handling
      try {
        if (player && player.playing) {
          player.pause();
        }
      } catch (error) {
        console.log('Audio player cleanup error (safe to ignore during unmounting):', error);
      }
      
      try {
        if (audioRecorder && audioRecorder.isRecording) {
          audioRecorder.stop().catch(console.error);
        }
      } catch (error) {
        console.log('Audio recorder cleanup error (safe to ignore during unmounting):', error);
      }
      
      if (recordingTimer.current !== null) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }
    };
  }, [userId, dispatch]);

  // Recording timer and animation effects
  useEffect(() => {
    if (isRecording && !isPaused) {
      // Start recording timer
      console.log('Starting recording timer');
      recordingTimer.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          console.log('Recording duration:', newDuration);
          return newDuration;
        });
      }, 1000);

      // Start pulse animation for recording button
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnimation, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(recordingAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Start waveform animation
      const animateWaveform = () => {
        const animations = waveformAnimations.map((anim, index) => {
          return Animated.loop(
            Animated.sequence([
              Animated.timing(anim, {
                toValue: 1,
                duration: 300 + Math.random() * 200,
                useNativeDriver: false,
              }),
              Animated.timing(anim, {
                toValue: 0,
                duration: 300 + Math.random() * 200,
                useNativeDriver: false,
              }),
            ])
          );
        });
        
        Animated.stagger(100, animations).start();
      };
      animateWaveform();
    } else {
      // Stop timer and animations
      if (recordingTimer.current !== null) {
        console.log('Stopping recording timer');
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }
      recordingAnimation.setValue(1);
      waveformAnimations.forEach(anim => anim.setValue(0));
    }

    return () => {
      if (recordingTimer.current !== null) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }
    };
  }, [isRecording, isPaused]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = (text?: string, type: 'text' | 'image' | 'audio' = 'text', uri?: string) => {
    console.log('Sending message:', { type, uri, duration: recordingDuration });
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      imageUri: type === 'image' ? uri : undefined,
      audioUri: type === 'audio' ? uri : undefined,
      timestamp: new Date(),
      isFromMe: true,
      isRead: false,
      type,
      duration: type === 'audio' ? recordingDuration : undefined,
      replyTo: replyingTo?.id,
      senderId: currentUser.id,
    };

    // Convert to Redux Message format
    const reduxMessage = {
      id: newMessage.id,
      text: newMessage.text || '',
      senderId: newMessage.senderId,
      timestamp: newMessage.timestamp.toISOString(),
      isRead: newMessage.isRead,
      type: newMessage.type as 'text' | 'image' | 'gif' | 'audio',
      imageUrl: newMessage.imageUri,
      audioUrl: newMessage.audioUri,
      duration: newMessage.duration,
      replyTo: newMessage.replyTo,
    };

    console.log('Redux message to dispatch:', reduxMessage);

    // Use userId as matchId if activeConversationId is not set
    const matchId = activeConversationId || (userId as string);
    console.log('About to dispatch - matchId:', matchId, 'activeConversationId:', activeConversationId, 'userId:', userId);
    
    if (matchId && !isUnmounting && isMounted && dispatch) {
      console.log('Dispatching addMessage with payload:', { matchId, message: reduxMessage });
      dispatch(addMessage({ matchId, message: reduxMessage }));
      console.log('Message dispatched to Redux store for matchId:', matchId);
    } else {
      console.error('No matchId available to send message or component is unmounting');
    }
    
    setInputText('');
    setRecordingDuration(0);
    setReplyingTo(null);
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendText = () => {
    console.log('handleSendText triggered, inputText:', inputText);
    if (inputText.trim()) {
      console.log('handleSendText called with:', inputText.trim());
      sendMessage(inputText.trim());
      setShowEmojiPicker(false);
    } else {
      console.log('handleSendText: inputText is empty or whitespace');
    }
  };

  const startRecording = () => {
    startRecordingInternal();
  };

  const pauseRecording = async () => {
    try {
      if (isRecording && !isPaused) {
        await audioRecorder.pause();
        setIsPaused(true);
        console.log('Recording paused');
      }
    } catch (error) {
      console.error('Failed to pause recording:', error);
    }
  };

  const resumeRecording = async () => {
    try {
      if (isRecording && isPaused) {
        await audioRecorder.record();
        setIsPaused(false);
        console.log('Recording resumed');
      }
    } catch (error) {
      console.error('Failed to resume recording:', error);
    }
  };

  const openRecordingPopup = async () => {
    console.log('Opening recording popup');
    setShowRecordingPopup(true);
    setRecordingDuration(0);
    setIsRecording(false);
    setIsPaused(false);
    
    // Auto-start recording after a short delay
    setTimeout(async () => {
      console.log('Auto-starting recording');
      await startRecordingInternal();
    }, 500);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to send images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        sendMessage(undefined, 'image', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const startRecordingInternal = async () => {
    console.log('Starting recording internal');
    
    // Check if platform is web
    if (Platform.OS === 'web') {
      Alert.alert('Not Supported', 'Audio recording is not supported on web browsers. Please use a mobile device.');
      return;
    }
    
    try {
      Vibration.vibrate(50);
      
      // Stop any existing audio playback
      if (player.playing) {
        player.pause();
        setPlayingAudio(null);
      }

      // Request permissions
      const { status } = await AudioModule.requestRecordingPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to record audio.');
        return;
      }

      // Set audio mode for recording
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // Start recording
      await audioRecorder.record();
      setIsRecording(true);
      setIsPaused(false);
      console.log('Recording started successfully, isRecording set to true');
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      let errorMessage = 'Failed to start recording. Please try again.';
      if (error instanceof Error) {
        errorMessage = `Recording error: ${error.message}`;
      }
      Alert.alert('Error', errorMessage);
      setIsRecording(false);
      setShowRecordingPopup(false);
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping recording...');
      setIsRecording(false);
      setIsPaused(false);
      setShowRecordingPopup(false);
      Vibration.vibrate(50);
      
      if (!audioRecorder.isRecording) {
        console.log('No recording to stop, creating mock audio message');
        // Create a mock audio message for testing
        const mockAudioUri = `mock-audio-${Date.now()}.m4a`;
        sendMessage(undefined, 'audio', mockAudioUri);
        console.log('Mock audio message created:', mockAudioUri);
        return;
      }

      // Stop recording and get the URI
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      
      console.log('Recording URI:', uri);
      console.log('Recording duration:', recordingDuration);
      
      if (uri) {
        // Send the actual recorded audio with proper duration
        sendMessage(undefined, 'audio', uri);
        console.log('Real recording stopped and sent:', uri, 'Duration:', recordingDuration);
      } else {
        console.error('No URI found in recording result, using mock');
        // Fallback to mock audio for testing
        const mockAudioUri = `mock-audio-fallback-${Date.now()}.m4a`;
        sendMessage(undefined, 'audio', mockAudioUri);
        console.log('Fallback mock audio message created:', mockAudioUri);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      // Create mock audio message even on error for testing
      const mockAudioUri = `mock-audio-error-${Date.now()}.m4a`;
      sendMessage(undefined, 'audio', mockAudioUri);
      console.log('Error fallback mock audio message created:', mockAudioUri);
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const playAudio = async (uri: string, messageId: string) => {
    console.log('🚀 playAudio function called!', { uri, messageId, timestamp: new Date().toISOString() });
    try {
      if (playingAudio === messageId) {
        // Stop current audio
        if (player.playing) {
          player.pause();
        }
        setPlayingAudio(null);
        
        // Stop all animations
        if (audioPlayAnimations[messageId]) {
          audioPlayAnimations[messageId].stopAnimation();
          audioPlayAnimations[messageId].setValue(1);
        }
        if (audioWaveformAnimations[messageId]) {
          audioWaveformAnimations[messageId].forEach(anim => {
            anim.stopAnimation();
            anim.setValue(0);
          });
        }
        if (audioProgressAnimations[messageId]) {
          audioProgressAnimations[messageId].stopAnimation();
          audioProgressAnimations[messageId].setValue(0);
        }
        
        console.log('Audio stopped');
        return;
      } else {
        // Stop any existing audio
        if (player.playing) {
          player.pause();
        }

        // Stop any existing recording
        if (audioRecorder.isRecording) {
          await audioRecorder.stop();
          setIsRecording(false);
          setShowRecordingPopup(false);
        }

        // Configure audio mode for playback with enhanced settings
        console.log('🔧 Configuring audio mode...');
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });
        
        console.log('✅ Audio mode configured for playback');
        console.log('🔊 Player volume before:', player.volume);
        console.log('🔇 Player muted status:', player.muted);
        console.log('📱 Device platform:', Platform.OS);
        
        // Set player volume to maximum and ensure not muted
        player.volume = 1.0;
        player.muted = false;
        console.log('🔊 Player volume set to:', player.volume);
        console.log('🔇 Player muted set to:', player.muted);

        // Load and play new audio
        console.log('🎵 Attempting to play audio:', uri);
        console.log('🌐 Running on platform:', Platform.OS);
        
        // Check if we're on web platform
        if (Platform.OS === 'web') {
          console.log('🌐 Web platform detected - using HTML5 audio fallback');
          try {
            const audio = new Audio(uri);
            audio.volume = 1.0;
            audio.preload = 'auto';
            
            // Set up event listeners
            audio.onloadeddata = () => {
              console.log('🎵 Web audio loaded successfully');
              console.log('🎵 Audio duration:', audio.duration);
              console.log('🎵 Audio volume:', audio.volume);
            };
            
            audio.oncanplaythrough = () => {
              console.log('🎵 Audio can play through');
            };
            
            audio.onplay = () => {
              console.log('🎉 Web audio started playing');
              setPlayingAudio(messageId);
            };
            
            audio.onended = () => {
              console.log('🏁 Web audio playback completed');
              setPlayingAudio(null);
            };
            
            audio.onerror = (error) => {
              console.error('❌ Web audio error:', error);
              console.error('❌ Audio error details:', {
                code: audio.error?.code,
                message: audio.error?.message
              });
            };
            
            // Try to play the audio
            console.log('🎵 Attempting to play web audio...');
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  console.log('✅ Web audio playback started successfully');
                })
                .catch(error => {
                  console.error('❌ Web audio play failed:', error);
                  // Fallback to mock playback
                  console.log('🔄 Falling back to mock playback');
                  setPlayingAudio(messageId);
                  const messageDuration = messages.find(msg => msg.id === messageId)?.duration || 5;
                  setTimeout(() => {
                    setPlayingAudio(null);
                  }, messageDuration * 1000);
                });
            }
            return;
          } catch (webAudioError) {
            console.error('❌ Web audio setup failed:', webAudioError);
            // Fall through to mock playback
          }
        }
        
        // For mock audio URIs, simulate playback
        if (uri.startsWith('mock-audio')) {
          console.log('Playing mock audio - simulating playback');
          setPlayingAudio(messageId);
          
          // Simulate audio playback completion after duration
          const messageDuration = messages.find(msg => msg.id === messageId)?.duration || 5;
          setTimeout(() => {
            handlePlaybackComplete();
          }, messageDuration * 1000);
        } else {
          // For real audio files
          try {
            console.log('🎵 Loading real audio file:', uri);
            console.log('🌐 Audio URI type:', typeof uri);
            console.log('🔗 Audio URI length:', uri.length);
            
            await player.replace(uri);
            
            console.log('✅ Audio file loaded successfully');
            console.log('🎵 Player state before play:', {
              isLoaded: player.isLoaded,
              duration: player.duration,
              volume: player.volume,
              muted: player.muted,
              playing: player.playing
            });
            
            // Add a small delay before playing
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log('▶️ Starting audio playback...');
            await player.play();
            setPlayingAudio(messageId);
            
            console.log('🎉 Audio playback started successfully!');
            console.log('🎵 Player state after play:', {
              playing: player.playing,
              currentTime: player.currentTime,
              duration: player.duration,
              volume: player.volume,
              muted: player.muted
            });
            
            // Test if audio is actually audible by checking system volume
            console.log('🔊 System audio check - if you hear this log, check device volume and silent mode');
            
            // Set up playback completion listener
            const checkPlaybackStatus = setInterval(() => {
              console.log('Checking playback status:', {
                playing: player.playing,
                currentTime: player.currentTime,
                duration: player.duration
              });
              
              if (!player.playing) {
                console.log('Playback completed, cleaning up...');
                clearInterval(checkPlaybackStatus);
                handlePlaybackComplete();
              }
            }, 500);
          } catch (audioError) {
            console.error('Failed to play real audio:', audioError);
            console.error('Audio error details:', {
              message: audioError instanceof Error ? audioError.message : 'Unknown error',
              stack: audioError instanceof Error ? audioError.stack : undefined,
              uri: uri
            });
            
            // Fallback to mock playback
            setPlayingAudio(messageId);
            const messageDuration = messages.find(msg => msg.id === messageId)?.duration || 5;
            setTimeout(() => {
              handlePlaybackComplete();
            }, messageDuration * 1000);
          }
        }
        
        // Initialize animations for this message
        if (!audioPlayAnimations[messageId]) {
          audioPlayAnimations[messageId] = new Animated.Value(1);
        }
        if (!audioWaveformAnimations[messageId]) {
          audioWaveformAnimations[messageId] = Array.from({ length: 20 }, () => new Animated.Value(0));
        }
        if (!audioProgressAnimations[messageId]) {
          audioProgressAnimations[messageId] = new Animated.Value(0);
        }
        
        // Start enhanced audio play button animation with pulsing effect
        Animated.loop(
          Animated.sequence([
            Animated.timing(audioPlayAnimations[messageId], {
              toValue: 1.2,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(audioPlayAnimations[messageId], {
              toValue: 0.9,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(audioPlayAnimations[messageId], {
              toValue: 1.1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(audioPlayAnimations[messageId], {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        ).start();
        
        // Start enhanced waveform animation for this specific message
        const waveformLoop = Animated.loop(
          Animated.stagger(80, 
            audioWaveformAnimations[messageId].map((anim, index) => 
              Animated.sequence([
                Animated.timing(anim, {
                  toValue: 0.3 + Math.random() * 0.7, // Random height between 0.3 and 1
                  duration: 200 + Math.random() * 150,
                  useNativeDriver: false,
                }),
                Animated.timing(anim, {
                  toValue: 0.1 + Math.random() * 0.3, // Random low height
                  duration: 200 + Math.random() * 150,
                  useNativeDriver: false,
                }),
                Animated.timing(anim, {
                  toValue: 0.5 + Math.random() * 0.5, // Random medium-high height
                  duration: 150 + Math.random() * 100,
                  useNativeDriver: false,
                }),
                Animated.timing(anim, {
                  toValue: 0.2,
                  duration: 100,
                  useNativeDriver: false,
                })
              ])
            )
          )
        );
        waveformLoop.start();
        
        // Start progress animation
        const messageDuration = messages.find(msg => msg.id === messageId)?.duration || 15;
        Animated.timing(audioProgressAnimations[messageId], {
          toValue: 1,
          duration: messageDuration * 1000, // Convert to milliseconds
          useNativeDriver: false,
        }).start();
        
        // Define playback completion handler
        const handlePlaybackComplete = () => {
          console.log('🏁 Handling playback completion for message:', messageId);
          if (audioPlayAnimations[messageId]) {
            audioPlayAnimations[messageId].stopAnimation();
            audioPlayAnimations[messageId].setValue(1);
          }
          if (audioWaveformAnimations[messageId]) {
            audioWaveformAnimations[messageId].forEach(anim => {
              anim.stopAnimation();
              anim.setValue(0);
            });
          }
          if (audioProgressAnimations[messageId]) {
            audioProgressAnimations[messageId].stopAnimation();
            audioProgressAnimations[messageId].setValue(0);
          }
          setPlayingAudio(null);
        };
        
        // TODO: Set up listener for playback completion when expo-audio supports it
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio. Please check if the audio file exists.');
      setPlayingAudio(null);
    }
  };

  const handleLongPress = (messageId: string) => {
    Vibration.vibrate(50);
    setLongPressedMessage(messageId);
  };

  const copyMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message?.text) {
      // Mock copy to clipboard
      console.log('Copied to clipboard:', message.text);
      Alert.alert('Copied', 'Message copied to clipboard');
    }
    setLongPressedMessage(null);
  };

  const deleteMessage = (messageId: string) => {
    // In a real app, you would dispatch a delete action to Redux
    // For now, we'll just close the modal
    setLongPressedMessage(null);
  };

  const handleDeleteMessage = (messageId: string) => {
    // In a real app, you would dispatch a delete action to Redux
    // For now, we'll just close the modal
    setShowMessageActions(null);
  };

  const handleAcceptRequest = () => {
    setHasAcceptedRequest(true);
    Alert.alert('Request Accepted', 'You can now start chatting!');
  };

  const handleDeleteRequest = () => {
    Alert.alert('Delete Request', 'Are you sure you want to delete this message request?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => router.back() }
    ]);
  };

  const handleBlockUser = () => {
    Alert.alert('Block User', 'Are you sure you want to block this user?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Block', style: 'destructive', onPress: () => console.log('User blocked') }
    ]);
  };

  const handleReportUser = () => {
    Alert.alert('Report User', 'Are you sure you want to report this user?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Report', style: 'destructive', onPress: () => console.log('User reported') }
    ]);
  };

  const cancelRecording = async () => {
    try {
      setIsRecording(false);
      setIsPaused(false);
      setShowRecordingPopup(false);
      setRecordingDuration(0);
      
      if (audioRecorder.isRecording) {
        await audioRecorder.stop();
      }
      
      console.log('Recording cancelled');
    } catch (error) {
      console.error('Error cancelling recording:', error);
    }
  };

  const createSwipeGesture = (messageId: string) => {
    // Create individual animation for this message if it doesn't exist
    if (!swipeAnimations[messageId]) {
      swipeAnimations[messageId] = new Animated.Value(0);
    }
    
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 50;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          swipeAnimations[messageId].setValue(Math.max(gestureState.dx, -100));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          const message = messages.find(m => m.id === messageId);
          if (message) {
            setReplyingTo(message);
            Vibration.vibrate(50);
          }
        }
        Animated.spring(swipeAnimations[messageId], {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    });
  };

  const scrollToMessage = (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: messageIndex, animated: true });
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    console.log('🔍 Rendering message:', { id: item.id, type: item.type, audioUri: item.audioUri });
    const swipeGesture = createSwipeGesture(item.id);
    const repliedMessage = item.replyTo ? messages.find(m => m.id === item.replyTo) : null;
    
    // Ensure animation exists for this message
    if (!swipeAnimations[item.id]) {
      swipeAnimations[item.id] = new Animated.Value(0);
    }
    
    return (
      <Animated.View
        {...swipeGesture.panHandlers}
        style={[
          styles.messageContainer,
          item.isFromMe ? styles.myMessageContainer : styles.theirMessageContainer,
          { transform: [{ translateX: swipeAnimations[item.id] }] }
        ]}
      >
        {!item.isFromMe && (
          <Image source={{ uri: mockUser.photo }} style={styles.messageAvatar} />
        )}
        
        <TouchableOpacity
          style={[
            styles.messageBubble,
            item.isFromMe ? styles.myMessageBubble : styles.theirMessageBubble,
          ]}
          onLongPress={() => handleLongPress(item.id)}
          delayLongPress={500}
        >
          {repliedMessage && (
            <TouchableOpacity 
              style={styles.replyContainer}
              onPress={() => scrollToMessage(repliedMessage.id)}
            >
              <View style={styles.replyLine} />
              <View style={styles.replyContent}>
                <Text style={styles.replyAuthor}>
                  {repliedMessage.isFromMe ? 'You' : mockUser.name}
                </Text>
                <Text style={styles.replyText} numberOfLines={1}>
                  {repliedMessage.text || (repliedMessage.type === 'image' ? '📷 Photo' : '🎵 Audio')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          
          {item.type === 'text' && (
            <Text style={[
              styles.messageText,
              item.isFromMe ? styles.myMessageText : styles.theirMessageText,
            ]}>
              {item.text}
            </Text>
          )}
          
          {item.type === 'image' && (
            <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
          )}
          
          {item.type === 'audio' && (
            <View style={styles.audioMessage}>
              <Animated.View style={{
                transform: [{
                  scale: audioPlayAnimations[item.id] || new Animated.Value(1)
                }]
              }}>
                <TouchableOpacity 
                  style={styles.audioPlayButton}
                  onPress={() => {
                    console.log('🎯 AUDIO BUTTON CLICKED!', { audioUri: item.audioUri, messageId: item.id });
                    item.audioUri && playAudio(item.audioUri, item.id);
                  }}
                >
                  <Ionicons 
                    name={playingAudio === item.id ? "pause" : "play"} 
                    size={20} 
                    color="white" 
                  />
                </TouchableOpacity>
              </Animated.View>
              <View style={styles.audioWaveformContainer}>
                 <Animated.View style={[
                   styles.audioWaveform,
                   {
                     transform: [{
                       scale: playingAudio === item.id 
                         ? (audioPlayAnimations[item.id] || new Animated.Value(1))
                         : new Animated.Value(1)
                     }]
                   }
                 ]}>
                     {[...Array(20)].map((_, i) => {
                       const messageWaveforms = audioWaveformAnimations[item.id];
                       const progressValue = audioProgressAnimations[item.id];
                       
                       return (
                         <Animated.View 
                           key={i} 
                           style={[
                             styles.audioBar, 
                             { 
                               height: playingAudio === item.id && messageWaveforms
                                 ? messageWaveforms[i].interpolate({
                                     inputRange: [0, 1],
                                     outputRange: [5, 25]
                                   })
                                 : Math.random() * 20 + 5,
                               backgroundColor: playingAudio === item.id && progressValue
                                 ? progressValue.interpolate({
                                     inputRange: [0, (i + 1) / 20, 1],
                                     outputRange: ['rgba(255, 255, 255, 0.7)', '#4CAF50', '#4CAF50'],
                                     extrapolate: 'clamp'
                                   })
                                 : 'rgba(255, 255, 255, 0.7)'
                             }
                           ]} 
                         />
                       );
                     })}
                  </Animated.View>
                </View>
               <Text style={styles.audioDuration}>{formatDuration(item.duration || 15)}</Text>
             </View>
           )}
        </TouchableOpacity>
         
        <Text style={[
          styles.messageTime,
          item.isFromMe ? styles.myMessageTime : styles.theirMessageTime,
        ]}>
          {formatTime(item.timestamp)}
        </Text>
        
        {item.isFromMe && (
          <View style={styles.messageStatus}>
            <Ionicons 
              name={item.isRead ? "checkmark-done" : "checkmark"} 
              size={16} 
              color={item.isRead ? "#4CAF50" : "#999"} 
            />
          </View>
        )}
        
        {item.isFromMe && (
          <Image source={{ uri: currentUser.photo }} style={[styles.messageAvatar, { marginLeft: 8, marginRight: 0 }]} />
        )}
      </Animated.View>
    );
  };

  const renderRequestHeader = () => {
    if (!isFirstTimeChat || hasAcceptedRequest) return null;
    
    return (
      <View style={styles.requestHeader}>
        <Image source={{ uri: mockUser.photo }} style={styles.requestAvatar} />
        <Text style={styles.requestName}>{mockUser.name}</Text>
        <Text style={styles.requestMessage}>wants to send you a message</Text>
        
        <View style={styles.requestActions}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteRequest}>
            <Text style={styles.deleteButtonText}>Delete Request</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptRequest}>
            <LinearGradient
              colors={['#FF4458', '#FF6B7A']}
              style={styles.acceptButtonGradient}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.viewProfileButton}>
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfo}>
          <Image source={{ uri: mockUser.photo }} style={styles.headerAvatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{mockUser.name}</Text>
            <Text style={styles.userStatus}>
              {mockUser.isOnline ? 'Online' : 'Last seen recently'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Call buttons */}
        <View style={styles.callButtons}>
          {/* Audio call button */}
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => startCall('audio', mockUser)}
            disabled={callState.isActive}
          >
            <Ionicons 
              name="call" 
              size={20} 
              color={callState.isActive ? '#ccc' : '#4CAF50'} 
            />
          </TouchableOpacity>
          
          {/* Video call button */}
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => startCall('video', mockUser)}
            disabled={callState.isActive}
          >
            <Ionicons 
              name="videocam" 
              size={20} 
              color={callState.isActive ? '#ccc' : '#2196F3'} 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.moreButton} 
          onPress={() => setShowUserActions(true)}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <View style={styles.messagesContainer}>
        {renderRequestHeader()}

        <FlatList
          ref={flatListRef}
          data={hasAcceptedRequest ? messages : []}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />
      </View>



      {/* Recording Overlay */}
      {showRecordingPopup && (
        <View style={styles.recordingOverlay}>
          <View style={styles.recordingContainer}>
            <TouchableOpacity 
              style={styles.cancelRecording}
              onPress={cancelRecording}
            >
              <Ionicons name="close" size={24} color="#FF4458" />
            </TouchableOpacity>
            
            <View style={styles.waveformContainer}>
              <View style={styles.recordingInfo}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Recording...</Text>
                <Text style={styles.recordingDuration}>{formatDuration(recordingDuration)}</Text>
              </View>
              
              <View style={styles.waveform}>
                {waveformAnimations.map((anim, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.waveformBar,
                      {
                        height: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [4, 40],
                        }),
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
            
            <View style={styles.recordingActions}>
              {!isRecording ? (
                <TouchableOpacity 
                  style={styles.startRecordingButton}
                  onPress={startRecording}
                >
                  <Ionicons name="mic" size={24} color="white" />
                </TouchableOpacity>
              ) : (
                <View style={styles.recordingActiveControls}>
                  <TouchableOpacity 
                    style={[styles.controlButton, styles.pauseButton]}
                    onPress={isPaused ? resumeRecording : pauseRecording}
                  >
                    <Ionicons 
                      name={isPaused ? "play" : "pause"} 
                      size={24} 
                      color="white" 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.sendRecording}
                    onPress={stopRecording}
                  >
                    <LinearGradient
                      colors={['#FF4458', '#FF6B7A']}
                      style={styles.sendRecordingGradient}
                    >
                      <Ionicons name="send" size={24} color="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Input */}
      {hasAcceptedRequest && (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          {replyingTo && (
            <View style={styles.replyPreview}>
              <View style={styles.replyPreviewContent}>
                <Ionicons name="arrow-undo-outline" size={16} color="#666" />
                <View style={styles.replyPreviewText}>
                  <Text style={styles.replyPreviewAuthor}>
                    Replying to {replyingTo.isFromMe ? 'yourself' : mockUser.name}
                  </Text>
                  <Text style={styles.replyPreviewMessage} numberOfLines={1}>
                    {replyingTo.text || (replyingTo.type === 'image' ? '📷 Photo' : '🎵 Audio')}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.replyPreviewClose}
                onPress={() => setReplyingTo(null)}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
          
          {showEmojiPicker && (
            <View style={styles.emojiPicker}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {emojis.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.emojiButton}
                    onPress={() => handleEmojiSelect(emoji)}
                  >
                    <Text style={styles.emoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          
          <View style={styles.inputRow}>
            <TouchableOpacity 
              style={styles.inputButton}
              onPress={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Ionicons name="happy-outline" size={24} color="#666" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              multiline
              maxLength={1000}
              editable={!isRecording}
            />
            
            <TouchableOpacity style={styles.inputButton} onPress={handleImagePicker}>
              <Ionicons name="camera-outline" size={24} color="#666" />
            </TouchableOpacity>
            
            {inputText.trim() ? (
              <TouchableOpacity style={styles.sendButton} onPress={handleSendText}>
                <LinearGradient
                  colors={['#FF4458', '#FF6B7A']}
                  style={styles.sendButtonGradient}
                >
                  <Ionicons name="send" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.recordButton}
                onPress={openRecordingPopup}
              >
                <Animated.View style={[styles.recordButtonInner, { transform: [{ scale: recordingAnimation }] }]}>
                  <Ionicons name="mic" size={20} color="white" />
                </Animated.View>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Long Press Message Actions Modal */}
      <Modal
        visible={longPressedMessage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setLongPressedMessage(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setLongPressedMessage(null)}
        >
          <View style={styles.actionSheet}>
            {longPressedMessage && messages.find(m => m.id === longPressedMessage)?.text && (
              <TouchableOpacity 
                style={styles.actionItem}
                onPress={() => {
                  copyMessage(longPressedMessage);
                }}
              >
                <Ionicons name="copy-outline" size={20} color="#333" />
                <Text style={styles.actionText}>Copy Message</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => {
                if (longPressedMessage) {
                  deleteMessage(longPressedMessage);
                }
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#FF4458" />
              <Text style={[styles.actionText, { color: '#FF4458' }]}>Delete Message</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>



      {/* User Actions Modal */}
      <Modal
        visible={showUserActions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUserActions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowUserActions(false)}
        >
          <View style={styles.actionSheet}>
            <TouchableOpacity style={styles.actionItem} onPress={handleBlockUser}>
              <Ionicons name="ban-outline" size={20} color="#FF4458" />
              <Text style={[styles.actionText, { color: '#FF4458' }]}>Block User</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={handleReportUser}>
              <Ionicons name="flag-outline" size={20} color="#FF4458" />
              <Text style={[styles.actionText, { color: '#FF4458' }]}>Report User</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="trash-outline" size={20} color="#FF4458" />
              <Text style={[styles.actionText, { color: '#FF4458' }]}>Delete Chat</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userStatus: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  callButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  moreButton: {
    marginLeft: 16,
  },
  messagesContainer: {
    flex: 1,
  },
  requestHeader: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  requestAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  requestName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  requestMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  deleteButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  acceptButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  acceptButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  viewProfileButton: {
    marginTop: 8,
  },
  viewProfileText: {
    fontSize: 14,
    color: '#FF4458',
    fontWeight: '500',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  myMessageBubble: {
    backgroundColor: '#FF4458',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: 'white',
  },
  theirMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  theirMessageTime: {
    color: '#999',
  },
  messageStatus: {
    marginLeft: 8,
    justifyContent: 'flex-end',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 4,
  },
  audioMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 200,
  },
  audioPlayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  audioWaveformContainer: {
    flex: 1,
    marginRight: 12,
    position: 'relative',
  },
  audioWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  audioBar: {
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 1,
    borderRadius: 1,
  },

  audioDuration: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  emojiPicker: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  emojiButton: {
    marginRight: 16,
  },
  emoji: {
    fontSize: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginHorizontal: 8,
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF4458',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSheet: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    minWidth: screenWidth * 0.7,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    color: '#333',
  },
  recordingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  recordingContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    minWidth: screenWidth * 0.8,
  },
  cancelRecording: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  waveformContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4458',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginRight: 12,
  },
  recordingDuration: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4458',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
  waveformBar: {
    width: 3,
    backgroundColor: '#FF4458',
    marginHorizontal: 1,
    borderRadius: 1.5,
  },
  sendRecording: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  sendRecordingGradient: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  recordingActiveControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF4458',
  },
  pauseButton: {
    backgroundColor: '#007AFF',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
  },
  startRecordingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF4458',
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyLine: {
    width: 3,
    height: 30,
    backgroundColor: '#FF4458',
    borderRadius: 1.5,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF4458',
    marginBottom: 2,
  },
  replyText: {
    fontSize: 13,
    color: '#666',
  },
  replyPreview: {
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyPreviewContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyPreviewText: {
    flex: 1,
    marginLeft: 8,
  },
  replyPreviewAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF4458',
    marginBottom: 2,
  },
  replyPreviewMessage: {
    fontSize: 13,
    color: '#666',
  },
  replyPreviewClose: {
    padding: 4,
  },
  

});