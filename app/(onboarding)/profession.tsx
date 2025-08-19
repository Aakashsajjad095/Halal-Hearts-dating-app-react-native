import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { AppColors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';

const professionOptions = [
  'Software Engineer',
  'Doctor',
  'Teacher',
  'Lawyer',
  'Nurse',
  'Business Analyst',
  'Marketing Manager',
  'Designer',
  'Accountant',
  'Engineer',
  'Consultant',
  'Sales Representative',
  'Project Manager',
  'Data Scientist',
  'Pharmacist',
  'Architect',
  'Chef',
  'Photographer',
  'Writer',
  'Artist',
  'Student',
  'Entrepreneur',
  'Other',
];

export default function ProfessionScreen() {
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [customProfession, setCustomProfession] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProfessions = professionOptions.filter(profession =>
    profession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfessionSelect = (profession: string) => {
    setSelectedProfession(profession);
    if (profession !== 'Other') {
      setCustomProfession('');
    }
  };

  const handleContinue = () => {
    const finalProfession = selectedProfession === 'Other' ? customProfession : selectedProfession;
    if (finalProfession.trim()) {
      // Save profession to store/context
      router.push('/(onboarding)/marital-status');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const isValidSelection = () => {
    if (selectedProfession === 'Other') {
      return customProfession.trim().length > 0;
    }
    return selectedProfession.length > 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '70%' }]} />
          </View>
          <Text style={styles.progressText}>5 of 7</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What do you do?</Text>
          <Text style={styles.subtitle}>
            Select your profession or occupation
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search professions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={AppColors.gray[500]}
          />
        </View>

        {/* Profession List */}
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.optionsContainer}>
            {filteredProfessions.map((profession) => (
              <TouchableOpacity
                key={profession}
                style={[
                  styles.optionButton,
                  selectedProfession === profession && styles.optionButtonSelected,
                ]}
                onPress={() => handleProfessionSelect(profession)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.optionText,
                  selectedProfession === profession && styles.optionTextSelected,
                ]}>
                  {profession}
                </Text>
                
                {selectedProfession === profession && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Custom Profession Input */}
        {selectedProfession === 'Other' && (
          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.customInput}
              placeholder="Enter your profession"
              value={customProfession}
              onChangeText={setCustomProfession}
              placeholderTextColor={AppColors.gray[500]}
              autoFocus
            />
          </View>
        )}
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
            disabled={!isValidSelection()}
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
    paddingTop: Spacing.lg,
  },
  titleContainer: {
    marginBottom: Spacing.xl,
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
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  searchInput: {
    backgroundColor: AppColors.gray[50],
    borderWidth: 1,
    borderColor: AppColors.gray[200],
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.md,
    color: AppColors.gray[900],
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
  optionsContainer: {
    gap: Spacing.sm,
  },
  optionButton: {
    backgroundColor: AppColors.gray[50],
    borderWidth: 1,
    borderColor: AppColors.gray[200],
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionButtonSelected: {
    backgroundColor: AppColors.primary + '10',
    borderColor: AppColors.primary,
  },
  optionText: {
    fontSize: Typography.fontSize.md,
    color: AppColors.gray[700],
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  optionTextSelected: {
    color: AppColors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: AppColors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  customInputContainer: {
    marginTop: Spacing.lg,
    backgroundColor: AppColors.gray[50],
    borderRadius: 12,
    padding: Spacing.md,
  },
  customInput: {
    fontSize: Typography.fontSize.md,
    color: AppColors.gray[900],
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: AppColors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.gray[200],
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.lg,
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray[100],
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