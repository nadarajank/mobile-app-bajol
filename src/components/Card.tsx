import React, { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../theme/colors";

export function Card({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 3,
    marginBottom: 20,
    marginTop: 20,
  },
});
