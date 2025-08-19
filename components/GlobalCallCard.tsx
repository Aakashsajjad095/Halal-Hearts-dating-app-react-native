import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
}

interface GlobalCallCardProps {
  callState: CallState;
  onExpand: () => void;
  onMinimize: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleSpeaker: () => void;
}

export default function GlobalCallCard({
  callState,
  onExpand,
  onMinimize,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  onToggleSpeaker,
}: GlobalCallCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position] = useState(new Animated.ValueXY({ x: screenWidth - 220, y: 100 }));
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Enhanced animations for calling state
  React.useEffect(() => {
    if (callState.status === 'calling') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      
      const rotate = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      );
      
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      
      pulse.start();
      rotate.start();
      glow.start();
      
      return () => {
        pulse.stop();
        rotate.stop();
        glow.stop();
      };
    } else {
      rotateAnim.setValue(0);
      glowAnim.setValue(0);
    }
  }, [callState.status]);

  // Enhanced pan responder for smooth dragging (completely JS-driven to avoid conflicts)
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
    },
    onPanResponderGrant: () => {
      // Stop any running animations on position to avoid conflicts
      position.stopAnimation();
    },
    onPanResponderMove: (_, gestureState) => {
        // Use setValue for immediate position updates (JS-driven)
        position.setValue({
          x: gestureState.moveX - 100, // Center the card on finger (200px width / 2)
          y: gestureState.moveY - 35,  // Center vertically (70px height / 2)
        });
      },
      onPanResponderRelease: (_, gestureState) => {
        // Enhanced snap to edges with better positioning
        const snapToLeft = gestureState.moveX < screenWidth / 2;
        const newX = snapToLeft ? 20 : screenWidth - 220; // Account for 200px width
        const newY = Math.max(80, Math.min(screenHeight - 120, gestureState.moveY - 35));

      // Smooth spring animation for snapping (JS-driven only)
      Animated.spring(position, {
        toValue: { x: newX, y: newY },
        tension: 100,
        friction: 8,
        useNativeDriver: false, // Explicitly JS-driven
      }).start();
    },
  });

  const handleExpand = () => {
    setIsExpanded(true);
    onExpand();
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    onMinimize();
  };

  if (!callState.isActive) {
    return null;
  }

  return (
    <>
      {/* Enhanced Minimized Call Card */}
      {callState.isMinimized && (
        <Animated.View
          style={[
            styles.minimizedCard,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Separate animated view for native-driven effects */}
          <Animated.View
            style={{
              flex: 1,
              transform: [
                { scale: scaleAnim },
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}
          >
          {/* Glow effect background */}
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.8],
                }),
              },
            ]}
          />
          
          <TouchableOpacity
            style={styles.cardContent}
            onPress={handleExpand}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={callState.status === 'calling' 
                ? ['#FF6B6B', '#FF8E8E', '#FFB3B3'] 
                : ['#4ECDC4', '#44A08D', '#096A5A']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              {/* Floating particles effect */}
              <View style={styles.particlesContainer}>
                <View style={[styles.particle, styles.particle1]} />
                <View style={[styles.particle, styles.particle2]} />
                <View style={[styles.particle, styles.particle3]} />
              </View>

              {/* User Avatar with enhanced pulse effect */}
              <Animated.View
                style={[
                  styles.avatarContainer,
                  {
                    transform: [{ scale: callState.status === 'calling' ? pulseAnim : 1 }],
                  },
                ]}
              >
                <Image source={{ uri: callState.userPhoto }} style={styles.avatar} />
                {callState.status === 'calling' && (
                  <Animated.View 
                    style={[
                      styles.callingRing,
                      {
                        opacity: pulseAnim.interpolate({
                          inputRange: [1, 1.15],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ]}
                  />
                )}
                <View style={styles.avatarBorder} />
              </Animated.View>

              {/* Enhanced Call Info */}
              <View style={styles.callInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {callState.userName}
                </Text>
                <Text style={styles.callDuration}>
                  {callState.status === 'calling' ? 'Calling...' : formatDuration(callState.duration)}
                </Text>
                <View style={styles.statusIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: callState.status === 'calling' ? '#FF6B6B' : '#4CAF50' }]} />
                </View>
              </View>

              {/* Enhanced Call Type Icon */}
              <View style={styles.callTypeIcon}>
                <View style={styles.iconBackground}>
                  <Ionicons
                    name={callState.type === 'video' ? 'videocam' : 'call'}
                    size={16}
                    color="white"
                  />
                </View>
              </View>

              {/* Enhanced End Call Button */}
              <TouchableOpacity
                style={styles.endCallButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onEndCall();
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <LinearGradient
                  colors={['#FF3B30', '#FF6B6B']}
                  style={styles.endCallGradient}
                >
                  <Ionicons name="call" size={14} color="white" style={{ transform: [{ rotate: '135deg' }] }} />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}

      {/* Expanded Call Modal */}
      <Modal
        visible={isExpanded || !callState.isMinimized}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
      >
        <View style={styles.expandedContainer}>
          <LinearGradient
            colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
            style={styles.expandedGradient}
          >
            {/* Header */}
            <View style={styles.expandedHeader}>
              <TouchableOpacity
                style={styles.minimizeButton}
                onPress={handleCollapse}
              >
                <Ionicons name="chevron-down" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.expandedStatus}>
                {callState.status === 'calling' ? 'Calling...' : formatDuration(callState.duration)}
              </Text>
              <TouchableOpacity
                style={styles.expandedEndButton}
                onPress={onEndCall}
              >
                <Ionicons name="call" size={20} color="white" style={{ transform: [{ rotate: '135deg' }] }} />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <View style={styles.expandedUserInfo}>
              <Animated.View
                style={[
                  styles.expandedAvatarContainer,
                  {
                    transform: [{ scale: callState.status === 'calling' ? pulseAnim : 1 }],
                  },
                ]}
              >
                <Image source={{ uri: callState.userPhoto }} style={styles.expandedAvatar} />
                {callState.status === 'calling' && (
                  <View style={styles.expandedCallingRing} />
                )}
              </Animated.View>
              <Text style={styles.expandedUserName}>{callState.userName}</Text>
              <Text style={styles.expandedCallType}>
                {callState.type === 'video' ? 'Video Call' : 'Voice Call'}
              </Text>
            </View>

            {/* Video Container (for video calls) */}
            {callState.type === 'video' && callState.status === 'connected' && (
              <View style={styles.videoContainer}>
                <View style={styles.remoteVideo}>
                  <Image
                    source={{ uri: callState.userPhoto }}
                    style={styles.remoteVideoImage}
                  />
                  {!callState.isVideoOn && (
                    <BlurView intensity={20} style={styles.videoOffOverlay}>
                      <Ionicons name="videocam-off" size={40} color="white" />
                      <Text style={styles.videoOffText}>Camera is off</Text>
                    </BlurView>
                  )}
                </View>
                
                {/* Local video preview */}
                <View style={styles.localVideo}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }}
                    style={styles.localVideoImage}
                  />
                </View>
              </View>
            )}



            {/* Call Controls */}
            <View style={styles.expandedControls}>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  callState.isMuted && styles.controlButtonActive,
                ]}
                onPress={onToggleMute}
              >
                <Ionicons
                  name={callState.isMuted ? 'mic-off' : 'mic'}
                  size={24}
                  color={callState.isMuted ? '#FF4458' : 'white'}
                />
              </TouchableOpacity>

              {callState.type === 'video' && (
                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    !callState.isVideoOn && styles.controlButtonActive,
                  ]}
                  onPress={onToggleVideo}
                >
                  <Ionicons
                    name={callState.isVideoOn ? 'videocam' : 'videocam-off'}
                    size={24}
                    color={!callState.isVideoOn ? '#FF4458' : 'white'}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.controlButton,
                  callState.isSpeakerOn && styles.controlButtonActive,
                ]}
                onPress={onToggleSpeaker}
              >
                <Ionicons
                  name={callState.isSpeakerOn ? 'volume-high' : 'volume-medium'}
                  size={24}
                  color={callState.isSpeakerOn ? '#4CAF50' : 'white'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.endCallControlButton}
                onPress={onEndCall}
              >
                <Ionicons name="call" size={28} color="white" style={{ transform: [{ rotate: '135deg' }] }} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  minimizedCard: {
    position: 'absolute',
    width: 200,
    height: 70,
    borderRadius: 12,
    zIndex: 9999,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  cardContent: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  callingRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
    opacity: 0.8,
  },
  callInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    marginBottom: 3,
  },
  callDuration: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  callTypeIcon: {
    marginRight: 8,
  },
  endCallButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Expanded Modal Styles
  expandedContainer: {
    flex: 1,
  },
  expandedGradient: {
    flex: 1,
    paddingTop: 60,
  },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  minimizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedStatus: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  expandedEndButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedUserInfo: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  expandedAvatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  expandedAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  expandedCallingRing: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 83,
    borderWidth: 3,
    borderColor: '#4CAF50',
    opacity: 0.7,
  },
  expandedUserName: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  expandedCallType: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
    marginVertical: 20,
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 20,
    position: 'relative',
  },
  remoteVideoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOffOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoOffText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '500',
  },
  localVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  localVideoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  expandedControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 68, 88, 0.2)',
    borderColor: '#FF4458',
  },
  endCallControlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  // New enhanced minimized card styles
  glowEffect: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 20,
    backgroundColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  particle1: {
    top: 10,
    left: 15,
  },
  particle2: {
    top: 25,
    right: 20,
  },
  particle3: {
    bottom: 15,
    left: 25,
  },
  avatarBorder: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  iconBackground: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallGradient: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});