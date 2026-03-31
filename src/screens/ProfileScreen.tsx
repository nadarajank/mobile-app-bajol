import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  NativeAppEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useCreateCashfreeOrderMutation } from "../api/paymentApi";
import { useGetUserProfileQuery } from "../api/profileApi";
import { useDeleteUserAccountMutation } from "../api/deleteAccountApi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { hasRequiredProfileData } from "../constants/profileOptions";
import { logout } from "../features/auth/authSlice";
import { resetForm } from "../features/form/formSlice";
import { RootStackParamList } from "../navigation/AppNavigator";
import { clearSession } from "../storage/sessionStorage";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

const profileFields = [
  ["Name", "name"],
  ["Age", "age"],
  ["Job", "job"],
  ["Monthly Salary", "monthlySalary"],
  ["Country", "country"],
  ["State", "state"],
  ["District", "district"],
  ["Phone", "phone_number"],
  ["Whatsapp", "whatsapp"],
  ["Caste", "caste"],
  ["Religion", "religion"],
  ["Gender", "gender"],
] as const;

const plans = [
  {
    planId: 2,
    name: "GOLD",
    description: "Unlock profile creation and premium match access.",
    price: 1,
    features: [
      "Unlimited profile views",
      "Send interests",
      "Priority listing",
      "Full contact access",
      "Customer support",
    ],
  },
] as const;

const cashfreeEnvironment = process.env.EXPO_PUBLIC_CASHFREE_ENV === "SANDBOX" ? "SANDBOX" : "PRODUCTION";

const hasCashfreeNativeModule = !!NativeModules.CashfreePgApi;

type CashfreeCallback = {
  onVerify(orderID: string): void;
  onError(message: string, orderID?: string): void;
};

function getCashfreeBridge() {
  if (!hasCashfreeNativeModule) {
    return null;
  }

  try {
    const cashfreeModule = NativeModules.CashfreePgApi;
    const emitter =
      Platform.OS === "ios" && NativeModules.CashfreeEventEmitter
        ? new NativeEventEmitter(NativeModules.CashfreeEventEmitter)
        : NativeAppEventEmitter;

    return {
      module: cashfreeModule,
      emitter,
    };
  } catch {
    return null;
  }
}

const getPriceLabel = (priceUSD: number, country?: string): string => {
  switch (country?.toLowerCase()) {
    case "india":
      return `₹${priceUSD * 30}`;
    case "bahrain":
    case "kuwait":
      return "د.ك 10";
    case "oman":
      return "﷼ 10";
    case "qatar":
    case "saudi":
    case "saudi arabia":
      return "﷼ 50";
    case "dubai":
    case "united arab emirates":
    case "sharjah":
    case "abhu dhabi":
      return "د.إ 50";
    case "brunei":
      return "$30";
    case "mauritius":
      return "₨250";
    case "philippine":
    case "philippines":
      return "₱200";
    case "israel":
      return "₪50";
    case "sri lanka":
      return "රු600";
    case "sweeden":
    case "sweden":
      return "kr100";
    case "wales":
    case "finland":
    case "bahamas":
      return "$10";
    case "fiji":
      return "$15";
    case "slomon island":
    case "solomon island":
    case "barbados":
    case "saint lucia":
    case "colombia":
      return "$25";
    case "zambia":
      return "ZK100";
    case "botswana":
      return "P100";
    case "egypt":
      return "£200";
    case "mexico":
      return "₱100";
    case "thailand":
      return "฿100";
    case "greece":
    case "malta":
    case "germany":
    case "switzerland":
    case "new zealand":
    case "netherland":
    case "netherlands":
      return "€10";
    case "ghana":
      return "₵75";
    case "norway":
      return "kr75";
    case "bermuda":
    case "singapore":
      return "$15";
    case "malaysia":
      return "RM25";
    case "scotland":
      return "£10";
    case "england":
    case "usa":
      return "$6";
    case "canada":
      return `CA$${(priceUSD * 6).toFixed(2)}`;
    case "australia":
      return `A$${(priceUSD * 6).toFixed(2)}`;
    default:
      return `₹${priceUSD * 30}`;
  }
};

