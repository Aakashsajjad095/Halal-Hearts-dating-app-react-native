import React, { useState, useEffect } from 'react';
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
  Animated,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface LeaderboardEntry {
  id: string;
  rank: number;
  user: {
    name: string;
    age: number;
    photo: string;
    location: string;
    verified: boolean;
  };
  score: number;
  quizType: string;
  completedAt: string;
  isCurrentUser?: boolean;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    rank: 1,
    user: {
      name: 'Emma Wilson',
      age: 27,
      photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      location: 'London, UK',
      verified: true,
    },
    score: 95,
    quizType: 'Love Language',
    completedAt: '2 hours ago',
  },
  {
    id: '2',
    rank: 2,
    user: {
      name: 'You',
      age: 25,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      location: 'New York, NY',
      verified: true,
    },
    score: 88,
    quizType: 'Love Language',
    completedAt: 'Just now',
    isCurrentUser: true,
  },
  {
    id: '3',
    rank: 3,
    user: {
      name: 'Sarah Johnson',
      age: 24,
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      location: 'Los Angeles, CA',
      verified: true,
    },
    score: 85,
    quizType: 'Love Language',
    completedAt: '1 day ago',
  },
  {
    id: '4',
    rank: 4,
    user: {
      name: 'Michael Brown',
      age: 29,
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      location: 'Sydney, Australia',
      verified: false,
    },
    score: 82,
    quizType: 'Love Language',
    completedAt: '2 days ago',
  },
  {
    id: '5',
    rank: 5,
    user: {
      name: 'Jessica Davis',
      age: 26,
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      location: 'Toronto, Canada',
      verified: true,
    },
    score: 79,
    quizType: 'Love Language',
    completedAt: '3 days ago',
  },
  {
    id: '6',
    rank: 6,
    user: {
      name: 'David Wilson',
      age: 28,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      location: 'Berlin, Germany',
      verified: false,
    },
    score: 76,
    quizType: 'Love Language',
    completedAt: '4 days ago',
  },
];

