import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  NativeAppEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  useConfirmProfileAccessOrderMutation,
  useCreateProfileAccessOrderMutation,
} from "../api/paymentApi";
import { useGetUserProfileQuery } from "../api/profileApi";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAppSelector } from "../store/hooks";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "ProfileDetail">;

type CashfreeCallback = {
  onVerify(orderID: string): void;
  onError(message: string, orderID?: string): void;
};

const cashfreeEnvironment = process.env.EXPO_PUBLIC_CASHFREE_ENV === "SANDBOX" ? "SANDBOX" : "PRODUCTION";
const hasCashfreeNativeModule = !!NativeModules.CashfreePgApi;

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

const maskContactValue = (value?: string | null) => {
  const raw = String(value || "").trim();
  if (!raw) return "XXXXXXXXXX";

  const visibleDigits = raw.replace(/\D/g, "").slice(-2);
  return `XXXXXX${visibleDigits || "XX"}`;
};

const getProfileImages = (profile: any) => profile?.userDetails?.imageData || profile?.imageData || [];

export function ProfileDetailScreen({ navigation, route }: Props) {
  const profileId = Number(route.params.profileId);
  const authUser = useAppSelector((state) => state.auth.user);
  const fallbackAuthUser = useAppSelector((state) => state.form.authUser);
  const viewerUser = authUser || fallbackAuthUser;
  const viewerUserId = Number(viewerUser?.id as number | string | undefined);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [createProfileAccessOrder] = useCreateProfileAccessOrderMutation();
  const [confirmProfileAccessOrder] = useConfirmProfileAccessOrderMutation();

  const { data, error, isLoading, isFetching, refetch } = useGetUserProfileQuery(
    { id: profileId, viewerUserId },
    { skip: !profileId || !viewerUserId, refetchOnFocus: true, refetchOnReconnect: true },
  );

  const images = useMemo(() => getProfileImages(data), [data]);
  const currentImage = images[currentImageIndex] || images[0];

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [profileId]);

  useEffect(() => {
    const cashfreeBridge = getCashfreeBridge();

    if (!cashfreeBridge) {
      return;
    }

    const confirmUnlock = async (orderID?: string) => {
      const cashfreeOrderId = orderID || pendingOrderId;

      if (!cashfreeOrderId) {
        Alert.alert("Payment received", "Payment completed, but the order id was missing. Please refresh this profile.");
        setIsStartingPayment(false);
        return;
      }

      try {
        await confirmProfileAccessOrder({ cashfree_order_id: cashfreeOrderId }).unwrap();
        await refetch();
        Alert.alert("Contact unlocked", "This profile contact details are now visible.");
      } catch (confirmError: any) {
        Alert.alert("Unlock failed", confirmError?.data?.message || "Payment completed but contact unlock failed.");
      } finally {
        setIsStartingPayment(false);
        setPendingOrderId(null);
      }
    };

    const callback: CashfreeCallback = {
      onVerify: (orderID) => {
        void confirmUnlock(orderID);
      },
      onError: (message, orderID) => {
        setIsStartingPayment(false);
        setPendingOrderId(null);
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
  }, [confirmProfileAccessOrder, pendingOrderId, refetch]);

  const handlePayNow = async () => {
    const cashfreeBridge = getCashfreeBridge();

    if (!cashfreeBridge) {
      Alert.alert(
        "Cashfree unavailable in Expo Go",
        "This payment SDK requires a native development build. Run `expo run:android` or `expo run:ios` and test there.",
      );
      return;
    }

    if (!viewerUserId || !profileId) {
      Alert.alert("Unable to start payment", "Profile or logged in user is missing.");
      return;
    }

    setIsStartingPayment(true);

    try {
      const response = await createProfileAccessOrder({
        viewer_user_id: viewerUserId,
        target_user_id: profileId,
        order_amount: 1,
        order_currency: "INR",
        receipt: `profile_${viewerUserId}_${profileId}_${Date.now()}`,
        customer_email: String(viewerUser?.email || "") || undefined,
        customer_phone: String(viewerUser?.phone_number || viewerUser?.mobile || "") || undefined,
      }).unwrap();

      const paymentSessionId = response?.cashfree_order?.payment_session_id;
      const orderId = response?.cashfree_order?.order_id;

      if (!paymentSessionId || !orderId) {
        throw new Error("Cashfree payment session was not returned by the backend.");
      }

      setPendingOrderId(orderId);
      cashfreeBridge.module.doWebPayment(
        JSON.stringify({
          payment_session_id: paymentSessionId,
          orderID: orderId,
          environment: cashfreeEnvironment,
        }),
      );
    } catch (paymentError: any) {
      setIsStartingPayment(false);
      setPendingOrderId(null);
      Alert.alert(
        "Payment could not start",
        paymentError?.data?.message || paymentError?.message || "Unable to launch Cashfree checkout.",
      );
    }
  };

  if (!viewerUserId) {
    return (
      <Screen>
        <Card>
          <Text style={styles.title}>Profile unavailable</Text>
          <Text style={styles.muted}>Please login again to view this profile.</Text>
          <Button label="Back" onPress={() => navigation.goBack()} />
        </Card>
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen>
        <Card>
          <Text style={styles.muted}>Loading profile...</Text>
        </Card>
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen>
        <Card>
          <Text style={styles.title}>Profile unavailable</Text>
          <Text style={styles.muted}>Unable to load this profile.</Text>
          <Button label="Retry" onPress={() => void refetch()} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen onRefresh={() => void refetch()} refreshing={isFetching}>
      <Card>
        <Button label="Back" onPress={() => navigation.goBack()} variant="secondary" />
        <View style={styles.gap} />

        {currentImage?.url ? (
          <Image source={{ uri: currentImage.url }} style={styles.image} resizeMode="cover" />
        ) : null}

        {images.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbList}>
            {images.map((image: any, index: number) => (
              <Button
                key={`${image.url}-${index}`}
                label={String(index + 1)}
                onPress={() => setCurrentImageIndex(index)}
                variant={index === currentImageIndex ? "primary" : "secondary"}
              />
            ))}
          </ScrollView>
        ) : null}

        <Text style={styles.title}>{data?.name || "Unnamed profile"}</Text>
        <Text style={styles.detailItem}>Age: {data?.age || "N/A"}</Text>
        <Text style={styles.detailItem}>Gender: {data?.gender || "N/A"}</Text>
        <Text style={styles.detailItem}>Caste: {data?.caste || "N/A"}</Text>
        <Text style={styles.detailItem}>Religion: {data?.religion || "N/A"}</Text>
        <Text style={styles.detailItem}>District: {data?.district || data?.userDetails?.district || "N/A"}</Text>
        <Text style={styles.detailItem}>State: {data?.state || data?.userDetails?.state || "N/A"}</Text>
        <Text style={styles.detailItem}>Country: {data?.country || "N/A"}</Text>
        <Text style={styles.detailItem}>Job: {data?.job || "N/A"}</Text>
        <Text style={styles.detailItem}>Monthly Salary: {data?.monthlySalary || "N/A"}</Text>
        <Text style={styles.detailItem}>Marriage Status: {data?.count || data?.userDetails?.count || "N/A"}</Text>
        <Text style={styles.detailItem}>Whose Marriage: {data?.person || "N/A"}</Text>

        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>Contact Details</Text>
          {data?.contactUnlocked ? (
            <>
              <Text style={styles.detailItem}>Phone: {data?.phone_number || "N/A"}</Text>
              <Text style={styles.detailItem}>Whatsapp: {data?.whatsapp || "N/A"}</Text>
            </>
          ) : (
            <>
              <Text style={styles.detailItem}>Phone: {maskContactValue(data?.phone_number)}</Text>
              <Text style={styles.detailItem}>Whatsapp: {maskContactValue(data?.whatsapp)}</Text>
              <Text style={styles.muted}>Pay 49 RS to unlock this profile mobile number and WhatsApp number.</Text>
              <View style={styles.gap} />
              <Button label="Pay Now" loading={isStartingPayment} onPress={handlePayNow} />
            </>
          )}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contactBox: {
    backgroundColor: "#fff8e6",
    borderColor: "#f0c36d",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
    padding: 14,
  },
  contactTitle: {
    color: "#8a5a00",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  detailItem: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  gap: {
    height: 12,
  },
  image: {
    borderRadius: 16,
    height: 360,
    marginBottom: 12,
    width: "100%",
  },
  muted: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  thumbList: {
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
});
