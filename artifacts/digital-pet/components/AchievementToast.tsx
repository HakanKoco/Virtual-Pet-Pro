import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { ACHIEVEMENTS, AchievementId } from "@/constants/achievements";

interface AchievementToastProps {
  achievementId: AchievementId;
  onHide: () => void;
}

export function AchievementToast({ achievementId, onHide }: AchievementToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!achievement) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + 12,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.iconCircle}>
        <Ionicons
          name={achievement.icon as keyof typeof Ionicons.glyphMap}
          size={22}
          color={Colors.xp}
        />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.badgeText}>BAŞARIM KAZANILDI</Text>
        <Text style={styles.titleText}>{achievement.title}</Text>
      </View>
      <Text style={styles.xpText}>+{achievement.xpReward} XP</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 999,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: `${Colors.xp}40`,
    shadowColor: Colors.xp,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.xp}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  badgeText: {
    color: Colors.xp,
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  titleText: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  xpText: {
    color: Colors.xp,
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
});
