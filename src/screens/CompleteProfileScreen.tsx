import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useEditFormMutation } from "../api/editFormApi";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PickerField } from "../components/PickerField";
import { Screen } from "../components/Screen";
import { TextField } from "../components/TextField";
import {
  COUNTRY_OPTIONS,
  GENDER_OPTIONS,
  MARRIAGE_COUNT_OPTIONS,
  MARRIAGE_PERSON_OPTIONS,
  STATE_OPTIONS,
} from "../constants/profileOptions";
import { RootStackParamList } from "../navigation/AppNavigator";
import { STATE_DISTRICT_MAP } from "../constants/stateDistrictMap";
import { useAppSelector } from "../store/hooks";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "CompleteProfile">;

type ProfileFormValues = {
  name: string;
  age: string;
  job: string;
  monthlySalary: string;
  country: string;
  state: string;
  district: string;
  mobile: string;
  whatsapp: string;
  caste: string;
  religion: string;
  gender: string;
  count: string;
  person: string;
  // height: string;
  // weight: string;
};

type PickerName = "country" | "state" | "district" | "gender" | "count" | "person" | null;

const normalizeStateName = (value: unknown) =>
  STATE_OPTIONS.find(
    (stateName) => stateName.toLowerCase() === String(value || "").trim().toLowerCase(),
  ) || "";

const pickerOptions: Record<Exclude<PickerName, "district" | null>, readonly string[]> = {
  country: COUNTRY_OPTIONS,
  state: STATE_OPTIONS,
  gender: GENDER_OPTIONS,
  count: MARRIAGE_COUNT_OPTIONS,
  person: MARRIAGE_PERSON_OPTIONS,
};

