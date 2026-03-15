export const PET_STAT_DECAY = {
  hunger: 2,
  happiness: 1.5,
  energy: 1,
  cleanliness: 1,
  health: 0.5,
} as const;

export const ACTION_EFFECTS = {
  feed: {
    hunger: 30,
    health: 5,
    happiness: 5,
    energy: -5,
    cleanliness: -3,
    xp: 10,
    cooldown: 3000,
  },
  play: {
    happiness: 35,
    energy: -20,
    hunger: -10,
    cleanliness: -5,
    health: 3,
    xp: 15,
    cooldown: 5000,
  },
  sleep: {
    energy: 50,
    health: 10,
    happiness: 5,
    hunger: -15,
    cleanliness: -2,
    xp: 5,
    cooldown: 8000,
  },
  clean: {
    cleanliness: 40,
    happiness: 10,
    health: 5,
    energy: -5,
    xp: 8,
    cooldown: 4000,
  },
  heal: {
    health: 40,
    energy: 10,
    hunger: -10,
    xp: 20,
    cooldown: 10000,
  },
} as const;

export const XP_PER_LEVEL = 100;
export const MAX_LEVEL = 50;
export const DECAY_INTERVAL_MS = 30000;
export const STREAK_RESET_HOURS = 36;

export const LEVEL_TITLES: Record<number, string> = {
  1: "Yeni Sahip",
  5: "Meraklı Bakıcı",
  10: "Tecrübeli Dost",
  15: "Sevgili Arkadaş",
  20: "Evcil Hayvan Uzmanı",
  25: "Hayvan Aşığı",
  30: "Efsanevi Bakıcı",
  40: "Pati Ustası",
  50: "Efsane",
};

export const getLevelTitle = (level: number): string => {
  const milestones = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  for (const milestone of milestones) {
    if (level >= milestone) return LEVEL_TITLES[milestone];
  }
  return "Yeni Sahip";
};

export type ActionType = keyof typeof ACTION_EFFECTS;
