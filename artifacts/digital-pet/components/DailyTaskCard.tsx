import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";
import { DailyTasks } from "@/context/PetContext";

interface DailyTask {
  id: keyof Omit<DailyTasks, "date">;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  required: number;
  color: string;
}

const TASKS: DailyTask[] = [
  { id: "feed", label: "Besle", icon: "restaurant", required: 2, color: Colors.hunger },
  { id: "play", label: "Oyna", icon: "game-controller", required: 2, color: Colors.happiness },
  { id: "sleep", label: "Uyut", icon: "moon", required: 1, color: Colors.energy },
  { id: "clean", label: "Temizle", icon: "sparkles", required: 1, color: Colors.cleanliness },
];

interface DailyTaskCardProps {
  dailyTasks: DailyTasks;
}

export function DailyTaskCard({ dailyTasks }: DailyTaskCardProps) {
  const today = new Date().toDateString();
  const isToday = dailyTasks.date === today;
  const currentTasks = isToday ? dailyTasks : { feed: 0, play: 0, sleep: 0, clean: 0, heal: 0 };

  const completedCount = TASKS.filter(
    (t) => (currentTasks[t.id] || 0) >= t.required
  ).length;
  const allDone = completedCount === TASKS.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Günlük Görevler</Text>
        <View style={[styles.badge, allDone && styles.badgeDone]}>
          <Text style={[styles.badgeText, allDone && styles.badgeDoneText]}>
            {completedCount}/{TASKS.length}
          </Text>
        </View>
      </View>

      {allDone && (
        <View style={styles.completedBanner}>
          <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
          <Text style={styles.completedText}>Tüm görevler tamamlandı!</Text>
        </View>
      )}

      <View style={styles.tasksGrid}>
        {TASKS.map((task) => {
          const count = currentTasks[task.id] || 0;
          const done = count >= task.required;
          return (
            <View
              key={task.id}
              style={[styles.taskItem, done && styles.taskItemDone]}
            >
              <View
                style={[
                  styles.taskIconCircle,
                  { backgroundColor: done ? `${task.color}25` : Colors.backgroundTertiary },
                ]}
              >
                <Ionicons
                  name={done ? "checkmark" : task.icon}
                  size={16}
                  color={done ? Colors.success : task.color}
                />
              </View>
              <Text
                style={[styles.taskLabel, done && styles.taskLabelDone]}
              >
                {task.label}
              </Text>
              <Text style={[styles.taskProgress, done && { color: Colors.success }]}>
                {Math.min(count, task.required)}/{task.required}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: Colors.text,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  badge: {
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeDone: {
    backgroundColor: `${Colors.success}25`,
  },
  badgeText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  badgeDoneText: {
    color: Colors.success,
  },
  completedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: `${Colors.success}15`,
    borderRadius: 10,
    padding: 10,
  },
  completedText: {
    color: Colors.success,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  tasksGrid: {
    flexDirection: "row",
    gap: 8,
  },
  taskItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  taskItemDone: {
    backgroundColor: `${Colors.success}12`,
  },
  taskIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  taskLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  taskLabelDone: {
    color: Colors.success,
  },
  taskProgress: {
    color: Colors.textTertiary,
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
  },
});
