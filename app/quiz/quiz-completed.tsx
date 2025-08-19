import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface QuizResult {
  category: string;
  percentage: number;
  description: string;
  color: string;
}

const mockResults: QuizResult[] = [
  {
    category: "Quality Time",
    percentage: 85,
    description: "You value spending meaningful time together",
    color: "#FF4458"
  },
  {
    category: "Words of Affirmation",
    percentage: 72,
    description: "You appreciate verbal expressions of love",
    color: "#4CAF50"
  },
  {
    category: "Physical Touch",
    percentage: 68,
    description: "You feel loved through physical connection",
    color: "#2196F3"
  },
  {
    category: "Acts of Service",
    percentage: 45,
    description: "You appreciate helpful actions",
    color: "#FF9800"
  },
  {
    category: "Receiving Gifts",
    percentage: 30,
    description: "You value thoughtful presents",
    color: "#9C27B0"
  }
];

export default function QuizCompletedScreen() {
  const router = useRouter();
  const [animatedValues] = useState(
    mockResults.map(() => new Animated.Value(0))
  );
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Delay showing results for dramatic effect
    const timer = setTimeout(() => {
      setShowResults(true);
      
      // Animate each result bar
      const animations = animatedValues.map((animatedValue, index) => 
        Animated.timing(animatedValue, {
          toValue: mockResults[index].percentage,
          duration: 1000,
          delay: index * 200,
          useNativeDriver: false,
        })
      );
      
      Animated.stagger(100, animations).start();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleDone = () => {
    router.push('/quiz/leaderboard');
  };

  const handleShareResults = () => {
    console.log('Share results');
  };

  const handleRetakeQuiz = () => {
    router.push('/quiz/quiz-questions');
  };

  const topResult = mockResults[0];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <LinearGradient
        colors={['#FF4458', '#FF6B7A']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Quiz Completed!</Text>
          
          <TouchableOpacity style={styles.shareButton} onPress={handleShareResults}>
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Celebration Section */}
        <View style={styles.celebrationContainer}>
          <View style={styles.celebrationIcon}>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.trophyBackground}
            >
              <MaterialIcons name="emoji-events" size={48} color="white" />
            </LinearGradient>
          </View>
          
          <Text style={styles.congratsText}>Congratulations!</Text>
          <Text style={styles.completedText}>You've completed the Love Language Quiz</Text>
        </View>

        {/* Main Result Card */}
        <View style={styles.mainResultCard}>
          <Text style={styles.resultTitle}>Your Primary Love Language</Text>
          
          <View style={styles.primaryResult}>
            <View style={[styles.resultCircle, { borderColor: topResult.color }]}>
              <Text style={[styles.resultPercentage, { color: topResult.color }]}>
                {topResult.percentage}%
              </Text>
            </View>
            
            <View style={styles.resultInfo}>
              <Text style={styles.resultCategory}>{topResult.category}</Text>
              <Text style={styles.resultDescription}>{topResult.description}</Text>
            </View>
          </View>
        </View>

        {/* Detailed Results */}
        <View style={styles.detailedResultsCard}>
          <Text style={styles.sectionTitle}>Complete Results</Text>
          
          {showResults && mockResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultName}>{result.category}</Text>
                <Animated.Text style={[styles.resultScore, { color: result.color }]}>
                  {animatedValues[index].interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  })}
                </Animated.Text>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <Animated.View 
                    style={[
                      styles.progressBar,
                      {
                        backgroundColor: result.color,
                        width: animatedValues[index].interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                          extrapolate: 'clamp',
                        })
                      }
                    ]}
                  />
                </View>
              </View>
              
              <Text style={styles.resultItemDescription}>{result.description}</Text>
            </View>
          ))}
        </View>

        {/* Compatibility Section */}
        <View style={styles.compatibilityCard}>
          <Text style={styles.sectionTitle}>Compatibility Insight</Text>
          
          <View style={styles.compatibilityContent}>
            <View style={styles.compatibilityIcon}>
              <Ionicons name="heart" size={24} color="#FF4458" />
            </View>
            
            <View style={styles.compatibilityText}>
              <Text style={styles.compatibilityTitle}>Great Match Potential!</Text>
              <Text style={styles.compatibilityDescription}>
                Your love language profile shows strong compatibility with your match. 
                You both value quality time and meaningful connections.
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetakeQuiz}>
            <Ionicons name="refresh" size={20} color="#666" />
            <Text style={styles.retakeButtonText}>Retake Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareResultsButton} onPress={handleShareResults}>
            <Ionicons name="share-social" size={20} color="#666" />
            <Text style={styles.shareResultsButtonText}>Share Results</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomContainer}>
        <LinearGradient
          colors={['#FF4458', '#FF6B7A']}
          style={styles.doneButton}
        >
          <TouchableOpacity style={styles.doneButtonInner} onPress={handleDone}>
            <Text style={styles.doneButtonText}>View Leaderboard</Text>
            <Ionicons name="arrow-forward" size={20} color="white" style={styles.doneButtonIcon} />
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
    paddingTop: 15,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  shareButton: {
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
  celebrationContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  celebrationIcon: {
    marginBottom: 20,
  },
  trophyBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  completedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  mainResultCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryResult: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  resultPercentage: {
    fontSize: 20,
    fontWeight: '700',
  },
  resultInfo: {
    flex: 1,
  },
  resultCategory: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  detailedResultsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
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
    marginBottom: 20,
  },
  resultItem: {
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  resultScore: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  resultItemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  compatibilityCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
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
  compatibilityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  compatibilityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  compatibilityText: {
    flex: 1,
  },
  compatibilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  compatibilityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 100,
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
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
  shareResultsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  shareResultsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
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
  doneButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  doneButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },
  doneButtonIcon: {
    marginLeft: 4,
  },
});