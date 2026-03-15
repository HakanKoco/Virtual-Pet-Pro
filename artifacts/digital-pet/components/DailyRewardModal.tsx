import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";
import { DailyRewardInfo } from "@/utils/dailyReward";

interface DailyRewardModalProps {
  visible: boolean;
  reward: DailyRewardInfo | null;
  streak: number;
  onClaim: () => void;
}

export function DailyRewardModal({
  visible,
  reward,
  streak,
  onClaim,
}: DailyRewardModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -8,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!reward) return null;

  return (
    <Modal transparent animationType="none" visible={visible}>
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View
          style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
        >
          <LinearGradient
            colors={["#1E1A3A", "#2D1F5E"]}
            style={styles.gradient}
          >
            <Animated.Text
              style={[styles.giftEmoji, { transform: [{ translateY: bounceAnim }] }]}
            >
              🎁
            </Animated.Text>

            <Text style={styles.title}>Günlük Ödül!</Text>
            <Text style={styles.message}>{reward.message}</Text>

            {reward.streakBonus && (
              <View style={styles.streakBanner}>
                <Ionicons name="flame" size={18} color={Colors.streak} />
                <Text style={styles.streakText}>
                  {streak} Günlük Seri Bonusu!
                </Text>
              </View>
            )}

            <View style={styles.rewardRow}>
              <View style={styles.rewardItem}>
                <View style={[styles.rewardIcon, { backgroundColor: `${Colors.xp}20` }]}>
                  <Ionicons name="diamond" size={22} color={Colors.xp} />
                </View>
                <Text style={styles.rewardAmount}>+{reward.xp}</Text>
                <Text style={styles.rewardLabel}>XP</Text>
              </View>

              <View style={styles.rewardDivider} />

              <View style={styles.rewardItem}>
                <View style={[styles.rewardIcon, { backgroundColor: `${Colors.secondary}20` }]}>
                  <Ionicons name="logo-bitcoin" size={22} color={Colors.secondary} />
                </View>
                <Text style={styles.rewardAmount}>+{reward.coins}</Text>
                <Text style={styles.rewardLabel}>Coin</Text>
              </View>
            </View>

            <Pressable
              onPress={onClaim}
              style={({ pressed }) => [
                styles.claimButton,
                { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
            >
              <LinearGradient
                colors={Colors.gradientGold}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.claimGradient}
              >
                <Ionicons name="gift" size={18} color="#1A1A00" />
                <Text style={styles.claimText}>Ödülü Al!</Text>
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "82%",
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: `${Colors.primary}60`,
  },
  gradient: {
    padding: 28,
    alignItems: "center",
    gap: 14,
  },
  giftEmoji: {
    fontSize: 64,
  },
  title: {
    color: Colors.text,
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  message: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  streakBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: `${Colors.streak}20`,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  streakText: {
    color: Colors.streak,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
  },
  rewardItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  rewardIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardAmount: {
    color: Colors.text,
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  rewardLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  rewardDivider: {
    width: 1,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 8,
  },
  claimButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 4,
  },
  claimGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  claimText: {
    color: "#1A1A00",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
});
