import React, { useMemo, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useLoginUserMutation } from "../api/authApi";
import { useResetPasswordMutation, useSendOtpMutation, useVerifyOtpMutation } from "../api/otpApi";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PickerField } from "../components/PickerField";
import { Screen } from "../components/Screen";
import { TextField } from "../components/TextField";
import { INDIAN_STATES } from "../constants/stateOptions";
import { RootStackParamList } from "../navigation/AppNavigator";
import { setAuthUser } from "../features/form/formSlice";
import { useLanguage } from "../localization/LanguageContext";
import { setToken, setUser } from "../features/auth/authSlice";
import { saveSession } from "../storage/sessionStorage";
import { colors } from "../theme/colors";
import { getIndianLocalNumber, normalizePhoneInput } from "../utils/validation";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

type LoginValues = {
  mobileNumber: string;
  state: string;
  password: string;
};

export function LoginScreen({ navigation }: Props) {
  const { copy } = useLanguage();
  const dispatch = useAppDispatch();
  const otpLoading = useAppSelector((state) => state.otp.loading);
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();
  const [showStateModal, setShowStateModal] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [forgotMobile, setForgotMobile] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: {
      mobileNumber: "",
      state: "",
      password: "",
    },
  });

  const stateValue = watch("state");
  const forgotPhoneWithCountryCode = useMemo(() => normalizePhoneInput(forgotMobile), [forgotMobile]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = {
        ...values,
        mobileNumber: getIndianLocalNumber(values.mobileNumber),
      };
      const result = await loginUser(payload).unwrap();
      const token = result?.user?.token;

      if (!token) {
        Alert.alert("Login failed", "Token was not returned by the API.");
        return;
      }

      const { token: _ignored, ...userData } = result.user;
      const normalizedUserData = {
        ...userData,
        state: String(userData?.state ?? values.state).trim(),
      };
      dispatch(setToken(token));
      dispatch(setUser(normalizedUserData));
      dispatch(setAuthUser(normalizedUserData));
      await saveSession(token, normalizedUserData);
      navigation.reset({ index: 0, routes: [{ name: "Discovery" }] });
    } catch (error: any) {
      Alert.alert("Login failed", error?.data?.message || "Please try again.");
    }
  });

  const handleSendOtp = async () => {
    if (!/^\+\d{6,14}$/.test(forgotPhoneWithCountryCode)) {
      Alert.alert("Invalid mobile", "Enter a valid mobile number with country code.");
      return;
    }

    try {
      await sendOtp({ mobileNumber: forgotPhoneWithCountryCode }).unwrap();
      Alert.alert("OTP sent", `OTP sent to ${forgotPhoneWithCountryCode}`);
    } catch (error: any) {
      Alert.alert("Failed to send OTP", error?.data?.message || "Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!forgotOtp.trim()) {
      Alert.alert("Invalid OTP", "Enter the OTP to continue.");
      return;
    }

    try {
      const response = await verifyOtp({
        mobileNumber: forgotPhoneWithCountryCode,
        otp: forgotOtp,
      }).unwrap();
      if (response?.success) {
        setOtpVerified(true);
        Alert.alert("Verified", response?.message || "OTP verified successfully.");
      } else {
        Alert.alert("Verification failed", response?.message || "Invalid OTP.");
      }
    } catch (error: any) {
      Alert.alert("Verification failed", error?.data?.message || "Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!otpVerified) {
      Alert.alert("OTP required", "Verify OTP before resetting the password.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      Alert.alert("Missing password", "Enter both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    try {
      const response = await resetPassword({
        mobileNumber: forgotPhoneWithCountryCode,
        password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();
      Alert.alert("Password updated", response?.message || "Password updated successfully.");
      setForgotPasswordVisible(false);
      setForgotMobile("");
      setForgotOtp("");
      setOtpVerified(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Alert.alert("Failed to reset password", error?.data?.message || "Please try again.");
    }
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>{copy.auth.signInTitle}</Text>

        <Controller
          control={control}
          name="mobileNumber"
          rules={{ required: "Mobile number is required" }}
          render={({ field: { onChange, value } }) => (
            <TextField
              error={errors.mobileNumber?.message}
              keyboardType="phone-pad"
              label={copy.auth.mobileNumber}
              onChangeText={onChange}
              placeholder="91XXXXXXXXXX"
              value={value}
            />
          )}
        />

        <PickerField
          error={errors.state?.message}
          label={copy.auth.state}
          onPress={() => setShowStateModal(true)}
          placeholder={copy.auth.selectState}
          value={stateValue}
        />

        <Controller
          control={control}
          name="state"
          rules={{ required: "State is required" }}
          render={() => <View />}
        />

        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, value } }) => (
            <TextField
              error={errors.password?.message}
              label={copy.auth.password}
              onChangeText={onChange}
              placeholder={copy.auth.enterPassword}
              secureTextEntry
              value={value}
            />
          )}
        />

        <View style={styles.actions}>
          <Button label={copy.auth.signInButton} loading={isLoading} onPress={onSubmit} />
          <Pressable onPress={() => setForgotPasswordVisible(true)}>
            <Text style={styles.link}>{copy.auth.forgotPassword}</Text>
          </Pressable>
        </View>
      </Card>

      <Modal animationType="slide" transparent visible={showStateModal}>
        <View style={styles.modalBackdrop}>
          <Card>
            <Text style={styles.modalTitle}>{copy.auth.chooseState}</Text>
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
            <Button label={copy.auth.close} onPress={() => setShowStateModal(false)} variant="secondary" />
          </Card>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={forgotPasswordVisible}>
        <View style={styles.modalBackdrop}>
          <Card>
            <Text style={styles.modalTitle}>{copy.auth.resetPassword}</Text>
            <TextField
              keyboardType="phone-pad"
              label={copy.auth.mobileNumber}
              onChangeText={setForgotMobile}
              placeholder="91XXXXXXXXXX"
              value={forgotMobile}
            />
            <Button label={copy.auth.sendOtp} loading={otpLoading} onPress={handleSendOtp} />

            <View style={styles.sectionGap} />

            <TextField
              keyboardType="number-pad"
              label={copy.auth.otp}
              onChangeText={setForgotOtp}
              placeholder={copy.auth.otp}
              value={forgotOtp}
            />
            <Button label={copy.auth.verifyOtp} onPress={handleVerifyOtp} variant="secondary" />

            <View style={styles.sectionGap} />

            <TextField
              label={copy.auth.newPassword}
              onChangeText={setNewPassword}
              placeholder={copy.auth.newPassword}
              secureTextEntry
              value={newPassword}
            />
            <TextField
              label={copy.auth.confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={copy.auth.confirmPassword}
              secureTextEntry
              value={confirmPassword}
            />
            <Button
              label={copy.auth.updatePassword}
              loading={isResettingPassword}
              onPress={handleResetPassword}
            />
            <View style={styles.sectionGap} />
            <Button
              label={copy.auth.backToLogin}
              onPress={() => setForgotPasswordVisible(false)}
              variant="secondary"
            />
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
  actions: {
    gap: 14,
    marginTop: 8,
  },
  link: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
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
  sectionGap: {
    height: 12,
  },
});
