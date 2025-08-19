import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { AppColors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';

export default function DateOfBirthScreen() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const isValidAge = () => {
    const age = calculateAge(date);
    return age >= 18 && age <= 100;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDateSelect = (year: number, month: number, day: number) => {
    const selectedDate = new Date(year, month, day);
    setDate(selectedDate);
    setHasSelected(true);
    setShowPicker(false);
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 18; year >= currentYear - 100; year--) {
      years.push(year);
    }
    return years;
  };

  const generateMonths = () => {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  };

  const generateDays = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const handleContinue = () => {
    if (isValidAge()) {
      // Save date of birth to store/context
      router.push('/(onboarding)/gender');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '28%' }]} />
          </View>
          <Text style={styles.progressText}>2 of 7</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>When's your birthday?</Text>
          <Text style={styles.subtitle}>
            Your age will be public, but your birthday won't be
          </Text>
        </View>

        <View style={styles.dateContainer}>
          <TouchableOpacity 
            style={[styles.dateButton, hasSelected && styles.dateButtonSelected]}
            onPress={showDatePicker}
          >
            <Text style={[styles.dateText, hasSelected && styles.dateTextSelected]}>
              {hasSelected ? formatDate(date) : 'Select your birthday'}
            </Text>
          </TouchableOpacity>
          
          {hasSelected && (
            <View style={styles.ageContainer}>
              <Text style={styles.ageText}>
                You are {calculateAge(date)} years old
              </Text>
              {!isValidAge() && (
                <Text style={styles.errorText}>
                  You must be between 18 and 100 years old
                </Text>
              )}
            </View>
          )}
        </View>

        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.modalButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => {
                  handleDateSelect(date.getFullYear(), date.getMonth(), date.getDate());
                }}>
                  <Text style={[styles.modalButton, styles.modalButtonPrimary]}>Done</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.datePickerContainer}>
                <Text style={styles.pickerLabel}>Select your birthday</Text>
                <View style={styles.dateInputs}>
                  <View style={styles.dateInputGroup}>
                    <Text style={styles.inputLabel}>Month</Text>
                    <ScrollView style={styles.scrollPicker} showsVerticalScrollIndicator={false}>
                      {generateMonths().map((month, index) => (
                        <TouchableOpacity
                          key={month}
                          style={[styles.pickerItem, date.getMonth() === index && styles.pickerItemSelected]}
                          onPress={() => setDate(new Date(date.getFullYear(), index, date.getDate()))}
                        >
                          <Text style={[styles.pickerItemText, date.getMonth() === index && styles.pickerItemTextSelected]}>
                            {month}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={styles.dateInputGroup}>
                    <Text style={styles.inputLabel}>Day</Text>
                    <ScrollView style={styles.scrollPicker} showsVerticalScrollIndicator={false}>
                      {generateDays(date.getFullYear(), date.getMonth()).map((day) => (
                        <TouchableOpacity
                          key={day}
                          style={[styles.pickerItem, date.getDate() === day && styles.pickerItemSelected]}
                          onPress={() => setDate(new Date(date.getFullYear(), date.getMonth(), day))}
                        >
                          <Text style={[styles.pickerItemText, date.getDate() === day && styles.pickerItemTextSelected]}>
                            {day}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={styles.dateInputGroup}>
                    <Text style={styles.inputLabel}>Year</Text>
                    <ScrollView style={styles.scrollPicker} showsVerticalScrollIndicator={false}>
                      {generateYears().map((year) => (
                        <TouchableOpacity
                          key={year}
                          style={[styles.pickerItem, date.getFullYear() === year && styles.pickerItemSelected]}
                          onPress={() => setDate(new Date(year, date.getMonth(), date.getDate()))}
                        >
                          <Text style={[styles.pickerItemText, date.getFullYear() === year && styles.pickerItemTextSelected]}>
                            {year}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
            disabled={!hasSelected || !isValidAge()}
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
  dateContainer: {
    alignItems: 'center',
  },
  dateButton: {
    backgroundColor: AppColors.gray[100],
    borderWidth: 2,
    borderColor: AppColors.gray[200],
    borderRadius: 12,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    minWidth: 280,
    alignItems: 'center',
  },
  dateButtonSelected: {
    backgroundColor: AppColors.primary + '10',
    borderColor: AppColors.primary,
  },
  dateText: {
    fontSize: Typography.fontSize.lg,
    color: AppColors.gray[500],
    fontWeight: Typography.fontWeight.medium,
  },
  dateTextSelected: {
    color: AppColors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  ageContainer: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  ageText: {
    fontSize: Typography.fontSize.md,
    color: AppColors.gray[700],
    fontWeight: Typography.fontWeight.medium,
  },
  errorText: {
    fontSize: Typography.fontSize.sm,
    color: AppColors.error,
    marginTop: Spacing.sm,
    textAlign: 'center',
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
    maxHeight: '70%',
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
  datePickerContainer: {
    padding: Spacing.lg,
  },
  pickerLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: AppColors.gray[700],
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  dateInputs: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dateInputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: AppColors.gray[600],
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  scrollPicker: {
    height: 150,
    backgroundColor: AppColors.gray[50],
    borderRadius: 8,
  },
  pickerItem: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: AppColors.primary + '20',
  },
  pickerItemText: {
    fontSize: Typography.fontSize.md,
    color: AppColors.gray[700],
  },
  pickerItemTextSelected: {
    color: AppColors.primary,
    fontWeight: Typography.fontWeight.semibold,
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