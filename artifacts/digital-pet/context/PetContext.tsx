import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ACHIEVEMENTS,
  AchievementId,
  Achievement,
} from "@/constants/achievements";
import {
  ACTION_EFFECTS,
  ActionType,
  DECAY_INTERVAL_MS,
  PET_STAT_DECAY,
  STREAK_RESET_HOURS,
  XP_PER_LEVEL,
  MAX_LEVEL,
} from "@/constants/gameConfig";
import { clamp, PetStats } from "@/utils/petHelpers";

const STORAGE_KEY = "digital_pet_state_v2";

export interface DailyTasks {
  feed: number;
  play: number;
  sleep: number;
  clean: number;
  heal: number;
  date: string;
}

export interface PetState {
  name: string;
  stats: PetStats;
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  lastPlayDate: string | null;
  unlockedAchievements: AchievementId[];
  actionCounts: Record<ActionType, number>;
  actionCooldowns: Record<ActionType, number>;
  dailyTasks: DailyTasks;
  createdAt: string;
  totalActions: number;
}

interface PetContextValue {
  petState: PetState;
  performAction: (action: ActionType) => { success: boolean; message: string };
  renamePet: (name: string) => void;
  resetPet: () => void;
  getAchievementProgress: () => Achievement[];
  newAchievements: AchievementId[];
  clearNewAchievements: () => void;
  levelUpAnimation: boolean;
  clearLevelUp: () => void;
}

const defaultStats: PetStats = {
  hunger: 80,
  happiness: 80,
  energy: 80,
  cleanliness: 80,
  health: 90,
};

const defaultDailyTasks = (): DailyTasks => ({
  feed: 0,
  play: 0,
  sleep: 0,
  clean: 0,
  heal: 0,
  date: new Date().toDateString(),
});

const defaultActionCounts: Record<ActionType, number> = {
  feed: 0,
  play: 0,
  sleep: 0,
  clean: 0,
  heal: 0,
};

const defaultActionCooldowns: Record<ActionType, number> = {
  feed: 0,
  play: 0,
  sleep: 0,
  clean: 0,
  heal: 0,
};

const createDefaultState = (): PetState => ({
  name: "Minik",
  stats: { ...defaultStats },
  level: 1,
  xp: 0,
  totalXp: 0,
  streak: 0,
  lastPlayDate: null,
  unlockedAchievements: [],
  actionCounts: { ...defaultActionCounts },
  actionCooldowns: { ...defaultActionCooldowns },
  dailyTasks: defaultDailyTasks(),
  createdAt: new Date().toISOString(),
  totalActions: 0,
});

const PetContext = createContext<PetContextValue | null>(null);

