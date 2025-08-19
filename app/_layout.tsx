import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/useColorScheme';
import { store } from '@/store';
import { CallProvider, useCall } from '@/contexts/CallContext';
import GlobalCallCard from '@/components/GlobalCallCard';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <CallProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="splash" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="chat/conversation" options={{ headerShown: false }} />
              <Stack.Screen name="quiz/quiz-detail" options={{headerShown:false}}/>
               <Stack.Screen name="quiz/quiz-questions" options={{headerShown:false}}/>
                <Stack.Screen name="quiz/quiz-completed" options={{headerShown:false}}/>
                 <Stack.Screen name="quiz/leaderboard" options={{headerShown:false}}/>
                 <Stack.Screen name='location' options={{headerShown:false}}/>
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
            <GlobalCallCardWrapper />
          </ThemeProvider>
        </CallProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

// Wrapper component to use the call context
function GlobalCallCardWrapper() {
  const { callState, endCall, expandCall, minimizeCall, toggleMute, toggleVideo, toggleSpeaker } = useCall();
  
  return (
    <GlobalCallCard
      callState={callState}
      onExpand={expandCall}
      onMinimize={minimizeCall}
      onEndCall={endCall}
      onToggleMute={toggleMute}
      onToggleVideo={toggleVideo}
      onToggleSpeaker={toggleSpeaker}
    />
  );
}
