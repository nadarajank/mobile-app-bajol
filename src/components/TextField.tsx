import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "../theme/colors";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "number-pad" | "phone-pad";
  error?: string;
  editable?: boolean;
};

export function TextField({
  editable = true,
  error,
  keyboardType = "default",
  label,
  onChangeText,
  placeholder,
  secureTextEntry,
  value,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        editable={editable}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        style={[styles.input, error && styles.inputError, !editable && styles.inputDisabled]}
        value={value}
      />
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
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputDisabled: {
    backgroundColor: "#F1E9DF",
  },
  error: {
    color: colors.danger,
    marginTop: 6,
  },
});
