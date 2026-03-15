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
import { usePet } from "@/context/PetContext";
import { FeedingActivity } from "@/components/activities/FeedingActivity";
import { PlayActivity } from "@/components/activities/PlayActivity";
import { SleepActivity } from "@/components/activities/SleepActivity";
import { CleanActivity } from "@/components/activities/CleanActivity";
import { HealActivity } from "@/components/activities/HealActivity";
import { StatBar } from "@/components/ui/StatBar";

type ActivityTab = "feed" | "play" | "sleep" | "clean" | "heal";

interface Tab {
  id: ActivityTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const TABS: Tab[] = [
  { id: "feed", label: "Besle", icon: "restaurant", color: Colors.hunger },
  { id: "play", label: "Oyna", icon: "game-controller", color: Colors.happiness },
  { id: "sleep", label: "Uyut", icon: "moon", color: Colors.energy },
  { id: "clean", label: "Temizle", icon: "sparkles", color: Colors.cleanliness },
  { id: "heal", label: "İyileştir", icon: "medkit", color: Colors.health },
];

export default function ActivitiesScreen() {
  const insets = useSafeAreaInsets();
  const { petState } = usePet();
  const [activeTab, setActiveTab] = useState<ActivityTab>("feed");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : 0;

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  const ACTIVITY_STAT_MAP: Record<ActivityTab, keyof typeof petState.stats> = {
    feed: "hunger",
    play: "happiness",
    sleep: "energy",
    clean: "cleanliness",
    heal: "health",
  };

  const renderActivity = () => {
    switch (activeTab) {
      case "feed": return <FeedingActivity />;
      case "play": return <PlayActivity />;
      case "sleep": return <SleepActivity />;
      case "clean": return <CleanActivity />;
      case "heal": return <HealActivity />;
    }
  };

  const relevantStat = ACTIVITY_STAT_MAP[activeTab];
  const statValue = petState.stats[relevantStat];

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
        <Text style={styles.screenTitle}>Aktiviteler</Text>

        {/* Horizontal tab selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={({ pressed }) => [
                  styles.tabChip,
                  isActive && { backgroundColor: tab.color, borderColor: tab.color },
                  pressed && styles.tabChipPressed,
                ]}
              >
                <Ionicons
                  name={tab.icon}
                  size={16}
                  color={isActive ? "#fff" : tab.color}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    isActive && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Relevant stat quick view */}
        <View style={styles.statQuickCard}>
          <View style={styles.statQuickHeader}>
            <Ionicons
              name={currentTab.icon}
              size={16}
              color={currentTab.color}
            />
            <Text style={[styles.statQuickLabel, { color: currentTab.color }]}>
              Mevcut Durum
            </Text>
          </View>
          <StatBar stat={relevantStat} value={statValue} />
        </View>

        {/* Activity card */}
        <View style={styles.activityCard}>
          {renderActivity()}
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
    gap: 14,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  tabRow: {
    gap: 8,
    paddingBottom: 4,
  },
  tabChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
  },
  tabChipPressed: {
    opacity: 0.8,
  },
  tabLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  tabLabelActive: {
    color: "#fff",
  },
  statQuickCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  statQuickHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statQuickLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  activityCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
});