export default function LeaderboardScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const [animatedValues] = useState(
    mockLeaderboard.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    // Animate leaderboard entries
    const animations = animatedValues.map((animatedValue, index) => 
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      })
    );
    
    Animated.stagger(50, animations).start();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleViewProfile = (userId: string) => {
    console.log('View profile:', userId);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return { icon: 'trophy', color: '#FFD700', bgColor: '#FFF9E6' };
      case 2:
        return { icon: 'medal', color: '#C0C0C0', bgColor: '#F5F5F5' };
      case 3:
        return { icon: 'medal', color: '#CD7F32', bgColor: '#FFF4E6' };
      default:
        return { icon: 'person', color: '#666', bgColor: '#F0F0F0' };
    }
  };

  const topThree = mockLeaderboard.slice(0, 3);
  const restOfLeaderboard = mockLeaderboard.slice(3);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <LinearGradient
        colors={['#FF4458', '#FF6B7A']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Leaderboard</Text>
            <Text style={styles.headerSubtitle}>Love Language Quiz</Text>
          </View>
          
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          {(['weekly', 'monthly', 'all'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.tabButtonActive
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Top 3 Podium */}
        <View style={styles.podiumContainer}>
          <Text style={styles.sectionTitle}>Top Performers</Text>
          
          <View style={styles.podium}>
            {/* Second Place */}
            {topThree[1] && (
              <Animated.View 
                style={[
                  styles.podiumItem,
                  styles.secondPlace,
                  {
                    opacity: animatedValues[1],
                    transform: [{
                      translateY: animatedValues[1].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      })
                    }]
                  }
                ]}
              >
                <View style={styles.podiumRank}>
                  <Text style={styles.podiumRankText}>2</Text>
                </View>
                <Image source={{ uri: topThree[1].user.photo }} style={styles.podiumAvatar} />
                <Text style={styles.podiumName}>{topThree[1].user.name}</Text>
                <Text style={styles.podiumScore}>{topThree[1].score}%</Text>
              </Animated.View>
            )}
            
            {/* First Place */}
            {topThree[0] && (
              <Animated.View 
                style={[
                  styles.podiumItem,
                  styles.firstPlace,
                  {
                    opacity: animatedValues[0],
                    transform: [{
                      translateY: animatedValues[0].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      })
                    }]
                  }
                ]}
              >
                <View style={styles.crownContainer}>
                  <MaterialIcons name="emoji-events" size={24} color="#FFD700" />
                </View>
                <View style={styles.podiumRank}>
                  <Text style={styles.podiumRankText}>1</Text>
                </View>
                <Image source={{ uri: topThree[0].user.photo }} style={styles.podiumAvatar} />
                <Text style={styles.podiumName}>{topThree[0].user.name}</Text>
                <Text style={styles.podiumScore}>{topThree[0].score}%</Text>
              </Animated.View>
            )}
            
            {/* Third Place */}
            {topThree[2] && (
              <Animated.View 
                style={[
                  styles.podiumItem,
                  styles.thirdPlace,
                  {
                    opacity: animatedValues[2],
                    transform: [{
                      translateY: animatedValues[2].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      })
                    }]
                  }
                ]}
              >
                <View style={styles.podiumRank}>
                  <Text style={styles.podiumRankText}>3</Text>
                </View>
                <Image source={{ uri: topThree[2].user.photo }} style={styles.podiumAvatar} />
                <Text style={styles.podiumName}>{topThree[2].user.name}</Text>
                <Text style={styles.podiumScore}>{topThree[2].score}%</Text>
              </Animated.View>
            )}
          </View>
        </View>

        {/* Full Leaderboard */}
        <View style={styles.leaderboardContainer}>
          <Text style={styles.sectionTitle}>Complete Rankings</Text>
          
          {mockLeaderboard.map((entry, index) => {
            const rankData = getRankIcon(entry.rank);
            
            return (
              <Animated.View
                key={entry.id}
                style={[
                  styles.leaderboardItem,
                  entry.isCurrentUser && styles.currentUserItem,
                  {
                    opacity: animatedValues[index],
                    transform: [{
                      translateX: animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [100, 0],
                      })
                    }]
                  }
                ]}
              >
                <View style={styles.rankSection}>
                  <View style={[styles.rankIcon, { backgroundColor: rankData.bgColor }]}>
                    {entry.rank <= 3 ? (
                      <MaterialIcons name={rankData.icon as any} size={20} color={rankData.color} />
                    ) : (
                      <Text style={[styles.rankNumber, { color: rankData.color }]}>
                        {entry.rank}
                      </Text>
                    )}
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.userSection}
                  onPress={() => handleViewProfile(entry.id)}
                >
                  <Image source={{ uri: entry.user.photo }} style={styles.userAvatar} />
                  <View style={styles.userInfo}>
                    <View style={styles.nameRow}>
                      <Text style={[
                        styles.userName,
                        entry.isCurrentUser && styles.currentUserName
                      ]}>
                        {entry.user.name}
                        {entry.user.age && `, ${entry.user.age}`}
                      </Text>
                      {entry.user.verified && (
                        <Ionicons name="checkmark-circle" size={16} color="#007AFF" style={styles.verifiedIcon} />
                      )}
                    </View>
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={12} color="#666" />
                      <Text style={styles.userLocation}>{entry.user.location}</Text>
                    </View>
                    <Text style={styles.completedTime}>{entry.completedAt}</Text>
                  </View>
                </TouchableOpacity>
                
                <View style={styles.scoreSection}>
                  <Text style={[
                    styles.score,
                    entry.isCurrentUser && styles.currentUserScore
                  ]}>
                    {entry.score}%
                  </Text>
                  <View style={styles.scoreBar}>
                    <View 
                      style={[
                        styles.scoreBarFill,
                        { width: `${entry.score}%` },
                        entry.isCurrentUser && styles.currentUserScoreBar
                      ]} 
                    />
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.retakeButton} onPress={() => router.push('/quiz/quiz-questions')}>
          <Ionicons name="refresh" size={20} color="#666" />
          <Text style={styles.retakeButtonText}>Retake Quiz</Text>
        </TouchableOpacity>
        
        <LinearGradient
          colors={['#FF4458', '#FF6B7A']}
          style={styles.shareButton}
        >
          <TouchableOpacity style={styles.shareButtonInner}>
            <Ionicons name="share-social" size={20} color="white" />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  tabTextActive: {
    color: '#FF4458',
  },
  scrollView: {
    flex: 1,
  },
  podiumContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 200,
  },
  podiumItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    flex: 1,
  },
  firstPlace: {
    marginBottom: 0,
  },
  secondPlace: {
    marginBottom: 20,
  },
  thirdPlace: {
    marginBottom: 40,
  },
  crownContainer: {
    position: 'absolute',
    top: -12,
    zIndex: 1,
  },
  podiumRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF4458',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  podiumRankText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: 'white',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumScore: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF4458',
  },
  leaderboardContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#FF4458',
    backgroundColor: '#FFF5F6',
  },
  rankSection: {
    marginRight: 16,
  },
  rankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  userSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  currentUserName: {
    color: '#FF4458',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  completedTime: {
    fontSize: 12,
    color: '#999',
  },
  scoreSection: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  score: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  currentUserScore: {
    color: '#FF4458',
  },
  scoreBar: {
    width: 50,
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  currentUserScoreBar: {
    backgroundColor: '#FF4458',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  shareButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  shareButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
});