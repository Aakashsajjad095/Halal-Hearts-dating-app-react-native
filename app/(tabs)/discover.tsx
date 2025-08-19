import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  PanResponder,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { AppColors } from '@/constants/Colors';
import { Spacing, Sizes, Typography } from '@/constants/Spacing';
import { Ionicons, MaterialIcons, AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Profile {
  id: string;
  name: string;
  age: number;
  distance: string;
  bio: string;
  photos: string[];
  interests: string[];
  occupation: string;
  education: string;
  height: string;
  location: string;
  verified: boolean;
}

const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Claudia Agneta',
    age: 23,
    distance: '2 km away',
    bio: 'He is not a broken lover who does not love forever.',
    photos: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
      'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400',
    ],
    interests: ['Photography', 'Travel', 'Coffee', 'Art', 'Music', 'Reading'],
    occupation: 'Software Engineer',
    education: 'UC Berkeley',
    height: '5\'5"',
    location: 'Paris, France',
    verified: true,
  },
  {
    id: '2',
    name: 'Sarah',
    age: 28,
    distance: '5 km away',
    bio: 'Yoga instructor and dog lover. Love to explore new places and meet new people.',
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
      'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400',
    ],
    interests: ['Yoga', 'Dogs', 'Meditation', 'Fitness'],
    occupation: 'Yoga Instructor',
    education: 'Stanford University',
    height: '5\'3"',
    location: 'Palo Alto, CA',
    verified: false,
  },
];

