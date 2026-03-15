import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";
import { XP_PER_LEVEL, getLevelTitle } from "@/constants/gameConfig";
import { formatNumber } from "@/utils/petHelpers";

interface XPBarProps {
  level: number;
  xp: number;
  totalXp: number;
}

export function XPBar({ level, xp, totalXp }: XPBarProps) {
  const xpNeeded = level * XP_PER_LEVEL;
  const progress = Math.min(xp / xpNeeded, 1);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: progress,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  }, [progress]);

  const title = getLevelTitle(level);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.levelBadge}>
          <LinearGradient
            colors={Colors.gradientPurple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.levelGradient}
          >
            <Text style={styles.levelText}>Lv.{level}</Text>
          </LinearGradient>
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.xpText}>
            {formatNumber(xp)} / {formatNumber(xpNeeded)} XP
          </Text>
        </View>
        <View style={styles.totalBlock}>
          <Text style={styles.totalLabel}>Toplam</Text>
          <Text style={styles.totalXp}>{formatNumber(totalXp)}</Text>
        </View>
      </View>
      <View style={styles.barBg}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={Colors.gradientGold}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  levelBadge: {
    borderRadius: 12,
    overflow: "hidden",
  },
  levelGradient: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  titleBlock: {
    flex: 1,
  },
  titleText: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  xpText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  totalBlock: {
    alignItems: "flex-end",
  },
  totalLabel: {
    color: Colors.textTertiary,
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  totalXp: {
    color: Colors.xp,
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  barBg: {
    height: 10,
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
    overflow: "hidden",
  },
});
