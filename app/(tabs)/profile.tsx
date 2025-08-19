import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  Modal,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/Colors';
import { Spacing, Typography } from '@/constants/Spacing';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProfile, UserProfile } from '@/store/slices/profileSlice';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth > 768;
const responsiveWidth = (percentage: number) => (screenWidth * percentage) / 100;
const responsiveHeight = (percentage: number) => (screenHeight * percentage) / 100;

interface EditModalProps {
  visible: boolean;
  title: string;
  value: string;
  onSave: (value: string) => void;
  onClose: () => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  title,
  value,
  onSave,
  onClose,
  multiline = false,
  keyboardType = 'default'
}) => {
  const [inputValue, setInputValue] = useState(value);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setInputValue(value);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible, value]);

  const handleSave = () => {
    onSave(inputValue);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Animated.View style={[styles.modalOverlay, { opacity: opacityAnim }]}>
        <BlurView intensity={30} style={StyleSheet.absoluteFill} />
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)'] as any}
            style={styles.modalGradient}
          />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={AppColors.gray[600]} />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={[styles.modalInput, multiline && styles.modalInputMultiline]}
            value={inputValue}
            onChangeText={setInputValue}
            multiline={multiline}
            keyboardType={keyboardType}
            autoFocus
            placeholder={`Enter ${title.toLowerCase()}`}
            placeholderTextColor={AppColors.gray[400]}
          />
          
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <LinearGradient
              colors={AppColors.gradient.primary as any}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

interface InterestSelectorProps {
  visible: boolean;
  selectedInterests: string[];
  onSave: (interests: string[]) => void;
  onClose: () => void;
}

