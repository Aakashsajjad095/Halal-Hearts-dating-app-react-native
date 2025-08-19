import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { AppColors } from '@/constants/Colors';
import { Spacing, Sizes, Typography } from '@/constants/Spacing';
import { Button } from '@/components/ui/Button';
import { useAppDispatch } from '@/store/hooks';
import { updateProfile } from '@/store/slices/profileSlice';

interface PreferenceOption {
  id: string;
  label: string;
  value: any;
}

const AGE_RANGES: PreferenceOption[] = [
  { id: '18-25', label: '18-25', value: { min: 18, max: 25 } },
  { id: '26-35', label: '26-35', value: { min: 26, max: 35 } },
  { id: '36-45', label: '36-45', value: { min: 36, max: 45 } },
  { id: '46-55', label: '46-55', value: { min: 46, max: 55 } },
  { id: '56+', label: '56+', value: { min: 56, max: 99 } },
];

const DISTANCE_OPTIONS: PreferenceOption[] = [
  { id: '5', label: '5 miles', value: 5 },
  { id: '10', label: '10 miles', value: 10 },
  { id: '25', label: '25 miles', value: 25 },
  { id: '50', label: '50 miles', value: 50 },
  { id: '100', label: '100+ miles', value: 100 },
];

const GENDER_OPTIONS: PreferenceOption[] = [
  { id: 'men', label: 'Men', value: 'men' },
  { id: 'women', label: 'Women', value: 'women' },
  { id: 'everyone', label: 'Everyone', value: 'everyone' },
];

export default function PreferencesScreen() {
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>('26-35');
  const [selectedDistance, setSelectedDistance] = useState<string>('25');
  const [selectedGender, setSelectedGender] = useState<string>('everyone');
  
  const dispatch = useAppDispatch();

  const handleContinue = () => {
    const ageRange = AGE_RANGES.find(range => range.id === selectedAgeRange)?.value;
    const distance = DISTANCE_OPTIONS.find(dist => dist.id === selectedDistance)?.value;
    const gender = GENDER_OPTIONS.find(g => g.id === selectedGender)?.value;
    
    dispatch(updateProfile({
      preferences: {
        ageRange,
        maxDistance: distance,
        genderPreference: gender,
      }
    }));
    
    router.replace('/(tabs)/explore');
  };

  const renderOptionGroup = (
    title: string,
    options: PreferenceOption[],
    selectedValue: string,
    onSelect: (value: string) => void
  ) => {
    return (
      <View style={styles.optionGroup}>
        <Text style={styles.optionGroupTitle}>{title}</Text>
        <View style={styles.optionsContainer}>
          {options.map((option) => {
            const isSelected = selectedValue === option.id;
            
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => onSelect(option.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Set your preferences</Text>
          <Text style={styles.subtitle}>
            Help us find the right people for you
          </Text>
        </View>

        {/* Preferences */}
        <View style={styles.preferencesContainer}>
          {renderOptionGroup(
            'I\'m interested in',
            GENDER_OPTIONS,
            selectedGender,
            setSelectedGender
          )}
          
          {renderOptionGroup(
            'Age range',
            AGE_RANGES,
            selectedAgeRange,
            setSelectedAgeRange
          )}
          
          {renderOptionGroup(
            'Maximum distance',
            DISTANCE_OPTIONS,
            selectedDistance,
            setSelectedDistance
          )}
        </View>

        {/* Note */}
        <View style={styles.note}>
          <Text style={styles.noteText}>
            You can always change these preferences later in your settings.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          title="Start Matching"
          onPress={handleContinue}
          size="large"
          style={styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
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
  preferencesContainer: {
    marginBottom: Spacing.xl,
  },
  optionGroup: {
    marginBottom: Spacing.xxxl,
  },
  optionGroupTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: AppColors.gray[900],
    marginBottom: Spacing.lg,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Sizes.radiusLG,
    borderWidth: 2,
    borderColor: AppColors.gray[300],
    backgroundColor: AppColors.white,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  optionButtonSelected: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primary,
  },
  optionText: {
    fontSize: Typography.md,
    color: AppColors.gray[700],
    fontWeight: Typography.medium,
  },
  optionTextSelected: {
    color: AppColors.white,
  },
  note: {
    backgroundColor: AppColors.gray[50],
    padding: Spacing.lg,
    borderRadius: Sizes.radiusLG,
    marginBottom: Spacing.xl,
  },
  noteText: {
    fontSize: Typography.sm,
    color: AppColors.gray[600],
    textAlign: 'center',
    lineHeight: Typography.lineHeightNormal,
  },
  bottomActions: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.lg,
    backgroundColor: AppColors.white,
  },
  continueButton: {
    marginBottom: Spacing.md,
  },
});