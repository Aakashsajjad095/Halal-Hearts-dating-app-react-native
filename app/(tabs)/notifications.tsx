import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons, AntDesign, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface Notification {
  id: string;
  type: 'quiz_request' | 'profile_visit' | 'like' | 'favorite';
  user: {
    id: string;
    name: string;
    age: number;
    location: string;
    photo: string;
    verified: boolean;
  };
  message: string;
  timestamp: string;
  isToday: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'quiz_request',
    user: {
      id: '1',
      name: 'John Smith',
      age: 23,
      location: 'Paris, France',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      verified: true,
    },
    message: 'requested you to start a quiz game',
    timestamp: '11:00 AM',
    isToday: true,
  },
  {
    id: '2',
    type: 'like',
    user: {
      id: '2',
      name: 'Sarah Johnson',
      age: 25,
      location: 'New York, NY',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      verified: true,
    },
    message: 'right swiped your profile!',
    timestamp: '10:30 AM',
    isToday: true,
  },
  {
    id: '3',
    type: 'favorite',
    user: {
      id: '3',
      name: 'Emma Wilson',
      age: 27,
      location: 'London, UK',
      photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      verified: true,
    },
    message: 'marked you as favourite!',
    timestamp: '9:45 AM',
    isToday: true,
  },
  {
    id: '4',
    type: 'profile_visit',
    user: {
      id: '4',
      name: 'Michael Brown',
      age: 29,
      location: 'Sydney, Australia',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      verified: false,
    },
    message: 'visited your profile',
    timestamp: '8:20 PM',
    isToday: false,
  },
  {
    id: '5',
    type: 'like',
    user: {
      id: '5',
      name: 'Jessica Davis',
      age: 24,
      location: 'Toronto, Canada',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      verified: false,
    },
    message: 'right swiped your profile!',
    timestamp: '7:15 PM',
    isToday: false,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleQuizAction = (notificationId: string, action: 'accept' | 'decline') => {
    if (action === 'accept') {
      router.push({pathname:'/quiz/quiz-detail'});
    } else {
      console.log('Cancel quiz for notification:', notificationId);
      // TODO: Implement cancel logic
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quiz_request':
        return { name: 'help-circle', color: '#FF6B7A', bgColor: '#FFF0F1' };
      case 'like':
        return { name: 'heart', color: '#4CAF50', bgColor: '#F0F8F0' };
      case 'favorite':
        return { name: 'star', color: '#FFD700', bgColor: '#FFFBF0' };
      case 'profile_visit':
        return { name: 'eye', color: '#2196F3', bgColor: '#F0F7FF' };
      default:
        return { name: 'bell', color: '#666', bgColor: '#F5F5F5' };
    }
  };

  const renderNotificationItem = (notification: Notification) => {
    const iconData = getNotificationIcon(notification.type);
    
    return (
      <View key={notification.id} style={styles.notificationItem}>
        <View style={styles.cardHeader}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: notification.user.photo }} style={styles.avatar} />
              {notification.user.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
              )}
            </View>
            
            <View style={styles.userDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>
                  {notification.user.name}, {notification.user.age}
                </Text>
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.userLocation}>{notification.user.location}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.notificationMeta}>
            <View style={[styles.notificationIcon, { backgroundColor: iconData.bgColor }]}>
              <Feather name={iconData.name as any} size={16} color={iconData.color} />
            </View>
            <Text style={styles.timeText}>{notification.timestamp}</Text>
          </View>
        </View>
        
        <View style={styles.messageSection}>
          <Text style={styles.notificationMessage}>
            <Text style={styles.userNameInMessage}>{notification.user.name}</Text>
            <Text style={styles.messageText}> {notification.message}</Text>
          </Text>
        </View>
        
        {notification.type === 'quiz_request' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => handleQuizAction(notification.id, 'decline')}
            >
              <Text style={styles.cancelButtonText}>Cancel Request</Text>
            </TouchableOpacity>
            
            <LinearGradient
              colors={['#FF4458', '#FF6B7A']}
              style={styles.startQuizButton}
            >
              <TouchableOpacity 
                style={styles.startQuizButtonInner}
                onPress={() => handleQuizAction(notification.id, 'accept')}
              >
                <Text style={styles.startQuizButtonText}>Start Quiz</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </View>
    );
  };

  const todayNotifications = notifications.filter(n => n.isToday);
  const yesterdayNotifications = notifications.filter(n => !n.isToday);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Today Section */}
        {todayNotifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TODAY</Text>
            {todayNotifications.map(renderNotificationItem)}
          </View>
        )}
        
        {/* Yesterday Section */}
        {yesterdayNotifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>YESTERDAY</Text>
            {yesterdayNotifications.map(renderNotificationItem)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuButton: {
    width: 24,
    height: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  menuDot: {
    width: 4,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 1,
    marginLeft: 20,
    marginBottom: 16,
    marginTop: 20,
  },
  notificationItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  notificationMeta: {
    alignItems: 'center',
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  messageSection: {
    marginBottom: 12,
  },
  notificationMessage: {
    fontSize: 16,
    lineHeight: 22,
  },
  userNameInMessage: {
    fontWeight: '700',
    color: '#333',
  },
  messageText: {
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  startQuizButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  startQuizButtonInner: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startQuizButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});