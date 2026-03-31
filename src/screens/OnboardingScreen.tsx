import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export function OnboardingScreen({ navigation }: Props) {
  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Profile Completion Flow</Text>
        <Text style={styles.body}>
          The mobile app now includes the real profile completion screen, image upload path, and
          profile discovery flow. Payment purchase still needs a separate React Native payment SDK
          implementation and is the main remaining gap versus the web project.
        </Text>
        <View style={styles.gap} />
        <Button label="Discover Matches" onPress={() => navigation.navigate("Discovery")} />
        <View style={styles.gap} />
        <Button label="Back" onPress={() => navigation.goBack()} variant="secondary" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
  },
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 26,
  },
  gap: {
    height: 16,
  },
});
