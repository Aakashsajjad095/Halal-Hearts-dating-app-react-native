import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/Colors';
import { Spacing, Sizes, Typography } from '@/constants/Spacing';
import { Button } from '@/components/ui/Button';
import { useAppDispatch } from '@/store/hooks';
import { updateProfile } from '@/store/slices/profileSlice';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;
const isTablet = width > 768;

export default function LocationScreen() {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const dispatch = useAppDispatch();
  
  // Enhanced Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const locationIconScale = useRef(new Animated.Value(0)).current;
  const benefitAnims = useRef([...Array(3)].map(() => new Animated.Value(0))).current;
  
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Entrance animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
      // Location icon bounce
      Animated.spring(locationIconScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      // Staggered benefit animations
      Animated.stagger(200, 
        benefitAnims.map(anim => 
          Animated.spring(anim, {
            toValue: 1,
            tension: 80,
            friction: 10,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
    
    // Continuous pulse animation for location icon
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
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
        duration: 30000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();
    
    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  const handleEnableLocation = () => {
    Alert.alert(
      'Location Access',
      'This app would like to access your location to show you people nearby.',
      [
        {
          text: 'Allow',
          onPress: () => {
            setLocationEnabled(true);
            setCurrentLocation('New York, NY');
            dispatch(updateProfile({ 
              location: {
                city: 'New York',
                state: 'NY',
                coordinates: {
                  latitude: 40.7128,
                  longitude: -74.0060
                }
              }
            }));
            
            // Success animation
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 0.9,
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
          },
        },
        { text: 'Not Now', style: 'cancel' },
      ]
    );
  };

  const handleContinue = () => {
    router.replace('/discover');
  };

  const handleSkip = () => {
    router.replace('/discover');
  };

  const handleBack = () => {
    router.back();
  };
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const benefits = [
    {
      icon: 'location',
      title: 'Find matches nearby',
      description: 'Discover people in your area',
      color: AppColors.primary,
    },
    {
      icon: 'navigate',
      title: 'See distance to matches',
      description: 'Know how far potential matches are',
      color: AppColors.accent,
    },
    {
      icon: 'shield-checkmark',
      title: 'Privacy protected',
      description: 'Your exact location stays private',
      color: AppColors.success,
    },
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Animated Background */}
      <LinearGradient
        colors={[AppColors.primary, AppColors.primaryLight, AppColors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
        <Animated.View
          style={[
            styles.floatingElement,
            styles.element3,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.08],
              }),
              transform: [{ rotate: spin }],
            },
          ]}
        />
      </LinearGradient>
      
      <SafeAreaView style={styles.safeArea}>
        {/* Enhanced Header */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
              style={styles.backButtonGradient}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Enhanced Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { 
                    width: '95%',
                    opacity: fadeAnim,
                  }
                ]} 
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressGradient}
                />
              </Animated.View>
            </View>
          </View>
        </Animated.View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Enhanced Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Enable Location</Text>
              <Text style={styles.subtitle}>
                We'll show you people nearby and help you find matches in your area
              </Text>
            </View>

            {/* Enhanced Location Icon */}
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [
                    { scale: locationIconScale },
                    { scale: pulseAnim },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                style={styles.locationIcon}
              >
                <View style={styles.iconInner}>
                  <LinearGradient
                    colors={[AppColors.accent, AppColors.primary]}
                    style={styles.iconGradient}
                  >
                    <Ionicons name="location" size={48} color="white" />
                  </LinearGradient>
                </View>
                
                {/* Ripple Effect */}
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
              </LinearGradient>
            </Animated.View>

            {/* Enhanced Current Location */}
            {locationEnabled && (
              <Animated.View
                style={[
                  styles.currentLocationContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                  style={styles.currentLocationGradient}
                >
                  <View style={styles.locationSuccessIcon}>
                    <Ionicons name="checkmark-circle" size={24} color={AppColors.success} />
                  </View>
                  <View style={styles.locationTextContainer}>
                    <Text style={styles.currentLocationLabel}>Current Location:</Text>
                    <Text style={styles.currentLocationText}>{currentLocation}</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            )}

            {/* Enhanced Benefits */}
            <View style={styles.benefits}>
              {benefits.map((benefit, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.benefitItem,
                    {
                      opacity: benefitAnims[index],
                      transform: [
                        {
                          translateX: benefitAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [-50, 0],
                          }),
                        },
                        { scale: benefitAnims[index] },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                    style={styles.benefitGradient}
                  >
                    <View style={[styles.benefitIconContainer, { backgroundColor: benefit.color }]}>
                      <Ionicons name={benefit.icon as any} size={24} color="white" />
                    </View>
                    <View style={styles.benefitTextContainer}>
                      <Text style={styles.benefitTitle}>{benefit.title}</Text>
                      <Text style={styles.benefitDescription}>{benefit.description}</Text>
                    </View>
                  </LinearGradient>
                </Animated.View>
              ))}
            </View>

            {/* Enhanced Privacy Note */}
            <Animated.View
              style={[
                styles.privacyNote,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.privacyGradient}
              >
                <View style={styles.privacyIconContainer}>
                  <Ionicons name="shield-checkmark" size={20} color="rgba(255,255,255,0.8)" />
                </View>
                <Text style={styles.privacyText}>
                  We only use your location to show distance and will never share your exact location with other users.
                </Text>
              </LinearGradient>
            </Animated.View>
          </Animated.View>
        </ScrollView>

        {/* Enhanced Bottom Actions */}
        <Animated.View
          style={[
            styles.bottomActions,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'transparent']}
            style={styles.bottomGradient}
          >
            {!locationEnabled ? (
              <>
                <TouchableOpacity
                  style={styles.enableButton}
                  onPress={handleEnableLocation}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                    style={styles.enableButtonGradient}
                  >
                    <Ionicons name="location" size={24} color={AppColors.primary} style={styles.buttonIcon} />
                    <Text style={styles.enableButtonText}>Enable Location</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                  <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleContinue}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                    style={styles.continueButtonGradient}
                  >
                    <Text style={styles.continueButtonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={24} color={AppColors.primary} style={styles.buttonIcon} />
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                  <Text style={styles.skipText}>Change location later</Text>
                </TouchableOpacity>
              </>
            )}
          </LinearGradient>
        </Animated.View>
      </SafeAreaView>
     </KeyboardAvoidingView>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
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
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  element1: {
    width: 150,
    height: 150,
    top: '10%',
    right: '-15%',
  },
  element2: {
    width: 100,
    height: 100,
    top: '40%',
    left: '-10%',
  },
  element3: {
    width: 80,
    height: 80,
    bottom: '20%',
    right: '10%',
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    zIndex: 10,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  backButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressGradient: {
    flex: 1,
    borderRadius: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: isTablet ? Spacing.xxxl : Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xxxl : Spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? Spacing.xl : Spacing.xxxl,
  },
  title: {
    fontSize: isSmallScreen ? Typography.xxl : Typography.xxxl,
    fontWeight: Typography.bold,
    color: 'white',
    marginBottom: Spacing.sm,
    textAlign: 'center',
    lineHeight: Typography.lineHeightTight * (isSmallScreen ? Typography.xxl : Typography.xxxl),
  },
  subtitle: {
    fontSize: Typography.lg,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: Typography.lineHeightNormal * Typography.lg,
    paddingHorizontal: Spacing.sm,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? Spacing.xl : Spacing.xxxl,
    position: 'relative',
  },
  locationIcon: {
    width: isSmallScreen ? 120 : 140,
    height: isSmallScreen ? 120 : 140,
    borderRadius: isSmallScreen ? 60 : 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconInner: {
    width: isSmallScreen ? 80 : 100,
    height: isSmallScreen ? 80 : 100,
    borderRadius: isSmallScreen ? 40 : 50,
    overflow: 'hidden',
  },
  iconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rippleEffect: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.2)',
    top: -20,
    left: -20,
  },
  currentLocationContainer: {
    marginBottom: Spacing.xl,
    borderRadius: Sizes.radiusXL,
    overflow: 'hidden',
  },
  currentLocationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  locationSuccessIcon: {
    marginRight: Spacing.md,
  },
  locationTextContainer: {
    flex: 1,
  },
  currentLocationLabel: {
    fontSize: Typography.sm,
    color: AppColors.gray[600],
    marginBottom: Spacing.xs,
  },
  currentLocationText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: AppColors.success,
  },
  benefits: {
    marginBottom: Spacing.xl,
  },
  benefitItem: {
    marginBottom: Spacing.lg,
    borderRadius: Sizes.radiusXL,
    overflow: 'hidden',
  },
  benefitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.semiBold,
    color: 'white',
    marginBottom: Spacing.xs,
  },
  benefitDescription: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: Typography.lineHeightNormal * Typography.sm,
  },
  privacyNote: {
    borderRadius: Sizes.radiusXL,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  privacyGradient: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
  },
  privacyIconContainer: {
    marginRight: Spacing.md,
    marginTop: 2,
  },
  privacyText: {
    flex: 1,
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: Typography.lineHeightNormal * Typography.sm,
  },
  bottomActions: {
    paddingHorizontal: isTablet ? Spacing.xxxl : Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xxxl : Spacing.xl,
    paddingTop: Spacing.lg,
    backgroundColor: 'transparent',
  },
  bottomGradient: {
    paddingTop: Spacing.lg,
  },
  enableButton: {
    marginBottom: Spacing.md,
    borderRadius: Sizes.radiusXL,
    overflow: 'hidden',
  },
  enableButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: isSmallScreen ? Spacing.md : Spacing.lg,
    paddingHorizontal: Spacing.xl,
    minHeight: 56,
  },
  enableButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: AppColors.primary,
  },
  continueButton: {
    marginBottom: Spacing.md,
    borderRadius: Sizes.radiusXL,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: isSmallScreen ? Spacing.md : Spacing.lg,
    paddingHorizontal: Spacing.xl,
    minHeight: 56,
  },
  continueButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: AppColors.primary,
  },
  buttonIcon: {
    marginHorizontal: Spacing.sm,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  skipText: {
    fontSize: Typography.md,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontWeight: Typography.medium,
  },
});