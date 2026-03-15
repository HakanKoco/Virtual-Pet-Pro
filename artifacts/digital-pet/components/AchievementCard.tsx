import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";
import { Achievement } from "@/constants/achievements";
import { formatNumber } from "@/utils/petHelpers";

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
}

const CATEGORY_COLORS: Record<Achievement["category"], [string, string]> = {
  milestones: ["#7C5CBF", "#4A3080"],
  actions: ["#FF6B6B", "#CC4444"],
  streaks: ["#FF6B35", "#CC4420"],
  special: ["#FFD700", "#FFA500"],
};

export function AchievementCard({ achievement, unlocked }: AchievementCardProps) {
  const colors = CATEGORY_COLORS[achievement.category];

  return (
    <View style={[styles.container, !unlocked && styles.locked]}>
      <View style={styles.iconWrapper}>
        {unlocked ? (
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconBg}
          >
            <Ionicons
              name={achievement.icon as keyof typeof Ionicons.glyphMap}
              size={24}
              color="#fff"
            />
          </LinearGradient>
        ) : (
          <View style={[styles.iconBg, styles.lockedIconBg]}>
            <Ionicons name="lock-closed" size={20} color={Colors.textTertiary} />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !unlocked && styles.lockedText]}>
          {unlocked ? achievement.title : "???"}
        </Text>
        <Text style={[styles.description, !unlocked && styles.lockedDesc]}>
          {unlocked ? achievement.description : "Gizli başarım"}
        </Text>
      </View>
      <View style={styles.rewardBlock}>
        {unlocked ? (
          <>
            <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
            <Text style={styles.xpReward}>+{formatNumber(achievement.xpReward)} XP</Text>
          </>
        ) : (
          <Text style={styles.xpRewardLocked}>?? XP</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
    marginBottom: 8,
  },
  locked: {
    opacity: 0.5,
  },
  iconWrapper: {},
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedIconBg: {
    backgroundColor: Colors.backgroundTertiary,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  lockedText: {
    color: Colors.textTertiary,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  lockedDesc: {
    color: Colors.textTertiary,
  },
  rewardBlock: {
    alignItems: "center",
    gap: 3,
  },
  xpReward: {
    color: Colors.xp,
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
  xpRewardLocked: {
    color: Colors.textTertiary,
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
});
