import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";
import { ACHIEVEMENTS, Achievement } from "@/constants/achievements";
import { AchievementCard } from "@/components/AchievementCard";
import { usePet } from "@/context/PetContext";

type Category = "all" | Achievement["category"];

const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: "all", label: "Tümü", icon: "grid" },
  { key: "milestones", label: "Kilometre", icon: "trophy" },
  { key: "actions", label: "Aksiyonlar", icon: "flash" },
  { key: "streaks", label: "Seriler", icon: "flame" },
  { key: "special", label: "Özel", icon: "star" },
];

export default function AchievementsScreen() {
  const insets = useSafeAreaInsets();
  const { petState } = usePet();
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : 0;

  const filtered =
    selectedCategory === "all"
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter((a) => a.category === selectedCategory);

  const totalUnlocked = petState.unlockedAchievements.length;
  const totalAchievements = ACHIEVEMENTS.length;
  const progress = totalUnlocked / totalAchievements;

  return (
    <View style={[styles.root, { backgroundColor: Colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topPadding + 16,
            paddingBottom: bottomPadding + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.screenTitle}>Başarımlar</Text>

        <LinearGradient
          colors={Colors.gradientPurple}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <View style={styles.summaryContent}>
            <View>
              <Text style={styles.summaryNumber}>{totalUnlocked}</Text>
              <Text style={styles.summaryLabel}>Kazanılan</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View>
              <Text style={styles.summaryNumber}>{totalAchievements}</Text>
              <Text style={styles.summaryLabel}>Toplam</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View>
              <Text style={styles.summaryNumber}>
                {Math.round(progress * 100)}%
              </Text>
              <Text style={styles.summaryLabel}>Tamamlandı</Text>
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>
        </LinearGradient>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            const count =
              cat.key === "all"
                ? ACHIEVEMENTS.length
                : ACHIEVEMENTS.filter((a) => a.category === cat.key).length;
            return (
              <Pressable
                key={cat.key}
                onPress={() => setSelectedCategory(cat.key)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Ionicons
                  name={cat.icon as keyof typeof Ionicons.glyphMap}
                  size={14}
                  color={isActive ? "#fff" : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
                <View
                  style={[
                    styles.filterCount,
                    isActive && styles.filterCountActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterCountText,
                      isActive && styles.filterCountTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.list}>
          {filtered.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlocked={petState.unlockedAchievements.includes(achievement.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  summaryContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  summaryNumber: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.xp,
    borderRadius: 4,
  },
  filterRow: {
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  filterTextActive: {
    color: "#fff",
  },
  filterCount: {
    backgroundColor: Colors.backgroundTertiary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  filterCountActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  filterCountText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
  filterCountTextActive: {
    color: "#fff",
  },
  list: {
    gap: 0,
  },
});
