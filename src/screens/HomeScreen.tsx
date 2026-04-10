import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PickerField } from "../components/PickerField";
import { Screen } from "../components/Screen";
import { useLanguage } from "../localization/LanguageContext";
import { languageOptions } from "../localization/translations";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { copy, language, setLanguage } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const heroAnim = useRef(new Animated.Value(0)).current;
  const introCardAnim = useRef(new Animated.Value(0)).current;
  const couplesCardAnim = useRef(new Animated.Value(0)).current;
  const featureCardsAnim = useRef(new Animated.Value(0)).current;
  const learnMoreAnim = useRef(new Animated.Value(0)).current;
  const selectedLanguage = languageOptions.find((option) => option.code === language);

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
          <Text style={styles.title}>💍 {copy.home.title}</Text>
          <Text style={styles.subtitle}>{copy.home.subtitle}</Text>
        </Animated.View>

        <Animated.View style={getRevealStyle(introCardAnim)}>
          <Card>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{copy.home.registeredPrompt}</Text>
              <View style={styles.actions}>
                <Button label={`🚀 ${copy.home.loginButton}`} onPress={() => navigation.navigate("Login")} />
                <Button
                  label={`✅ ${copy.home.registerButton}`}
                  onPress={() => navigation.navigate("Register")}
                  variant="secondary"
                />
              </View>
              <PickerField
                label={copy.home.languageTitle}
                onPress={() => setShowLanguageModal(true)}
                placeholder={copy.home.languageHint}
                value={selectedLanguage ? `${selectedLanguage.nativeLabel} (${selectedLanguage.label})` : ""}
              />
            </View>
          </Card>
        </Animated.View>

        <Animated.View style={getRevealStyle(couplesCardAnim)}>
          <Card>
            <View style={styles.section}>
              <Text style={styles.bannerText}>❤️ {copy.home.alliancesTitle} ❤️</Text>
              <Image
                source={require("../../assets/couples.jpg")}
                style={styles.couplesImage}
                resizeMode="cover"
              // width={100}
              // height={300}
              />
              <Text style={styles.caption}>❤️ {copy.home.alliancesCaption} ❤️</Text>
            </View>
          </Card>
        </Animated.View>

        <Animated.View style={getRevealStyle(featureCardsAnim)}>
          <View style={styles.section}>
            <Text style={styles.bannerText}>💖 {copy.home.specialSomeoneTitle} 💖</Text>
          </View>

          <Card>
            <View style={[styles.cardss, styles.section, styles.featureCard]}>
              <Text style={styles.featureTitle}>📝 {copy.home.signUpTitle}</Text>
              <View style={styles.actions}>
                <Text style={styles.featureText}>{copy.home.signUpText}</Text>
              </View>
            </View>
          </Card>
          <Card>
            <View style={[styles.section, styles.featureCard]}>
              <Text style={styles.featureTitle}>💞 {copy.home.connectTitle}</Text>
              <View style={styles.actions}>
                <Text style={styles.featureText}>{copy.home.connectText}</Text>
              </View>
            </View>
          </Card>
          <Card>
            <View style={[styles.section, styles.featureCard]}>
              <Text style={styles.featureTitle}>💬 {copy.home.interactTitle}</Text>
              <View style={styles.actions}>
                <Text style={styles.featureText}>{copy.home.interactText}</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View style={getRevealStyle(couplesCardAnim)}>

          <View style={styles.section}>
            <Text style={styles.bannerText}>{copy.home.membersTitle}</Text>
            <Text style={styles.caption}>{copy.home.membersCaption}</Text>
            <Text style={styles.bannerTexts}>{copy.home.membersBody}</Text>
            <Text style={styles.caption}>{copy.home.globalRegions}</Text>

            <Card>
              <View style={styles.section}>
                <Text style={styles.bannerText}>{copy.home.trustedTitle}</Text>
                <Text style={styles.caption}>💑 {copy.home.bestMatches}</Text>
                <Text style={styles.caption}>✅ {copy.home.verifiedProfiles}</Text>
                <Text style={styles.caption}>🔒 {copy.home.privacy}</Text>
              </View>
            </Card>


          </View>
        </Animated.View>

        <Animated.View style={getRevealStyle(learnMoreAnim)}>
          <Card>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{copy.home.learnMore}</Text>
              <View style={styles.actions}>
                <Button label={copy.home.aboutButton} onPress={() => navigation.navigate("About")} variant="secondary" />
                <Button label={copy.home.rulesButton} onPress={() => navigation.navigate("Rules")} variant="secondary" />
                <Button
                  label={copy.home.conclusionButton}
                  onPress={() => navigation.navigate("Conclusion")}
                  variant="secondary"
                />
                <Button
                  label={copy.home.privacyPolicyButton}
                  onPress={() => navigation.navigate("PrivacyPolicy")}
                  variant="secondary"
                />
              </View>
            </View>
          </Card>
        </Animated.View>
      </View>

      <Modal animationType="slide" transparent visible={showLanguageModal}>
        <View style={styles.modalBackdrop}>
          <Card>
            <Text style={styles.modalTitle}>{copy.home.languageTitle}</Text>
            <ScrollView contentContainerStyle={styles.optionListContent} style={styles.optionList}>
              {languageOptions.map((option) => (
                <Pressable
                  key={option.code}
                  onPress={() => {
                    void setLanguage(option.code);
                    setShowLanguageModal(false);
                  }}
                  style={styles.optionItem}
                >
                  <Text style={styles.optionText}>
                    {option.nativeLabel} ({option.label})
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Button label="Close" onPress={() => setShowLanguageModal(false)} variant="secondary" />
          </Card>
        </View>
      </Modal>

      <Text style={styles.caption}>{copy.common.copyright}</Text>
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
  modalBackdrop: {
    backgroundColor: "rgba(30, 27, 22, 0.45)",
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
  },
  optionList: {
    marginBottom: 16,
    maxHeight: 260,
  },
  optionListContent: {
    gap: 10,
  },
  optionItem: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
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
