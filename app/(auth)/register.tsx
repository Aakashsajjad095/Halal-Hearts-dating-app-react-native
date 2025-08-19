import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/Colors';
import { Spacing, Sizes, Typography } from '@/constants/Spacing';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess } from '@/store/slices/authSlice';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const dispatch = useAppDispatch();

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock successful registration
      dispatch(loginSuccess({
        id: '1',
        email,
        name: email.split('@')[0], // Use email prefix as name
        isVerified: false,
      }));
      
      setLoading(false);
      router.replace('/(onboarding)/welcome');
    }, 1500);
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, simulate Google login
      setTimeout(() => {
        dispatch(loginSuccess({
          id: '2',
          email: 'user@gmail.com',
          name: 'Google User',
          isVerified: true,
        }));
        
        setLoading(false);
        router.replace('/(onboarding)/welcome');
      }, 1000);
      
      Alert.alert('Success', 'Google registration successful!');
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Google registration failed. Please try again.');
    }
  };

  const handleAppleLogin = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, simulate Apple login
      setTimeout(() => {
        dispatch(loginSuccess({
          id: '3',
          email: 'user@icloud.com',
          name: 'Apple User',
          isVerified: true,
        }));
        
        setLoading(false);
        router.replace('/(onboarding)/welcome');
      }, 1000);
      
      Alert.alert('Success', 'Apple registration successful!');
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Apple registration failed. Please try again.');
    }
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -50} // Adjust as needed
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Add this to ensure taps on buttons are handled
        >
          {/* Header with Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>💕</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join thousands of people finding love
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry
                error={errors.password}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                error={errors.confirmPassword}
              />
            </View>
          </View>

          {/* Terms */}
          <View style={styles.terms}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <TouchableOpacity>
                <Text style={styles.linkText}>Terms of Service</Text>
              </TouchableOpacity>
              {' '}and{' '}
              <TouchableOpacity>
                <Text style={styles.linkText}>Privacy Policy</Text>
              </TouchableOpacity>
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              size="large"
              style={styles.registerButton}
            />
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <TouchableOpacity 
              style={[styles.socialButton, styles.googleButton]} 
              onPress={handleGoogleLogin}
              disabled={loading}
            >
              <Ionicons name="logo-google" size={20} color="#4285F4" style={styles.socialIcon} />
              <Text style={[styles.socialButtonText, styles.googleButtonText]}>Continue with Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, styles.appleButton]} 
              onPress={handleAppleLogin}
              disabled={loading}
            >
              <Ionicons name="logo-apple" size={20} color="#000" style={styles.socialIcon} />
              <Text style={[styles.socialButtonText, styles.appleButtonText]}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    marginBottom: Spacing.xl,
  },
  logoText: {
    fontSize: 48,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: AppColors.gray[900],
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.lg,
    color: AppColors.gray[600],
    textAlign: 'center',
  },
  form: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  terms: {
    marginBottom: Spacing.xl,
  },
  termsText: {
    fontSize: Typography.sm,
    color: AppColors.gray[600],
    textAlign: 'center',
    lineHeight: Typography.lineHeightNormal,
  },
  actions: {
    marginBottom: Spacing.xl,
  },
  registerButton: {
    marginBottom: Spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: AppColors.gray[300],
  },
  dividerText: {
    fontSize: Typography.sm,
    color: AppColors.gray[500],
    marginHorizontal: Spacing.md,
    fontWeight: '500',
  },
  socialButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: AppColors.gray[300],
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: Typography.md,
    fontWeight: Typography.semiBold,
    color: AppColors.gray[900],
  },
  socialIcon: {
    marginRight: 12,
  },
  googleButton: {
    backgroundColor: '#4285F4', // Google Blue
  },
  googleButtonText: {
    color: AppColors.white,
  },
  appleButton: {
    backgroundColor: AppColors.black,
  },
  appleButtonText: {
    color: AppColors.white,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.md,
    color: AppColors.gray[600],
  },
  linkText: {
    color: AppColors.primary,
    fontWeight: Typography.semiBold,
  },
});