const getFinalPriceNumber = (priceUSD: number, country?: string): number => {
  switch (country?.toLowerCase()) {
    case "india":
      return priceUSD * 30;
    case "bahrain":
    case "kuwait":
      return 10;
    case "oman":
      return 10;
    case "qatar":
    case "saudi":
    case "saudi arabia":
      return 50;
    case "dubai":
    case "united arab emirates":
    case "sharjah":
    case "abhu dhabi":
      return 50;
    case "brunei":
      return 30;
    case "mauritius":
      return 250;
    case "philippine":
    case "philippines":
      return 200;
    case "israel":
      return 50;
    case "sri lanka":
      return 600;
    case "sweeden":
    case "sweden":
      return 100;
    case "wales":
    case "finland":
    case "bahamas":
      return 10;
    case "fiji":
    case "bermuda":
    case "singapore":
      return 15;
    case "slomon island":
    case "solomon island":
    case "barbados":
    case "saint lucia":
    case "colombia":
      return 25;
    case "zambia":
    case "botswana":
    case "mexico":
    case "thailand":
      return 100;
    case "egypt":
      return 200;
    case "greece":
    case "malta":
    case "germany":
    case "switzerland":
    case "new zealand":
    case "netherland":
    case "netherlands":
      return 10;
    case "ghana":
      return 75;
    case "norway":
      return 75;
    case "malaysia":
      return 25;
    case "scotland":
      return 10;
    case "england":
    case "usa":
      return 6;
    case "canada":
      return 6;
    case "australia":
      return priceUSD * 1.5;
    default:
      return priceUSD * 30;
  }
};

const getCurrencyCode = (country?: string): string => {
  switch (country?.toLowerCase()) {
    case "india":
      return "INR";
    case "usa":
      return "USD";
    case "canada":
      return "CAD";
    case "australia":
      return "AUD";
    case "england":
    case "wales":
    case "scotland":
      return "GBP";
    case "sweden":
    case "sweeden":
      return "SEK";
    case "norway":
      return "NOK";
    case "germany":
    case "finland":
    case "malta":
    case "greece":
    case "switzerland":
    case "netherlands":
    case "netherland":
    case "new zealand":
      return "EUR";
    case "dubai":
    case "united arab emirates":
    case "sharjah":
    case "abhu dhabi":
      return "AED";
    case "qatar":
    case "saudi":
    case "saudi arabia":
    case "oman":
      return "SAR";
    case "bahrain":
      return "BHD";
    case "kuwait":
      return "KWD";
    case "malaysia":
      return "MYR";
    case "singapore":
      return "SGD";
    case "brunei":
      return "BND";
    case "philippines":
    case "philippine":
      return "PHP";
    case "sri lanka":
      return "LKR";
    case "mauritius":
      return "MUR";
    case "ghana":
      return "GHS";
    case "zambia":
      return "ZMW";
    case "botswana":
      return "BWP";
    case "egypt":
      return "EGP";
    case "mexico":
      return "MXN";
    case "thailand":
      return "THB";
    case "colombia":
      return "COP";
    case "fiji":
      return "FJD";
    case "barbados":
    case "saint lucia":
      return "BBD";
    default:
      return "USD";
  }
};

