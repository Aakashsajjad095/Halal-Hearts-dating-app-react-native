import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';
import { AppColors } from '@/constants/Colors';
import { Spacing, Sizes, Typography, Shadows } from '@/constants/Spacing';

interface CardProps {
  imageUri: string;
  name: string;
  age: number;
  distance?: number;
  bio?: string;
  interests?: string[];
  onPress?: () => void;
  style?: ViewStyle;
  showDetails?: boolean;
}

export const Card: React.FC<CardProps> = ({
  imageUri,
  name,
  age,
  distance,
  bio,
  interests = [],
  onPress,
  style,
  showDetails = true,
}) => {
  const renderInterests = () => {
    if (!interests.length || !showDetails) return null;

    return (
      <View style={styles.interestsContainer}>
        {interests.slice(0, 3).map((interest, index) => (
          <View key={index} style={styles.interestTag}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
        {interests.length > 3 && (
          <View style={styles.interestTag}>
            <Text style={styles.interestText}>+{interests.length - 3}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.95}
      disabled={!onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        
        {/* Gradient overlay */}
        <View style={styles.gradientOverlay} />
        
        {/* Content overlay */}
        <View style={styles.contentOverlay}>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.age}>{age}</Text>
          </View>
          
          {distance && (
            <Text style={styles.distance}>{distance} km away</Text>
          )}
          
          {bio && showDetails && (
            <Text style={styles.bio} numberOfLines={2}>
              {bio}
            </Text>
          )}
          
          {renderInterests()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Sizes.cardWidth,
    height: Sizes.cardHeight,
    borderRadius: Sizes.radiusLG,
    overflow: 'hidden',
    ...Shadows.large,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    // Note: For a real gradient, you'd use react-native-linear-gradient
    // For now, using a simple overlay
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: AppColors.white,
    marginRight: Spacing.sm,
  },
  age: {
    fontSize: Typography.lg,
    fontWeight: Typography.medium,
    color: AppColors.white,
  },
  distance: {
    fontSize: Typography.sm,
    color: AppColors.white,
    opacity: 0.9,
    marginBottom: Spacing.sm,
  },
  bio: {
    fontSize: Typography.sm,
    color: AppColors.white,
    lineHeight: Typography.lineHeightNormal * Typography.sm,
    marginBottom: Spacing.sm,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: Sizes.radiusSM,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  interestText: {
    fontSize: Typography.xs,
    color: AppColors.white,
    fontWeight: Typography.medium,
  },
});