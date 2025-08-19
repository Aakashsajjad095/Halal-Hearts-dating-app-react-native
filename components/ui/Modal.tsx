import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ViewStyle,
  ModalProps as RNModalProps,
} from 'react-native';
import { AppColors } from '@/constants/Colors';
import { Spacing, Sizes, Typography, Shadows } from '@/constants/Spacing';
import { Button } from './Button';

interface ModalProps extends Omit<RNModalProps, 'children'> {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  position?: 'center' | 'bottom';
  style?: ViewStyle;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = 'medium',
  position = 'center',
  style,
  ...props
}) => {
  const getModalStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: AppColors.white,
      borderRadius: position === 'bottom' ? 0 : Sizes.radiusLG,
      ...Shadows.large,
    };

    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        width: screenWidth * 0.8,
        maxHeight: screenHeight * 0.4,
      },
      medium: {
        width: screenWidth * 0.9,
        maxHeight: screenHeight * 0.6,
      },
      large: {
        width: screenWidth * 0.95,
        maxHeight: screenHeight * 0.8,
      },
      fullscreen: {
        width: screenWidth,
        height: screenHeight,
        borderRadius: 0,
      },
    };

    const positionStyles: Record<string, ViewStyle> = {
      center: {
        alignSelf: 'center',
      },
      bottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: Sizes.radiusLG,
        borderTopRightRadius: Sizes.radiusLG,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...positionStyles[position],
    };
  };

  const getContainerStyle = (): ViewStyle => {
    return {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: position === 'center' ? 'center' : 'flex-end',
      alignItems: position === 'center' ? 'center' : 'stretch',
      padding: position === 'center' ? Spacing.lg : 0,
    };
  };

  return (
    <RNModal
      visible={isVisible}
      transparent
      animationType={position === 'bottom' ? 'slide' : 'fade'}
      onRequestClose={onClose}
      {...props}
    >
      <TouchableOpacity
        style={getContainerStyle()}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={[getModalStyle(), style]}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && (
                <Text style={styles.title}>{title}</Text>
              )}
              {showCloseButton && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>
            {children}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: AppColors.gray[900],
    flex: 1,
  },
  closeButton: {
    width: Sizes.iconLG,
    height: Sizes.iconLG,
    borderRadius: Sizes.iconLG / 2,
    backgroundColor: AppColors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: Typography.xl,
    color: AppColors.gray[600],
    fontWeight: Typography.bold,
  },
  content: {
    padding: Spacing.lg,
  },
});