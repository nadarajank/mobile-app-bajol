import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "NotFound">;

export function NotFoundScreen({ navigation }: Props) {
  return (
    <Screen>
      <Card>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Screen not found</Text>
        <Text style={styles.body}>The screen you are looking for is not available in the mobile app.</Text>
        <View style={styles.gap} />
        <Button label="Go Home" onPress={() => navigation.navigate("Home")} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  code: {
    color: colors.primary,
    fontSize: 56,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  gap: {
    height: 16,
  },
});
