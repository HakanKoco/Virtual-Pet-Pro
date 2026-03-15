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
import { useSound } from "@/hooks/useSound";
import { usePet } from "@/context/PetContext";

const SOAP_TAPS = 6;

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
  scale: Animated.Value;
}

export function CleanActivity() {
  const { petState, performAction } = usePet();
  const { play } = useSound();
  const [soapCount, setSoapCount] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [phase, setPhase] = useState<"idle" | "soaping" | "rinsing" | "done">("idle");
  const bubbleIdRef = useRef(0);

  const petScale = useRef(new Animated.Value(1)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;
  const sparkleScale = useRef(new Animated.Value(0)).current;

  const addBubble = (x: number, y: number) => {
    const id = bubbleIdRef.current++;
    const size = 12 + Math.random() * 20;
    const opacity = new Animated.Value(0.8);
    const scale = new Animated.Value(0);

    const newBubble: Bubble = { id, x, y, size, opacity, scale };
    setBubbles((prev) => [...prev.slice(-12), newBubble]);

    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 5 }),
      Animated.sequence([
        Animated.delay(600),
        Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    });
  };

  const handleSoap = () => {
    if (phase !== "idle" && phase !== "soaping") return;
    setPhase("soaping");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    play("cleanBubble", 0.35);

    // Random bubbles around pet
    const count = 3;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        addBubble(
          Math.random() * 80 - 40,
          Math.random() * 60 - 30
        );
      }, i * 60);
    }

    // Pet wobble
    Animated.sequence([
      Animated.spring(petScale, { toValue: 1.08, useNativeDriver: true, tension: 200, friction: 4 }),
      Animated.spring(petScale, { toValue: 1, useNativeDriver: true, tension: 100, friction: 5 }),
    ]).start();

    const newCount = soapCount + 1;
    setSoapCount(newCount);

    if (newCount >= SOAP_TAPS) {
      setPhase("rinsing");
      setTimeout(() => {
        handleRinse();
      }, 600);
    }
  };

  const handleRinse = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    play("clean", 0.6);
    setBubbles([]);
    performAction("clean");

    // Sparkle effect
    Animated.parallel([
      Animated.spring(sparkleScale, { toValue: 1.4, useNativeDriver: true, tension: 80, friction: 5 }),
      Animated.timing(sparkleOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(sparkleScale, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(sparkleOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    });

    setPhase("done");
    setTimeout(() => {
      setSoapCount(0);
      setPhase("idle");
    }, 2500);
  };

  const progress = Math.min(soapCount / SOAP_TAPS, 1);

  const getInstruction = () => {
    if (phase === "done") return "Pırıl pırıl temiz! ✨";
    if (phase === "rinsing") return "Durulaniyor...";
    if (phase === "soaping") return `Devam et! ${SOAP_TAPS - soapCount} kez daha`;
    return "Sabunu Pete sür!";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{getInstruction()}</Text>

      {phase === "soaping" && (
        <View style={styles.progressWrapper}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      )}

      <View style={styles.petArea}>
        {/* Bubbles */}
        {bubbles.map((b) => (
          <Animated.View
            key={b.id}
            style={[
              styles.bubble,
              {
                width: b.size,
                height: b.size,
                borderRadius: b.size / 2,
                left: "50%" ,
                top: "50%",
                marginLeft: b.x - b.size / 2,
                marginTop: b.y - b.size / 2,
                opacity: b.opacity,
                transform: [{ scale: b.scale }],
              },
            ]}
          />
        ))}

        {/* Sparkle */}
        <Animated.Text
          style={[
            styles.sparkle,
            {
              opacity: sparkleOpacity,
              transform: [{ scale: sparkleScale }],
            },
          ]}
        >
          ✨
        </Animated.Text>

        <Pressable
          onPress={handleSoap}
          disabled={phase === "rinsing" || phase === "done"}
        >
          <Animated.View style={{ transform: [{ scale: petScale }] }}>
            <Text style={styles.petEmoji}>
              {phase === "done" ? "😻" : phase === "soaping" ? "🙀" : "🐱"}
            </Text>
          </Animated.View>
        </Pressable>

        {phase === "idle" && (
          <Text style={styles.tapHint}>Pete dokun</Text>
        )}
      </View>

      <View style={styles.soapTools}>
        <View style={[styles.toolItem, phase === "soaping" && styles.toolItemActive]}>
          <Text style={styles.toolEmoji}>🧼</Text>
          <Text style={styles.toolLabel}>Sabun</Text>
        </View>
        <Ionicons name="arrow-forward" size={16} color={Colors.textTertiary} />
        <View style={[styles.toolItem, phase === "rinsing" && styles.toolItemActive]}>
          <Text style={styles.toolEmoji}>💧</Text>
          <Text style={styles.toolLabel}>Su</Text>
        </View>
        <Ionicons name="arrow-forward" size={16} color={Colors.textTertiary} />
        <View style={[styles.toolItem, phase === "done" && styles.toolItemActive]}>
          <Text style={styles.toolEmoji}>✨</Text>
          <Text style={styles.toolLabel}>Temiz!</Text>
        </View>
      </View>

      <View style={styles.bonusRow}>
        <View style={styles.bonusItem}>
          <Ionicons name="sparkles" size={14} color={Colors.cleanliness} />
          <Text style={styles.bonusText}>+40 Temizlik</Text>
        </View>
        <View style={styles.bonusItem}>
          <Ionicons name="happy" size={14} color={Colors.happiness} />
          <Text style={styles.bonusText}>+10 Mutluluk</Text>
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
  progressWrapper: {
    width: "100%",
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
    backgroundColor: Colors.cleanliness,
    borderRadius: 4,
  },
  petArea: {
    width: "100%",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bubble: {
    position: "absolute",
    backgroundColor: "rgba(91, 158, 248, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(91, 158, 248, 0.6)",
  },
  sparkle: {
    position: "absolute",
    fontSize: 48,
    zIndex: 10,
  },
  petEmoji: {
    fontSize: 70,
    zIndex: 5,
  },
  tapHint: {
    color: Colors.textTertiary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
  soapTools: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  toolItem: {
    alignItems: "center",
    gap: 4,
    opacity: 0.5,
  },
  toolItemActive: {
    opacity: 1,
  },
  toolEmoji: {
    fontSize: 26,
  },
  toolLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontFamily: "Inter_500Medium",
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
