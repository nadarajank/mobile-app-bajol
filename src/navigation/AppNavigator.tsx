import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { hydrateSession } from "../features/auth/authSlice";
import { loadSession } from "../storage/sessionStorage";
import { colors } from "../theme/colors";
import { useLanguage } from "../localization/LanguageContext";
import { AboutScreen } from "../screens/AboutScreen";
import { CompleteProfileScreen } from "../screens/CompleteProfileScreen";
import { ConclusionScreen } from "../screens/ConclusionScreen";
import { DiscoveryScreen } from "../screens/DiscoveryScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { NotFoundScreen } from "../screens/NotFoundScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { PrivacyPolicyScreen } from "../screens/PrivacyPolicyScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { RulesScreen } from "../screens/RulesScreen";
import { UploadPhotoScreen } from "../screens/UploadPhotoScreen";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  About: undefined;
  Rules: undefined;
  Conclusion: undefined;
  PrivacyPolicy: undefined;
  Onboarding: undefined;
  NotFound: undefined;
  CompleteProfile: { userId: number; initialData?: Record<string, unknown> };
  Discovery: undefined;
  UploadPhoto: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Bootstrap() {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const { copy } = useLanguage();

  useEffect(() => {
    loadSession()
      .then((session) => {
        dispatch(
          hydrateSession({
            token: session.token,
            user: (session.user as Record<string, unknown> | null) ?? null,
          }),
        );
      })
      .catch(() => {
        dispatch(hydrateSession({ token: null, user: null }));
      });
  }, [dispatch]);

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>{copy.common.loading}</Text>
      </View>
    );
  }

  return <NavigatorContent />;
}

function NavigatorContent() {
  const token = useAppSelector((state) => state.auth.token);
  const { copy } = useLanguage();

  if (token) {
    return (
      <Stack.Navigator
        id="auth-stack"
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: copy.nav.home }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: copy.nav.login }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: copy.nav.register }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: copy.nav.profile }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: copy.nav.about }} />
        <Stack.Screen name="Rules" component={RulesScreen} options={{ title: copy.nav.rules }} />
        <Stack.Screen
          name="Conclusion"
          component={ConclusionScreen}
          options={{ title: copy.nav.conclusion }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{ title: copy.nav.privacyPolicy }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ title: copy.nav.onboarding }}
        />
        <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: copy.nav.notFound }} />
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
          options={{ title: copy.nav.completeProfile }}
        />
        <Stack.Screen name="Discovery" component={DiscoveryScreen} options={{ title: copy.nav.discovery }} />
        <Stack.Screen name="UploadPhoto" component={UploadPhotoScreen} options={{ title: copy.nav.uploadPhoto }} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      id="guest-stack"
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: copy.nav.home }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: copy.nav.login }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: copy.nav.register }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: copy.nav.about }} />
      <Stack.Screen name="Rules" component={RulesScreen} options={{ title: copy.nav.rules }} />
      <Stack.Screen
        name="Conclusion"
        component={ConclusionScreen}
        options={{ title: copy.nav.conclusion }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: copy.nav.privacyPolicy }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ title: copy.nav.onboarding }}
      />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: copy.nav.notFound }} />
      <Stack.Screen
        name="CompleteProfile"
        component={CompleteProfileScreen}
        options={{ title: copy.nav.completeProfile }}
      />
      <Stack.Screen name="Discovery" component={DiscoveryScreen} options={{ title: copy.nav.discovery }} />
      <Stack.Screen name="UploadPhoto" component={UploadPhotoScreen} options={{ title: copy.nav.uploadPhoto }} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Bootstrap />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    gap: 12,
    justifyContent: "center",
  },
  loadingText: {
    color: colors.muted,
    fontSize: 16,
  },
});
