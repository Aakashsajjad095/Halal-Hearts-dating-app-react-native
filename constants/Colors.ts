/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#FF4458';
const tintColorDark = '#FF6B7A';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: '#FF4458',
    secondary: '#FFF0F1',
    accent: '#FF6B7A',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    border: '#E8E8E8',
    card: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.1)',
    placeholder: '#9CA3AF',
    disabled: '#D1D5DB',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#FF6B7A',
    secondary: '#2A1A1B',
    accent: '#FF8A95',
    success: '#66BB6A',
    warning: '#FFB74D',
    error: '#EF5350',
    border: '#2A2A2A',
    card: '#1F1F1F',
    shadow: 'rgba(0, 0, 0, 0.3)',
    placeholder: '#6B7280',
    disabled: '#4B5563',
  },
};

export const AppColors = {
  primary: '#FF4458',
  primaryLight: '#FF6B7A',
  primaryDark: '#E63946',
  secondary: '#FFF0F1',
  accent: '#FF6B7A',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  gradient: {
    primary: ['#FF4458', '#FF6B7A'],
    secondary: ['#FFF0F1', '#FFFFFF'],
    dark: ['#1F1F1F', '#151718'],
  },
};
