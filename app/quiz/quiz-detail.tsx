import React from 'react';
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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function QuizDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Mock quiz data - in real app this would come from params or API
  const quizData = {
    title: "Love Language Quiz",
    description: "Discover your love language and see how compatible you are with your match!",
    duration: "5 min",
    questions: 12,
    participants: 2847,
    difficulty: "Easy",
    category: "Personality",
    user: {
      name: "John Smith",
      age: 23,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      location: "Paris, France"
    }
  };

  const handleStartQuiz = () => {
    router.push('/quiz/quiz-questions');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header with background image */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['rgba(255,68,88,0.9)', 'rgba(255,107,122,0.9)']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Quiz Details</Text>
            </View>
            
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quiz Info Card */}
        <View style={styles.quizCard}>
          <View style={styles.quizIconContainer}>
            <LinearGradient
              colors={['#FF4458', '#FF6B7A']}
              style={styles.quizIcon}
            >
              <MaterialIcons name="quiz" size={32} color="white" />
            </LinearGradient>
          </View>
          
          <Text style={styles.quizTitle}>{quizData.title}</Text>
          <Text style={styles.quizDescription}>{quizData.description}</Text>
          
          {/* Quiz Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.statText}>{quizData.duration}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="help-circle-outline" size={20} color="#666" />
              <Text style={styles.statText}>{quizData.questions} questions</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={20} color="#666" />
              <Text style={styles.statText}>{quizData.participants.toLocaleString()} played</Text>
            </View>
          </View>
        </View>

        {/* Quiz Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Quiz Information</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Difficulty:</Text>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{quizData.difficulty}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{quizData.category}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Questions:</Text>
            <Text style={styles.detailValue}>{quizData.questions}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{quizData.duration}</Text>
          </View>
        </View>

        {/* Challenger Info */}
        <View style={styles.challengerCard}>
          <Text style={styles.sectionTitle}>Quiz Challenger</Text>
          
          <View style={styles.challengerInfo}>
            <Image source={{ uri: quizData.user.photo }} style={styles.challengerAvatar} />
            <View style={styles.challengerDetails}>
              <Text style={styles.challengerName}>{quizData.user.name}, {quizData.user.age}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.challengerLocation}>{quizData.user.location}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewProfileButton}>
              <Text style={styles.viewProfileText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rules */}
        <View style={styles.rulesCard}>
          <Text style={styles.sectionTitle}>Quiz Rules</Text>
          
          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>1</Text>
            </View>
            <Text style={styles.ruleText}>Answer all questions honestly</Text>
          </View>
          
          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>2</Text>
            </View>
            <Text style={styles.ruleText}>You have unlimited time per question</Text>
          </View>
          
          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>3</Text>
            </View>
            <Text style={styles.ruleText}>Results will be shared with your match</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomContainer}>
        <LinearGradient
          colors={['#FF4458', '#FF6B7A']}
          style={styles.startButton}
        >
          <TouchableOpacity style={styles.startButtonInner} onPress={handleStartQuiz}>
            <Text style={styles.startButtonText}>Start Quiz</Text>
            <Ionicons name="arrow-forward" size={20} color="white" style={styles.startButtonIcon} />
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
  headerContainer: {
    height: 100,
  },
  headerGradient: {
    flex: 1,
    // paddingTop: 44,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  quizCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  quizIconContainer: {
    marginBottom: 16,
  },
  quizIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  difficultyBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  challengerCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  challengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  challengerDetails: {
    flex: 1,
  },
  challengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengerLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  viewProfileButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  rulesCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 100,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ruleNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF4458',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ruleNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  ruleText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },
  startButtonIcon: {
    marginLeft: 4,
  },
});