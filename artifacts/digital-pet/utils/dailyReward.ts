export interface DailyRewardInfo {
  coins: number;
  xp: number;
  message: string;
  streakBonus: boolean;
}

export const isDailyRewardAvailable = (
  lastRewardDate: string | null
): boolean => {
  if (!lastRewardDate) return true;
  const last = new Date(lastRewardDate);
  const now = new Date();
  return last.toDateString() !== now.toDateString();
};

export const calculateDailyReward = (streak: number): DailyRewardInfo => {
  const baseCoins = 25;
  const baseXp = 30;

  let streakBonus = false;
  let bonusCoins = 0;
  let bonusXp = 0;
  let message = "Hoş geldin! İşte günlük ödülün 🎁";

  if (streak >= 30) {
    bonusCoins = 100;
    bonusXp = 150;
    streakBonus = true;
    message = "30 günlük seri! Efsanesin 🏆";
  } else if (streak >= 14) {
    bonusCoins = 60;
    bonusXp = 80;
    streakBonus = true;
    message = "2 haftalık seri! Muhteşem 🔥";
  } else if (streak >= 7) {
    bonusCoins = 35;
    bonusXp = 50;
    streakBonus = true;
    message = "Haftalık seri! Devam et 🌟";
  } else if (streak >= 3) {
    bonusCoins = 15;
    bonusXp = 20;
    streakBonus = true;
    message = "3 günlük seri! Harika gidiyorsun 😊";
  }

  return {
    coins: baseCoins + bonusCoins,
    xp: baseXp + bonusXp,
    message,
    streakBonus,
  };
};