export function PetProvider({ children }: { children: React.ReactNode }) {
  const [petState, setPetState] = useState<PetState>(createDefaultState());
  const [newAchievements, setNewAchievements] = useState<AchievementId[]>([]);
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);
  const decayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    if (decayTimerRef.current) clearInterval(decayTimerRef.current);
    decayTimerRef.current = setInterval(() => {
      setPetState((prev) => {
        const newStats = { ...prev.stats };
        (Object.keys(PET_STAT_DECAY) as (keyof typeof PET_STAT_DECAY)[]).forEach(
          (key) => {
            newStats[key] = clamp(newStats[key] - PET_STAT_DECAY[key]);
          }
        );
        return { ...prev, stats: newStats };
      });
    }, DECAY_INTERVAL_MS);

    return () => {
      if (decayTimerRef.current) clearInterval(decayTimerRef.current);
    };
  }, []);

  useEffect(() => {
    saveState(petState);
  }, [petState]);

  const loadState = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as PetState;
        const now = Date.now();
        const updatedCooldowns = { ...saved.actionCooldowns };
        (Object.keys(updatedCooldowns) as ActionType[]).forEach((key) => {
          if (updatedCooldowns[key] < now) updatedCooldowns[key] = 0;
        });
        setPetState({ ...saved, actionCooldowns: updatedCooldowns });
      }
    } catch {}
  };

  const saveState = async (state: PetState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  };

  const updateStreak = (state: PetState): PetState => {
    const now = new Date();
    const todayStr = now.toDateString();
    if (state.lastPlayDate === todayStr) return state;

    if (state.lastPlayDate) {
      const last = new Date(state.lastPlayDate);
      const diffHours =
        (now.getTime() - last.getTime()) / (1000 * 60 * 60);
      if (diffHours > STREAK_RESET_HOURS) {
        return { ...state, streak: 1, lastPlayDate: todayStr };
      }
    }
    return {
      ...state,
      streak: state.streak + 1,
      lastPlayDate: todayStr,
    };
  };

  const checkAchievements = useCallback(
    (state: PetState): { state: PetState; unlocked: AchievementId[] } => {
      const newlyUnlocked: AchievementId[] = [];

      const check = (id: AchievementId, condition: boolean) => {
        if (condition && !state.unlockedAchievements.includes(id)) {
          newlyUnlocked.push(id);
        }
      };

      check("first_feed", state.actionCounts.feed >= 1);
      check("first_play", state.actionCounts.play >= 1);
      check("first_sleep", state.actionCounts.sleep >= 1);
      check("first_clean", state.actionCounts.clean >= 1);
      check("first_heal", state.actionCounts.heal >= 1);
      check("feed_10", state.actionCounts.feed >= 10);
      check("play_10", state.actionCounts.play >= 10);
      check("sleep_10", state.actionCounts.sleep >= 10);
      check("heal_5", state.actionCounts.heal >= 5);
      check("level_5", state.level >= 5);
      check("level_10", state.level >= 10);
      check("level_20", state.level >= 20);
      check("streak_3", state.streak >= 3);
      check("streak_7", state.streak >= 7);
      check("streak_14", state.streak >= 14);
      check("streak_30", state.streak >= 30);
      check("total_xp_500", state.totalXp >= 500);
      check("total_xp_1000", state.totalXp >= 1000);
      check("total_xp_5000", state.totalXp >= 5000);

      const allHigh = Object.values(state.stats).every((v) => v >= 80);
      check("all_stats_max", allHigh);

      const today = new Date().toDateString();
      const tasks = state.dailyTasks;
      const perfectDay =
        tasks.date === today &&
        tasks.feed >= 2 &&
        tasks.play >= 2 &&
        tasks.sleep >= 1 &&
        tasks.clean >= 1;
      check("perfect_day", perfectDay);

      if (newlyUnlocked.length === 0) return { state, unlocked: [] };

      let bonusXp = 0;
      for (const id of newlyUnlocked) {
        const ach = ACHIEVEMENTS.find((a) => a.id === id);
        if (ach) bonusXp += ach.xpReward;
      }

      const updatedState: PetState = {
        ...state,
        unlockedAchievements: [...state.unlockedAchievements, ...newlyUnlocked],
        xp: state.xp + bonusXp,
        totalXp: state.totalXp + bonusXp,
      };

      return { state: updatedState, unlocked: newlyUnlocked };
    },
    []
  );

  const performAction = useCallback(
    (action: ActionType): { success: boolean; message: string } => {
      const now = Date.now();
      const cooldown = petState.actionCooldowns[action];
      if (cooldown > now) {
        const remaining = Math.ceil((cooldown - now) / 1000);
        return { success: false, message: `${remaining}s bekle` };
      }

      const effects = ACTION_EFFECTS[action];
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      setPetState((prev) => {
        const newStats = { ...prev.stats };
        const statKeys: (keyof PetStats)[] = [
          "hunger",
          "happiness",
          "energy",
          "cleanliness",
          "health",
        ];

        statKeys.forEach((key) => {
          const delta = (effects as Record<string, number>)[key];
          if (typeof delta === "number") {
            newStats[key] = clamp(newStats[key] + delta);
          }
        });

        const xpGain = effects.xp;
        let newXp = prev.xp + xpGain;
        let newLevel = prev.level;
        let didLevelUp = false;

        const xpNeeded = newLevel * XP_PER_LEVEL;
        if (newXp >= xpNeeded && newLevel < MAX_LEVEL) {
          newXp -= xpNeeded;
          newLevel++;
          didLevelUp = true;
        }

        if (didLevelUp) {
          setLevelUpAnimation(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        const today = new Date().toDateString();
        const prevTasks = prev.dailyTasks;
        const dailyTasks: DailyTasks =
          prevTasks.date === today
            ? { ...prevTasks, [action]: prevTasks[action] + 1 }
            : { ...defaultDailyTasks(), [action]: 1 };

        const newCooldowns = {
          ...prev.actionCooldowns,
          [action]: now + effects.cooldown,
        };

        const newActionCounts = {
          ...prev.actionCounts,
          [action]: prev.actionCounts[action] + 1,
        };

        const updatedState: PetState = {
          ...prev,
          stats: newStats,
          level: newLevel,
          xp: newXp,
          totalXp: prev.totalXp + xpGain,
          actionCooldowns: newCooldowns,
          actionCounts: newActionCounts,
          dailyTasks,
          totalActions: prev.totalActions + 1,
        };

        const withStreak = updateStreak(updatedState);
        const { state: finalState, unlocked } = checkAchievements(withStreak);

        if (unlocked.length > 0) {
          setNewAchievements((prev) => [...prev, ...unlocked]);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        return finalState;
      });

      return { success: true, message: "Harika!" };
    },
    [petState, checkAchievements]
  );

  const renamePet = useCallback((name: string) => {
    setPetState((prev) => ({ ...prev, name }));
  }, []);

  const resetPet = useCallback(() => {
    const fresh = createDefaultState();
    setPetState(fresh);
    saveState(fresh);
  }, []);

  const getAchievementProgress = useCallback((): Achievement[] => {
    return ACHIEVEMENTS;
  }, []);

  const clearNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  const clearLevelUp = useCallback(() => {
    setLevelUpAnimation(false);
  }, []);

  return (
    <PetContext.Provider
      value={{
        petState,
        performAction,
        renamePet,
        resetPet,
        getAchievementProgress,
        newAchievements,
        clearNewAchievements,
        levelUpAnimation,
        clearLevelUp,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

export function usePet(): PetContextValue {
  const ctx = useContext(PetContext);
  if (!ctx) throw new Error("usePet must be used inside PetProvider");
  return ctx;
}
