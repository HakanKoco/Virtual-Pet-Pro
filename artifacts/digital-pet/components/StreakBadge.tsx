import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const isActive = streak > 0;
  const getStreakColor = (): [string, string] => {
    if (streak >= 30) return ["#FF1493", "#FF69B4"];
    if (streak >= 14) return ["#FF6B35", "#FF8C42"];
    if (streak >= 7) return ["#FF9500", "#FFCC00"];
    if (streak >= 3) return [Colors.streak, Colors.streakLight];
    return ["#555", "#777"];
  };

  const colors = getStreakColor();

  return (
    <LinearGradient
      colors={isActive ? colors : ["#252545", "#1E1E35"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Ionicons
        name="flame"
        size={18}
        color={isActive ? "#fff" : Colors.textTertiary}
      />
      <Text style={[styles.number, !isActive && styles.inactiveText]}>
        {streak}
      </Text>
      <Text style={[styles.label, !isActive && styles.inactiveText]}>
        gün
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  number: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  label: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  inactiveText: {
    color: Colors.textTertiary,
  },
});
