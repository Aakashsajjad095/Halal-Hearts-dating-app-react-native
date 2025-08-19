import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { AppColors } from '@/constants/Colors';
import { Spacing, Sizes, Typography, Shadows } from '@/constants/Spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: Sizes.radiusMD,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: icon ? 'row' : 'column',
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        height: Sizes.buttonHeight * 0.8,
        paddingHorizontal: Spacing.md,
      },
      medium: {
        height: Sizes.buttonHeight,
        paddingHorizontal: Spacing.lg,
      },
      large: {
        height: Sizes.buttonHeight * 1.2,
        paddingHorizontal: Spacing.xl,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: disabled ? AppColors.gray[300] : AppColors.primary,
        ...Shadows.medium,
      },
      secondary: {
        backgroundColor: disabled ? AppColors.gray[100] : AppColors.secondary,
        borderWidth: 1,
        borderColor: AppColors.gray[200],
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: disabled ? AppColors.gray[300] : AppColors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: Typography.semiBold,
      textAlign: 'center',
    };

    // Size styles
    const sizeStyles: Record<string, TextStyle> = {
      small: {
        fontSize: Typography.sm,
      },
      medium: {
        fontSize: Typography.md,
      },
      large: {
        fontSize: Typography.lg,
      },
    };

    // Variant styles
    const variantStyles: Record<string, TextStyle> = {
      primary: {
        color: disabled ? AppColors.gray[500] : AppColors.white,
      },
      secondary: {
        color: disabled ? AppColors.gray[400] : AppColors.gray[700],
      },
      outline: {
        color: disabled ? AppColors.gray[400] : AppColors.primary,
      },
      ghost: {
        color: disabled ? AppColors.gray[400] : AppColors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? AppColors.white : AppColors.primary}
        />
      );
    }

    if (icon) {
      return (
        <>
          {iconPosition === 'left' && icon}
          <Text style={[getTextStyle(), textStyle, icon ? { marginHorizontal: Spacing.xs } : null]}>
            {title}
          </Text>
          {iconPosition === 'right' && icon}
        </>
      );
    }

    return <Text style={[getTextStyle(), textStyle]}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});