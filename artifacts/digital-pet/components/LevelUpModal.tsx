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
import { getLevelTitle } from "@/constants/gameConfig";

interface LevelUpModalProps {
  visible: boolean;
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ visible, level, onClose }: LevelUpModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const starRotate = useRef(new Animated.Value(0)).current;

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
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.timing(starRotate, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const spin = starRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal transparent animationType="none" visible={visible}>
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View
          style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
        >
          <LinearGradient
            colors={Colors.gradientPurple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="star" size={56} color={Colors.xp} />
            </Animated.View>
            <Text style={styles.levelUpText}>SEVİYE ATLADI!</Text>
            <Text style={styles.levelText}>Seviye {level}</Text>
            <Text style={styles.titleText}>{getLevelTitle(level)}</Text>
            <Pressable onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>Harika!</Text>
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
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "80%",
    borderRadius: 24,
    overflow: "hidden",
  },
  gradient: {
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  levelUpText: {
    color: Colors.xp,
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
  },
  levelText: {
    color: "#fff",
    fontSize: 48,
    fontFamily: "Inter_700Bold",
  },
  titleText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  button: {
    marginTop: 8,
    backgroundColor: Colors.xp,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 50,
  },
  buttonText: {
    color: "#1A1A00",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
});
