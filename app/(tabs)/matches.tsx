import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');

interface RecentMatch {
  id: string;
  name: string;
  photo: string;
  isOnline: boolean;
}

interface Message {
  id: string;
  user: {
    id: string;
    name: string;
    photo: string;
    isOnline: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isToday: boolean;
}

const mockRecentMatches: RecentMatch[] = [
  {
    id: '1',
    name: 'Emma',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Sarah',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Jessica',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    isOnline: true,
  },
  {
    id: '4',
    name: 'Ashley',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    isOnline: false,
  },
  {
    id: '5',
    name: 'Mia',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    isOnline: true,
  },
  {
    id: '6',
    name: 'Olivia',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
    isOnline: false,
  },
  {
    id: '7',
    name: 'Sophia',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isOnline: true,
  },
  {
    id: '8',
    name: 'Isabella',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    isOnline: false,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Emma Wilson',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      isOnline: true,
    },
    lastMessage: 'Hey! How was your day? 😊',
    timestamp: '2:30 PM',
    unreadCount: 2,
    isToday: true,
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Sarah Johnson',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      isOnline: false,
    },
    lastMessage: 'Thanks for the coffee recommendation!',
    timestamp: '1:15 PM',
    unreadCount: 0,
    isToday: true,
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Jessica Davis',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      isOnline: true,
    },
    lastMessage: 'Looking forward to our date tomorrow! 💕',
    timestamp: '11:45 AM',
    unreadCount: 1,
    isToday: true,
  },
  {
    id: '4',
    user: {
      id: '4',
      name: 'Ashley Brown',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      isOnline: false,
    },
    lastMessage: 'That movie was amazing! What did you think?',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isToday: false,
  },
  {
    id: '5',
    user: {
      id: '5',
      name: 'Mia Garcia',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
      isOnline: true,
    },
    lastMessage: 'Good morning! Hope you have a great day ☀️',
    timestamp: 'Yesterday',
    unreadCount: 3,
    isToday: false,
  },
];

const mockMessageRequests: Message[] = [
  {
    id: '6',
    user: {
      id: '6',
      name: 'Olivia Martinez',
      photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
      isOnline: false,
    },
    lastMessage: 'Hi! I saw your profile and thought we might have a lot in common. Would love to chat!',
    timestamp: '3:20 PM',
    unreadCount: 1,
    isToday: true,
  },
  {
    id: '7',
    user: {
      id: '7',
      name: 'Sophia Lee',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isOnline: true,
    },
    lastMessage: 'Hello! Your travel photos are incredible. I\'d love to hear about your adventures!',
    timestamp: '1:45 PM',
    unreadCount: 1,
    isToday: true,
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'primary' | 'requests'>('primary');
  const [scrollY] = useState(new Animated.Value(0));

  const handleChatPress = (userId: string, userName: string, isRequest: boolean = false) => {
    router.push({
      pathname: '/chat/conversation',
      params: { userId, userName, isRequest: isRequest.toString() }
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
            // Dispatch action to delete message
            console.log('Delete message with ID:', messageId);
            // TODO: Implement actual Redux dispatch for deleting message from matches
          }
        },
      ],
      { cancelable: true }
    );
  };

  const handleMatchPress = (matchId: string) => {
    router.push({
      pathname: '/chat/conversation',
      params: { userId: matchId, isRequest: 'false' }
    });
  };

  const renderRecentMatch = ({ item }: { item: RecentMatch }) => (
    <TouchableOpacity 
      style={styles.matchItem}
      onPress={() => handleMatchPress(item.id)}
    >
      <View style={styles.matchImageContainer}>
        <Image source={{ uri: item.photo }} style={styles.matchImage} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <Text style={styles.matchName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, item: Message) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        onPress={() => handleDeleteMessage(item.id)}
        style={styles.deleteButtonContainer}
      >
        <Animated.View style={[styles.deleteButtonBackground, { transform: [{ scale }] }]}>
          <Feather name="trash-2" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
      overshootRight={false}
      containerStyle={styles.swipeableContainer}
    >

    <TouchableOpacity 
      style={styles.messageItem}
      onPress={() => handleChatPress(item.user.id, item.user.name, selectedTab === 'requests')}
    >
      <View style={styles.messageImageContainer}>
        <Image source={{ uri: item.user.photo }} style={styles.messageImage} />
        {item.user.isOnline && <View style={styles.messageOnlineIndicator} />}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageName}>{item.user.name}</Text>
          <Text style={styles.messageTime}>{item.timestamp}</Text>
        </View>
        <View style={styles.messagePreview}>
          <Text style={styles.messageText} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
    </Swipeable>
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const primaryMessages = mockMessages;
  const requestMessages = mockMessageRequests;
  const totalRequests = requestMessages.reduce((sum, msg) => sum + msg.unreadCount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.menuButton}>
            <View style={styles.menuDot} />
            <View style={styles.menuDot} />
            <View style={styles.menuDot} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Feather name="search" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Recent Matches Section */}
        <View style={styles.recentMatchesSection}>
          <Text style={styles.sectionTitle}>8 Recent Matches</Text>
          <FlatList
            data={mockRecentMatches}
            renderItem={renderRecentMatch}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.matchesList}
          />
        </View>

        {/* Message Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'primary' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('primary')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'primary' && styles.activeTabText
            ]}>
              Primary Messages
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'requests' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('requests')}
          >
            <View style={styles.tabWithBadge}>
              <Text style={[
                styles.tabText,
                selectedTab === 'requests' && styles.activeTabText
              ]}>
                Message Requests
              </Text>
              {totalRequests > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{totalRequests}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <View style={styles.messagesContainer}>
          <FlatList
            data={selectedTab === 'primary' ? primaryMessages : requestMessages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.messageSeparator} />}
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  swipeableContainer: {
    // This is important to ensure the Swipeable component takes full width
    width: '100%',
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
    backgroundColor: 'red',
    width: 100, // Fixed width for the delete button area
  },
  deleteButtonBackground: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  recentMatchesSection: {
    backgroundColor: 'white',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 20,
    marginBottom: 16,
  },
  matchesList: {
    paddingHorizontal: 16,
  },
  matchItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 70,
  },
  matchImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FF4458',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  matchName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF4458',
  },
  tabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#FF4458',
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: '#FF4458',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  messagesContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  messageImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  messageOnlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#FF4458',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  messageSeparator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 92,
  },
});