export default function DiscoverScreen() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [cardStack, setCardStack] = useState([0, 1]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const currentProfile = mockProfiles[currentProfileIndex];
  const nextProfile = mockProfiles[cardStack[1]] || mockProfiles[0];
  
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const cardRotation = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const backgroundScale = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundScale, {
          toValue: 1.05,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundScale, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    
    return () => pulseAnimation.stop();
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return !isAnimating && (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5);
    },
    onPanResponderGrant: () => {
      Animated.spring(cardScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderMove: (_, gestureState) => {
      translateX.setValue(gestureState.dx);
      translateY.setValue(gestureState.dy);
      
      const rotation = gestureState.dx / screenWidth * 0.4;
      cardRotation.setValue(rotation);
      
      const scaleValue = 1 - Math.abs(gestureState.dx) / (screenWidth * 3);
      scale.setValue(Math.max(scaleValue, 0.85));
      
      const opacityValue = 1 - Math.abs(gestureState.dx) / (screenWidth * 1.5);
      opacity.setValue(Math.max(opacityValue, 0.3));
      
      const headerOpacityValue = 1 - Math.abs(gestureState.dx) / (screenWidth * 0.8);
      headerOpacity.setValue(Math.max(headerOpacityValue, 0));
    },
    onPanResponderRelease: (_, gestureState) => {
      const threshold = screenWidth * 0.3;
      const velocity = Math.abs(gestureState.vx);
      
      if (Math.abs(gestureState.dx) > threshold || velocity > 0.5) {
        setIsAnimating(true);
        const direction = gestureState.dx > 0 ? 1 : -1;
        const toValue = direction * screenWidth * 1.2;
        
        Animated.parallel([
          Animated.timing(translateX, {
            toValue,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: gestureState.dy * 0.5,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(cardRotation, {
            toValue: direction * 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          handleSwipe(direction > 0 ? 'like' : 'pass');
        });
      } else {
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(cardScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(opacity, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(cardRotation, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(headerOpacity, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
  });

  const handleSwipe = (action: 'like' | 'pass' | 'super') => {
    console.log(`${action} on ${currentProfile.name}`);
    
    // Reset animations
    translateX.setValue(0);
    translateY.setValue(0);
    scale.setValue(1);
    opacity.setValue(1);
    cardRotation.setValue(0);
    cardScale.setValue(1);
    headerOpacity.setValue(1);
    
    // Update card stack
    const newStack = [cardStack[1], (cardStack[1] + 1) % mockProfiles.length];
    setCardStack(newStack);
    
    // Move to next profile
    setCurrentProfileIndex(newStack[0]);
    setCurrentPhotoIndex(0);
    setIsAnimating(false);
  };

  const handleActionButton = (action: 'like' | 'pass' | 'super') => {
    handleSwipe(action);
  };

  const handleAction = (action: 'like' | 'pass' | 'star' | 'superlike') => {
    console.log(`${action} on ${currentProfile.name}`);
    
    // Reset animations
    translateX.setValue(0);
    translateY.setValue(0);
    scale.setValue(1);
    opacity.setValue(1);
    cardRotation.setValue(0);
    
    // Move to next profile
    setCurrentProfileIndex((prev) => (prev + 1) % mockProfiles.length);
    setCurrentPhotoIndex(0);
  };

  const handlePhotoTap = (side: 'left' | 'right') => {
    if (side === 'left' && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    } else if (side === 'right' && currentPhotoIndex < currentProfile.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Dynamic Background */}
      <Animated.View style={[styles.backgroundContainer, { transform: [{ scale: backgroundScale }] }]}>
        <ImageBackground 
          source={{ uri: currentProfile.photos[currentPhotoIndex] }} 
          style={styles.backgroundImage}
          blurRadius={25}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(20,20,40,0.3)', 'rgba(0,0,0,0.8)']}
            style={styles.gradientOverlay}
          />
        </ImageBackground>
      </Animated.View>
      
      {/* Floating Header */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={20} style={styles.headerBlur}>
          <TouchableOpacity 
            style={styles.filterButtonFloat}
            onPress={() => setShowFilters(true)}
          >
            <Feather name="sliders" size={22} color="white" />
          </TouchableOpacity>
        </BlurView>
        <BlurView intensity={20} style={[styles.headerBlur, { marginLeft: 12 }]}>
          <TouchableOpacity style={styles.filterButtonFloat}>
            <Ionicons name="notifications-outline" size={22} color="white" />
          </TouchableOpacity>
        </BlurView>
      </Animated.View>

<ScrollView>
      <SafeAreaView style={styles.safeArea}>
        {/* Card Stack Container */}
        <View style={styles.cardStackContainer}>
          {/* Background Card */}
          <View style={[styles.profileCard, styles.backgroundCard]}>
            <Image
              source={{ uri: nextProfile.photos[0] }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
          
          {/* Main Profile Card */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.profileCard,
              styles.mainCard,
              {
                opacity,
                transform: [
                  { translateX },
                  { translateY },
                  { scale: Animated.multiply(scale, cardScale) },
                  { rotate: cardRotation.interpolate({
                      inputRange: [-1, 1],
                      outputRange: ['-12deg', '12deg'],
                    })
                  },
                ],
              },
            ]}
          >
            {/* Photo Container with Enhanced UI */}
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: currentProfile.photos[currentPhotoIndex] }}
                style={styles.profileImage}
                resizeMode="cover"
              />
              
              {/* Photo Indicators */}
              <View style={styles.photoIndicators}>
                {currentProfile.photos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.photoIndicator,
                      index === currentPhotoIndex && styles.activePhotoIndicator
                    ]}
                  />
                ))}
              </View>
              
              {/* Photo tap areas for navigation */}
              <TouchableOpacity
                style={[styles.photoTapArea, styles.leftTapArea]}
                onPress={() => handlePhotoTap('left')}
                activeOpacity={1}
              />
              <TouchableOpacity
                style={[styles.photoTapArea, styles.rightTapArea]}
                onPress={() => handlePhotoTap('right')}
                activeOpacity={1}
              />
              
              {/* Floating Quick Actions */}
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickActionButton}>
                  <Feather name="heart" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton}>
                  <Feather name="message-circle" size={18} color="white" />
                </TouchableOpacity>
              </View>

              {/* Profile Info Overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                style={styles.profileOverlay}
              >
                <View style={styles.profileInfo}>
                  <View style={styles.nameRow}>
                    <LinearGradient
                      colors={['#FF4458', '#FF6B7A']}
                      style={styles.nameGradientContainer}
                    >
                      <Text style={styles.profileName}>
                        {currentProfile.name}, {currentProfile.age}
                      </Text>
                      {currentProfile.verified && (
                        <View style={styles.verifiedBadgeBlue}>
                          <Ionicons name="checkmark" size={12} color="white" />
                        </View>
                      )}
                    </LinearGradient>
                  </View>
                  <View style={styles.locationRow}>
                    <LinearGradient
                      colors={['#FF4458', '#FF6B7A']}
                      style={styles.locationGradientContainer}
                    >
                      <Ionicons name="location" size={14} color="white" />
                      <Text style={styles.profileDistance}>{currentProfile.location}</Text>
                    </LinearGradient>
                  </View>
                  
                  {/* Interest Tags */}
                  <View style={styles.tagsContainer}>
                    {currentProfile.interests.slice(0, 3).map((interest, index) => (
                      <View key={index} style={styles.interestTag}>
                        <Text style={styles.tagText}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                  
                  {/* Bio Preview */}
                  <Text style={styles.bioPreview} numberOfLines={2}>
                    {currentProfile.bio}
                  </Text>
                  
                  {/* Instant Message Button */}
                  {/* <TouchableOpacity>
                    <LinearGradient
                      colors={['#FF4458', '#FF6B7A']}
                      style={styles.instantMessageButtonGradient}
                    >
                      <Ionicons name="chatbubble" size={16} color="white" />
                      <Text style={styles.instantMessageText}>Instant Halal Hearts</Text>
                    </LinearGradient>
                  </TouchableOpacity> */}
                </View>
              </LinearGradient>
            </View>
          </Animated.View>
        </View>

        {/* Floating Action Buttons */}
        <View style={styles.floatingActionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.floatingActionButton, styles.passButton]}
            onPress={() => handleSwipe('pass')}
          >
            <LinearGradient
              colors={['#FF4458', '#FF6B7A']}
              style={styles.actionButtonGradient}
            >
              <Feather name="x" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.floatingActionButton, styles.superLikeButton]}
            onPress={() => handleSwipe('super')}
          >
            <LinearGradient
              colors={['#FFD700', '#FFB300']}
              style={styles.actionButtonGradient}
            >
              <Feather name="star" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.floatingActionButton, styles.likeButton]}
            onPress={() => handleSwipe('like')}
          >
            <LinearGradient
              colors={['#4CAF50', '#66BB6A']}
              style={styles.actionButtonGradient}
            >
              <Feather name="heart" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.floatingActionButton, styles.detailsButton]}
            onPress={() => setShowDetails(true)}
          >
            <LinearGradient
              colors={['#FF4458', '#FF6B7A']}
              style={styles.actionButtonGradient}
            >
              <Feather name="user" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Enhanced Profile Details Modal */}
        {showDetails && (
          <View style={styles.detailsModal}>
            <TouchableOpacity 
              style={styles.modalOverlay} 
              onPress={() => setShowDetails(false)}
            />
            <View style={styles.detailsContent}>
              <View style={styles.detailsHeader}>
                <TouchableOpacity 
                  style={styles.detailsCloseButton}
                  onPress={() => setShowDetails(false)}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.detailsTitle}>Profile Details</Text>
                <View style={styles.placeholder} />
              </View>
              
              <ScrollView 
                style={styles.detailsScroll}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
                bounces={true}
                scrollEventThrottle={16}
                removeClippedSubviews={false}
              >
                {/* Photo Grid with Dummy Images */}
                <View style={styles.photoGrid}>
                  <View style={styles.gridPhoto}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400' }} style={styles.gridPhotoImage} />
                  </View>
                  <View style={styles.gridPhoto}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' }} style={styles.gridPhotoImage} />
                  </View>
                  <View style={styles.gridPhoto}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400' }} style={styles.gridPhotoImage} />
                  </View>
                  <View style={styles.gridPhoto}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400' }} style={styles.gridPhotoImage} />
                  </View>
                  <View style={styles.gridPhoto}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400' }} style={styles.gridPhotoImage} />
                  </View>
                  <View style={styles.gridPhoto}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' }} style={styles.gridPhotoImage} />
                  </View>
                </View>
                
                {/* Profile Info Card */}
                <View style={styles.profileInfoCard}>
                  <View style={styles.profileHeader}>
                    <View style={styles.nameSection}>
                      <Text style={styles.profileNameLarge}>
                        {currentProfile.name}, {currentProfile.age}
                      </Text>
                      {currentProfile.verified && (
                        <View style={styles.verifiedBadgeLarge}>
                          <Ionicons name="checkmark" size={12} color="white" />
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.locationSection}>
                    <Ionicons name="location" size={16} color={AppColors.gray[500]} />
                    <Text style={styles.locationText}>{currentProfile.location}</Text>
                  </View>
                  <TouchableOpacity>
                    <LinearGradient
                      colors={['#FF4458', '#FF6B7A']}
                      style={styles.instantHalalHeartsBtnLarge}
                    >
                      <Ionicons name="chatbubble" size={16} color="white" />
                      <Text style={styles.instantHalalHeartsTextLarge}>Instant Halal Hearts</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                
                {/* Interests Section */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Interests</Text>
                  <View style={styles.interestsContainer}>
                    {currentProfile.interests.map((interest, index) => (
                      <View key={index} style={styles.interestTagLarge}>
                        <Text style={styles.interestTextLarge}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>In few words...</Text>
                  <Text style={styles.bioText}>{currentProfile.bio}</Text>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Basic Info</Text>
                  <View style={styles.basicInfoGrid}>
                    <View style={styles.infoCard}>
                      <View style={styles.infoIconContainer}>
                        <Ionicons name="resize" size={20} color={AppColors.primary[500]} />
                      </View>
                      <Text style={styles.infoCardValue}>{currentProfile.height}</Text>
                      <Text style={styles.infoCardLabel}>Height</Text>
                    </View>
                    <View style={styles.infoCard}>
                      <View style={styles.infoIconContainer}>
                        <Ionicons name="briefcase" size={20} color={AppColors.primary[500]} />
                      </View>
                      <Text style={styles.infoCardValue}>{currentProfile.occupation}</Text>
                      <Text style={styles.infoCardLabel}>Occupation</Text>
                    </View>
                    <View style={styles.infoCard}>
                      <View style={styles.infoIconContainer}>
                        <Ionicons name="school" size={20} color={AppColors.primary[500]} />
                      </View>
                      <Text style={styles.infoCardValue}>{currentProfile.education}</Text>
                      <Text style={styles.infoCardLabel}>Education</Text>
                    </View>
                  </View>
                </View>
                
                {/* Additional spacing for better scrolling */}
                <View style={styles.bottomSpacing} />
              </ScrollView>
            </View>
          </View>
        )}
        
        {/* Filter Popup Modal */}
        {showFilters && (
          <View style={styles.filterModalOverlay}>
            <TouchableOpacity 
              style={styles.filterModalBackground}
              onPress={() => setShowFilters(false)}
            />
            <View style={styles.filterModalContent}>
              <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>Filters</Text>
                <TouchableOpacity onPress={() => setShowFilters(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.filterScrollView}>
                {/* Age Range */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Age Range</Text>
                  <View style={styles.ageRangeContainer}>
                    <Text style={styles.ageRangeText}>18 - 35</Text>
                  </View>
                </View>
                
                {/* Distance */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Distance</Text>
                  <View style={styles.distanceContainer}>
                    <Text style={styles.distanceText}>Within 25 km</Text>
                  </View>
                </View>
                
                {/* Interests */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Interests</Text>
                  <View style={styles.filterInterestsGrid}>
                    {['Travel', 'Music', 'Sports', 'Art', 'Food', 'Movies'].map((interest, index) => (
                      <TouchableOpacity key={index} style={styles.filterInterestChip}>
                        <Text style={styles.filterInterestText}>{interest}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>
              
              <View style={styles.filterActions}>
                <TouchableOpacity style={styles.clearFiltersBtn}>
                  <Text style={styles.clearFiltersText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <LinearGradient
                    colors={['#FF4458', '#FF6B7A']}
                    style={styles.applyFiltersBtn}
                  >
                    <Text style={styles.applyFiltersText}>Apply Filters</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

      </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingHeader: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    zIndex: 100,
  },
  headerBlur: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  filterButtonFloat: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 140,
  },
  backgroundCard: {
    position: 'absolute',
    transform: [{ scale: 0.95 }, { translateY: 10 }],
    opacity: 0.3,
    zIndex: 1,
  },
  mainCard: {
    zIndex: 2,
  },
  quickActions: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'column',
    gap: 12,
    zIndex: 10,
  },
  quickActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  photoIndicators: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 6,
    zIndex: 5,
  },
  photoIndicator: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  activePhotoIndicator: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
  },
  profileInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 20,
    overflow: 'hidden',
    margin: 16,
  },
  profileInfoGradient: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAge: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(66, 232, 194, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#42e8c2',
  },
  profileMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 20,
    zIndex: 200,
  },
  modernActionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  actionButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passButton: {
    transform: [{ scale: 0.9 }],
  },
  superLikeButton: {
    transform: [{ scale: 0.85 }],
  },
  likeButton: {
    transform: [{ scale: 1.1 }],
  },
  detailsButton: {
    transform: [{ scale: 0.9 }],
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  headerButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContainer: {
    paddingHorizontal: 0,
    paddingBottom: 140,
    paddingTop: 100,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    width: screenWidth - 40,
    height: screenHeight * 0.65,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 25,
    overflow: 'hidden',
  },
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  photoTapArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
  },
  leftTapArea: {
    left: 0,
  },
  rightTapArea: {
    right: 0,
  },
  profileOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  profileInfo: {
    padding: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
  },
  profileBio: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 4,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileDistance: {
    fontSize: 14,
    color: 'white',
    marginLeft: 4,
    opacity: 0.9,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  bioPreview: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
  },
  instantMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  instantMessageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  actionButtons: {
     position: 'absolute',
     bottom: 120,
     left: 0,
     right: 0,
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     paddingHorizontal: 40,
     gap: 25,
     zIndex: 200,
   },
  floatingActionButtonsContainer: {
    position: 'absolute',
    bottom: 130,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    zIndex: 10,
  },
  floatingActionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    transform: [{ translateY: -20 }],
  },
  actionButton: {
     width: 70,
     height: 70,
     borderRadius: 35,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'rgba(255, 255, 255, 0.95)',
     shadowColor: '#000',
     shadowOffset: {
       width: 0,
       height: 8,
     },
     shadowOpacity: 0.25,
     shadowRadius: 15,
     elevation: 15,
     borderWidth: 2,
     borderColor: 'rgba(255, 255, 255, 0.3)',
   },
  starButton: {
     backgroundColor: 'rgba(255, 193, 7, 0.9)',
     borderColor: '#FFC107',
   },
   heartButton: {
     backgroundColor: 'rgba(76, 175, 80, 0.9)',
     borderColor: '#4CAF50',
   },
   closeButton: {
     backgroundColor: 'rgba(244, 67, 54, 0.9)',
     borderColor: '#F44336',
   },
   boltButton: {
     backgroundColor: 'rgba(156, 39, 176, 0.9)',
     borderColor: '#9C27B0',
   },
  detailsModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 1000,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  detailsContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: screenHeight * 0.9,
    overflow: 'hidden',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
    zIndex: 10,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: Spacing.lg,
  },
  gridPhoto: {
    width: (screenWidth - 64) / 3,
    height: (screenWidth - 64) / 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridPhotoImage: {
    width: '100%',
    height: '100%',
  },
  profileInfoCard: {
    backgroundColor: AppColors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: 16,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  profileNameLarge: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: AppColors.gray[900],
    marginRight: Spacing.sm,
  },
  verifiedBadgeLarge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadgeBlue: {
    backgroundColor: '#1DA1F2',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.xs,
  },
  nameGradientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  locationGradientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  instantMessageButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: Typography.md,
    color: AppColors.gray[600],
    marginLeft: Spacing.xs,
  },
  instantHalalHeartsBtnLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  instantHalalHeartsTextLarge: {
     color: 'white',
     fontSize: Typography.md,
     fontWeight: Typography.semiBold,
     marginLeft: Spacing.xs,
   },
  basicInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  infoCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: AppColors.gray[50],
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  infoCardValue: {
     fontSize: Typography.md,
     fontWeight: Typography.semiBold,
     color: AppColors.gray[900],
     textAlign: 'center',
     marginBottom: Spacing.xs,
   },
  infoCardLabel: {
    fontSize: Typography.sm,
    color: AppColors.gray[600],
    textAlign: 'center',
  },
  interestTagLarge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  interestTextLarge: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailsScroll: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  detailsCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  detailSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: AppColors.gray[900],
    marginBottom: Spacing.md,
  },
  bioText: {
    fontSize: Typography.md,
    color: AppColors.gray[700],
    lineHeight: Typography.lineHeightNormal * Typography.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: Typography.md,
    color: AppColors.gray[600],
    fontWeight: Typography.medium,
  },
  infoValue: {
    fontSize: Typography.md,
    color: AppColors.gray[900],
    fontWeight: Typography.medium,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  interestText: {
    fontSize: Typography.sm,
    color: AppColors.primary[700],
    fontWeight: Typography.medium,
  },
  
  // Filter Modal Styles
  filterModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filterModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: screenWidth - 40,
    maxHeight: screenHeight * 0.8,
    overflow: 'hidden',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  filterScrollView: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ageRangeContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  ageRangeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  distanceContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  filterInterestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterInterestChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterInterestText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  clearFiltersBtn: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyFiltersBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  bottomSpacing: {
    height: 50,
  },
});