import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";
import { ActionType, ACTION_EFFECTS } from "@/constants/gameConfig";

interface ActionButtonProps {
  action: ActionType;
  onPress: () => void;
  cooldownEnd: number;
  disabled?: boolean;
}

const ACTION_CONFIG: Record<
  ActionType,
  { label: string; icon: keyof typeof Ionicons.glyphMap; gradient: [string, string] }
> = {
  feed: {
    label: "Besle",
    icon: "restaurant",
    gradient: ["#FF6B6B", "#CC4444"],
  },
  play: {
    label: "Oyna",
    icon: "game-controller",
    gradient: ["#FFD700", "#FFA500"],
  },
  sleep: {
    label: "Uyut",
    icon: "moon",
    gradient: ["#4ECDC4", "#2AA198"],
  },
  clean: {
    label: "Temizle",
    icon: "sparkles",
    gradient: ["#5B9EF8", "#3A7CD4"],
  },
  heal: {
    label: "İyileştir",
    icon: "medkit",
    gradient: ["#2DD36F", "#1A9A4E"],
  },
};

export function ActionButton({
  action,
  onPress,
  cooldownEnd,
  disabled = false,
}: ActionButtonProps) {
  const config = ACTION_CONFIG[action];
  const scale = useRef(new Animated.Value(1)).current;
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const rem = Math.max(0, cooldownEnd - now);
      setRemaining(rem);
      if (rem === 0 && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    update();
    if (cooldownEnd > Date.now()) {
      timerRef.current = setInterval(update, 500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldownEnd]);

  const isCooling = remaining > 0;
  const isDisabled = disabled || isCooling;

  const handlePressIn = () => {
    if (!isDisabled) {
      Animated.spring(scale, {
        toValue: 0.93,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const formatCooldown = (ms: number): string => {
    if (ms <= 0) return "";
    const s = Math.ceil(ms / 1000);
    if (s >= 60) return `${Math.floor(s / 60)}m`;
    return `${s}s`;
  };

  const effects = ACTION_EFFECTS[action];
  const xpLabel = `+${effects.xp} XP`;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <Pressable
        onPress={isDisabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <LinearGradient
          colors={isDisabled ? ["#2D2D4E", "#252545"] : config.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, isDisabled && styles.gradientDisabled]}
        >
          {isCooling && (
            <View style={styles.cooldownOverlay}>
              <Text style={styles.cooldownText}>
                {formatCooldown(remaining)}
              </Text>
            </View>
          )}
          <Ionicons
            name={config.icon}
            size={26}
            color={isDisabled ? Colors.textTertiary : "#fff"}
          />
          <Text
            style={[
              styles.label,
              isDisabled && { color: Colors.textTertiary },
            ]}
          >
            {config.label}
          </Text>
          <View
            style={[
              styles.xpBadge,
              isDisabled && { backgroundColor: Colors.backgroundTertiary },
            ]}
          >
            <Text
              style={[
                styles.xpText,
                isDisabled && { color: Colors.textTertiary },
              ]}
            >
              {xpLabel}
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minWidth: "30%",
  },
  pressable: {
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
    minHeight: 90,
    justifyContent: "center",
    borderRadius: 16,
  },
  gradientDisabled: {
    opacity: 0.7,
  },
  cooldownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  cooldownText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  label: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  xpBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  xpText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
});
