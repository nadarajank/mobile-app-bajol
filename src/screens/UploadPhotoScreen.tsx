import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useUploadImagesMutation } from "../api/imageApi";
import { useAppSelector } from "../store/hooks";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "UploadPhoto">;

export function UploadPhotoScreen({ navigation }: Props) {
  const [imageUri, setImageUri] = useState("");
  const [uploadImages, { isLoading }] = useUploadImagesMutation();
  const userId = Number(useAppSelector((state) => state.auth.user?.id));

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!imageUri || !userId) {
      Alert.alert("Missing data", "Choose an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("dpfile", {
      uri: imageUri,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);

    try {
      await uploadImages({ formData, userId }).unwrap();
      Alert.alert("Upload successful", "Profile photo uploaded.", [
        {
          text: "OK",
          onPress: () => navigation.reset({ index: 0, routes: [{ name: "Discovery" }] }),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Upload failed", error?.data?.message || "Failed to upload image.");
    }
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Upload Profile Photo</Text>
        <Text style={styles.subtitle}>Choose a profile image and upload it to the same backend endpoint.</Text>
        <Button label="Choose Photo" onPress={pickImage} variant="secondary" />
        <View style={styles.gap} />
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" /> : null}
        <Button label="Upload Photo" loading={isLoading} onPress={handleUpload} />
      </Card>
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
  gap: {
    height: 16,
  },
  image: {
    borderRadius: 18,
    height: 280,
    marginBottom: 16,
    width: "100%",
  },
});
