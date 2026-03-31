import React, { useEffect, useMemo, useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useGetAllUsersQuery } from "../api/viewApi";
import { logout } from "../features/auth/authSlice";
import { resetForm } from "../features/form/formSlice";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PickerField } from "../components/PickerField";
import { Screen } from "../components/Screen";
import { TextField } from "../components/TextField";
import { GENDER_OPTIONS, STATE_OPTIONS } from "../constants/profileOptions";
import { STATE_DISTRICT_MAP } from "../constants/stateDistrictMap";
import { RootStackParamList } from "../navigation/AppNavigator";
import { clearSession } from "../storage/sessionStorage";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Discovery">;
type PickerName = "state" | "district" | "gender" | null;

const countries = ["India"];
const normalizeStateName = (value: unknown) =>
  STATE_OPTIONS.find(
    (stateName) => stateName.toLowerCase() === String(value || "").trim().toLowerCase(),
  ) || "";

export function DiscoveryScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const authUserDetails =
    authUser && typeof authUser["userDetails"] === "object" && authUser["userDetails"] !== null
      ? (authUser["userDetails"] as Record<string, unknown>)
      : null;
  const authUserState = authUser?.["state"] || authUserDetails?.["state"];
  const defaultState = useMemo(() => normalizeStateName(authUserState), [authUserState]);
  const [activePicker, setActivePicker] = useState<PickerName>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    country: countries[0],
    state: defaultState,
    district: "",
    gender: "",
  });
  const districts = useMemo(
    () => (filters.state ? STATE_DISTRICT_MAP[filters.state] || [] : []),
    [filters.state],
  );

  useEffect(() => {
    if (filters.country !== countries[0] || (!filters.state && defaultState)) {
      setFilters((prev) => ({
        ...prev,
        country: countries[0],
        ...(!prev.state && defaultState ? { state: defaultState } : {}),
      }));
    }
  }, [defaultState, filters.country, filters.state]);

  useEffect(() => {
    if (filters.district && !districts.includes(filters.district)) {
      setFilters((prev) => ({ ...prev, district: "" }));
    }
  }, [districts, filters.district]);

  const payload = useMemo(
    () => ({
      page: 1,
      limit: 100,
      filter: filters,
    }),
    [filters],
  );
  const { data = [], isLoading, isFetching, refetch } = useGetAllUsersQuery(payload);

  const options =
    activePicker === "state"
      ? STATE_OPTIONS
      : activePicker === "district"
        ? districts
        : GENDER_OPTIONS;
  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  const handleLogout = async () => {
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    await clearSession();
    dispatch(resetForm());
    dispatch(logout());
  };

  const handleBack = () => {
    const routes = navigation.getState().routes;
    const previousRoute = routes[routes.length - 2]?.name;

    if (previousRoute === "CompleteProfile" || previousRoute === "UploadPhoto") {
      navigation.reset({ index: 0, routes: [{ name: "Profile" }] });
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Profile");
  };

  return (
    <Screen onRefresh={() => void refetch()} refreshing={isFetching && !isLoading}>
      <Card>
        <Text style={styles.title}>Discover Profiles</Text>
        <Text style={styles.subtitle}>Search the same `user/list` backend used by the web app.</Text>

        <TextField
          label="Country"
          value={filters.country}
          onChangeText={() => undefined}
          editable={false}
          placeholder={countries[0]}
        />
        <PickerField
          label="State"
          value={filters.state}
          placeholder="Select state"
          onPress={() => setActivePicker("state")}
        />
        <PickerField
          label="District"
          value={filters.district}
          placeholder={filters.state ? "Select district" : "Select state first"}
          onPress={() => {
            if (!filters.state) {
              Alert.alert("Select state first", "Choose state before selecting district.");
              return;
            }

            setActivePicker("district");
          }}
        />
        <PickerField
          label="Gender"
          value={filters.gender}
          placeholder="Select gender"
          onPress={() => setActivePicker("gender")}
        />

        <View style={styles.gap} />
        <Text style={styles.resultCount}>
          {isLoading ? "Loading matches..." : `${data.length} profiles found`}
        </Text>
      </Card>

      {data.map((user: any) => {
        const imageUrl = user?.userDetails?.imageData?.[0]?.url || user?.imageData?.[0]?.url;
        return (
          <Pressable key={String(user.id)} onPress={() => setSelectedUser(user)}>
            <Card>
              {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" /> : null}
              <Text style={styles.name}>{user?.name || "Unnamed profile"}</Text>
              <Text style={styles.meta}>
                {user?.state || "No state"} · {user?.district || "No district"} · {user?.gender || "No gender"}
              </Text>
              <Text style={styles.bio}>Phone: {user?.phone_number || "Hidden"}</Text>
              <Text style={styles.tapHint}>Tap to view full profile</Text>
            </Card>
          </Pressable>
        );
      })}

      <View style={styles.gap} />
      <Button label="Profile" onPress={handleProfile} />
      <View style={styles.buttonGap} />
      <Button label="Logout" onPress={handleLogout} variant="secondary" />
      <View style={styles.buttonGap} />
      <Button label="Back" onPress={handleBack} variant="secondary" />

      <Modal transparent visible={!!activePicker} animationType="slide">
        <View style={styles.modalBackdrop}>
          <Card>
            <Text style={styles.modalTitle}>Select {activePicker}</Text>
            <ScrollView style={styles.optionList}>
              {options.map((option) => (
                <Pressable
                  key={option}
                  style={styles.optionItem}
                  onPress={() => {
                    const key = activePicker as Exclude<PickerName, null>;
                    setFilters((prev) => ({
                      ...prev,
                      [key]: option,
                      ...(key === "state" ? { district: "" } : {}),
                    }));
                    setActivePicker(null);
                  }}
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

      <Modal transparent visible={!!selectedUser} animationType="fade">
        <View style={styles.modalBackdrop}>
          <Card>
            <Text style={styles.modalTitle}>Profile Details</Text>
            <ScrollView style={styles.profileDetailList}>
              {(selectedUser?.userDetails?.imageData?.[0]?.url || selectedUser?.imageData?.[0]?.url) ? (
                <Image
                  source={{
                    uri:
                      selectedUser?.userDetails?.imageData?.[0]?.url ||
                      selectedUser?.imageData?.[0]?.url,
                  }}
                  style={styles.detailImage}
                  resizeMode="cover"
                />
              ) : null}
              <Text style={styles.detailItem}>Name: {selectedUser?.name || "N/A"}</Text>
              <Text style={styles.detailItem}>Age: {selectedUser?.age || "N/A"}</Text>
              <Text style={styles.detailItem}>Gender: {selectedUser?.gender || "N/A"}</Text>
              <Text style={styles.detailItem}>Caste: {selectedUser?.caste || "N/A"}</Text>
              <Text style={styles.detailItem}>Religion: {selectedUser?.religion || "N/A"}</Text>
              <Text style={styles.detailItem}>
                District: {selectedUser?.district || selectedUser?.userDetails?.district || "N/A"}
              </Text>
              <Text style={styles.detailItem}>
                State: {selectedUser?.state || selectedUser?.userDetails?.state || "N/A"}
              </Text>
              <Text style={styles.detailItem}>Country: {selectedUser?.country || "N/A"}</Text>
              <Text style={styles.detailItem}>Phone: {selectedUser?.phone_number || "N/A"}</Text>
              <Text style={styles.detailItem}>Whatsapp: {selectedUser?.whatsapp || "N/A"}</Text>
              <Text style={styles.detailItem}>Job: {selectedUser?.job || "N/A"}</Text>
              <Text style={styles.detailItem}>Monthly Salary: {selectedUser?.monthlySalary || "N/A"}</Text>
              <Text style={styles.detailItem}>
                Marriage Status: {selectedUser?.count || selectedUser?.userDetails?.count || "N/A"}
              </Text>
              <Text style={styles.detailItem}>Whose Marriage: {selectedUser?.person || "N/A"}</Text>
            </ScrollView>
            <Button label="Close" onPress={() => setSelectedUser(null)} variant="secondary" />
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
    marginBottom: 12,
  },
  gap: {
    height: 16,
  },
  buttonGap: {
    height: 12,
  },
  resultCount: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  image: {
    borderRadius: 16,
    height: 220,
    marginBottom: 12,
    width: "100%",
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 6,
  },
  bio: {
    color: colors.text,
    fontSize: 15,
    marginTop: 8,
  },
  tapHint: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
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
  profileDetailList: {
    marginBottom: 16,
    maxHeight: 520,
  },
  detailImage: {
    borderRadius: 16,
    height: 260,
    marginBottom: 16,
    width: "100%",
  },
  detailItem: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
});
