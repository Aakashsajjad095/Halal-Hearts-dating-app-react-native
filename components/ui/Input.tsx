import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { AppColors } from '@/constants/Colors';
import { Spacing, Sizes, Typography, Shadows } from '@/constants/Spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'outlined',
  size = 'medium',
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginBottom: Spacing.sm,
    };

    return baseStyle;
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: Sizes.radiusMD,
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        height: Sizes.inputHeight * 0.8,
        paddingHorizontal: Spacing.sm,
      },
      medium: {
        height: Sizes.inputHeight,
        paddingHorizontal: Spacing.md,
      },
      large: {
        height: Sizes.inputHeight * 1.2,
        paddingHorizontal: Spacing.lg,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      default: {
        backgroundColor: AppColors.gray[50],
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: AppColors.white,
        borderWidth: 1,
        borderColor: error
          ? AppColors.error
          : isFocused
          ? AppColors.primary
          : AppColors.gray[300],
        ...Shadows.small,
      },
      filled: {
        backgroundColor: AppColors.gray[100],
        borderWidth: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      fontSize: Typography.md,
      color: AppColors.gray[900],
      paddingVertical: 0, // Remove default padding
    };

    return baseStyle;
  };

  const getLabelStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: Typography.sm,
      fontWeight: Typography.medium,
      color: AppColors.gray[700],
      marginBottom: Spacing.xs,
    };

    return baseStyle;
  };

  const getErrorStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: Typography.xs,
      color: AppColors.error,
      marginTop: Spacing.xs,
    };

    return baseStyle;
  };

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>{label}</Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.iconContainer}>{leftIcon}</View>
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={AppColors.gray[400]}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[getErrorStyle(), errorStyle]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginHorizontal: Spacing.xs,
  },
});