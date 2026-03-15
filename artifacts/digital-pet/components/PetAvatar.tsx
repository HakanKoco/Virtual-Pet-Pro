import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";
import {
  getMood,
  getMoodColor,
  getMoodEmoji,
  getMoodLabel,
  PetStats,
} from "@/utils/petHelpers";

interface PetAvatarProps {
  name: string;
  stats: PetStats;
  size?: "small" | "large";
}

export function PetAvatar({ name, stats, size = "large" }: PetAvatarProps) {
  const mood = getMood(stats);
  const moodColor = getMoodColor(mood);
  const moodEmoji = getMoodEmoji(mood);
  const moodLabel = getMoodLabel(mood);

  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const isLarge = size === "large";
  const avatarSize = isLarge ? 130 : 70;
  const emojiSize = isLarge ? 64 : 34;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: avatarSize + 40,
            height: avatarSize + 40,
            borderRadius: (avatarSize + 40) / 2,
            borderColor: moodColor,
            opacity: glowAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.avatarWrapper,
          {
            transform: [{ translateY: floatAnim }],
            width: avatarSize,
            height: avatarSize,
          },
        ]}
      >
        <LinearGradient
          colors={[`${moodColor}30`, `${moodColor}10`]}
          style={[
            styles.avatarBg,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              borderColor: `${moodColor}60`,
            },
          ]}
        >
          <Text style={{ fontSize: emojiSize }}>{moodEmoji}</Text>
        </LinearGradient>
      </Animated.View>

      {isLarge && (
        <View style={styles.nameBlock}>
          <Text style={styles.nameText}>{name}</Text>
          <View style={[styles.moodBadge, { backgroundColor: `${moodColor}20` }]}>
            <Text style={[styles.moodText, { color: moodColor }]}>
              {moodLabel}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
  },
  glowRing: {
    position: "absolute",
    borderWidth: 2,
    top: -20,
  },
  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBg: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  nameBlock: {
    alignItems: "center",
    gap: 6,
  },
  nameText: {
    color: Colors.text,
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  moodBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  moodText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
});
