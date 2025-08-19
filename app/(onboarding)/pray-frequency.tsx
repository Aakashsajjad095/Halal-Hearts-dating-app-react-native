import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { AppColors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';

const PrayFrequencyScreen = () => {
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');

  const prayFrequencies = [
    { id: 'five-times', label: '5 times a day', description: 'I pray all five daily prayers' },
    { id: 'sometimes', label: 'Sometimes', description: 'I pray when I can' },
    { id: 'fridays', label: 'Only on Fridays', description: 'I attend Jummah prayers' },
    { id: 'special-occasions', label: 'Special occasions', description: 'During Ramadan and Eid' },
    { id: 'never', label: 'Never', description: 'I don\'t pray regularly' },
  ];

  const handleContinue = () => {
    if (selectedFrequency) {
      router.push('/sect');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '80%' }]} />
          </View>
          <Text style={styles.progressText}>8 of 10</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>How often do you pray?</Text>
          <Text style={styles.subtitle}>This helps us understand your spiritual practices</Text>
        </View>

        {/* Options */}
        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
          {prayFrequencies.map((frequency) => (
            <TouchableOpacity
              key={frequency.id}
              style={[
                styles.optionCard,
                selectedFrequency === frequency.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedFrequency(frequency.id)}
            >
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionLabel,
                  selectedFrequency === frequency.id && styles.optionLabelSelected
                ]}>
                  {frequency.label}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  selectedFrequency === frequency.id && styles.optionDescriptionSelected
                ]}>
                  {frequency.description}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedFrequency === frequency.id && styles.radioButtonSelected
              ]}>
                {selectedFrequency === frequency.id && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedFrequency}
          style={!selectedFrequency ? [styles.continueButton, styles.continueButtonDisabled] : styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  progressContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  progressBar: {
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
    textAlign: 'center',
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: AppColors.gray[900],
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: AppColors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.white,
    borderWidth: 2,
    borderColor: AppColors.gray[200],
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  optionCardSelected: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primary + '08',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: AppColors.gray[900],
    marginBottom: Spacing.xs,
  },
  optionLabelSelected: {
    color: AppColors.primary,
  },
  optionDescription: {
    fontSize: Typography.fontSize.sm,
    color: AppColors.gray[600],
  },
  optionDescriptionSelected: {
    color: AppColors.primary + 'CC',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: AppColors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  radioButtonSelected: {
    borderColor: AppColors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AppColors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: AppColors.white,
  },
  backButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  backButtonText: {
    fontSize: Typography.fontSize.md,
    color: AppColors.gray[600],
    fontWeight: Typography.fontWeight.medium,
  },
  continueButton: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
});

export default PrayFrequencyScreen;