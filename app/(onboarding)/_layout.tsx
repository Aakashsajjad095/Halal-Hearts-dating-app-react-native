import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="name" options={{ headerShown: false }} />
        <Stack.Screen name="dob" options={{ headerShown: false }} />
        <Stack.Screen name="gender" options={{ headerShown: false }} />
        <Stack.Screen name="height" options={{ headerShown: false }} />
        <Stack.Screen name="profession" options={{ headerShown: false }} />
        <Stack.Screen name="marital-status" options={{ headerShown: false }} />
        <Stack.Screen name="religious-level" options={{ headerShown: false }} />
        <Stack.Screen name="pray-frequency" options={{ headerShown: false }} />
        <Stack.Screen name="sect" options={{ headerShown: false }} />
        <Stack.Screen name="marriage-intention" options={{ headerShown: false }} />
        <Stack.Screen name="personality" options={{ headerShown: false }} />
        <Stack.Screen name="interests" options={{ headerShown: false }} />
      <Stack.Screen name="photos" options={{ headerShown: false }} />
      <Stack.Screen name="location" options={{ headerShown: false }} />
    </Stack>
  );
}