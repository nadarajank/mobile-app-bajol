import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const GoldenGlobeCard = () => {
    const subscriptionsCount = 12000;
    const marriagesCount = 4500;

    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 6000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={styles.container}>
            {/* <LinearGradient
        colors={["#FFE082", "#FFD700", "#D4AF37", "#B8860B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.globe}
      >
       
        <View style={[styles.ring, styles.ringOne]} />
        <View style={[styles.ring, styles.ringTwo]} />

       
        <FontAwesome5
          name="globe-asia"
          size={85}
          color="#FFFFFF"
        />
      </LinearGradient> */}

            <Animated.View
                style={{
                    transform: [{ rotate: spin }],
                }}
            >
                <LinearGradient
                    colors={["#FFE082", "#FFD700", "#D4AF37", "#B8860B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.globe}
                >
                    {/* Rings */}
                    <View style={[styles.ring, styles.ringOne]} />
                    <View style={[styles.ring, styles.ringTwo]} />

                    {/* Globe Icon */}
                    <FontAwesome5
                        name="globe-asia"
                        size={85}
                        color="#FFFFFF"
                    />
                </LinearGradient>
            </Animated.View>

            {/* Golden Card */}
            <LinearGradient
                colors={["#FFD700", "#D4AF37", "#B8860B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <Text style={styles.title}>
                    Our Growing Matrimony Network
                </Text>

                <Text style={styles.description}>
                    <Text style={styles.number}>
                        {subscriptionsCount.toLocaleString()}+
                    </Text>{" "}
                    total subscriptions and{" "}
                    <Text style={styles.number}>
                        {marriagesCount.toLocaleString()}+
                    </Text>{" "}
                    successful marriages worldwide.
                </Text>
            </LinearGradient>
        </View>
    );
};

export default GoldenGlobeCard;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 30,
        paddingHorizontal: 20,
        // backgroundColor: "#000",
    },

    globe: {
        width: 190,
        height: 190,
        borderRadius: 100,

        alignItems: "center",
        justifyContent: "center",

        marginBottom: 30,

        position: "relative",
        overflow: "hidden",

        shadowColor: "#FFD700",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,

        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.4)",
    },

    ring: {
        position: "absolute",
        width: 170,
        height: 170,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.25)",
    },

    ringOne: {
        transform: [{ rotate: "25deg" }],
    },

    ringTwo: {
        transform: [{ rotate: "-25deg" }],
    },

    card: {
        width: "100%",
        borderRadius: 24,

        paddingVertical: 25,
        paddingHorizontal: 22,

        shadowColor: "#FFD700",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 12,
    },

    title: {
        fontSize: 24,
        fontWeight: "800",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 14,
    },

    description: {
        fontSize: 17,
        lineHeight: 28,
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "500",
    },

    number: {
        fontSize: 20,
        fontWeight: "900",
        color: "#FFFFFF",
    },
});