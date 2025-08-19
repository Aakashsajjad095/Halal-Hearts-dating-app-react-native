import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, AntDesign, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { AppColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Spacing } from '@/constants/Spacing';

const { width: screenWidth } = Dimensions.get('window');

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <BlurView intensity={80} style={StyleSheet.absoluteFill}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.8)', 'rgba(20, 20, 20, 0.9)']}
              style={StyleSheet.absoluteFill}
            />
          </BlurView>
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: 30,
          left: 20,
          right: 20,
          height: 80,
          borderRadius: 25,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 20,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="matches"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIcon, focused && styles.activeTabIcon]}>
              <LinearGradient
                colors={focused ? ['#FF6B6B', '#FF8E8E'] : ['transparent', 'transparent']}
                style={styles.iconGradient}
              >
                <Ionicons 
                  size={26} 
                  name={focused ? 'chatbubbles' : 'chatbubbles-outline'} 
                  color={focused ? 'white' : 'rgba(255, 255, 255, 0.6)'} 
                />
              </LinearGradient>
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIcon, focused && styles.activeTabIcon]}>
              <LinearGradient
                colors={focused ? ['#FF4458', '#FF6B7A'] : ['transparent', 'transparent']}
                style={styles.iconGradient}
              >
                <Ionicons 
                  size={26} 
                  name={focused ? 'notifications' : 'notifications-outline'} 
                  color={focused ? 'white' : 'rgba(255, 255, 255, 0.6)'} 
                />
              </LinearGradient>
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.centerTabIcon}>
              <LinearGradient
                colors={['#FF416C', '#FF4B2B']}
                style={styles.centerIconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <AntDesign 
                  size={32} 
                  name="heart" 
                  color="white" 
                />
              </LinearGradient>
              <View style={styles.centerGlow} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIcon, focused && styles.activeTabIcon]}>
              <LinearGradient
                colors={focused ? ['#4ECDC4', '#44A08D'] : ['transparent', 'transparent']}
                style={styles.iconGradient}
              >
                <Ionicons 
                  size={26} 
                  name={focused ? 'person' : 'person-outline'} 
                  color={focused ? 'white' : 'rgba(255, 255, 255, 0.6)'} 
                />
              </LinearGradient>
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      </Tabs>
      <View style={[styles.bottomSafeArea, { height: insets.bottom }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeTabIcon: {
    transform: [{ scale: 1.1 }],
  },
  iconGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  centerTabIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: -10,
  },
  centerIconGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF416C',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  centerGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 65, 108, 0.2)',
    top: -10,
    left: -10,
    zIndex: -1,
  },
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
  },
});
