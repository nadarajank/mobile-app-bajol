import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "About">;

const aboutText = `Dear Sir / Madam,

The heartfelt gratitude and thankfulness are being presented by madam BAJOL ONLINE APP on the outset of this venture.

What does BAJOL mean shall be clarified here concisely.
In our society, so many males and females are being astrayed in pursuit of finding an ideal couple, after they are being driven, by manipulated, and thereby happened to be married in disharmony.

Assist you too instead, BAJOL is endeavoring to detect apt and appropriate spouse in your personal life.
Through this platform each one of you can have a healthy, happy, colorful, and glorious married life.

Those who aspire to be married, whether it is the first time or second time, by making a nominal payment, you will be able to enter the app and access appropriate future brides and grooms within the states and countries abroad.

But herein, BAJOL is creating a reliable platform, whereby being levied a small amount, the needy can utilize unlimited services both domestically and internationally.`;

export function AboutScreen({ navigation }: Props) {
  return (
    <Screen>
      <Card>
        <Text style={styles.title}>About Bajol</Text>
        <Text style={styles.body}>{aboutText}</Text>
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
