export type AchievementId =
  | "first_feed"
  | "first_play"
  | "first_sleep"
  | "first_clean"
  | "first_heal"
  | "level_5"
  | "level_10"
  | "level_20"
  | "streak_3"
  | "streak_7"
  | "streak_14"
  | "streak_30"
  | "total_xp_500"
  | "total_xp_1000"
  | "total_xp_5000"
  | "all_stats_max"
  | "feed_10"
  | "play_10"
  | "sleep_10"
  | "heal_5"
  | "perfect_day";

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  category: "milestones" | "actions" | "streaks" | "special";
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_feed",
    title: "İlk Yemek",
    description: "Evcil hayvanını ilk kez besledi",
    icon: "restaurant",
    xpReward: 20,
    category: "actions",
  },
  {
    id: "first_play",
    title: "İlk Oyun",
    description: "Evcil hayvanınla ilk kez oynadı",
    icon: "game-controller",
    xpReward: 20,
    category: "actions",
  },
  {
    id: "first_sleep",
    title: "İlk Uyku",
    description: "Evcil hayvanını ilk kez uyuttun",
    icon: "moon",
    xpReward: 20,
    category: "actions",
  },
  {
    id: "first_clean",
    title: "Pırıl Pırıl",
    description: "Evcil hayvanını ilk kez temizle",
    icon: "sparkles",
    xpReward: 20,
    category: "actions",
  },
  {
    id: "first_heal",
    title: "Sağlık Dostu",
    description: "Evcil hayvanını ilk kez iyileştir",
    icon: "medkit",
    xpReward: 20,
    category: "actions",
  },
  {
    id: "feed_10",
    title: "Aşçı Çırağı",
    description: "10 kez besleme yaptı",
    icon: "fast-food",
    xpReward: 50,
    category: "actions",
  },
  {
    id: "play_10",
    title: "Oyun Arkadaşı",
    description: "10 kez oyun oynadı",
    icon: "football",
    xpReward: 50,
    category: "actions",
  },
  {
    id: "sleep_10",
    title: "Uyku Koruyucusu",
    description: "10 kez uyuttun",
    icon: "bed",
    xpReward: 50,
    category: "actions",
  },
  {
    id: "heal_5",
    title: "Doktor Yardımcısı",
    description: "5 kez iyileştirme yaptı",
    icon: "fitness",
    xpReward: 50,
    category: "actions",
  },
  {
    id: "level_5",
    title: "Tecrübe Kazanıyor",
    description: "5. seviyeye ulaştı",
    icon: "star",
    xpReward: 100,
    category: "milestones",
  },
  {
    id: "level_10",
    title: "Uzman Bakıcı",
    description: "10. seviyeye ulaştı",
    icon: "trophy",
    xpReward: 200,
    category: "milestones",
  },
  {
    id: "level_20",
    title: "Efsane Yolcusu",
    description: "20. seviyeye ulaştı",
    icon: "medal",
    xpReward: 500,
    category: "milestones",
  },
  {
    id: "streak_3",
    title: "3 Günlük Seri",
    description: "3 gün üst üste oynadı",
    icon: "flame",
    xpReward: 75,
    category: "streaks",
  },
  {
    id: "streak_7",
    title: "Haftalık Seri",
    description: "7 gün üst üste oynadı",
    icon: "flame",
    xpReward: 150,
    category: "streaks",
  },
  {
    id: "streak_14",
    title: "İki Haftalık Seri",
    description: "14 gün üst üste oynadı",
    icon: "flame",
    xpReward: 300,
    category: "streaks",
  },
  {
    id: "streak_30",
    title: "Aylık Seri",
    description: "30 gün üst üste oynadı",
    icon: "flame",
    xpReward: 1000,
    category: "streaks",
  },
  {
    id: "total_xp_500",
    title: "XP Toplayıcı",
    description: "Toplam 500 XP kazandı",
    icon: "diamond",
    xpReward: 50,
    category: "milestones",
  },
  {
    id: "total_xp_1000",
    title: "XP Ustası",
    description: "Toplam 1000 XP kazandı",
    icon: "diamond",
    xpReward: 100,
    category: "milestones",
  },
  {
    id: "total_xp_5000",
    title: "XP Efsanesi",
    description: "Toplam 5000 XP kazandı",
    icon: "diamond",
    xpReward: 500,
    category: "milestones",
  },
  {
    id: "all_stats_max",
    title: "Mükemmel Bakım",
    description: "Tüm istatistikler 80+",
    icon: "checkmark-circle",
    xpReward: 200,
    category: "special",
  },
  {
    id: "perfect_day",
    title: "Mükemmel Gün",
    description: "Günde tüm aksiyonları tamamladı",
    icon: "sunny",
    xpReward: 150,
    category: "special",
  },
];
