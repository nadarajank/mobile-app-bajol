import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../theme/colors";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  loading?: boolean;
};

export function Button({ label, loading, onPress, variant = "primary" }: Props) {
  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      style={[styles.button, variant === "secondary" && styles.secondary]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? colors.primary : colors.white} />
      ) : (
        <Text style={[styles.label, variant === "secondary" && styles.secondaryLabel]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  label: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryLabel: {
    color: colors.primary,
  },
});
