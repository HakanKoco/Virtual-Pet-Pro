export type PetType = "cat" | "dog" | "rabbit" | "dragon" | "penguin";

export interface PetTypeConfig {
  id: PetType;
  name: string;
  emoji: {
    happy: string;
    neutral: string;
    sad: string;
    sleep: string;
    eating: string;
    clean: string;
    sick: string;
    excited: string;
  };
  color: string;
  description: string;
}

export const PET_TYPES: PetTypeConfig[] = [
  {
    id: "cat",
    name: "Kedi",
    emoji: {
      happy: "😺",
      neutral: "🐱",
      sad: "😿",
      sleep: "😸",
      eating: "😻",
      clean: "🐱",
      sick: "🙀",
      excited: "😸",
    },
    color: "#A07FD8",
    description: "Bağımsız ve zarif",
  },
  {
    id: "dog",
    name: "Köpek",
    emoji: {
      happy: "🐶",
      neutral: "🐕",
      sad: "🐾",
      sleep: "🐕",
      eating: "🦴",
      clean: "🐩",
      sick: "🐕",
      excited: "🐶",
    },
    color: "#F59E3F",
    description: "Sadık ve enerjik",
  },
  {
    id: "rabbit",
    name: "Tavşan",
    emoji: {
      happy: "🐰",
      neutral: "🐇",
      sad: "🐇",
      sleep: "🐰",
      eating: "🥕",
      clean: "🐰",
      sick: "🐇",
      excited: "🐰",
    },
    color: "#FF9EB5",
    description: "Sevimli ve meraklı",
  },
  {
    id: "dragon",
    name: "Ejderha",
    emoji: {
      happy: "🐲",
      neutral: "🐉",
      sad: "🐉",
      sleep: "🐉",
      eating: "🔥",
      clean: "🐲",
      sick: "🐉",
      excited: "🐲",
    },
    color: "#4ECDC4",
    description: "Güçlü ve gizemli",
  },
  {
    id: "penguin",
    name: "Penguen",
    emoji: {
      happy: "🐧",
      neutral: "🐧",
      sad: "🐧",
      sleep: "🐧",
      eating: "🐟",
      clean: "🐧",
      sick: "🐧",
      excited: "🐧",
    },
    color: "#5B9EF8",
    description: "Komik ve eğlenceli",
  },
];

export const getPetTypeConfig = (type: PetType): PetTypeConfig => {
  return PET_TYPES.find((p) => p.id === type) ?? PET_TYPES[0];
};

export type FoodItem = {
  id: string;
  name: string;
  emoji: string;
  hungerBoost: number;
  happinessBoost: number;
  healthBoost: number;
  xp: number;
  coins: number;
};

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: "kibble",
    name: "Mama",
    emoji: "🍽️",
    hungerBoost: 30,
    happinessBoost: 5,
    healthBoost: 3,
    xp: 10,
    coins: 5,
  },
  {
    id: "fish",
    name: "Balık",
    emoji: "🐟",
    hungerBoost: 25,
    happinessBoost: 15,
    healthBoost: 5,
    xp: 15,
    coins: 8,
  },
  {
    id: "milk",
    name: "Süt",
    emoji: "🥛",
    hungerBoost: 15,
    happinessBoost: 10,
    healthBoost: 8,
    xp: 8,
    coins: 5,
  },
  {
    id: "treat",
    name: "Ödül Bisküvisi",
    emoji: "🍪",
    hungerBoost: 10,
    happinessBoost: 25,
    healthBoost: 0,
    xp: 12,
    coins: 7,
  },
  {
    id: "apple",
    name: "Elma",
    emoji: "🍎",
    hungerBoost: 20,
    happinessBoost: 8,
    healthBoost: 10,
    xp: 10,
    coins: 6,
  },
];
