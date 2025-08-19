import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { AppColors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';

const PersonalityScreen = () => {
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const personalityTraits = [
    { id: 'adventurous', label: 'Adventurous', emoji: '🏔️' },
    { id: 'creative', label: 'Creative', emoji: '🎨' },
    { id: 'funny', label: 'Funny', emoji: '😄' },
    { id: 'intellectual', label: 'Intellectual', emoji: '🧠' },
    { id: 'kind', label: 'Kind', emoji: '💝' },
    { id: 'ambitious', label: 'Ambitious', emoji: '🎯' },
    { id: 'romantic', label: 'Romantic', emoji: '💕' },
    { id: 'spiritual', label: 'Spiritual', emoji: '🕌' },
    { id: 'athletic', label: 'Athletic', emoji: '💪' },
    { id: 'social', label: 'Social', emoji: '👥' },
    { id: 'calm', label: 'Calm', emoji: '🧘' },
    { id: 'loyal', label: 'Loyal', emoji: '🤝' },
  ];

  const handleTraitToggle = (traitId: string) => {
    setSelectedTraits(prev => {
      if (prev.includes(traitId)) {
        return prev.filter(id => id !== traitId);
      } else if (prev.length < 5) {
        return [...prev, traitId];
      }
      return prev;
    });
  };

  const handleContinue = () => {
    if (selectedTraits.length >= 3) {
      router.push('/interests');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What describes your personality?</Text>
          <Text style={styles.subtitle}>
            Choose 3-5 traits that best represent you
          </Text>
          <Text style={styles.counter}>
            {selectedTraits.length}/5 selected
          </Text>
        </View>

        {/* Traits Grid */}
        <ScrollView style={styles.traitsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.traitsGrid}>
            {personalityTraits.map((trait) => {
              const isSelected = selectedTraits.includes(trait.id);
              return (
                <TouchableOpacity
                  key={trait.id}
                  style={[
                    styles.traitCard,
                    isSelected && styles.traitCardSelected,
                    selectedTraits.length >= 5 && !isSelected && styles.traitCardDisabled
                  ]}
                  onPress={() => handleTraitToggle(trait.id)}
                  disabled={selectedTraits.length >= 5 && !isSelected}
                >
                  <Text style={styles.traitEmoji}>{trait.emoji}</Text>
                  <Text style={[
                    styles.traitLabel,
                    isSelected && styles.traitLabelSelected
                  ]}>
                    {trait.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
          disabled={selectedTraits.length < 3}
          style={selectedTraits.length < 3 ? [styles.continueButton, styles.continueButtonDisabled] : styles.continueButton}
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
  header: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    alignItems: 'center',
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
    marginBottom: Spacing.sm,
  },
  counter: {
    fontSize: Typography.fontSize.sm,
    color: AppColors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  traitsContainer: {
    flex: 1,
  },
  traitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  traitCard: {
    width: '47%',
    backgroundColor: AppColors.white,
    borderWidth: 2,
    borderColor: AppColors.gray[200],
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    minHeight: 100,
    justifyContent: 'center',
  },
  traitCardSelected: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primary + '08',
  },
  traitCardDisabled: {
    opacity: 0.5,
  },
  traitEmoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  traitLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: AppColors.gray[700],
    textAlign: 'center',
  },
  traitLabelSelected: {
    color: AppColors.primary,
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

export default PersonalityScreen;