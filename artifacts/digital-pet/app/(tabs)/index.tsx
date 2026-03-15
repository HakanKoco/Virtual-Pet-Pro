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
import { usePet } from "@/context/PetContext";
import { AchievementId } from "@/constants/achievements";

const ACTIONS: ActionType[] = ["feed", "play", "sleep", "clean", "heal"];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    petState,
    performAction,
    newAchievements,
    clearNewAchievements,
    levelUpAnimation,
    clearLevelUp,
  } = usePet();

  const [currentToast, setCurrentToast] = useState<AchievementId | null>(null);
  const toastQueueRef = React.useRef<AchievementId[]>([]);

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
          <View style={styles.levelPill}>
            <Ionicons name="star" size={14} color={Colors.xp} />
            <Text style={styles.levelPillText}>Lv.{petState.level}</Text>
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
          <Text style={styles.sectionTitle}>Aksiyonlar</Text>
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
  sectionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
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
