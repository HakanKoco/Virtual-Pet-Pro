import { Colors } from "@/constants/colors";

export type PetMood =
  | "ecstatic"
  | "happy"
  | "content"
  | "neutral"
  | "sad"
  | "unhappy"
  | "desperate";

export interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
  cleanliness: number;
  health: number;
}

export const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(Math.max(value, min), max);

export const getOverallScore = (stats: PetStats): number => {
  const weights = {
    hunger: 0.25,
    happiness: 0.25,
    energy: 0.15,
    cleanliness: 0.15,
    health: 0.2,
  };
  return (
    stats.hunger * weights.hunger +
    stats.happiness * weights.happiness +
    stats.energy * weights.energy +
    stats.cleanliness * weights.cleanliness +
    stats.health * weights.health
  );
};

export const getMood = (stats: PetStats): PetMood => {
  const score = getOverallScore(stats);
  const minStat = Math.min(
    stats.hunger,
    stats.happiness,
    stats.energy,
    stats.cleanliness,
    stats.health
  );

  if (minStat < 10) return "desperate";
  if (score >= 90) return "ecstatic";
  if (score >= 75) return "happy";
  if (score >= 60) return "content";
  if (score >= 45) return "neutral";
  if (score >= 30) return "sad";
  if (score >= 15) return "unhappy";
  return "desperate";
};

export const getMoodEmoji = (mood: PetMood): string => {
  const map: Record<PetMood, string> = {
    ecstatic: "🤩",
    happy: "😄",
    content: "😊",
    neutral: "😐",
    sad: "😢",
    unhappy: "😠",
    desperate: "😱",
  };
  return map[mood];
};

export const getMoodLabel = (mood: PetMood): string => {
  const map: Record<PetMood, string> = {
    ecstatic: "Çok Mutlu",
    happy: "Mutlu",
    content: "Memnun",
    neutral: "Normal",
    sad: "Üzgün",
    unhappy: "Mutsuz",
    desperate: "Çaresiz",
  };
  return map[mood];
};

export const getMoodColor = (mood: PetMood): string => {
  const map: Record<PetMood, string> = {
    ecstatic: Colors.moodEcstatic,
    happy: Colors.moodHappy,
    content: Colors.moodContent,
    neutral: Colors.moodNeutral,
    sad: Colors.moodSad,
    unhappy: Colors.moodUnhappy,
    desperate: Colors.moodDesperate,
  };
  return map[mood];
};

export const getStatColor = (stat: keyof PetStats): string => {
  const map: Record<keyof PetStats, string> = {
    hunger: Colors.hunger,
    happiness: Colors.happiness,
    energy: Colors.energy,
    cleanliness: Colors.cleanliness,
    health: Colors.health,
  };
  return map[stat];
};

export const getStatLabel = (stat: keyof PetStats): string => {
  const map: Record<keyof PetStats, string> = {
    hunger: "Tokluk",
    happiness: "Mutluluk",
    energy: "Enerji",
    cleanliness: "Temizlik",
    health: "Sağlık",
  };
  return map[stat];
};

export const getStatIcon = (stat: keyof PetStats): string => {
  const map: Record<keyof PetStats, string> = {
    hunger: "restaurant",
    happiness: "happy",
    energy: "flash",
    cleanliness: "sparkles",
    health: "heart",
  };
  return map[stat];
};

export const getStatBarColor = (value: number): string => {
  if (value >= 70) return Colors.success;
  if (value >= 40) return Colors.warning;
  return Colors.danger;
};

export const getPetAvatar = (mood: PetMood): string => {
  const map: Record<PetMood, string> = {
    ecstatic: "🐱",
    happy: "😺",
    content: "🐱",
    neutral: "😾",
    sad: "🙀",
    unhappy: "😿",
    desperate: "🙀",
  };
  return map[mood];
};

export const xpForNextLevel = (level: number): number => {
  return level * 100;
};

export const formatNumber = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
};
