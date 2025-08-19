import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AppColors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';

export default function NameScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});

  const validateForm = () => {
    const newErrors: { firstName?: string; lastName?: string } = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Save name data to store/context
      router.push('/(onboarding)/dob');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '14%' }]} />
            </View>
            <Text style={styles.progressText}>1 of 7</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>What's your name?</Text>
            <Text style={styles.subtitle}>
              This will be displayed on your profile
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Input
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                autoCapitalize="words"
                error={errors.firstName}
                autoFocus
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Input
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                autoCapitalize="words"
                error={errors.lastName}
              />
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <Button
              title="Back"
              onPress={handleBack}
              variant="outline"
              style={styles.backButton}
            />
            <Button
              title="Continue"
              onPress={handleContinue}
              disabled={!firstName.trim() || !lastName.trim()}
              style={styles.continueButton}
            />
          </View>
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
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: AppColors.gray[200],
    borderRadius: 2,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    color: AppColors.gray[600],
    fontWeight: Typography.fontWeight.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  titleContainer: {
    marginBottom: Spacing.xxxl,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: AppColors.gray[900],
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: AppColors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    gap: Spacing.lg,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  backButton: {
    flex: 1,
  },
  continueButton: {
    flex: 2,
  },
});