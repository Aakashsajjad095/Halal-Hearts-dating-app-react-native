import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface Question {
  id: number;
  question: string;
  options: string[];
}

const mockQuestions: Question[] = [
  {
    id: 1,
    question: "What's your ideal way to spend a weekend?",
    options: [
      "Exploring a new city or neighborhood",
      "Relaxing at home with a good book",
      "Having an adventure outdoors",
      "Spending quality time with friends"
    ]
  },
  {
    id: 2,
    question: "How do you prefer to receive affection?",
    options: [
      "Physical touch and hugs",
      "Words of affirmation",
      "Quality time together",
      "Thoughtful gifts"
    ]
  },
  {
    id: 3,
    question: "What's most important in a relationship?",
    options: [
      "Trust and honesty",
      "Shared interests and hobbies",
      "Physical attraction",
      "Emotional connection"
    ]
  },
  {
    id: 4,
    question: "How do you handle disagreements?",
    options: [
      "Talk it out immediately",
      "Take time to think first",
      "Find a compromise",
      "Agree to disagree"
    ]
  },
  {
    id: 5,
    question: "What's your communication style?",
    options: [
      "Direct and straightforward",
      "Gentle and considerate",
      "Playful and humorous",
      "Deep and meaningful"
    ]
  }
];

export default function QuizQuestionsScreen() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progress, {
      toValue: (currentQuestion + 1) / mockQuestions.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestion]: selectedOption
      }));
      
      if (currentQuestion < mockQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        // Quiz completed, navigate to results
        router.push('/quiz/quiz-completed');
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedOption(selectedAnswers[currentQuestion - 1] || null);
    } else {
      router.back();
    }
  };

  const currentQ = mockQuestions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / mockQuestions.length) * 100;

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
            <Text style={styles.headerTitle}>Love Language Quiz</Text>
            <Text style={styles.questionCounter}>
              Question {currentQuestion + 1} of {mockQuestions.length}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View 
              style={[
                styles.progressFill,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  })
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progressPercentage)}%</Text>
        </View>
      </LinearGradient>

      {/* Question Content */}
      <View style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQ.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQ.options.map((option, index) => {
            const isSelected = selectedOption === index;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected
                ]}
                onPress={() => handleOptionSelect(index)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionCircle,
                    isSelected && styles.optionCircleSelected
                  ]}>
                    {isSelected && (
                      <View style={styles.optionCircleInner} />
                    )}
                  </View>
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomContainer}>
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[
              styles.navButton,
              currentQuestion === 0 && styles.navButtonDisabled
            ]}
            onPress={handleBack}
            disabled={currentQuestion === 0}
          >
            <Text style={[
              styles.navButtonText,
              currentQuestion === 0 && styles.navButtonTextDisabled
            ]}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <LinearGradient
            colors={selectedOption !== null ? ['#FF4458', '#FF6B7A'] : ['#ccc', '#ccc']}
            style={[
              styles.nextButton,
              selectedOption === null && styles.nextButtonDisabled
            ]}
          >
            <TouchableOpacity 
              style={styles.nextButtonInner}
              onPress={handleNext}
              disabled={selectedOption === null}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestion === mockQuestions.length - 1 ? 'Finish' : 'Next'}
              </Text>
              <Ionicons 
                name={currentQuestion === mockQuestions.length - 1 ? 'checkmark' : 'arrow-forward'} 
                size={20} 
                color="white" 
                style={styles.nextButtonIcon} 
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>
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
    marginBottom: 4,
  },
  questionCounter: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    minWidth: 40,
    textAlign: 'right',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    lineHeight: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionButtonSelected: {
    borderColor: '#FF4458',
    backgroundColor: '#FFF5F6',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCircleSelected: {
    borderColor: '#FF4458',
  },
  optionCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4458',
  },
  optionText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    lineHeight: 22,
  },
  optionTextSelected: {
    color: '#333',
    fontWeight: '600',
  },
  bottomContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 120,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },
  nextButtonIcon: {
    marginLeft: 4,
  },
});