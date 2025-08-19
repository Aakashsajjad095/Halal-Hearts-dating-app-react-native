import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { AppColors } from '@/constants/Colors';
import { Spacing, Sizes, Typography } from '@/constants/Spacing';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSendReset = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
    }, 1500);
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    handleSendReset();
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.iconText}>✓</Text>
            </View>
          </View>

          {/* Success Message */}
          <View style={styles.header}>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              We've sent a password reset link to{' '}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              • Check your inbox and spam folder
            </Text>
            <Text style={styles.instructionText}>
              • Click the reset link in the email
            </Text>
            <Text style={styles.instructionText}>
              • Create a new password
            </Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <Button
            title="Resend Email"
            onPress={handleResendEmail}
            variant="outline"
            size="large"
            style={styles.resendButton}
          />
          
          <Button
            title="Back to Login"
            onPress={handleBackToLogin}
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={error}
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Send Reset Link"
              onPress={handleSendReset}
              loading={loading}
              size="large"
              style={styles.sendButton}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleBackToLogin}>
            <Text style={styles.backText}>
              ← Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  successIcon: {
    width: Sizes.avatarXL,
    height: Sizes.avatarXL,
    borderRadius: Sizes.radiusRound,
    backgroundColor: AppColors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: Typography.xxl,
    color: AppColors.white,
    fontWeight: Typography.bold,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  title: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: AppColors.gray[900],
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.lg,
    color: AppColors.gray[600],
    textAlign: 'center',
    lineHeight: Typography.lineHeightNormal,
  },
  emailText: {
    fontWeight: Typography.semiBold,
    color: AppColors.primary,
  },
  instructions: {
    marginBottom: Spacing.xl,
  },
  instructionText: {
    fontSize: Typography.md,
    color: AppColors.gray[700],
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeightNormal,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  actions: {
    marginBottom: Spacing.xl,
  },
  sendButton: {
    marginBottom: Spacing.lg,
  },
  bottomActions: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  resendButton: {
    marginBottom: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  backText: {
    fontSize: Typography.md,
    color: AppColors.primary,
    fontWeight: Typography.medium,
  },
});