export function CompleteProfileScreen({ navigation, route }: Props) {
  const [editForm, { isLoading }] = useEditFormMutation();
  const [activePicker, setActivePicker] = useState<PickerName>(null);
  const userId = route.params?.userId;
  const initialData = route.params?.initialData || {};
  const authUser = useAppSelector((state) => state.auth.user);
  const authUserState = authUser?.["state"];
  const defaultState = useMemo(
    () => normalizeStateName(initialData?.state || authUserState),
    [authUserState, initialData?.state],
  );

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileFormValues>({
    defaultValues: {
      name: String(initialData?.name || ""),
      age: String(initialData?.age || ""),
      job: String(initialData?.job || ""),
      monthlySalary: String(initialData?.monthlySalary || ""),
      country: String(initialData?.country || "India"),
      state: String(defaultState || initialData?.state || authUserState || ""),
      district: String(initialData?.district || ""),
      mobile: String(initialData?.phone_number || initialData?.mobile || ""),
      whatsapp: String(initialData?.whatsapp || ""),
      caste: String(initialData?.caste || ""),
      religion: String(initialData?.religion || ""),
      gender: String(initialData?.gender || ""),
      count: String(initialData?.count || ""),
      person: String(initialData?.person || ""),
      // height: String(initialData?.height || ""),
      // weight: String(initialData?.weight || ""),
    },
  });

  const selectedValues = watch();
  const selectedState = watch("state");
  const selectedDistrict = watch("district");
  const districts = useMemo(
    () => (selectedState ? STATE_DISTRICT_MAP[selectedState] || [] : []),
    [selectedState],
  );

  useEffect(() => {
    if (!selectedState && defaultState) {
      setValue("state", defaultState, { shouldValidate: true });
    }
  }, [defaultState, selectedState, setValue]);

  useEffect(() => {
    if (selectedDistrict && !districts.includes(selectedDistrict)) {
      setValue("district", "", { shouldValidate: true });
    }
  }, [districts, selectedDistrict, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    if (!userId) {
      Alert.alert("Missing user", "User ID is required to save profile.");
      return;
    }

    try {
      await editForm({
        id: userId,
        ...values,
        phone_number: values.mobile,
      }).unwrap();
      Alert.alert("Profile saved", "Profile details saved successfully.", [
        { text: "OK", onPress: () => navigation.replace("UploadPhoto") },
      ]);
    } catch (error: any) {
      Alert.alert("Save failed", error?.data?.message || "Failed to save profile details.");
    }
  });

  const renderPicker = (name: Exclude<PickerName, null>, label: string, placeholder: string) => (
    <>
      <PickerField
        error={(errors[name]?.message as string | undefined) || undefined}
        label={label}
        onPress={() => {
          if (name === "district" && !selectedState) {
            Alert.alert("Select state first", "Choose your state before selecting district.");
            return;
          }

          setActivePicker(name);
        }}
        placeholder={placeholder}
        value={(selectedValues[name] as string) || ""}
      />
      <Controller
        control={control}
        name={name}
        rules={{ required: `${label} is required` }}
        render={() => <View />}
      />
    </>
  );

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Complete Profile</Text>
        <Text style={styles.subtitle}>Fill all required details to unlock the full profile flow.</Text>

        <Controller control={control} name="name" rules={{ required: "Name is required" }} render={({ field }) => (
          <TextField label="Name" value={field.value} onChangeText={field.onChange} error={errors.name?.message} />
        )} />
        <Controller control={control} name="age" rules={{ required: "Age is required" }} render={({ field }) => (
          <TextField label="Age" keyboardType="number-pad" value={field.value} onChangeText={field.onChange} error={errors.age?.message} />
        )} />
        <Controller control={control} name="job" rules={{ required: "Job is required" }} render={({ field }) => (
          <TextField label="Job" value={field.value} onChangeText={field.onChange} error={errors.job?.message} />
        )} />
        <Controller control={control} name="monthlySalary" rules={{ required: "Monthly salary is required" }} render={({ field }) => (
          <TextField label="Monthly Salary" keyboardType="number-pad" value={field.value} onChangeText={field.onChange} error={errors.monthlySalary?.message} />
        )} />

        {renderPicker("country", "Country", "Select country")}
        {renderPicker("state", "State", "Select state")}
        {renderPicker("district", "District", selectedState ? "Select district" : "Select state first")}

        <Controller control={control} name="mobile" rules={{ required: "Mobile is required" }} render={({ field }) => (
          <TextField label="Mobile" keyboardType="phone-pad" value={field.value} onChangeText={field.onChange} error={errors.mobile?.message} />
        )} />
        <Controller control={control} name="whatsapp" rules={{ required: "Whatsapp is required" }} render={({ field }) => (
          <TextField label="Whatsapp" keyboardType="phone-pad" value={field.value} onChangeText={field.onChange} error={errors.whatsapp?.message} />
        )} />
        <Controller control={control} name="caste" rules={{ required: "Caste is required" }} render={({ field }) => (
          <TextField label="Caste" value={field.value} onChangeText={field.onChange} error={errors.caste?.message} />
        )} />
        <Controller control={control} name="religion" rules={{ required: "Religion is required" }} render={({ field }) => (
          <TextField label="Religion" value={field.value} onChangeText={field.onChange} error={errors.religion?.message} />
        )} />

        {renderPicker("gender", "Gender", "Select gender")}
        {renderPicker("count", "Marriage Count", "Select marriage count")}
        {renderPicker("person", "Marriage Person", "Select person")}

        {/* <Controller control={control} name="height" rules={{ required: "Height is required" }} render={({ field }) => (
          <TextField label="Height" value={field.value} onChangeText={field.onChange} error={errors.height?.message} />
        )} />
        <Controller control={control} name="weight" rules={{ required: "Weight is required" }} render={({ field }) => (
          <TextField label="Weight" value={field.value} onChangeText={field.onChange} error={errors.weight?.message} />
        )} /> */}

        <Button label="Save Profile" loading={isLoading} onPress={onSubmit} />
      </Card>

      <Modal transparent visible={!!activePicker} animationType="slide">
        <View style={styles.modalBackdrop}>
          <Card>
            <Text style={styles.modalTitle}>Select {activePicker}</Text>
            <ScrollView style={styles.optionList}>
              {(activePicker === "district"
                ? districts
                : activePicker
                  ? pickerOptions[activePicker as Exclude<PickerName, "district" | null>]
                  : []
              ).map((option) => (
                <Pressable
                  key={option}
                  onPress={() => {
                    if (activePicker) {
                      setValue(activePicker, option, { shouldValidate: true });
                      if (activePicker === "state") {
                        setValue("district", "", { shouldValidate: true });
                      }
                    }
                    setActivePicker(null);
                  }}
                  style={styles.optionItem}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </Pressable>
              ))}
            </ScrollView>
            {activePicker === "district" && districts.length === 0 ? (
              <Text style={styles.emptyState}>No districts available for the selected state.</Text>
            ) : null}
            <Button label="Close" onPress={() => setActivePicker(null)} variant="secondary" />
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
    marginBottom: 8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
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
    textTransform: "capitalize",
  },
  optionList: {
    maxHeight: 420,
    marginBottom: 16,
  },
  optionItem: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  optionText: {
    color: colors.text,
    fontSize: 16,
  },
  emptyState: {
    color: colors.muted,
    fontSize: 15,
    marginBottom: 16,
    textAlign: "center",
  },
});
