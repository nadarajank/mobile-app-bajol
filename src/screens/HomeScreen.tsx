import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const heroAnim = useRef(new Animated.Value(0)).current;
  const introCardAnim = useRef(new Animated.Value(0)).current;
  const couplesCardAnim = useRef(new Animated.Value(0)).current;
  const featureCardsAnim = useRef(new Animated.Value(0)).current;
  const learnMoreAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(heroAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(introCardAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(couplesCardAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(featureCardsAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(learnMoreAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, [couplesCardAnim, featureCardsAnim, heroAnim, introCardAnim, learnMoreAnim]);

  const getRevealStyle = (animation: Animated.Value, offset = 18) => ({
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [offset, 0],
        }),
      },
    ],
  });

  return (
    <Screen>
      <View style={styles.container}>
        <Animated.View style={[styles.hero, getRevealStyle(heroAnim, 24)]}>
          <Image source={require("../../assets/baa.jpeg")} style={styles.logo} resizeMode="contain" />
          {/* <Text style={styles.eyebrow}>Bajol Matrimony</Text> */}
          <Text style={styles.title}>💍 Dream of Marriage</Text>
          <Text style={styles.subtitle}>
            There are three ways to a happy marriage: The first way is to be kind. The second way is to be kind. The third way is to be kind.
          </Text>
        </Animated.View>

        <Animated.View style={getRevealStyle(introCardAnim)}>
          <Card>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Are you already registered in BAJOL ?</Text>
              <View style={styles.actions}>
                <Button label="🚀 Did" onPress={() => navigation.navigate("Login")} />
                <Button
                  label="✅ Do Register Now"
                  onPress={() => navigation.navigate("Register")}
                  variant="secondary"
                />
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View style={getRevealStyle(couplesCardAnim)}>
          <Card>
            <View style={styles.section}>
              <Text style={styles.bannerText}>❤️ Alliances for every age at Bajol Matrimony ❤️</Text>
              <Image
                source={require("../../assets/couples.jpg")}
                style={styles.couplesImage}
                resizeMode="cover"
              // width={100}
              // height={300}
              />
              <Text style={styles.caption}>
                ❤️ Connecting hearts, creating futures ❤️
              </Text>
            </View>
          </Card>
        </Animated.View>

        <Animated.View style={getRevealStyle(featureCardsAnim)}>
          <View style={styles.section}>
            <Text style={styles.bannerText}>💖 Find your Special Someone 💖</Text>
          </View>

          <Card>
            <View style={[styles.cardss, styles.section, styles.featureCard]}>
              <Text style={styles.featureTitle}>📝 Sign Up</Text>
              <View style={styles.actions}>
                <Text style={styles.featureText}>Register for free and create your matrimony profile.</Text>
              </View>
            </View>
          </Card>
          <Card>
            <View style={[styles.section, styles.featureCard]}>
              <Text style={styles.featureTitle}>💞 Connect</Text>
              <View style={styles.actions}>
                <Text style={styles.featureText}>Select your perfect match and connect with profiles you like.</Text>
              </View>
            </View>
          </Card>
          <Card>
            <View style={[styles.section, styles.featureCard]}>
              <Text style={styles.featureTitle}>💬 Interact</Text>
              <View style={styles.actions}>
                <Text style={styles.featureText}>Become a member, start conversations, and build your future.</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View style={getRevealStyle(couplesCardAnim)}>

          <View style={styles.section}>
            <Text style={styles.bannerText}>20,000+ have found their life partner at BajolMatrimony!</Text>
            <Text style={styles.caption}>
              Bajol.com - Trusted by over 20,000+ Members
            </Text>
            <Text style={styles.bannerTexts}>Bajol.com, one of world's best known brands and the world's largest matrimonial service was founded with a simple objective - to help people find happiness. The company pioneered online matrimonials in 1996 and continues to lead the exciting matrimony category after more than a decade. By redefining the way Indian brides and grooms meet for marriage, bajolmatrimony.com has created a world-renowned service that has touched over 20,000+ people.</Text>
            <Text style={styles.caption}>
              India | USA | Canada | UK | Singapore | Australia | UAE | NRI Matrimonials
            </Text>

            <Card>
              <View style={styles.section}>
                <Text style={styles.bannerText}>Trusted by 20,000+ Members</Text>
                <Text style={styles.caption}>💑 Best Matches</Text>
                <Text style={styles.caption}>✅ Verified Profiles</Text>
                <Text style={styles.caption}>🔒 100% Privacy</Text>
              </View>
            </Card>


          </View>
        </Animated.View>

        <Animated.View style={getRevealStyle(learnMoreAnim)}>
          <Card>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Learn more</Text>
              <View style={styles.actions}>
                <Button label="About Bajol" onPress={() => navigation.navigate("About")} variant="secondary" />
                <Button label="Rules" onPress={() => navigation.navigate("Rules")} variant="secondary" />
                <Button
                  label="Conclusion"
                  onPress={() => navigation.navigate("Conclusion")}
                  variant="secondary"
                />
              </View>
            </View>
          </Card>
        </Animated.View>
      </View>

      <Text style={styles.caption}>
        © 2026 BAJOL ONLINE MATRIMONY PRIVATE LIMITED. All Rights Reserved.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingVertical: 8,
  },
  hero: {
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 8,
  },
  logo: {
    height: 120,
    marginBottom: 16,
    width: 120,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 10,
    textAlign: "center",
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 440,
    textAlign: "center",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  sectionText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  bannerText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    textAlign: "center",
  },
  bannerTexts: {
    color: 'white',
    fontSize: 18,
    fontWeight: "300",
    lineHeight: 24,
    textAlign: "justify",
    backgroundColor: "#007aff",
    padding: 15,
    borderRadius: 18,

  },
  caption: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  actions: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: "#1565C0",
    borderRadius: 18,
    padding: 18,
  },
  featureTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
    textAlign: "center",
  },
  featureText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  couplesImage: {
    // aspectRatio: 1.5,
    borderRadius: 18,
    marginTop: 10,
    overflow: "hidden",
    // width: "100%",
    height: 200,
    width: "100%",
  },

  cardss: {
    backgroundColor: "#B65E3C",
  }
});
