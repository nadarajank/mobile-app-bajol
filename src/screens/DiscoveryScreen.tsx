import React, { useEffect, useMemo, useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  useCreateCommentReplyMutation,
  useCreateProfileCommentMutation,
  useGetProfileCommentsQuery,
} from "../api/commentApi";
import { useDeleteUserAccountMutation } from "../api/deleteAccountApi";
import { useGetUserProfileQuery } from "../api/profileApi";
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
import { useLanguage } from "../localization/LanguageContext";
import { clearSession } from "../storage/sessionStorage";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Discovery">;
type PickerName = "district" | "gender" | null;

const countries = ["India"];
const normalizeStateName = (value: unknown) =>
  STATE_OPTIONS.find(
    (stateName) => stateName.toLowerCase() === String(value || "").trim().toLowerCase(),
  ) || "";

export function DiscoveryScreen({ navigation }: Props) {
  const { copy } = useLanguage();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const fallbackAuthUser = useAppSelector((state) => state.form.authUser);
  const userId = Number(
    (authUser?.id as number | string | undefined) ?? (fallbackAuthUser?.id as number | string | undefined),
  );
  const [deleteUserAccount, { isLoading: isDeleting }] = useDeleteUserAccountMutation();
  const { refetch: refetchProfile, isFetching: isFetchingProfile } = useGetUserProfileQuery(userId, {
    skip: !userId,
  });
  const authUserDetails =
    authUser && typeof authUser["userDetails"] === "object" && authUser["userDetails"] !== null
      ? (authUser["userDetails"] as Record<string, unknown>)
      : null;
  const fallbackUserDetails =
    fallbackAuthUser &&
    typeof fallbackAuthUser["userDetails"] === "object" &&
    fallbackAuthUser["userDetails"] !== null
      ? (fallbackAuthUser["userDetails"] as Record<string, unknown>)
      : null;
  const authUserState =
    authUser?.["state"] ||
    authUserDetails?.["state"] ||
    fallbackAuthUser?.["state"] ||
    fallbackUserDetails?.["state"];
  const defaultState = useMemo(() => normalizeStateName(authUserState), [authUserState]);
  const [activePicker, setActivePicker] = useState<PickerName>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [commentText, setCommentText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<number | string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filters, setFilters] = useState({
    country: countries[0],
    state: defaultState,
    district: "",
    gender: "",
  });
  const [submittedFilters, setSubmittedFilters] = useState<{
    country: string;
    state: string;
    district: string;
    gender: string;
  } | null>(null);
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
    () =>
      submittedFilters
        ? {
            page: 1,
            limit: 100,
            filter: submittedFilters,
          }
        : undefined,
    [submittedFilters],
  );
  const { data = [], isLoading, isFetching, refetch } = useGetAllUsersQuery(payload as Record<string, unknown>, {
    skip: !payload,
  });
  const selectedProfileId = Number(selectedUser?.id ?? 0);
  const {
    data: comments = [],
    isFetching: isFetchingComments,
    refetch: refetchComments,
  } = useGetProfileCommentsQuery(selectedProfileId, {
    skip: !selectedProfileId,
  });
  const [createProfileComment, { isLoading: isCreatingComment }] = useCreateProfileCommentMutation();
  const [createCommentReply, { isLoading: isCreatingReply }] = useCreateCommentReplyMutation();
  const visibleUsers = useMemo(
    () =>
      data.filter((user: any) => {
        const imageUrl = user?.userDetails?.imageData?.[0]?.url || user?.imageData?.[0]?.url;
        return Boolean(imageUrl);
      }),
    [data],
  );

  const options =
    activePicker === "district"
        ? districts
        : GENDER_OPTIONS;
  const handleProfile = async () => {
    if (!userId) {
      Alert.alert("Missing user", "User ID is required to load your profile.");
      return;
    }

    try {
      const result = await refetchProfile();

      if ("error" in result) {
        throw result.error;
      }

      navigation.navigate("CompleteProfile", {
        userId,
        initialData: result.data || {},
      });
    } catch {
      Alert.alert("Profile load failed", "Unable to load your profile details.");
    }
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

  const handleDeleteAccount = async () => {
    if (!userId) {
      Alert.alert("Missing user", "User ID is required to delete the account.");
      return;
    }

    Alert.alert("Delete account", "This will permanently delete your account.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUserAccount(userId).unwrap();
            await handleLogout();
          } catch (deleteError: any) {
            Alert.alert("Delete failed", deleteError?.data?.message || "Unable to delete account.");
          }
        },
      },
    ]);
  };

  const handleSubmit = () => {
    setSubmittedFilters({ ...filters });
  };

  const handleRefresh = async () => {
    if (!submittedFilters) {
      return;
    }

    try {
      await refetch();
    } catch {
      Alert.alert("Refresh failed", "Unable to reload the profile list.");
    }
  };

  const currentUserName =
    String(authUser?.name ?? authUserDetails?.name ?? fallbackAuthUser?.name ?? fallbackUserDetails?.name ?? "").trim() ||
    "Anonymous";

  const handleOpenProfile = (user: any) => {
    setSelectedUser(user);
    setCommentText("");
    setReplyText("");
    setActiveReplyId(null);
  };

  const handleAddComment = async () => {
    const trimmedComment = commentText.trim();

    if (!selectedProfileId || !trimmedComment) {
      Alert.alert("Missing comment", "Type a comment before posting.");
      return;
    }

    try {
      await createProfileComment({
        profileId: selectedProfileId,
        comment: trimmedComment,
        userId: userId || undefined,
        userName: currentUserName,
      }).unwrap();
      setCommentText("");
      void refetchComments();
    } catch (error: any) {
      Alert.alert("Comment failed", error?.data?.message || "Unable to post comment.");
    }
  };

  const handleAddReply = async (commentId: number | string) => {
    const trimmedReply = replyText.trim();

    if (!selectedProfileId || !trimmedReply) {
      Alert.alert("Missing reply", "Type a reply before posting.");
      return;
    }

    try {
      await createCommentReply({
        profileId: selectedProfileId,
        commentId,
        reply: trimmedReply,
        userId: userId || undefined,
        userName: currentUserName,
      }).unwrap();
      setReplyText("");
      setActiveReplyId(null);
      void refetchComments();
    } catch (error: any) {
      Alert.alert("Reply failed", error?.data?.message || "Unable to post reply.");
    }
  };

  return (
    <Screen onRefresh={() => void handleRefresh()} refreshing={isFetching && !isLoading}>
      <Card>
        <Text style={styles.title}>{copy.discovery.title}</Text>
        <Text style={styles.subtitle}>{copy.discovery.subtitle}</Text>

        <TextField
          label={copy.discovery.country}
          value={filters.country}
          onChangeText={() => undefined}
          editable={false}
          placeholder={countries[0]}
        />
        <TextField
          label={copy.discovery.state}
          value={filters.state}
          onChangeText={() => undefined}
          editable={false}
          placeholder={defaultState || "State"}
        />
        <PickerField
          label={copy.discovery.district}
          value={filters.district}
          placeholder={filters.state ? copy.discovery.selectDistrict : copy.discovery.selectStateFirst}
          onPress={() => {
            if (!filters.state) {
              Alert.alert("Select state first", "Choose state before selecting district.");
              return;
            }

            setActivePicker("district");
          }}
        />
        <PickerField
          // label="Gender"
          label={copy.discovery.genderPrompt}
          value={filters.gender}
          placeholder={copy.discovery.selectGender}
          onPress={() => setActivePicker("gender")}
        />

        <View style={styles.gap} />
        <Button label={copy.discovery.submit} onPress={handleSubmit} loading={isFetching} />
        <View style={styles.gap} />
        <Text style={styles.resultCount}>
          {!submittedFilters
            ? copy.discovery.submitPrompt
            : isLoading || isFetching
              ? copy.discovery.loadingMatches
              : `${visibleUsers.length} ${copy.discovery.profilesFound}`}
        </Text>
      </Card>

      {visibleUsers.map((user: any) => {
        const imageUrl = user?.userDetails?.imageData?.[0]?.url || user?.imageData?.[0]?.url;
        return (
          <Pressable key={String(user.id)} onPress={() => handleOpenProfile(user)}>
            <Card>
              {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" /> : null}
              <Text style={styles.name}>{user?.name || "Unnamed profile"}</Text>
              <Text style={styles.meta}>
                {user?.state || copy.discovery.noState} · {user?.district || copy.discovery.noDistrict} · {user?.gender || copy.discovery.noGender}
              </Text>
              <Text style={styles.bio}>{copy.discovery.phone}: {user?.phone_number || copy.discovery.hiddenPhone}</Text>
              <Text style={styles.tapHint}>{copy.discovery.tapToView}</Text>
            </Card>
          </Pressable>
        );
      })}

      <View style={styles.gap} />
      <Button label={copy.discovery.viewMyProfile} onPress={() => void handleProfile()} loading={isFetchingProfile} />
      <View style={styles.buttonGap} />
      <Button label={copy.discovery.logout} onPress={handleLogout} variant="secondary" />
      <View style={styles.buttonGap} />
      <Button
        label={isDeleting ? copy.discovery.deleting : copy.discovery.deleteAccount}
        onPress={handleDeleteAccount}
        variant="secondary"
      />
      <View style={styles.buttonGap} />
      <Button label={copy.discovery.back} onPress={handleBack} variant="secondary" />

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
            <Text style={styles.modalTitle}>{copy.discovery.profileDetails}</Text>
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
              <Text style={styles.detailItem}>{copy.discovery.name}: {selectedUser?.name || "N/A"}</Text>
              <Text style={styles.detailItem}>{copy.discovery.age}: {selectedUser?.age || "N/A"}</Text>
              <Text style={styles.detailItem}>{copy.discovery.gender}: {selectedUser?.gender || "N/A"}</Text>
              <Text style={styles.detailItem}>{copy.discovery.caste}: {selectedUser?.caste || "N/A"}</Text>
              <Text style={styles.detailItem}>{copy.discovery.religion}: {selectedUser?.religion || "N/A"}</Text>
              <Text style={styles.detailItem}>
                {copy.discovery.district}: {selectedUser?.district || selectedUser?.userDetails?.district || "N/A"}
              </Text>
              <Text style={styles.detailItem}>
                {copy.discovery.state}: {selectedUser?.state || selectedUser?.userDetails?.state || "N/A"}
              </Text>
              <Text style={styles.detailItem}>{copy.discovery.countryLabel}: {selectedUser?.country || "N/A"}</Text>
              <Text style={styles.detailItem}>{copy.discovery.phone}: {selectedUser?.phone_number || "N/A"}</Text>
              <Text style={styles.detailItem}>{copy.discovery.whatsapp}: {selectedUser?.whatsapp || "N/A"}</Text>
              <Text style={styles.detailItem}>{copy.discovery.job}: {selectedUser?.job || "N/A"}</Text>
              <Text style={styles.detailItem}>{copy.discovery.monthlySalary}: {selectedUser?.monthlySalary || "N/A"}</Text>
              <Text style={styles.detailItem}>
                {copy.discovery.marriageStatus}: {selectedUser?.count || selectedUser?.userDetails?.count || "N/A"}
              </Text>
              <Text style={styles.detailItem}>{copy.discovery.whoseMarriage}: {selectedUser?.person || "N/A"}</Text>
              <View style={styles.commentSection}>
                <Text style={styles.commentSectionTitle}>{copy.discovery.comments}</Text>
                <TextField
                  label={copy.discovery.addComment}
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder={copy.discovery.writeComment}
                />
                <Button
                  label={copy.discovery.postComment}
                  onPress={() => void handleAddComment()}
                  loading={isCreatingComment}
                />
                <View style={styles.commentGap} />
                {isFetchingComments ? (
                  <Text style={styles.commentMeta}>{copy.discovery.loadingComments}</Text>
                ) : comments.length === 0 ? (
                  <Text style={styles.commentMeta}>{copy.discovery.noComments}</Text>
                ) : (
                  comments.map((comment) => {
                    const commentId = comment.id;
                    const commentBody = comment.comment || comment.content || comment.message || "";
                    const replies = comment.replies || [];

                    return (
                      <View key={String(commentId)} style={styles.commentCard}>
                        <Text style={styles.commentAuthor}>
                          {comment.userName || comment.name || "User"}
                        </Text>
                        <Text style={styles.commentBody}>{commentBody || "No comment content"}</Text>
                        <Text style={styles.commentMeta}>
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Just now"}
                        </Text>
                        <Pressable
                          onPress={() => {
                            setActiveReplyId(activeReplyId === commentId ? null : commentId);
                            setReplyText("");
                          }}
                        >
                          <Text style={styles.replyToggle}>{copy.discovery.reply}</Text>
                        </Pressable>
                        {replies.map((reply) => (
                          <View key={String(reply.id)} style={styles.replyCard}>
                            <Text style={styles.commentAuthor}>
                              {reply.userName || reply.name || "User"}
                            </Text>
                            <Text style={styles.commentBody}>
                              {reply.comment || reply.content || reply.message || "No reply content"}
                            </Text>
                            <Text style={styles.commentMeta}>
                              {reply.createdAt ? new Date(reply.createdAt).toLocaleString() : "Just now"}
                            </Text>
                          </View>
                        ))}
                        {activeReplyId === commentId ? (
                          <View style={styles.replyComposer}>
                            <TextField
                              label={copy.discovery.reply}
                              value={replyText}
                              onChangeText={setReplyText}
                              placeholder={copy.discovery.writeReply}
                            />
                            <Button
                              label={copy.discovery.postReply}
                              onPress={() => void handleAddReply(commentId)}
                              loading={isCreatingReply}
                              variant="secondary"
                            />
                          </View>
                        ) : null}
                      </View>
                    );
                  })
                )}
              </View>
            </ScrollView>
            <Button label={copy.auth.close} onPress={() => setSelectedUser(null)} variant="secondary" />
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
  commentSection: {
    marginTop: 16,
  },
  commentSectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  commentGap: {
    height: 12,
  },
  commentCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  replyCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    marginLeft: 12,
    padding: 12,
  },
  commentAuthor: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  commentBody: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  commentMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 6,
  },
  replyToggle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
  },
  replyComposer: {
    marginTop: 12,
  },
});
