import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { AppColors } from '@/constants/Colors';
import { Spacing, Sizes, Typography } from '@/constants/Spacing';
import { Button } from '@/components/ui/Button';
import { useAppDispatch } from '@/store/hooks';
import { updateProfile } from '@/store/slices/profileSlice';
import { Ionicons } from '@expo/vector-icons';

const INTERESTS = [
  'Travel', 'Photography', 'Music', 'Movies', 'Reading', 'Cooking',
  'Fitness', 'Yoga', 'Dancing', 'Art', 'Gaming', 'Sports',
  'Nature', 'Technology', 'Fashion', 'Food', 'Wine', 'Coffee',
  'Hiking', 'Swimming', 'Running', 'Cycling', 'Meditation', 'Writing',
  'Painting', 'Singing', 'Guitar', 'Piano', 'Theater', 'Comedy',
  'Volunteering', 'Animals', 'Dogs', 'Cats', 'Beach', 'Mountains',
  'City Life', 'Nightlife', 'Museums', 'Concerts', 'Festivals', 'Camping',
  'Skiing', 'Surfing', 'Rock Climbing', 'Martial Arts', 'Boxing', 'Tennis',
];

export default function InterestsScreen() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(item => item !== interest);
      } else if (prev.length < 10) {
        return [...prev, interest];
      }
      return prev;
    });
  };

  const handleContinue = () => {
    if (selectedInterests.length >= 3) {
      dispatch(updateProfile({ interests: selectedInterests }));
      router.push('/(onboarding)/photos');
    }
  };

  const handleSkip = () => {
    router.push('/(onboarding)/photos');
  };

  const renderInterest = ({ item }: { item: string }) => {
    const isSelected = selectedInterests.includes(item);
    
    return (
      <TouchableOpacity
        style={[
          styles.interestChip,
          isSelected && styles.interestChipSelected,
        ]}
        onPress={() => toggleInterest(item)}
      >
        <Text
          style={[
            styles.interestText,
            isSelected && styles.interestTextSelected,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and progress */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={AppColors.gray[900]} />
        </TouchableOpacity>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '85%' }]} />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What are you into?</Text>
          <Text style={styles.subtitle}>
            Select at least 3 interests to help us find your perfect match
          </Text>
          <Text style={styles.counter}>
            {selectedInterests.length}/10 selected
          </Text>
        </View>

        {/* Interests Grid */}
        <View style={styles.interestsContainer}>
          <FlatList
            data={INTERESTS}
            renderItem={renderInterest}
            keyExtractor={(item) => item}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={selectedInterests.length < 3}
          size="large"
          style={styles.continueButton}
        />
        
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: AppColors.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
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
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeightNormal,
  },
  counter: {
    fontSize: Typography.md,
    color: AppColors.primary,
    fontWeight: Typography.semiBold,
  },
  interestsContainer: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  interestChip: {
    flex: 0.48,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Sizes.radiusXL,
    borderWidth: 2,
    borderColor: AppColors.gray[300],
    backgroundColor: AppColors.white,
    alignItems: 'center',
  },
  interestChipSelected: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primary,
  },
  interestText: {
    fontSize: Typography.md,
    color: AppColors.gray[700],
    fontWeight: Typography.medium,
  },
  interestTextSelected: {
    color: AppColors.white,
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
  skipText: {
    fontSize: Typography.md,
    color: AppColors.gray[600],
    textAlign: 'center',
    fontWeight: Typography.medium,
  },
});