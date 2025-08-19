import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { AppColors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { isAuthenticated } = useAppSelector((state: any) => state.auth);
  const { isComplete } = useAppSelector((state: any) => state.profile);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace('/(auth)/login');
      } else if (!isComplete) {
        router.replace('/(onboarding)/welcome');
      } else {
        router.replace('/(tabs)/discover');
      }
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [isAuthenticated, isComplete]);

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.gradientBackground} />
      
      {/* Main logo/icon */}
      <View style={styles.logoContainer}>
        <View style={styles.heartIcon}>
          <Text style={styles.heartText}>💕</Text>
        </View>
        <Text style={styles.appName}>Halal Hearts</Text>
        <Text style={styles.tagline}>Find Your Perfect Match</Text>
      </View>
      
      {/* Bottom loading indicator */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.primary,
    opacity: 0.9,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.2,
  },
  heartIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  heartText: {
    fontSize: 60,
  },
  appName: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: AppColors.white,
    marginBottom: 8,
  },
  tagline: {
    fontSize: Typography.fontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.white,
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});