import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";
import { getPetTypeConfig } from "@/constants/petTypes";
import {
  getMood,
  getMoodColor,
  getMoodLabel,
  PetStats,
} from "@/utils/petHelpers";
import { usePet } from "@/context/PetContext";

interface PetAvatarProps {
  name: string;
  stats: PetStats;
  size?: "small" | "large";
}

export function PetAvatar({ name, stats, size = "large" }: PetAvatarProps) {
  const { petState } = usePet();
  const petTypeConfig = getPetTypeConfig(petState.petType);

  const mood = getMood(stats);
  const moodColor = getMoodColor(mood);
  const moodLabel = getMoodLabel(mood);

  // Pick pet emoji based on mood
  const getEmoji = (): string => {
    const e = petTypeConfig.emoji;
    switch (mood) {
      case "ecstatic": return e.excited;
      case "happy": return e.happy;
      case "content": return e.happy;
      case "neutral": return e.neutral;
      case "sad": return e.sad;
      case "unhappy": return e.sad;
      case "desperate": return e.sick;
      default: return e.neutral;
    }
  };

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
  const petColor = petTypeConfig.color;

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
          colors={[`${petColor}30`, `${moodColor}15`]}
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
          <Text style={{ fontSize: emojiSize }}>{getEmoji()}</Text>
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
          <Text style={[styles.petTypeBadge, { color: petColor }]}>
            {petTypeConfig.name} · {petTypeConfig.description}
          </Text>
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
    gap: 5,
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
  petTypeBadge: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
