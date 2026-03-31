import React, { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useSubmitFormMutation } from "../api/formApi";
import { useAppDispatch } from "../store/hooks";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PickerField } from "../components/PickerField";
import { Screen } from "../components/Screen";
import { TextField } from "../components/TextField";
import { INDIAN_STATES } from "../constants/stateOptions";
import { setToken, setUser } from "../features/auth/authSlice";
import { setAuthUser } from "../features/form/formSlice";
import { RootStackParamList } from "../navigation/AppNavigator";
import { saveSession } from "../storage/sessionStorage";
import { colors } from "../theme/colors";
import { getIndianLocalNumber } from "../utils/validation";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

type RegisterValues = {
  mobile: string;
  state: string;
  password: string;
  confirmPassword: string;
  country: string;
};

export function RegisterScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [submitForm, { isLoading }] = useSubmitFormMutation();
  const [showStateModal, setShowStateModal] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    defaultValues: {
      mobile: "",
      state: "",
      password: "",
      confirmPassword: "",
      country: "India",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = {
        ...values,
        mobile: getIndianLocalNumber(values.mobile),
      };
      const result = await submitForm(payload).unwrap();
      const token = result?.data?.token || null;
      const user = result?.data || null;

      if (token) {
        dispatch(setToken(token));
        dispatch(setUser(user));
        dispatch(setAuthUser(user));
        await saveSession(token, user);
        navigation.reset({ index: 0, routes: [{ name: "Profile" }] });
        return;
      }

      Alert.alert("Registration completed", result?.message || "Account created successfully.");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Registration failed", error?.data?.message || "Please try again later.");
    }
  });

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Create your account</Text>

        <Controller
          control={control}
          name="mobile"
          rules={{ required: "Phone number is required" }}
          render={({ field: { onChange, value } }) => (
            <TextField
              error={errors.mobile?.message}
              keyboardType="phone-pad"
              label="Phone Number"
              onChangeText={onChange}
              placeholder="91XXXXXXXXXX"
              value={value}
            />
          )}
        />

        <PickerField
          error={errors.state?.message}
          label="State"
          onPress={() => setShowStateModal(true)}
          placeholder="Select your state"
          value={watch("state")}
        />

        <Controller
          control={control}
          name="state"
          rules={{ required: "State is required" }}
          render={() => <View />}
        />

        <Controller
          control={control}
          name="country"
          render={({ field: { value } }) => (
            <TextField
              editable={false}
              label="Country"
              onChangeText={() => undefined}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, value } }) => (
            <TextField
              error={errors.password?.message}
              label="Password"
              onChangeText={onChange}
              placeholder="Enter password"
              secureTextEntry
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Confirm password is required",
            validate: (value) => value === watch("password") || "Passwords do not match",
          }}
          render={({ field: { onChange, value } }) => (
            <TextField
              error={errors.confirmPassword?.message}
              label="Confirm Password"
              onChangeText={onChange}
              placeholder="Confirm password"
              secureTextEntry
              value={value}
            />
          )}
        />

        <Button label="Create Account" loading={isLoading} onPress={onSubmit} />
      </Card>

      <Modal animationType="slide" transparent visible={showStateModal}>
        <View style={styles.modalBackdrop}>
          <Card>
            <Text style={styles.modalTitle}>Choose your state</Text>
            <ScrollView contentContainerStyle={styles.stateListContent} style={styles.stateList}>
              {INDIAN_STATES.map((stateName) => (
                <Pressable
                  key={stateName}
                  onPress={() => {
                    setValue("state", stateName, { shouldValidate: true });
                    setShowStateModal(false);
                  }}
                  style={styles.stateItem}
                >
                  <Text style={styles.stateText}>{stateName}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Button label="Close" onPress={() => setShowStateModal(false)} variant="secondary" />
          </Card>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
  },
  modalBackdrop: {
    backgroundColor: "rgba(30,27,22,0.35)",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 16,
  },
  stateList: {
    marginBottom: 16,
    maxHeight: 420,
  },
  stateListContent: {
    paddingBottom: 4,
  },
  stateItem: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  stateText: {
    color: colors.text,
    fontSize: 15,
  },
});
