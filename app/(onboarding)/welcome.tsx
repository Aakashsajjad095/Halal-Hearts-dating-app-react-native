import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { AppColors } from '@/constants/Colors';
import { Spacing, Sizes, Typography } from '@/constants/Spacing';
import { Button } from '@/components/ui/Button';

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    router.push('/(onboarding)/name');
  };

  const handleSignIn = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>💕</Text>
          </View>
          <Text style={styles.appName}>Halal Hearts</Text>
        </View>

        {/* Hero Content */}
        <View style={styles.heroContainer}>
          <Text style={styles.title}>Find Your Perfect Match</Text>
          <Text style={styles.subtitle}>
            Connect with people who share your interests and values. 
            Start your journey to meaningful relationships today.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>Smart Matching</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>💬</Text>
            <Text style={styles.featureText}>Safe Messaging</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>Privacy First</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            size="large"
            style={styles.primaryButton}
          />
          
          <Button
            title="I already have an account"
            onPress={handleSignIn}
            variant="ghost"
            size="medium"
            style={styles.secondaryButton}
          />
        </View>

        {/* Terms */}
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    width: Sizes.avatarLG,
    height: Sizes.avatarLG,
    borderRadius: Sizes.avatarLG / 2,
    backgroundColor: AppColors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: Typography.xxxl,
  },
  appName: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: AppColors.primary,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: AppColors.gray[900],
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeightTight * Typography.xxxl,
  },
  subtitle: {
    fontSize: Typography.lg,
    color: AppColors.gray[600],
    textAlign: 'center',
    lineHeight: Typography.lineHeightRelaxed * Typography.lg,
    paddingHorizontal: Spacing.md,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: Typography.xxl,
    marginBottom: Spacing.sm,
  },
  featureText: {
    fontSize: Typography.sm,
    color: AppColors.gray[700],
    textAlign: 'center',
    fontWeight: Typography.medium,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
  termsText: {
    fontSize: Typography.xs,
    color: AppColors.gray[500],
    textAlign: 'center',
    lineHeight: Typography.lineHeightNormal * Typography.xs,
    marginTop: Spacing.lg,
  },
  linkText: {
    color: AppColors.primary,
    fontWeight: Typography.medium,
  },
});