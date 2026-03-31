import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";

type Props = {
  label: string;
  value?: string;
  placeholder: string;
  onPress: () => void;
  error?: string;
};

export function PickerField({ error, label, onPress, placeholder, value }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={onPress} style={[styles.trigger, error && styles.triggerError]}>
        <Text style={[styles.value, !value && styles.placeholder]}>{value || placeholder}</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  trigger: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  triggerError: {
    borderColor: colors.danger,
  },
  value: {
    color: colors.text,
    fontSize: 16,
  },
  placeholder: {
    color: colors.muted,
  },
  error: {
    color: colors.danger,
    marginTop: 6,
  },
});
