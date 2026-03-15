import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/colors";
import {
  getStatColor,
  getStatLabel,
  getStatIcon,
  getStatBarColor,
  PetStats,
} from "@/utils/petHelpers";

interface StatBarProps {
  stat: keyof PetStats;
  value: number;
  compact?: boolean;
}

export function StatBar({ stat, value, compact = false }: StatBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: value,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  }, [value]);

  const barColor = getStatBarColor(value);
  const iconName = getStatIcon(stat) as keyof typeof Ionicons.glyphMap;
  const label = getStatLabel(stat);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactIconRow}>
          <Ionicons name={iconName} size={12} color={getStatColor(stat)} />
          <Text style={styles.compactValue}>{Math.round(value)}</Text>
        </View>
        <View style={styles.compactBarBg}>
          <Animated.View
            style={[
              styles.compactBarFill,
              {
                backgroundColor: barColor,
                width: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.labelLeft}>
          <View
            style={[styles.iconCircle, { backgroundColor: `${getStatColor(stat)}20` }]}
          >
            <Ionicons name={iconName} size={14} color={getStatColor(stat)} />
          </View>
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={[styles.value, { color: barColor }]}>
          {Math.round(value)}
        </Text>
      </View>
      <View style={styles.barBg}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: barColor,
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  labelLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  value: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  barBg: {
    height: 8,
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  compactContainer: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  compactIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  compactValue: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  compactBarBg: {
    width: "100%",
    height: 4,
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 2,
    overflow: "hidden",
  },
  compactBarFill: {
    height: "100%",
    borderRadius: 2,
  },
});
