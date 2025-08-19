import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Small delay to ensure Root Layout is mounted
      const timer = setTimeout(() => {
        router.replace('/splash');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
}