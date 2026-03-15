import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";

import { Colors } from "@/constants/colors";
import { useSound } from "@/hooks/useSound";
import { usePet } from "@/context/PetContext";
import { PetAvatar } from "@/components/PetAvatar";

const REACTIONS = ["❤️", "⭐", "✨", "🎉", "💫", "🌟"];
const MAX_TAPS = 10;

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
  opacity: Animated.Value;
  translateY: Animated.Value;
}

export function PlayActivity() {
  const { petState, performAction } = usePet();
  const { play } = useSound();
  const [tapCount, setTapCount] = useState(0);
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const petScale = useRef(new Animated.Value(1)).current;
  const petRotate = useRef(new Animated.Value(0)).current;
  const reactionIdRef = useRef(0);

  const handleTap = () => {
    if (isPlaying) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    play("playTap", 0.4);

    // Pet bounce + slight wiggle
    Animated.sequence([
      Animated.parallel([
        Animated.spring(petScale, {
          toValue: 1.2,
          useNativeDriver: true,
          tension: 300,
          friction: 4,
        }),
        Animated.timing(petRotate, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(petScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 5,
        }),
        Animated.timing(petRotate, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Floating reaction
    const id = reactionIdRef.current++;
    const emoji = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
    const x = Math.random() * 120 - 60;
    const opacity = new Animated.Value(1);
    const translateY = new Animated.Value(0);

    const newReaction: FloatingReaction = { id, emoji, x, opacity, translateY };
    setReactions((prev) => [...prev.slice(-5), newReaction]);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    });

    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount >= MAX_TAPS) {
      setIsPlaying(true);
      performAction("play");
      play("play", 0.7);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        setTapCount(0);
        setIsPlaying(false);
      }, 2500);
    }
  };

  const spin = petRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-8deg", "8deg"],
  });

  const progress = Math.min(tapCount / MAX_TAPS, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        {isPlaying
          ? "Harika! Pete oynuyor 🎉"
          : `Pete ${MAX_TAPS - tapCount} kez daha dokun!`}
      </Text>

      <View style={styles.progressBarBg}>
        <Animated.View
          style={[
            styles.progressBarFill,
            { width: `${progress * 100}%` },
          ]}
        />
      </View>

      <View style={styles.petArea}>
        {reactions.map((r) => (
          <Animated.Text
            key={r.id}
            style={[
              styles.floatingReaction,
              {
                transform: [{ translateX: r.x }, { translateY: r.translateY }],
                opacity: r.opacity,
              },
            ]}
          >
            {r.emoji}
          </Animated.Text>
        ))}

        <Pressable onPress={handleTap} disabled={isPlaying}>
          <Animated.View
            style={{ transform: [{ scale: petScale }, { rotate: spin }] }}
          >
            <PetAvatar name="" stats={petState.stats} size="small" />
          </Animated.View>
        </Pressable>

        {!isPlaying && (
          <Text style={styles.tapHint}>Dokun, dokun, dokun!</Text>
        )}
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{tapCount}</Text>
          <Text style={styles.infoLabel}>Dokunuş</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[styles.infoValue, { color: Colors.happiness }]}>
            +35
          </Text>
          <Text style={styles.infoLabel}>Mutluluk</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[styles.infoValue, { color: Colors.xp }]}>
            +15 XP
          </Text>
          <Text style={styles.infoLabel}>Ödül</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    alignItems: "center",
  },
  instruction: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  progressBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.happiness,
    borderRadius: 4,
  },
  petArea: {
    height: 180,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  floatingReaction: {
    position: "absolute",
    fontSize: 28,
    zIndex: 10,
  },
  tapHint: {
    color: Colors.textTertiary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
  infoRow: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 14,
    padding: 14,
    justifyContent: "space-around",
  },
  infoItem: {
    alignItems: "center",
    gap: 4,
  },
  infoValue: {
    color: Colors.text,
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  infoLabel: {
    color: Colors.textTertiary,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
