import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/useUserStore';
import { modern, fonts } from '@/constants/Theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    VT323_400Regular,
    PressStart2P_400Regular,
  });

  const setSession = useUserStore((s) => s.setSession);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    // Bootstrap auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  const headerTheme = {
    headerStyle: { backgroundColor: modern.background },
    headerTintColor: modern.textPrimary,
    headerTitleStyle: { fontFamily: fonts.body, fontSize: 18, fontWeight: '700' as const },
  };

  return (
    <Stack screenOptions={headerTheme}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: 'Profile', presentation: 'card' }} />
      <Stack.Screen name="shop" options={{ title: 'Shop', presentation: 'card' }} />
      <Stack.Screen name="inventory" options={{ title: 'Inventory', presentation: 'card' }} />
      <Stack.Screen name="about" options={{ title: 'About', presentation: 'card' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings', presentation: 'card' }} />
      <Stack.Screen name="habit/[id]" options={{ title: 'Habit', presentation: 'card' }} />
      <Stack.Screen name="check-in/[id]" options={{ title: 'Check In', presentation: 'modal' }} />
      <Stack.Screen name="reflection/[id]" options={{ title: 'Reflection', presentation: 'modal' }} />
      <Stack.Screen name="timeline/[id]" options={{ title: 'Timeline', presentation: 'card' }} />
      <Stack.Screen name="goal/[id]" options={{ title: 'Goal', presentation: 'card' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
