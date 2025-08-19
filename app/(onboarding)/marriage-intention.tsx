import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { AppColors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';

const MarriageIntentionScreen = () => {
  const [selectedIntention, setSelectedIntention] = useState<string>('');

  const intentions = [
    { id: 'immediately', label: 'Immediately', description: 'Ready to get married right away' },
    { id: 'within-year', label: 'Within a year', description: 'Planning to marry within 12 months' },
    { id: 'few-years', label: 'In a few years', description: 'Looking for long-term relationship first' },
    { id: 'not-sure', label: 'Not sure yet', description: 'Open to see where things go' },
  ];

  const handleContinue = () => {
    if (selectedIntention) {
      router.push('/personality');
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
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>10 of 10</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>When do you want to get married?</Text>
          <Text style={styles.subtitle}>This helps us understand your timeline and intentions</Text>
        </View>

        {/* Options */}
        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
          {intentions.map((intention) => (
            <TouchableOpacity
              key={intention.id}
              style={[
                styles.optionCard,
                selectedIntention === intention.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedIntention(intention.id)}
            >
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionLabel,
                  selectedIntention === intention.id && styles.optionLabelSelected
                ]}>
                  {intention.label}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  selectedIntention === intention.id && styles.optionDescriptionSelected
                ]}>
                  {intention.description}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedIntention === intention.id && styles.radioButtonSelected
              ]}>
                {selectedIntention === intention.id && <View style={styles.radioButtonInner} />}
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
          disabled={!selectedIntention}
          style={!selectedIntention ? [styles.continueButton, styles.continueButtonDisabled] : styles.continueButton}
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

export default MarriageIntentionScreen;