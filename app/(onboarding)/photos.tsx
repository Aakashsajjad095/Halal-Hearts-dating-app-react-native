import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { AppColors } from '@/constants/Colors';
import { Spacing, Sizes, Typography } from '@/constants/Spacing';
import { Button } from '@/components/ui/Button';
import { useAppDispatch } from '@/store/hooks';
import { updateProfile } from '@/store/slices/profileSlice';
import { Ionicons } from '@expo/vector-icons';

interface PhotoSlot {
  id: number;
  uri?: string;
  isMain?: boolean;
}

export default function PhotosScreen() {
  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { id: 1, isMain: true },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ]);
  
  const dispatch = useAppDispatch();

  const handleAddPhoto = (slotId: number) => {
    // In a real app, this would open image picker
    Alert.alert(
      'Add Photo',
      'Choose photo source',
      [
        { text: 'Camera', onPress: () => mockAddPhoto(slotId) },
        { text: 'Gallery', onPress: () => mockAddPhoto(slotId) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const mockAddPhoto = (slotId: number) => {
    // Mock photo URLs for demonstration
    const mockPhotos = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    ];
    
    const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === slotId 
          ? { ...photo, uri: randomPhoto }
          : photo
      )
    );
  };

  const handleRemovePhoto = (slotId: number) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === slotId 
          ? { ...photo, uri: undefined }
          : photo
      )
    );
  };

  const handleContinue = () => {
    const photoUris = photos
      .filter(photo => photo.uri)
      .map(photo => photo.uri!);
    
    if (photoUris.length >= 2) {
      dispatch(updateProfile({ photos: photoUris }));
      router.push('/(onboarding)/location');
    }
  };

  const handleSkip = () => {
    router.push('/(onboarding)/location');
  };

  const handleBack = () => {
    router.back();
  };

  const renderPhotoSlot = (photo: PhotoSlot) => {
    const hasPhoto = !!photo.uri;
    
    return (
      <TouchableOpacity
        key={photo.id}
        style={[
          styles.photoSlot,
          photo.isMain && styles.mainPhotoSlot,
          hasPhoto && styles.photoSlotFilled,
        ]}
        onPress={() => hasPhoto ? handleRemovePhoto(photo.id) : handleAddPhoto(photo.id)}
      >
        {hasPhoto ? (
          <>
            <Image source={{ uri: photo.uri }} style={styles.photo} />
            <View style={styles.photoOverlay}>
              <Text style={styles.removeText}>✕</Text>
            </View>
            {photo.isMain && (
              <View style={styles.mainBadge}>
                <Text style={styles.mainBadgeText}>MAIN</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.addPhotoContent}>
            <Text style={styles.addPhotoIcon}>+</Text>
            <Text style={styles.addPhotoText}>
              {photo.isMain ? 'Add main photo' : 'Add photo'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const photosCount = photos.filter(photo => photo.uri).length;

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
            <View style={[styles.progressFill, { width: '90%' }]} />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add your photos</Text>
          <Text style={styles.subtitle}>
            Upload at least 2 photos to show your personality
          </Text>
          <Text style={styles.counter}>
            {photosCount}/6 photos added
          </Text>
        </View>

        {/* Photos Grid */}
        <View style={styles.photosGrid}>
          {photos.map(renderPhotoSlot)}
        </View>

        {/* Tips */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Photo Tips:</Text>
          <Text style={styles.tipText}>• Use recent photos that show your face clearly</Text>
          <Text style={styles.tipText}>• Smile and make eye contact with the camera</Text>
          <Text style={styles.tipText}>• Include photos that show your interests</Text>
          <Text style={styles.tipText}>• Avoid group photos as your main picture</Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={photosCount < 2}
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
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  photoSlot: {
    width: '48%',
    aspectRatio: 0.75,
    borderRadius: Sizes.radiusLG,
    borderWidth: 2,
    borderColor: AppColors.gray[300],
    borderStyle: 'dashed',
    marginBottom: Spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  mainPhotoSlot: {
    width: '100%',
    aspectRatio: 0.8,
  },
  photoSlotFilled: {
    borderStyle: 'solid',
    borderColor: AppColors.primary,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: Sizes.iconLG,
    height: Sizes.iconLG,
    borderRadius: Sizes.radiusRound,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: AppColors.white,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
  mainBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: AppColors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Sizes.radiusSM,
  },
  mainBadgeText: {
    color: AppColors.white,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
  addPhotoContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  addPhotoIcon: {
    fontSize: Typography.xxxl,
    color: AppColors.gray[400],
    marginBottom: Spacing.sm,
  },
  addPhotoText: {
    fontSize: Typography.sm,
    color: AppColors.gray[600],
    textAlign: 'center',
    fontWeight: Typography.medium,
  },
  tips: {
    backgroundColor: AppColors.gray[50],
    padding: Spacing.lg,
    borderRadius: Sizes.radiusLG,
    marginBottom: Spacing.xl,
  },
  tipsTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.semiBold,
    color: AppColors.gray[900],
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontSize: Typography.sm,
    color: AppColors.gray[700],
    marginBottom: Spacing.xs,
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
  skipText: {
    fontSize: Typography.md,
    color: AppColors.gray[600],
    textAlign: 'center',
    fontWeight: Typography.medium,
  },
});