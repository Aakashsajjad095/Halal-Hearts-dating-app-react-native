import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive helper functions
const wp = (percentage: number) => (screenWidth * percentage) / 100;
const hp = (percentage: number) => (screenHeight * percentage) / 100;

export const Spacing = {
  xs: wp(1),
  sm: wp(2),
  md: wp(4),
  lg: wp(6),
  xl: wp(8),
  xxl: wp(12),
  xxxl: wp(16),
};

export const Sizes = {
  // Screen dimensions
  screenWidth: wp(100),
  screenHeight: hp(100),
  
  // Common sizes
  buttonHeight: hp(6),
  inputHeight: hp(6),
  headerHeight: hp(8),
  tabBarHeight: hp(10),
  
  // Icon sizes
  iconXS: wp(4),
  iconSM: wp(5),
  iconMD: wp(6),
  iconLG: wp(8),
  iconXL: wp(10),
  
  // Avatar sizes
  avatarSM: wp(12),
  avatarMD: wp(20),
  avatarLG: wp(30),
  avatarXL: wp(40),
  
  // Card dimensions
  cardWidth: wp(85),
  cardHeight: hp(70),
  
  // Border radius
  radiusXS: wp(1),
  radiusSM: wp(2),
  radiusMD: wp(3),
  radiusLG: wp(4),
  radiusXL: wp(6),
  radiusRound: wp(50),
};

export const Typography = {
  // Font sizes
  xs: wp(3),
  sm: wp(3.5),
  md: wp(4),
  lg: wp(4.5),
  xl: wp(5),
  xxl: wp(6),
  xxxl: wp(8),
  
  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.6,
  
  // Font weights
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};