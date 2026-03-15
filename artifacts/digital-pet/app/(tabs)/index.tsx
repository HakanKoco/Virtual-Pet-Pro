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
import { router } from "expo-router";

import { Colors } from "@/constants/colors";
import { ActionType } from "@/constants/gameConfig";
import { PetAvatar } from "@/components/PetAvatar";
import { StatBar } from "@/components/ui/StatBar";
import { ActionButton } from "@/components/ui/ActionButton";
import { XPBar } from "@/components/ui/XPBar";
import { StreakBadge } from "@/components/StreakBadge";
import { DailyTaskCard } from "@/components/DailyTaskCard";
import { AchievementToast } from "@/components/AchievementToast";
import { LevelUpModal } from "@/components/LevelUpModal";
import { DailyRewardModal } from "@/components/DailyRewardModal";
import { usePet } from "@/context/PetContext";
import { AchievementId } from "@/constants/achievements";
import { DailyRewardInfo } from "@/utils/dailyReward";

const ACTIONS: ActionType[] = ["feed", "play", "sleep", "clean", "heal"];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    petState,
    performAction,
    claimDailyReward,
    isDailyRewardReady,
    newAchievements,
    clearNewAchievements,
    levelUpAnimation,
    clearLevelUp,
  } = usePet();

  const [currentToast, setCurrentToast] = useState<AchievementId | null>(null);
  const toastQueueRef = React.useRef<AchievementId[]>([]);

  const [dailyRewardVisible, setDailyRewardVisible] = useState(isDailyRewardReady);
  const [pendingReward, setPendingReward] = useState<DailyRewardInfo | null>(
    isDailyRewardReady
      ? { coins: 0, xp: 0, message: "Yükleniyor...", streakBonus: false }
      : null
  );

  React.useEffect(() => {
    if (isDailyRewardReady && !dailyRewardVisible) {
      setDailyRewardVisible(true);
      setPendingReward({
        coins: 0,
        xp: 0,
        message: "Hoş geldin!",
        streakBonus: false,
      });
    }
  }, [isDailyRewardReady]);

  const handleClaimReward = () => {
    const reward = claimDailyReward();
    setDailyRewardVisible(false);
    setPendingReward(null);
  };

  React.useEffect(() => {
    if (newAchievements.length > 0) {
      toastQueueRef.current = [...toastQueueRef.current, ...newAchievements];
      clearNewAchievements();
      if (!currentToast) {
        setCurrentToast(toastQueueRef.current.shift()!);
      }
    }
  }, [newAchievements]);

  const handleToastHide = () => {
    if (toastQueueRef.current.length > 0) {
      setCurrentToast(toastQueueRef.current.shift()!);
    } else {
      setCurrentToast(null);
    }
  };

  const handleAction = (action: ActionType) => {
    performAction(action);
  };

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : 0;

  const previewReward = React.useMemo(() => {
    if (!isDailyRewardReady) return null;
    const { calculateDailyReward } = require("@/utils/dailyReward");
    return calculateDailyReward(petState.streak) as DailyRewardInfo;
  }, [isDailyRewardReady, petState.streak]);

  return (
    <View style={[styles.root, { backgroundColor: Colors.background }]}>
      {currentToast && (
        <AchievementToast
          achievementId={currentToast}
          onHide={handleToastHide}
        />
      )}

      <LevelUpModal
        visible={levelUpAnimation}
        level={petState.level}
        onClose={clearLevelUp}
      />

      <DailyRewardModal
        visible={dailyRewardVisible}
        reward={previewReward}
        streak={petState.streak}
        onClaim={handleClaimReward}
      />

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
        <View style={styles.topBar}>
          <StreakBadge streak={petState.streak} />
          <View style={styles.rightBadges}>
            {isDailyRewardReady && (
              <Pressable
                onPress={() => setDailyRewardVisible(true)}
                style={styles.rewardBadge}
              >
                <Text style={styles.rewardBadgeText}>🎁</Text>
              </Pressable>
            )}
            <View style={styles.coinPill}>
              <Ionicons name="logo-bitcoin" size={13} color={Colors.secondary} />
              <Text style={styles.coinText}>{petState.coins}</Text>
            </View>
            <View style={styles.levelPill}>
              <Ionicons name="star" size={14} color={Colors.xp} />
              <Text style={styles.levelPillText}>Lv.{petState.level}</Text>
            </View>
          </View>
        </View>

        <View style={styles.avatarSection}>
          <PetAvatar
            name={petState.name}
            stats={petState.stats}
            size="large"
          />
        </View>

        <View style={styles.card}>
          <XPBar
            level={petState.level}
            xp={petState.xp}
            totalXp={petState.totalXp}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>İstatistikler</Text>
          <View style={styles.statsGrid}>
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
        </View>

        <View style={styles.actionsCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Hızlı Aksiyonlar</Text>
            <Pressable
              onPress={() => router.push("/(tabs)/activities")}
              style={styles.activitiesLink}
            >
              <Text style={styles.activitiesLinkText}>Tüm aktiviteler</Text>
              <Ionicons name="arrow-forward" size={13} color={Colors.primary} />
            </Pressable>
          </View>
          <View style={styles.actionsGrid}>
            {ACTIONS.map((action) => (
              <ActionButton
                key={action}
                action={action}
                onPress={() => handleAction(action)}
                cooldownEnd={petState.actionCooldowns[action]}
              />
            ))}
          </View>
        </View>

        <DailyTaskCard dailyTasks={petState.dailyTasks} />
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
    gap: 12,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rewardBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: `${Colors.secondary}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardBadgeText: {
    fontSize: 18,
  },
  coinPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${Colors.secondary}20`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  coinText: {
    color: Colors.secondary,
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  levelPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: `${Colors.xp}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelPillText: {
    color: Colors.xp,
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  actionsCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  activitiesLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activitiesLinkText: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  statsGrid: {
    gap: 0,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