const InterestSelector: React.FC<InterestSelectorProps> = ({
  visible,
  selectedInterests,
  onSave,
  onClose
}) => {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedInterests);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const availableInterests = [
    'Travel', 'Photography', 'Music', 'Sports', 'Reading', 'Cooking',
    'Art', 'Dancing', 'Hiking', 'Gaming', 'Fitness', 'Movies',
    'Technology', 'Fashion', 'Food', 'Nature', 'Yoga', 'Swimming'
  ];

  useEffect(() => {
    if (visible) {
      setTempSelected(selectedInterests);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, selectedInterests]);

  const toggleInterest = (interest: string) => {
    setTempSelected(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    onSave(tempSelected);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <BlurView intensity={30} style={StyleSheet.absoluteFill} />
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)'] as any}
            style={styles.modalGradient}
          />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Interests</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={AppColors.gray[600]} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.interestsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.interestsGrid}>
              {availableInterests.map((interest) => {
                const isSelected = tempSelected.includes(interest);
                return (
                  <TouchableOpacity
                    key={interest}
                    onPress={() => toggleInterest(interest)}
                    style={[
                      styles.interestChip,
                      isSelected && styles.interestChipSelected
                    ]}
                  >
                    <Text style={[
                      styles.interestChipText,
                      isSelected && styles.interestChipTextSelected
                    ]}>
                      {interest}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <LinearGradient
              colors={AppColors.gradient.primary as any}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Save Interests</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function ProfileScreen() {
  const router = useRouter();

  const navigateToChangeLocation = () => {
    router.push('/location');
  };
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  
  // Modal states
  const [editModal, setEditModal] = useState<{
    visible: boolean;
    field: keyof UserProfile | null;
    title: string;
    value: string;
    multiline?: boolean;
    keyboardType?: 'default' | 'numeric' | 'email-address';
  }>({ visible: false, field: null, title: '', value: '' });
  
  const [interestModal, setInterestModal] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      })
    ]).start();

    // Continuous animations
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ])
    );

    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        })
      ])
    );

    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    const breatheAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.02,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      ])
    );

    pulseAnimation.start();
    floatAnimation.start();
    shimmerAnimation.start();
    rotateAnimation.start();
    breatheAnimation.start();

    return () => {
      pulseAnimation.stop();
      floatAnimation.stop();
      shimmerAnimation.stop();
      rotateAnimation.stop();
      breatheAnimation.stop();
    };
  }, []);

  const openEditModal = (field: keyof UserProfile, title: string, multiline = false, keyboardType: 'default' | 'numeric' | 'email-address' = 'default') => {
    setEditModal({
      visible: true,
      field,
      title,
      value: profile?.[field]?.toString() || '',
      multiline,
      keyboardType
    });
  };

  const handleSave = (value: string) => {
    if (editModal.field && profile) {
      const updatedProfile = { ...profile, [editModal.field]: value };
      dispatch(updateProfile(updatedProfile));
    }
    setEditModal({ visible: false, field: null, title: '', value: '' });
  };

  const handleInterestsSave = (interests: string[]) => {
    if (profile) {
      const updatedProfile = { ...profile, interests };
      dispatch(updateProfile(updatedProfile));
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && profile) {
      const updatedProfile = { ...profile, profileImage: result.assets[0].uri };
      dispatch(updateProfile(updatedProfile));
    }
  };

  const addPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, screenWidth]
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated Background */}
      <Animated.View style={[styles.backgroundContainer, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={[
            AppColors.primary,
            AppColors.primaryLight,
            AppColors.accent,
            '#FF8A95'
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backgroundGradient}
        />
        
        {/* Floating Orbs */}
        <Animated.View 
          style={[
            styles.floatingOrb1,
            { 
              transform: [
                { rotate: rotateInterpolate },
                { scale: breatheAnim }
              ]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingOrb2,
            { 
              transform: [
                { rotate: rotateInterpolate },
                { translateY: floatAnim }
              ]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingOrb3,
            { 
              transform: [
                { rotate: rotateInterpolate },
                { scale: pulseAnim }
              ]
            }
          ]} 
        />
        
        {/* Shimmer Effect */}
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              transform: [{ translateX: shimmerTranslate }]
            }
          ]}
        />
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Hero Section */}
          <Animated.View 
            style={[
              styles.heroSection,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <BlurView intensity={20} style={styles.heroBlur} />
            
            {/* Profile Image */}
            <Animated.View 
              style={[
                styles.profileImageContainer,
                {
                  transform: [
                    { scale: pulseAnim },
                    { translateY: floatAnim }
                  ]
                }
              ]}
            >
              <LinearGradient
                colors={[AppColors.primary, AppColors.accent, AppColors.primaryLight]}
                style={styles.profileImageBorder}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <TouchableOpacity onPress={pickImage} style={styles.profileImageWrapper}>
                  <Image
                    source={{
                      uri: profile.profileImage || 'https://via.placeholder.com/150'
                    }}
                    style={styles.profileImage}
                  />
                  
                  {/* Camera Icon */}
                  <View style={styles.cameraIconContainer}>
                    <LinearGradient
                      colors={[AppColors.primary, AppColors.accent]}
                      style={styles.cameraIcon}
                    >
                      <Ionicons name="camera" size={16} color="white" />
                    </LinearGradient>
                  </View>
                  
                  {/* Online Status */}
                  <View style={styles.onlineStatusContainer}>
                    <Animated.View 
                      style={[
                        styles.onlineStatus,
                        { transform: [{ scale: pulseAnim }] }
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
            
            {/* Profile Info */}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name || 'Your Name'}</Text>
              <View style={styles.profileMetaRow}>
                <View style={styles.ageChip}>
                  <Ionicons name="calendar-outline" size={14} color="white" />
                  <Text style={styles.ageText}>{profile.age || '25'}</Text>
                </View>
                <TouchableOpacity style={styles.locationChip} onPress={navigateToChangeLocation}>
                  <Ionicons name="location-outline" size={14} color="white" />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {profile.location ? `${profile.location.city}, ${profile.location.state}` : 'Your Location'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Quick Stats */}
              <View style={styles.quickStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>127</Text>
                  <Text style={styles.statLabel}>Matches</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>89%</Text>
                  <Text style={styles.statLabel}>Compatibility</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>4.8</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Content Sections */}
          <Animated.View 
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* About Section */}
            <View style={styles.section}>
              <BlurView intensity={15} style={styles.sectionBlur} />
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <LinearGradient
                    colors={[AppColors.primary, AppColors.accent]}
                    style={styles.sectionIcon}
                  >
                    <Ionicons name="person-outline" size={20} color="white" />
                  </LinearGradient>
                  <Text style={styles.sectionTitle}>About Me</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => openEditModal('bio', 'Bio', true)}
                  style={styles.editButton}
                >
                  <Ionicons name="pencil" size={16} color={AppColors.primary} />
                </TouchableOpacity>
              </View>
              
              <ProfileField
                icon="information-circle-outline"
                label="Bio"
                value={profile.bio || 'Tell us about yourself...'}
                onPress={() => openEditModal('bio', 'Bio', true)}
                multiline
              />
              
              <ProfileField
                icon="briefcase-outline"
                label="Occupation"
                value={profile.occupation || 'Your occupation'}
                onPress={() => openEditModal('occupation', 'Occupation')}
              />
              
              <ProfileField
                icon="location-outline"
                label="Location"
                value={profile.location ? `${profile.location.city}, ${profile.location.state}` : 'Your location'}
                onPress={() => openEditModal('location', 'Location')}
              />
            </View>

            {/* Personal Details */}
            <View style={styles.section}>
              <BlurView intensity={15} style={styles.sectionBlur} />
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <LinearGradient
                    colors={[AppColors.primary, AppColors.accent]}
                    style={styles.sectionIcon}
                  >
                    <Ionicons name="heart-outline" size={20} color="white" />
                  </LinearGradient>
                  <Text style={styles.sectionTitle}>Personal Details</Text>
                </View>
              </View>
              
              <ProfileField
                icon="resize-outline"
                label="Height"
                value={profile.height ? `${profile.height} cm` : 'Your height'}
                onPress={() => openEditModal('height', 'Height', false, 'numeric')}
              />
              
              <ProfileField
                icon="heart-outline"
                label="Looking For"
                value={profile.lookingFor || 'What are you looking for?'}
                onPress={() => openEditModal('lookingFor', 'Looking For')}
              />
              
              <ProfileField
                icon="school-outline"
                label="Education"
                value={profile.education || 'Your education'}
                onPress={() => openEditModal('education', 'Education')}
              />
            </View>

            {/* Interests */}
            <View style={styles.section}>
              <BlurView intensity={15} style={styles.sectionBlur} />
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <LinearGradient
                    colors={[AppColors.primary, AppColors.accent]}
                    style={styles.sectionIcon}
                  >
                    <Ionicons name="star-outline" size={20} color="white" />
                  </LinearGradient>
                  <Text style={styles.sectionTitle}>Interests</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => setInterestModal(true)}
                  style={styles.editButton}
                >
                  <Ionicons name="add" size={16} color={AppColors.primary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.interestsContainer}>
                {profile.interests && profile.interests.length > 0 ? (
                  <View style={styles.interestsDisplay}>
                    {profile.interests.map((interest, index) => (
                      <View key={index} style={styles.interestTag}>
                        <Text style={styles.interestTagText}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyText}>Add your interests to help others know you better</Text>
                )}
              </View>
            </View>

            {/* Photos */}
            <View style={styles.section}>
              <BlurView intensity={15} style={styles.sectionBlur} />
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <LinearGradient
                    colors={[AppColors.primary, AppColors.accent]}
                    style={styles.sectionIcon}
                  >
                    <Ionicons name="images-outline" size={20} color="white" />
                  </LinearGradient>
                  <Text style={styles.sectionTitle}>Photos</Text>
                </View>
                <TouchableOpacity 
                  onPress={addPhoto}
                  style={styles.editButton}
                >
                  <Ionicons name="add" size={16} color={AppColors.primary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
                {photos.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <TouchableOpacity
                      onPress={() => removePhoto(index)}
                      style={styles.removePhotoButton}
                    >
                      <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity onPress={addPhoto} style={styles.addPhotoButton}>
                  <Ionicons name="add" size={32} color={AppColors.gray[400]} />
                </TouchableOpacity>
              </ScrollView>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* Modals */}
      <EditModal
        visible={editModal.visible}
        title={editModal.title}
        value={editModal.value}
        onSave={handleSave}
        onClose={() => setEditModal({ visible: false, field: null, title: '', value: '' })}
        multiline={editModal.multiline}
        keyboardType={editModal.keyboardType}
      />
      
      <InterestSelector
        visible={interestModal}
        selectedInterests={profile.interests || []}
        onSave={handleInterestsSave}
        onClose={() => setInterestModal(false)}
      />
    </View>
  );
}

interface ProfileFieldProps {
  icon: string;
  label: string;
  value: string;
  onPress: () => void;
  multiline?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label, value, onPress, multiline = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.profileField, { transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={10} style={styles.fieldBlur} />
        <View style={styles.fieldLeft}>
          <LinearGradient
            colors={[AppColors.primary + '20', AppColors.accent + '20']}
            style={styles.fieldIcon}
          >
            <Ionicons name={icon as any} size={20} color={AppColors.primary} />
          </LinearGradient>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={[styles.fieldValue, multiline && styles.fieldValueMultiline]}>
              {value}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={AppColors.gray[400]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray[50],
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: responsiveHeight(60),
    overflow: 'hidden',
  },
  backgroundGradient: {
    flex: 1,
  },
  floatingOrb1: {
    position: 'absolute',
    top: responsiveHeight(8),
    right: responsiveWidth(10),
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: responsiveWidth(12.5),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  floatingOrb2: {
    position: 'absolute',
    bottom: responsiveHeight(15),
    left: responsiveWidth(5),
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    borderRadius: responsiveWidth(10),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  floatingOrb3: {
    position: 'absolute',
    top: responsiveHeight(25),
    left: responsiveWidth(15),
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    borderRadius: responsiveWidth(7.5),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: responsiveWidth(30),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-20deg' }],
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: responsiveWidth(5),
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    marginBottom: 20,
  },
  heroBlur: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImageBorder: {
    width: responsiveWidth(35),
    height: responsiveWidth(35),
    borderRadius: responsiveWidth(17.5),
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
  },
  profileImageWrapper: {
    flex: 1,
    borderRadius: responsiveWidth(16.5),
    overflow: 'hidden',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  cameraIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  onlineStatusContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  onlineStatus: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: AppColors.success,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: AppColors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  profileName: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  profileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 15,
  },
  ageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    maxWidth: responsiveWidth(50),
  },
  locationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    width: responsiveWidth(85),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: 'white',
    fontSize: isTablet ? 22 : 18,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '500',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  contentContainer: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  sectionBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: isTablet ? 22 : 20,
    fontWeight: '700',
    color: AppColors.gray[900],
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.primary + '30',
  },
  profileField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  fieldBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    padding: 16,
  },
  fieldIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: AppColors.gray[600],
    marginBottom: 4,
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 16,
    color: AppColors.gray[900],
    fontWeight: '600',
  },
  fieldValueMultiline: {
    lineHeight: 22,
  },
  interestsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  interestsDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  interestTagText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    color: AppColors.gray[500],
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: 16,
  },
  photosScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  photo: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: 16,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addPhotoButton: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppColors.gray[300],
    borderStyle: 'dashed',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.gray[50],
  },
  loadingText: {
    fontSize: 18,
    color: AppColors.gray[600],
    fontWeight: '500',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  modalGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.gray[900],
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInput: {
    marginHorizontal: 24,
    borderWidth: 2,
    borderColor: AppColors.gray[200],
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    minHeight: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  modalInputMultiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: AppColors.gray[100],
    borderWidth: 2,
    borderColor: AppColors.gray[200],
  },
  interestChipSelected: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  interestChipText: {
    fontSize: 14,
    color: AppColors.gray[700],
    fontWeight: '500',
  },
  interestChipTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
});
