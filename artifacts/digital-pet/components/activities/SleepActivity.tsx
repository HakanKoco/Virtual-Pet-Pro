import React, { useRef, useState, useEffect } from "react";
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
import { useSound } from "@/hooks/useSound";
import { usePet } from "@/context/PetContext";

const SLEEP_DURATION = 3000;

export function SleepActivity() {
  const { petState, performAction } = usePet();
  const { play } = useSound();
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepDone, setSleepDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const moonScale = useRef(new Animated.Value(0)).current;
  const zzzOpacity = useRef(new Animated.Value(0)).current;
  const star1 = useRef(new Animated.Value(0)).current;
  const star2 = useRef(new Animated.Value(0)).current;
  const star3 = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startSleep = () => {
    if (isSleeping || sleepDone) return;
    setIsSleeping(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    play("sleep", 0.5);

    // Darken overlay
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Moon appears
    Animated.spring(moonScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 7,
      delay: 400,
    }).start();

    // Stars twinkle
    const twinkle = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    };
    twinkle(star1, 600);
    twinkle(star2, 900);
    twinkle(star3, 1200);

    // Zzz float
    Animated.loop(
      Animated.sequence([
        Animated.timing(zzzOpacity, { toValue: 1, duration: 400, delay: 800, useNativeDriver: true }),
        Animated.timing(zzzOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    ).start();

    // Progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: SLEEP_DURATION,
      useNativeDriver: false,
    }).start();

    // Track progress %
    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 100;
      setProgress(Math.min(elapsed / SLEEP_DURATION, 1));
      if (elapsed >= SLEEP_DURATION) {
        if (timerRef.current) clearInterval(timerRef.current);
        finishSleep();
      }
    }, 100);
  };

  const finishSleep = () => {
    performAction("sleep");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Wake up
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(moonScale, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      setIsSleeping(false);
      setSleepDone(true);
      setProgress(0);
      setTimeout(() => setSleepDone(false), 3000);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        {sleepDone
          ? "Günaydın! Enerji yenilendi ☀️"
          : isSleeping
          ? "Uyuyor... Sss! 🤫"
          : "Pete uyut — enerji ve sağlık yenilenir"}
      </Text>

      <View style={styles.scene}>
        {/* Night overlay */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.nightOverlay,
            { opacity: overlayOpacity },
          ]}
        >
          <LinearGradient
            colors={["#050520", "#0A0A30"]}
            style={StyleSheet.absoluteFill}
          />
          {/* Stars */}
          <Animated.Text style={[styles.star, styles.star1, { opacity: star1 }]}>
            ✨
          </Animated.Text>
          <Animated.Text style={[styles.star, styles.star2, { opacity: star2 }]}>
            ⭐
          </Animated.Text>
          <Animated.Text style={[styles.star, styles.star3, { opacity: star3 }]}>
            ✨
          </Animated.Text>
          {/* Moon */}
          <Animated.Text
            style={[styles.moon, { transform: [{ scale: moonScale }] }]}
          >
            🌙
          </Animated.Text>
          {/* Zzz */}
          <Animated.Text style={[styles.zzz, { opacity: zzzOpacity }]}>
            💤
          </Animated.Text>
        </Animated.View>

        {/* Pet */}
        <View style={styles.petWrapper}>
          <Text style={styles.petEmoji}>
            {isSleeping ? "😴" : sleepDone ? "😸" : "🐱"}
          </Text>
        </View>
      </View>

      {isSleeping && (
        <View style={styles.progressWrapper}>
          <View style={styles.progressBg}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      )}

      <Pressable
        onPress={startSleep}
        disabled={isSleeping || sleepDone}
        style={({ pressed }) => [
          styles.button,
          (isSleeping || sleepDone) && styles.buttonDisabled,
          pressed && !isSleeping && styles.buttonPressed,
        ]}
      >
        <LinearGradient
          colors={isSleeping || sleepDone ? ["#2D2D4E", "#1E1E35"] : ["#4ECDC4", "#2AA198"]}
          style={styles.buttonGradient}
        >
          <Ionicons
            name={isSleeping ? "moon" : sleepDone ? "sunny" : "moon"}
            size={20}
            color={isSleeping || sleepDone ? Colors.textTertiary : "#fff"}
          />
          <Text
            style={[
              styles.buttonText,
              (isSleeping || sleepDone) && { color: Colors.textTertiary },
            ]}
          >
            {isSleeping ? "Uyuyor..." : sleepDone ? "Uyandı!" : "Uyut"}
          </Text>
        </LinearGradient>
      </Pressable>

      <View style={styles.bonusRow}>
        <View style={styles.bonusItem}>
          <Ionicons name="flash" size={14} color={Colors.energy} />
          <Text style={styles.bonusText}>+50 Enerji</Text>
        </View>
        <View style={styles.bonusItem}>
          <Ionicons name="heart" size={14} color={Colors.health} />
          <Text style={styles.bonusText}>+10 Sağlık</Text>
        </View>
        <View style={styles.bonusItem}>
          <Ionicons name="diamond" size={14} color={Colors.xp} />
          <Text style={styles.bonusText}>+5 XP</Text>
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
  instruction: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  scene: {
    width: "100%",
    height: 160,
    borderRadius: 18,
    backgroundColor: Colors.backgroundTertiary,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  nightOverlay: {
    borderRadius: 18,
  },
  star: {
    position: "absolute",
    fontSize: 18,
  },
  star1: { top: 20, left: 30 },
  star2: { top: 14, right: 50 },
  star3: { top: 35, right: 20 },
  moon: {
    position: "absolute",
    top: 12,
    right: 28,
    fontSize: 34,
  },
  zzz: {
    position: "absolute",
    top: 50,
    left: "55%",
    fontSize: 28,
  },
  petWrapper: {
    zIndex: 5,
  },
  petEmoji: {
    fontSize: 64,
  },
  progressWrapper: {
    width: "100%",
    gap: 6,
    alignItems: "flex-end",
  },
  progressBg: {
    width: "100%",
    height: 8,
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.energy,
    borderRadius: 4,
  },
  progressLabel: {
    color: Colors.energy,
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  button: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  bonusRow: {
    flexDirection: "row",
    gap: 16,
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