export function ProfileScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const user = useAppSelector((state) => state.auth.user);
  const fallbackUser = useAppSelector((state) => state.form.authUser);
  const userId = Number((user?.id as number | string | undefined) ?? (fallbackUser?.id as number | string | undefined));
  const { data, error, isLoading, refetch } = useGetUserProfileQuery(userId, {
    skip: !userId,
  });
  const [deleteUserAccount, { isLoading: isDeleting }] = useDeleteUserAccountMutation();
  const [createCashfreeOrder, { isLoading: isCreatingOrder }] = useCreateCashfreeOrderMutation();
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!userId) {
      return;
    }

    try {
      setIsRefreshing(true);
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const cashfreeBridge = getCashfreeBridge();

    if (!cashfreeBridge) {
      return;
    }

    const callback: CashfreeCallback = {
      onVerify: (orderID) => {
        setIsStartingPayment(false);
        Alert.alert("Payment received", `Cashfree verified order ${orderID}. Refreshing profile.`);
        void refetch();
      },
      onError: (message, orderID) => {
        setIsStartingPayment(false);
        Alert.alert(
          "Payment failed",
          message || `Cashfree checkout failed for order ${orderID ?? "unknown"}.`,
        );
      },
    };

    const successSubscription = cashfreeBridge.emitter.addListener("cfSuccess", (orderID: string) => {
      callback.onVerify(orderID);
    });
    const failureSubscription = cashfreeBridge.emitter.addListener("cfFailure", (rawError: string) => {
      try {
        const parsed = JSON.parse(rawError);
        const errorBody = parsed?.error ? JSON.parse(parsed.error) : null;
        callback.onError(errorBody?.message || "Cashfree payment failed.", parsed?.orderID);
      } catch {
        callback.onError("Cashfree payment failed.");
      }
    });
    cashfreeBridge.module.setCallback();

    return () => {
      successSubscription.remove();
      failureSubscription.remove();
    };
  }, [refetch]);

  const handleLogout = async () => {
    await clearSession();
    dispatch(resetForm());
    dispatch(logout());
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
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

  const handleCashfreePayment = async (planId: number, priceUSD: number) => {
    const cashfreeBridge = getCashfreeBridge();

    if (!cashfreeBridge) {
      Alert.alert(
        "Cashfree unavailable in Expo Go",
        "This payment SDK requires a native development build. Run `expo run:android` or `expo run:ios` and test there.",
      );
      return;
    }

    const customerPhone = String(
      data?.phone_number ?? user?.phone_number ?? user?.mobile ?? fallbackUser?.phone_number ?? "",
    ).trim();
    const customerEmail = String(data?.email ?? user?.email ?? fallbackUser?.email ?? "").trim();
    const country = String(data?.country ?? user?.country ?? "India");

    if (!userId) {
      Alert.alert("Missing user", "User ID is required to start payment.");
      return;
    }

    setIsStartingPayment(true);

    try {
      const response = await createCashfreeOrder({
        user_id: userId,
        plan_id: planId,
        order_amount: getFinalPriceNumber(priceUSD, country),
        order_currency: getCurrencyCode(country),
        receipt: `order_${Date.now()}`,
        customer_email: customerEmail || undefined,
        customer_phone: customerPhone || undefined,
      }).unwrap();

      const paymentSessionId = response?.cashfree_order?.payment_session_id;
      const orderId = response?.cashfree_order?.order_id;

      if (!paymentSessionId || !orderId) {
        throw new Error("Cashfree payment session was not returned by the backend.");
      }

      cashfreeBridge.module.doWebPayment(
        JSON.stringify({
          payment_session_id: paymentSessionId,
          orderID: orderId,
          environment: cashfreeEnvironment,
        }),
      );
    } catch (paymentError: any) {
      setIsStartingPayment(false);
      Alert.alert(
        "Payment could not start",
        paymentError?.data?.message || paymentError?.message || "Unable to launch Cashfree checkout.",
      );
    }
  };

  const hasImages = (data?.imageData?.length || 0) > 0;
  const profileComplete = hasRequiredProfileData(data);
  const hasPayments = !!data?.hasPayments;
  // const hasPayments = true;
  const shouldShowProfileForm = hasPayments && !hasImages && !profileComplete;

  useEffect(() => {
    if (!isFocused || isLoading || error || !userId || !hasPayments) {
      return;
    }

    if (!profileComplete) {
      navigation.replace("CompleteProfile", {
        userId,
        initialData: data || {},
      });
      return;
    }

    if (!hasImages) {
      navigation.replace("UploadPhoto");
      return;
    }

    navigation.replace("Discovery");
  }, [
    data,
    error,
    hasImages,
    hasPayments,
    isFocused,
    isLoading,
    navigation,
    profileComplete,
    userId,
  ]);

  if (!userId) {
    return (
      <Screen onRefresh={handleRefresh} refreshing={isRefreshing}>
        <Card>
          <Text style={styles.title}>No user session found</Text>
          <Text style={styles.muted}>Sign in again to fetch your profile.</Text>
          <View style={styles.gap} />
          <Button label="Logout" onPress={handleLogout} />
        </Card>
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen onRefresh={handleRefresh} refreshing={isRefreshing}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.muted}>Loading your profile...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen onRefresh={handleRefresh} refreshing={isRefreshing}>
        <Card>
          <Text style={styles.title}>Profile fetch failed</Text>
          <Text style={styles.muted}>
            The backend returned an error. This screen uses the same `/user/get/:id` API as the web app.
          </Text>
          <View style={styles.gap} />
          <Button label="Retry" onPress={() => refetch()} />
          <View style={styles.gap} />
          <Button label="Logout" onPress={handleLogout} variant="secondary" />
        </Card>
      </Screen>
    );
  }

  const renderPlanState = () => (
    <Card>
      {/* <Text style={styles.title}>Choose a plan</Text> */}
      <Text style={styles.title}>
       🚀 After payment you can go to register page Fill your Bio-data 🚀
      </Text>
      {/* <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Payment status</Text>
        <Text style={styles.statusText}>Active plan: No</Text>
        <Text style={styles.statusText}>Country: {String(data?.country ?? "India")}</Text>
      </View> */}
      <View style={styles.gap} />
      <Text style={styles.planTitle}>* After Payment You Touch On Reload Button *</Text>
      {/* <Text style={styles.planHint}>
        {hasCashfreeNativeModule
          ? "After payment completes, refresh if the profile state does not update immediately."
          : "Cashfree is not available inside Expo Go. Use a development build with `expo run:android` or `expo run:ios` to test payment."}
      </Text> */}
      <View style={styles.gap} />
      {plans.map((plan) => (
        <View key={plan.planId} style={styles.planCard}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDescription}>{plan.description}</Text>
          <Text style={styles.planPrice}>{getPriceLabel(plan.price, String(data?.country ?? "India"))}</Text>
          <View style={styles.featureList}>
            {plan.features.map((feature) => (
              <Text key={feature} style={styles.featureItem}>
                {`\u2022 ${feature}`}
              </Text>
            ))}
          </View>
          <View style={styles.gap} />
          <Button
            label={hasCashfreeNativeModule ? "Pay with Cashfree" : "Cashfree Requires Dev Build"}
            loading={isCreatingOrder || isStartingPayment}
            onPress={() => handleCashfreePayment(plan.planId, plan.price)}
          />
        </View>
      ))}
      <View style={styles.gap} />
      <Button
        label="Refresh"
        onPress={async () => {
          try {
            await refetch();
          } catch {
            Alert.alert("Refresh failed", "Unable to refresh profile data.");
          }
        }}
      />
      <View style={styles.gap} />
      <Button label="About Bajol" onPress={() => navigation.navigate("About")} variant="secondary" />
      <View style={styles.gap} />
      <Button label="Rules" onPress={() => navigation.navigate("Rules")} variant="secondary" />
      <View style={styles.gap} />
      <Button label="Logout" onPress={handleLogout} variant="secondary" />
    </Card>
  );

  const renderCompleteProfileState = () => (
    <Card>
      <Text style={styles.title}>Complete your profile</Text>
      <Text style={styles.muted}>
        Payment is active, but required profile details are still missing.
      </Text>
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Current status</Text>
        <Text style={styles.statusText}>Payment active: Yes</Text>
        <Text style={styles.statusText}>Profile complete: No</Text>
        <Text style={styles.statusText}>Photo uploaded: {hasImages ? "Yes" : "No"}</Text>
      </View>
      <View style={styles.gap} />
      <Button
        label="Complete Profile"
        onPress={() =>
          navigation.navigate("CompleteProfile", {
            userId,
            initialData: data || {},
          })
        }
      />
      <View style={styles.gap} />
      <Button label="Refresh" onPress={() => refetch()} variant="secondary" />
      <View style={styles.gap} />
      <Button label="Logout" onPress={handleLogout} variant="secondary" />
    </Card>
  );

  const renderUploadPhotoState = () => (
    <Card>
      <Text style={styles.title}>Upload profile photo</Text>
      <Text style={styles.muted}>
        Your payment is active and profile details are complete. Add a photo to continue.
      </Text>
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Current status</Text>
        <Text style={styles.statusText}>Payment active: Yes</Text>
        <Text style={styles.statusText}>Profile complete: Yes</Text>
        <Text style={styles.statusText}>Photo uploaded: No</Text>
      </View>
      <View style={styles.gap} />
      <Button label="Upload Photo" onPress={() => navigation.navigate("UploadPhoto")} />
      <View style={styles.gap} />
      <Button label="Refresh" onPress={() => refetch()} variant="secondary" />
      <View style={styles.gap} />
      <Button label="Logout" onPress={handleLogout} variant="secondary" />
    </Card>
  );

  const renderDiscoveryState = () => (
    <Card>
      <Text style={styles.title}>Profile ready</Text>
      <Text style={styles.muted}>
        This matches the web flow after payment, profile completion, and photo upload.
      </Text>
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Current status</Text>
        <Text style={styles.statusText}>Payment active: Yes</Text>
        <Text style={styles.statusText}>Profile complete: Yes</Text>
        <Text style={styles.statusText}>Photo uploaded: Yes</Text>
      </View>
      <View style={styles.gap} />
      <Button label="Discover Matches" onPress={() => navigation.navigate("Discovery")} />
      <View style={styles.gap} />
      <Button
        label="Refresh"
        onPress={async () => {
          try {
            await refetch();
          } catch {
            Alert.alert("Refresh failed", "Unable to refresh profile data.");
          }
        }}
        variant="secondary"
      />
      <View style={styles.gap} />
      <Button label="About Bajol" onPress={() => navigation.navigate("About")} variant="secondary" />
      <View style={styles.gap} />
      <Button label="Rules" onPress={() => navigation.navigate("Rules")} variant="secondary" />
      <View style={styles.gap} />
      <Button
        label="Profile Flow"
        onPress={() => navigation.navigate("Onboarding")}
        variant="secondary"
      />
      <View style={styles.gap} />
      <Button
        label="Conclusion"
        onPress={() => navigation.navigate("Conclusion")}
        variant="secondary"
      />
      <View style={styles.gap} />
      {profileFields.map(([label, key]) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{String(data?.[key] ?? "Not provided")}</Text>
        </View>
      ))}
      <View style={styles.gap} />
      <Button label="Logout" onPress={handleLogout} variant="secondary" />
      <View style={styles.gap} />
      <Button
        label={isDeleting ? "Deleting..." : "Delete Account"}
        onPress={handleDeleteAccount}
        variant="secondary"
      />
    </Card>
  );
// The main render logic follows the same flow as the web `profile.tsx` component, with additional loading and error states.
  return (
    <Screen onRefresh={handleRefresh} refreshing={isRefreshing}>
      {!hasPayments
        ? renderPlanState()
        : shouldShowProfileForm
          ? renderCompleteProfileState()
          : !hasImages
            ? renderUploadPhotoState()
            : renderDiscoveryState()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    flex: 1,
    gap: 12,
    justifyContent: "center",
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  muted: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  gap: {
    height: 16,
  },
  statusCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
    padding: 14,
  },
  statusTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  statusText: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 4,
  },
  planTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  planHint: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  planCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  planName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  planDescription: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  planPrice: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 14,
  },
  featureList: {
    marginTop: 14,
  },
  featureItem: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  row: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
