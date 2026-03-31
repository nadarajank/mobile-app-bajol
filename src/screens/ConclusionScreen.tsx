import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Conclusion">;

const conclusionText = `BAJOL bless the people all over the world, to have fast and speedy matrimonial relationships.

BAJOL APP has been designed and formulated with a divine interaction. We hope you all may have a rejoicing married life by having brides and groom divinely united.

BAJOL will always be with you with prayers and benedictions.`;

export function ConclusionScreen({ navigation }: Props) {
  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Conclusion</Text>
        <Text style={styles.body}>{conclusionText}</Text>
        <View style={styles.gap} />
        <Button label="Back" onPress={() => navigation.goBack()} />
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
