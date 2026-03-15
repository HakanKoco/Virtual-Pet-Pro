import React, { useState, useRef } from "react";
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
import { FOOD_ITEMS, FoodItem } from "@/constants/petTypes";
import { usePet } from "@/context/PetContext";
import { PetAvatar } from "@/components/PetAvatar";

export function FeedingActivity() {
  const { petState, feedWithFood } = usePet();
  const { play } = useSound();
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isFeeding, setIsFeeding] = useState(false);
  const [lastFed, setLastFed] = useState<string | null>(null);

  const petScale = useRef(new Animated.Value(1)).current;
  const feedingOpacity = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const reactionScale = useRef(new Animated.Value(0)).current;

  const animateFeed = () => {
    // Pet bounce
    Animated.sequence([
      Animated.spring(petScale, {
        toValue: 1.18,
        useNativeDriver: true,
        tension: 200,
        friction: 5,
      }),
      Animated.spring(petScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 6,
      }),
    ]).start();

    // Food float up + fade
    floatY.setValue(0);
    feedingOpacity.setValue(1);
    Animated.parallel([
      Animated.timing(floatY, {
        toValue: -60,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(feedingOpacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    // Reaction pop
    reactionScale.setValue(0);
    Animated.sequence([
      Animated.spring(reactionScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 6,
      }),
      Animated.delay(800),
      Animated.timing(reactionScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleFeed = () => {
    if (!selectedFood || isFeeding) return;

    setIsFeeding(true);
    setLastFed(selectedFood.name);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    play("eat", 0.7);

    animateFeed();
    feedWithFood(selectedFood);

    setTimeout(() => {
      setIsFeeding(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        {selectedFood
          ? `"${selectedFood.name}" seçildi — Pete ver!`
          : "Bir yiyecek seç"}
      </Text>

      <View style={styles.petArea}>
        {/* Floating food emoji */}
        {selectedFood && (
          <Animated.Text
            style={[
              styles.floatingFood,
              {
                opacity: feedingOpacity,
                transform: [{ translateY: floatY }, { scale: petScale }],
              },
            ]}
          >
            {selectedFood.emoji}
          </Animated.Text>
        )}

        {/* Reaction emoji */}
        <Animated.Text
          style={[
            styles.reactionEmoji,
            { transform: [{ scale: reactionScale }] },
          ]}
        >
          😻
        </Animated.Text>

        {/* Pet tap area */}
        <Pressable onPress={handleFeed} disabled={!selectedFood || isFeeding}>
          <Animated.View style={{ transform: [{ scale: petScale }] }}>
            <PetAvatar name="" stats={petState.stats} size="small" />
          </Animated.View>
        </Pressable>

        {selectedFood && !isFeeding && (
          <Text style={styles.tapHint}>Pete dokunarak besle!</Text>
        )}
        {lastFed && (
          <Text style={styles.lastFed}>Son: {lastFed}</Text>
        )}
      </View>

      <View style={styles.foodGrid}>
        {FOOD_ITEMS.map((food) => {
          const isSelected = selectedFood?.id === food.id;
          return (
            <Pressable
              key={food.id}
              onPress={() => {
                setSelectedFood(isSelected ? null : food);
                Haptics.selectionAsync();
              }}
              style={({ pressed }) => [
                styles.foodItem,
                isSelected && styles.foodItemSelected,
                pressed && styles.foodItemPressed,
              ]}
            >
              <Text style={styles.foodEmoji}>{food.emoji}</Text>
              <Text style={[styles.foodName, isSelected && styles.foodNameSelected]}>
                {food.name}
              </Text>
              <View style={styles.foodStats}>
                <Text style={styles.foodStat}>🍽️ +{food.hungerBoost}</Text>
                <Text style={styles.foodXp}>+{food.xp}xp</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  instruction: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  petArea: {
    alignItems: "center",
    justifyContent: "center",
    height: 160,
    position: "relative",
  },
  floatingFood: {
    position: "absolute",
    fontSize: 36,
    top: 10,
    zIndex: 10,
  },
  reactionEmoji: {
    position: "absolute",
    fontSize: 36,
    top: -10,
    right: "30%",
    zIndex: 10,
  },
  tapHint: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginTop: 8,
  },
  lastFed: {
    color: Colors.textTertiary,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  foodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  foodItem: {
    flex: 1,
    minWidth: "28%",
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  foodItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}20`,
  },
  foodItemPressed: {
    opacity: 0.8,
  },
  foodEmoji: {
    fontSize: 28,
  },
  foodName: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  foodNameSelected: {
    color: Colors.primary,
  },
  foodStats: {
    alignItems: "center",
    gap: 2,
  },
  foodStat: {
    color: Colors.textTertiary,
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  foodXp: {
    color: Colors.xp,
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
});
