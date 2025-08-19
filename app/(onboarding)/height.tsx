import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { AppColors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';

export default function HeightScreen() {
  const [selectedFeet, setSelectedFeet] = useState(5);
  const [selectedInches, setSelectedInches] = useState(6);
  const [showFeetPicker, setShowFeetPicker] = useState(false);
  const [showInchesPicker, setShowInchesPicker] = useState(false);

  // Generate height options
  const feetOptions = Array.from({ length: 4 }, (_, i) => i + 4); // 4-7 feet
  const inchesOptions = Array.from({ length: 12 }, (_, i) => i); // 0-11 inches

  const formatHeight = (feet: number, inches: number) => {
    return `${feet}'${inches}"`;
  };

  const convertToCm = (feet: number, inches: number) => {
    const totalInches = feet * 12 + inches;
    const cm = Math.round(totalInches * 2.54);
    return cm;
  };

  const handleContinue = () => {
    // Save height to store/context
    const heightData = {
      feet: selectedFeet,
      inches: selectedInches,
      cm: convertToCm(selectedFeet, selectedInches),
      display: formatHeight(selectedFeet, selectedInches),
    };
    
    router.push('/(onboarding)/profession');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '56%' }]} />
          </View>
          <Text style={styles.progressText}>4 of 7</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>How tall are you?</Text>
          <Text style={styles.subtitle}>
            Your height will be displayed on your profile
          </Text>
        </View>

        <View style={styles.heightContainer}>
          <View style={styles.heightDisplay}>
            <Text style={styles.heightText}>
              {formatHeight(selectedFeet, selectedInches)}
            </Text>
            <Text style={styles.heightCm}>
              ({convertToCm(selectedFeet, selectedInches)} cm)
            </Text>
          </View>

          <View style={styles.pickersContainer}>
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Feet</Text>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => setShowFeetPicker(true)}
              >
                <Text style={styles.pickerButtonText}>{selectedFeet} ft</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Inches</Text>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => setShowInchesPicker(true)}
              >
                <Text style={styles.pickerButtonText}>{selectedInches} in</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Feet Picker Modal */}
          <Modal
            visible={showFeetPicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowFeetPicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowFeetPicker(false)}>
                    <Text style={styles.modalButton}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Select Feet</Text>
                  <TouchableOpacity onPress={() => setShowFeetPicker(false)}>
                    <Text style={[styles.modalButton, styles.modalButtonPrimary]}>Done</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.optionsContainer}>
                  {feetOptions.map((feet) => (
                    <TouchableOpacity
                      key={feet}
                      style={[styles.optionItem, selectedFeet === feet && styles.optionItemSelected]}
                      onPress={() => {
                        setSelectedFeet(feet);
                        setShowFeetPicker(false);
                      }}
                    >
                      <Text style={[styles.optionText, selectedFeet === feet && styles.optionTextSelected]}>
                        {feet} ft
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Inches Picker Modal */}
          <Modal
            visible={showInchesPicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowInchesPicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowInchesPicker(false)}>
                    <Text style={styles.modalButton}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Select Inches</Text>
                  <TouchableOpacity onPress={() => setShowInchesPicker(false)}>
                    <Text style={[styles.modalButton, styles.modalButtonPrimary]}>Done</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.optionsContainer}>
                  {inchesOptions.map((inches) => (
                    <TouchableOpacity
                      key={inches}
                      style={[styles.optionItem, selectedInches === inches && styles.optionItemSelected]}
                      onPress={() => {
                        setSelectedInches(inches);
                        setShowInchesPicker(false);
                      }}
                    >
                      <Text style={[styles.optionText, selectedInches === inches && styles.optionTextSelected]}>
                        {inches} in
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            💡 Tip: Being honest about your height helps create better matches and builds trust.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            onPress={handleBack}
            variant="outline"
            style={styles.backButton}
          />
          <Button
            title="Continue"
            onPress={handleContinue}
            style={styles.continueButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: AppColors.gray[200],
    borderRadius: 2,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    color: AppColors.gray[600],
    fontWeight: Typography.fontWeight.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  titleContainer: {
    marginBottom: Spacing.xxxl,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: AppColors.gray[900],
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: AppColors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  heightContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  heightDisplay: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    backgroundColor: AppColors.primary + '10',
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    minWidth: 200,
  },
  heightText: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: AppColors.primary,
    marginBottom: Spacing.xs,
  },
  heightCm: {
    fontSize: Typography.fontSize.md,
    color: AppColors.gray[600],
    fontWeight: Typography.fontWeight.medium,
  },
  pickersContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    width: '100%',
    justifyContent: 'center',
  },
  pickerWrapper: {
    flex: 1,
    maxWidth: 120,
  },
  pickerLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: AppColors.gray[700],
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  pickerContainer: {
    backgroundColor: AppColors.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.gray[200],
    overflow: 'hidden',
  },
  pickerButton: {
    backgroundColor: AppColors.gray[50],
    borderWidth: 1,
    borderColor: AppColors.gray[200],
    borderRadius: 12,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  pickerButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: AppColors.gray[700],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: AppColors.gray[900],
  },
  modalButton: {
    fontSize: Typography.fontSize.md,
    color: AppColors.gray[600],
    fontWeight: Typography.fontWeight.medium,
  },
  modalButtonPrimary: {
    color: AppColors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  optionsContainer: {
    maxHeight: 200,
  },
  optionItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[100],
  },
  optionItemSelected: {
    backgroundColor: AppColors.primary + '10',
  },
  optionText: {
    fontSize: Typography.fontSize.md,
    color: AppColors.gray[700],
    textAlign: 'center',
  },
  optionTextSelected: {
    color: AppColors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  noteContainer: {
    backgroundColor: AppColors.gray[50],
    borderRadius: 12,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
  },
  noteText: {
    fontSize: Typography.fontSize.sm,
    color: AppColors.gray[600],
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  backButton: {
    flex: 1,
  },
  continueButton: {
    flex: 2,
  },
});