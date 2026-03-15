import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/colors";
import { usePet } from "@/context/PetContext";

interface CareItem {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

const CARE_ITEMS: CareItem[] = [
  { id: "vitamin", label: "Vitamin", emoji: "💊", color: Colors.success },
  { id: "love", label: "Sevgi", emoji: "❤️", color: Colors.danger },
  { id: "rest", label: "Dinlenme", emoji: "🛌", color: Colors.energy },
  { id: "herbs", label: "Bitki", emoji: "🌿", color: "#4CAF50" },
];

export function HealActivity() {
  const { petState, performAction } = usePet();
  const [selectedCare, setSelectedCare] = useState<CareItem | null>(null);
  const [isHealing, setIsHealing] = useState(false);
  const [healDone, setHealDone] = useState(false);

  const petScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartY = useRef(new Animated.Value(0)).current;

  const animateHeal = () => {
    // Pet glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ]),
      { iterations: 4 }
    ).start(() => glowOpacity.setValue(0));

    // Pet pulse
    Animated.sequence([
      Animated.spring(petScale, { toValue: 1.15, useNativeDriver: true, tension: 100, friction: 5 }),
      Animated.spring(petScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 5 }),
    ]).start();

    // Heart float
    heartScale.setValue(0);
    heartY.setValue(0);
    Animated.parallel([
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, tension: 150, friction: 5 }),
      Animated.timing(heartY, { toValue: -70, duration: 1000, useNativeDriver: true }),
    ]).start(() => {
      Animated.timing(heartScale, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    });
  };

  const handleHeal = () => {
    if (!selectedCare || isHealing) return;
    setIsHealing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    animateHeal();
    performAction("heal");

    setTimeout(() => {
      setIsHealing(false);
      setHealDone(true);
      setTimeout(() => setHealDone(false), 2500);
    }, 1500);
  };

  const healthPercent = Math.round(petState.stats.health);
  const healthColor =
    healthPercent >= 70 ? Colors.success : healthPercent >= 40 ? Colors.warning : Colors.danger;

  return (
    <View style={styles.container}>
      <View style={styles.healthStatus}>
        <Ionicons name="heart" size={16} color={healthColor} />
        <Text style={[styles.healthValue, { color: healthColor }]}>
          {healthPercent}
        </Text>
        <Text style={styles.healthLabel}>Sağlık</Text>
        <View style={styles.healthBarBg}>
          <View
            style={[
              styles.healthBarFill,
              {
                width: `${healthPercent}%`,
                backgroundColor: healthColor,
              },
            ]}
          />
        </View>
      </View>

      <Text style={styles.instruction}>
        {healDone
          ? "Bakım tamamlandı! 💚"
          : selectedCare
          ? `"${selectedCare.label}" ile Pete'e bak!`
          : "Bir bakım yöntemi seç"}
      </Text>

      <View style={styles.petArea}>
        {/* Glow ring */}
        <Animated.View
          style={[
            styles.glowRing,
            { opacity: glowOpacity, borderColor: Colors.success },
          ]}
        />

        {/* Floating heart */}
        <Animated.Text
          style={[
            styles.floatingHeart,
            {
              transform: [{ scale: heartScale }, { translateY: heartY }],
            },
          ]}
        >
          {selectedCare?.emoji ?? "❤️"}
        </Animated.Text>

        <Pressable onPress={handleHeal} disabled={!selectedCare || isHealing}>
          <Animated.View style={{ transform: [{ scale: petScale }] }}>
            <Text style={styles.petEmoji}>
              {isHealing ? "😻" : healDone ? "😸" : "🐱"}
            </Text>
          </Animated.View>
        </Pressable>

        {selectedCare && !isHealing && (
          <Text style={styles.tapHint}>Pete'e dokun!</Text>
        )}
      </View>

      <View style={styles.careGrid}>
        {CARE_ITEMS.map((item) => {
          const isSelected = selectedCare?.id === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => {
                setSelectedCare(isSelected ? null : item);
                Haptics.selectionAsync();
              }}
              style={[
                styles.careItem,
                isSelected && { borderColor: item.color, backgroundColor: `${item.color}20` },
              ]}
            >
              <Text style={styles.careEmoji}>{item.emoji}</Text>
              <Text
                style={[
                  styles.careLabel,
                  isSelected && { color: item.color },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.bonusRow}>
        <View style={styles.bonusItem}>
          <Ionicons name="heart" size={14} color={Colors.health} />
          <Text style={styles.bonusText}>+40 Sağlık</Text>
        </View>
        <View style={styles.bonusItem}>
          <Ionicons name="diamond" size={14} color={Colors.xp} />
          <Text style={styles.bonusText}>+20 XP</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    alignItems: "center",
  },
  healthStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 12,
    padding: 12,
  },
  healthValue: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  healthLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  healthBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  healthBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  instruction: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  petArea: {
    width: "100%",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  glowRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
  },
  floatingHeart: {
    position: "absolute",
    fontSize: 34,
    zIndex: 10,
  },
  petEmoji: {
    fontSize: 70,
  },
  tapHint: {
    color: Colors.textTertiary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
  careGrid: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  careItem: {
    flex: 1,
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 6,
    borderWidth: 2,
    borderColor: "transparent",
  },
  careEmoji: {
    fontSize: 26,
  },
  careLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  bonusRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
  },
  bonusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bonusText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
