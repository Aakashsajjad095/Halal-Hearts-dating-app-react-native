import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { AppColors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';

type Gender = 'male' | 'female' | 'other';

interface GenderOption {
  id: Gender;
  label: string;
  icon: string;
}

const genderOptions: GenderOption[] = [
  { id: 'male', label: 'Man', icon: '👨' },
  { id: 'female', label: 'Woman', icon: '👩' },
  { id: 'other', label: 'Other', icon: '🧑' },
];

export default function GenderScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  const handleGenderSelect = (gender: Gender) => {
    setSelectedGender(gender);
  };

  const handleContinue = () => {
    if (selectedGender) {
      // Save gender to store/context
      router.push('/(onboarding)/height');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '42%' }]} />
          </View>
          <Text style={styles.progressText}>3 of 7</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>I am a</Text>
          <Text style={styles.subtitle}>
            Select your gender identity
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedGender === option.id && styles.optionButtonSelected,
              ]}
              onPress={() => handleGenderSelect(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <Text style={[
                  styles.optionText,
                  selectedGender === option.id && styles.optionTextSelected,
                ]}>
                  {option.label}
                </Text>
              </View>
              
              {selectedGender === option.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            This information will be displayed on your profile and used for matching preferences.
          </Text>
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
            disabled={!selectedGender}
            style={styles.continueButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
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
  optionsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  optionButton: {
    backgroundColor: AppColors.gray[50],
    borderWidth: 2,
    borderColor: AppColors.gray[200],
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionButtonSelected: {
    backgroundColor: AppColors.primary + '10',
    borderColor: AppColors.primary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: Spacing.lg,
  },
  optionText: {
    fontSize: Typography.fontSize.lg,
    color: AppColors.gray[700],
    fontWeight: Typography.fontWeight.medium,
  },
  optionTextSelected: {
    color: AppColors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: AppColors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  noteContainer: {
    backgroundColor: AppColors.gray[50],
    borderRadius: 12,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
  },
  noteText: {
    fontSize: Typography.fontSize.sm,
    color: AppColors.gray[600],
    textAlign: 'center',
    lineHeight: 20,
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