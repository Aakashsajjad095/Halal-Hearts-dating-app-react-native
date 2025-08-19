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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const dispatch = useAppDispatch();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock successful login
      dispatch(loginSuccess({
        id: '1',
        email,
        name: 'John Doe',
        isVerified: true,
      }));
      
      setLoading(false);
      // Navigate to matches screen after successful login
      router.replace('/(tabs)/matches');
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
        router.replace('/(tabs)/matches');
      }, 1000);
      
      Alert.alert('Success', 'Google login successful!');
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Google login failed. Please try again.');
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
        router.replace('/(tabs)/matches');
      }, 1000);
      
      Alert.alert('Success', 'Apple login successful!');
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Apple login failed. Please try again.');
    }
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>💕</Text>
            </View>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Please sign in to your account
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
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
              />
            </View>
            
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              size="large"
              style={styles.loginButton}
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
              Don't have an account?{' '}
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.linkText}>Sign Up</Text>
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
    paddingHorizontal: 24,
    paddingTop: height * 0.08,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.gray?.[900] || '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.gray?.[600] || '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
  },
  actions: {
    marginBottom: 32,
  },
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: AppColors.gray?.[300] || '#D1D5DB',
  },
  dividerText: {
    fontSize: 12,
    color: AppColors.gray?.[500] || '#9CA3AF',
    marginHorizontal: 16,
    fontWeight: '600',
  },
  socialButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.gray?.[300] || '#D1D5DB',
    backgroundColor: AppColors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: AppColors.gray?.[700] || '#374151',
    fontWeight: '600',
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: AppColors.gray?.[600] || '#6B7280',
  },
  linkText: {
    color: AppColors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});