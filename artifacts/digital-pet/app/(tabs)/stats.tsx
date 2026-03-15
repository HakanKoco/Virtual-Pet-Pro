import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";
import { usePet } from "@/context/PetContext";
import { PetAvatar } from "@/components/PetAvatar";
import { StatBar } from "@/components/ui/StatBar";
import {
  getMood,
  getMoodColor,
  getMoodLabel,
  getOverallScore,
  formatNumber,
} from "@/utils/petHelpers";
import { getLevelTitle } from "@/constants/gameConfig";
import { ACHIEVEMENTS } from "@/constants/achievements";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <View style={[statCardStyles.container, { borderColor: `${color}30` }]}>
      <View style={[statCardStyles.iconCircle, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={statCardStyles.value}>{value}</Text>
      <Text style={statCardStyles.label}>{label}</Text>
    </View>
  );
}

const statCardStyles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    color: Colors.text,
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { petState } = usePet();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : 0;

  const mood = getMood(petState.stats);
  const moodColor = getMoodColor(mood);
  const moodLabel = getMoodLabel(mood);
  const overallScore = Math.round(getOverallScore(petState.stats));
  const levelTitle = getLevelTitle(petState.level);

  const daysAlive = Math.floor(
    (Date.now() - new Date(petState.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const totalUnlocked = petState.unlockedAchievements.length;

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
        <Text style={styles.screenTitle}>İstatistikler</Text>

        <View style={styles.profileCard}>
          <PetAvatar name={petState.name} stats={petState.stats} size="small" />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{petState.name}</Text>
            <Text style={styles.profileTitle}>{levelTitle}</Text>
            <View style={styles.profileBadges}>
              <View style={[styles.scoreBadge, { backgroundColor: `${moodColor}20` }]}>
                <Text style={[styles.scoreBadgeText, { color: moodColor }]}>
                  {moodLabel}
                </Text>
              </View>
              <View style={styles.overallBadge}>
                <Text style={styles.overallScore}>{overallScore}</Text>
                <Text style={styles.overallLabel}>/100</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Seviye"
            value={petState.level}
            icon="star"
            color={Colors.primary}
          />
          <StatCard
            label="Toplam XP"
            value={formatNumber(petState.totalXp)}
            icon="diamond"
            color={Colors.xp}
          />
          <StatCard
            label="Gün Serisi"
            value={petState.streak}
            icon="flame"
            color={Colors.streak}
          />
          <StatCard
            label="Günler"
            value={daysAlive}
            icon="calendar"
            color={Colors.accent}
          />
          <StatCard
            label="Toplam Aksiyon"
            value={formatNumber(petState.totalActions)}
            icon="flash"
            color={Colors.secondaryLight}
          />
          <StatCard
            label="Başarımlar"
            value={`${totalUnlocked}/${ACHIEVEMENTS.length}`}
            icon="trophy"
            color={Colors.success}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Güncel Durumlar</Text>
          {(["hunger", "happiness", "energy", "cleanliness", "health"] as const).map(
            (stat) => (
              <StatBar
                key={stat}
                stat={stat}
                value={petState.stats[stat]}
              />
            )
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Aksiyon Sayaçları</Text>
          <View style={styles.actionCounts}>
            {(["feed", "play", "sleep", "clean", "heal"] as const).map((action) => {
              const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
                feed: "restaurant",
                play: "game-controller",
                sleep: "moon",
                clean: "sparkles",
                heal: "medkit",
              };
              const labels: Record<string, string> = {
                feed: "Besle",
                play: "Oyna",
                sleep: "Uyut",
                clean: "Temizle",
                heal: "İyileştir",
              };
              return (
                <View key={action} style={styles.actionCountItem}>
                  <Ionicons
                    name={icons[action]}
                    size={16}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.actionCountLabel}>{labels[action]}</Text>
                  <Text style={styles.actionCountValue}>
                    {petState.actionCounts[action]}
                  </Text>
                </View>
              );
            })}
          </View>
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
  profileCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    color: Colors.text,
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  profileTitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  profileBadges: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 4,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  scoreBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  overallBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 1,
  },
  overallScore: {
    color: Colors.text,
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  overallLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  actionCounts: {
    gap: 8,
  },
  actionCountItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionCountLabel: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  actionCountValue: {
    color: Colors.text,
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
});
