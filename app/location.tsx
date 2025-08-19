import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateProfile } from '../store/slices/profileSlice';
import { AppColors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface LocationSuggestion {
  id: string;
  city: string;
  state: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
  popular?: boolean;
}

const mockLocationSuggestions: LocationSuggestion[] = [
  {
    id: '1',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    distance: 0,
    popular: true,
  },
  {
    id: '2',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    coordinates: { latitude: 34.0522, longitude: -118.2437 },
    distance: 380,
    popular: true,
  },
  {
    id: '3',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    distance: 2900,
    popular: true,
  },
  {
    id: '4',
    city: 'Seattle',
    state: 'WA',
    country: 'USA',
    coordinates: { latitude: 47.6062, longitude: -122.3321 },
    distance: 680,
  },
  {
    id: '5',
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    coordinates: { latitude: 30.2672, longitude: -97.7431 },
    distance: 1500,
  },
  {
    id: '6',
    city: 'Miami',
    state: 'FL',
    country: 'USA',
    coordinates: { latitude: 25.7617, longitude: -80.1918 },
    distance: 2580,
  },
];

export default function LocationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);
  
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState(mockLocationSuggestions);
  
  // Enhanced Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const saveButtonSlide = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const mapPinAnims = useRef(mockLocationSuggestions.map(() => new Animated.Value(0))).current;
  const headerSlide = useRef(new Animated.Value(-100)).current;
  const searchSlide = useRef(new Animated.Value(30)).current;
  const listSlide = useRef(new Animated.Value(50)).current;
  const floatingAnim1 = useRef(new Animated.Value(0)).current;
  const floatingAnim2 = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Enhanced entrance animations sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(headerSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(searchSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(listSlide, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      // Staggered pin animations
      Animated.stagger(150, 
        mapPinAnims.map(anim => 
          Animated.spring(anim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
    
    // Enhanced pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    
    // Continuous rotation for decorative elements
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();
    
    // Floating animations for background elements
    const floatingAnimation1 = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim1, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim1, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    floatingAnimation1.start();
    
    const floatingAnimation2 = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim2, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim2, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    );
    floatingAnimation2.start();
    
    // Shimmer effect
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    shimmerAnimation.start();
    
    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
      floatingAnimation1.stop();
      floatingAnimation2.stop();
      shimmerAnimation.stop();
    };
  }, []);
  
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredSuggestions(mockLocationSuggestions);
    } else {
      const filtered = mockLocationSuggestions.filter(
        (location) =>
          location.city.toLowerCase().includes(searchText.toLowerCase()) ||
          location.state.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
  }, [searchText]);
  
  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    
    // Selection animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Animate save button in
    Animated.spring(saveButtonSlide, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };
  
  const handleSaveLocation = () => {
    if (!selectedLocation) {
      Alert.alert('Please select a location');
      return;
    }
    
    if (profile) {
      dispatch(updateProfile({
        location: {
          city: selectedLocation.city,
          state: selectedLocation.state,
          coordinates: selectedLocation.coordinates,
        },
      }));
    }
    
    router.back();
  };
  
  const getCurrentLocation = () => {
    Alert.alert(
      'Location Access',
      'Allow access to your current location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Allow',
          onPress: () => {
            setSelectedLocation(mockLocationSuggestions[0]);
            setSearchText(mockLocationSuggestions[0].city);
          },
        },
      ]
    );
  };
  
  const renderLocationPin = (location: LocationSuggestion, index: number) => {
    const isSelected = selectedLocation?.id === location.id;
    const animValue = mapPinAnims[index];
    
    return (
      <Animated.View
        key={location.id}
        style={[
          styles.locationCard,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 100 + index * 20],
                }),
              },
              { scale: animValue },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.locationCardContent}
          onPress={() => handleLocationSelect(location)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              isSelected
                ? [AppColors.primary, AppColors.primaryLight]
                : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
            }
            style={styles.locationCardGradient}
          >
            {/* Animated Location Pin */}
            <View style={styles.pinContainer}>
              <Animated.View
                style={[
                  styles.pinCircle,
                  isSelected && styles.pinCircleSelected,
                  {
                    transform: [{ scale: isSelected ? pulseAnim : 1 }],
                  },
                ]}
              >
                <LinearGradient
                  colors={
                    isSelected
                      ? [AppColors.primary, AppColors.accent]
                      : [AppColors.gray[400], AppColors.gray[500]]
                  }
                  style={styles.pinGradient}
                >
                  <Ionicons
                    name="location"
                    size={24}
                    color="white"
                  />
                </LinearGradient>
                
                {/* Ripple Effect for Selected */}
                {isSelected && (
                  <Animated.View
                    style={[
                      styles.rippleEffect,
                      {
                        transform: [{ scale: pulseAnim }],
                        opacity: pulseAnim.interpolate({
                          inputRange: [1, 1.1],
                          outputRange: [0.3, 0],
                        }),
                      },
                    ]}
                  />
                )}
              </Animated.View>
              
              {/* Popular Badge */}
              {location.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
            </View>
            
            {/* Location Info */}
            <View style={styles.locationInfo}>
              <Text style={[styles.cityName, isSelected && styles.cityNameSelected]}>
                {location.city}
              </Text>
              <Text style={[styles.stateCountry, isSelected && styles.stateCountrySelected]}>
                {location.state}, {location.country}
              </Text>
              {location.distance !== undefined && location.distance > 0 && (
                <View style={styles.distanceContainer}>
                  <Ionicons name="navigate" size={12} color={isSelected ? 'white' : AppColors.gray[400]} />
                  <Text style={[styles.distanceText, isSelected && styles.distanceTextSelected]}>
                    {location.distance} miles
                  </Text>
                </View>
              )}
            </View>
            
            {/* Selection Indicator */}
            {isSelected && (
              <Animated.View
                style={[
                  styles.selectionIndicator,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >
                <LinearGradient
                  colors={[AppColors.success, '#66BB6A']}
                  style={styles.checkmarkGradient}
                >
                  <Ionicons name="checkmark" size={16} color="white" />
                </LinearGradient>
              </Animated.View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Animated Background */}
      <LinearGradient
        colors={[AppColors.black, AppColors.gray[900], AppColors.gray[800]]}
        style={styles.backgroundGradient}
      >
        {/* Floating Decorative Elements */}
        <Animated.View
          style={[
            styles.floatingElement,
            styles.element1,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1],
              }),
              transform: [{ rotate: spin }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingElement,
            styles.element2,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.15],
              }),
              transform: [{ rotate: spin }],
            },
          ]}
        />
      </LinearGradient>
      
      {/* Floating Background Elements */}
      <Animated.View
        style={[
          styles.floatingElement,
          styles.element1,
          {
            opacity: floatingAnim1.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
            transform: [
              {
                translateY: floatingAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
              {
                rotate: floatingAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '10deg'],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingElement,
          styles.element2,
          {
            opacity: floatingAnim2.interpolate({
              inputRange: [0, 1],
              outputRange: [0.05, 0.2],
            }),
            transform: [
              {
                translateY: floatingAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 15],
                }),
              },
              {
                scale: floatingAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                }),
              },
            ],
          },
        ]}
      />
      
      {/* Enhanced Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: headerSlide }],
          },
        ]}
      >
        {/* Shimmer effect */}
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              opacity: shimmerAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.3, 0],
              }),
              transform: [
                {
                  translateX: shimmerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 400],
                  }),
                },
              ],
            },
          ]}
        />
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={20} style={styles.backButtonGradient}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </BlurView>
          ) : (
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.backButtonGradient}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </LinearGradient>
          )}
        </TouchableOpacity>
        
        <Animated.View
          style={[
            styles.headerContent,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.headerTitle}>📍 Choose Location</Text>
          <Text style={styles.headerSubtitle}>Find your perfect spot</Text>
        </Animated.View>
        
        <TouchableOpacity style={styles.currentLocationButton} onPress={getCurrentLocation}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <LinearGradient
              colors={[AppColors.primary, AppColors.primaryLight, AppColors.accent]}
              style={styles.currentLocationGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="locate" size={20} color="white" />
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Enhanced Search Section */}
      <Animated.View
        style={[
          styles.searchSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: searchSlide }, { scale: scaleAnim }],
          },
        ]}
      >
        {Platform.OS === 'ios' ? (
          <BlurView intensity={10} style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <LinearGradient
                colors={[AppColors.primary + '20', AppColors.accent + '10']}
                style={styles.searchIconContainer}
              >
                <Ionicons name="search" size={20} color={AppColors.primary} />
              </LinearGradient>
              <TextInput
                style={styles.searchInput}
                placeholder="Search cities, states..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchText('')}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              )}
            </View>
          </BlurView>
        ) : (
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.searchContainer}
          >
            <LinearGradient
              colors={[AppColors.primary + '20', AppColors.accent + '10']}
              style={styles.searchIconContainer}
            >
              <Ionicons name="search" size={20} color={AppColors.primary} />
            </LinearGradient>
            <TextInput
              style={styles.searchInput}
              placeholder="Search cities, states..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            )}
          </LinearGradient>
        )}
      </Animated.View>
      
      {/* Enhanced Location Cards */}
      <Animated.View
        style={[
          styles.locationsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: listSlide }],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.locationsContent}
        >
          {filteredSuggestions.map((location, index) => renderLocationPin(location, index))}
        </ScrollView>
      </Animated.View>
      
      {/* Enhanced Save Button */}
      {selectedLocation && (
        <Animated.View
          style={[
            styles.saveButtonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: saveButtonSlide }],
            },
          ]}
        >
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveLocation}>
            <LinearGradient
              colors={[AppColors.success, '#66BB6A']}
              style={styles.saveButtonGradient}
            >
              <Ionicons name="checkmark-circle" size={24} color="white" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Confirm Location</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.black,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: AppColors.primary,
  },
  element1: {
    width: 120,
    height: 120,
    top: '15%',
    right: '-10%',
  },
  element2: {
    width: 80,
    height: 80,
    bottom: '25%',
    left: '-5%',
  },
  floatingElement1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: '10%',
    right: '-15%',
  },
  floatingElement2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: '60%',
    left: '-10%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    zIndex: 10,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  currentLocationButton: {
    marginLeft: 15,
  },
  currentLocationGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchBlur: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clearButton: {
    padding: 4,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
  },
  locationsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationsContent: {
  },
  locationCard: {
    marginBottom: 12,
  },
  locationCardContent: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  locationCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pinContainer: {
    position: 'relative',
    marginRight: 16,
  },
  pinCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pinCircleSelected: {
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  pinGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pinGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    top: -10,
    left: -10,
  },
  rippleEffect: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.primary,
    top: -12,
    left: -12,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: AppColors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  popularBadgeGradient: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  locationInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  cityNameSelected: {
    color: 'white',
  },
  stateCountry: {
    fontSize: 14,
    color: AppColors.gray[400],
    marginBottom: 6,
  },
  stateCountrySelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: AppColors.gray[500],
    marginLeft: 4,
  },
  distanceTextSelected: {
    color: 'rgba(255,255,255,0.7)',
  },
  selectionIndicator: {
    marginLeft: 12,
  },
  checkmarkGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 25,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  saveButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});