import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Rules">;

const rulesText = `1. ആരും അവരുടെ വിവാഹ ലക്ഷ്യത്തിനായി മാത്രമേ ഈ ആപ്പ് തുറന്ന് ഉപയോഗിക്കരുത്.

2. ഗാലറി നമ്പർ ഏതെങ്കിലും സാഹചര്യത്തിലും ദുരുപയോഗം ചെയ്യരുത്; ചെയ്താൽ നിയമാനുസൃത നടപടികൾ ഉണ്ടായിരിക്കും.

നന്ദി`;

export function RulesScreen({ navigation }: Props) {
  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Terms and Rules</Text>
        <Text style={styles.body}>{rulesText}</Text>
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
    lineHeight: 28,
  },
  gap: {
    height: 16,
  },
});
