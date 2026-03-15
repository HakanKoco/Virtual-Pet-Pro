import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { Colors } from "@/constants/colors";
import { usePet } from "@/context/PetContext";
import { formatNumber } from "@/utils/petHelpers";
import { getLevelTitle } from "@/constants/gameConfig";
import { PET_TYPES, getPetTypeConfig } from "@/constants/petTypes";

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  description?: string;
  onPress?: () => void;
  danger?: boolean;
  rightElement?: React.ReactNode;
}

function SettingsRow({
  icon,
  iconColor,
  label,
  description,
  onPress,
  danger,
  rightElement,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && onPress && styles.rowPressed,
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>
          {label}
        </Text>
        {description && (
          <Text style={styles.rowDesc}>{description}</Text>
        )}
      </View>
      {rightElement ?? (
        onPress ? (
          <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
        ) : null
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { petState, renamePet, changePetType, resetPet } = usePet();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(petState.name);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : 0;

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length > 0 && trimmed.length <= 20) {
      renamePet(trimmed);
      setEditing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Evcil Hayvanı Sıfırla",
      "Tüm ilerleme, seviye ve başarımlar silinecek. Bu işlem geri alınamaz!",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sıfırla",
          style: "destructive",
          onPress: () => {
            resetPet();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  const levelTitle = getLevelTitle(petState.level);
  const currentPetConfig = getPetTypeConfig(petState.petType);

  return (
    <View style={[styles.root, { backgroundColor: Colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topPadding + 16,
            paddingBottom: bottomPadding + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.screenTitle}>Ayarlar</Text>

        <View style={styles.profileSummary}>
          <View style={[styles.petEmojiBg, { borderColor: `${currentPetConfig.color}40` }]}>
            <Text style={{ fontSize: 36 }}>{currentPetConfig.emoji.happy}</Text>
          </View>
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{petState.name}</Text>
            <Text style={[styles.petType, { color: currentPetConfig.color }]}>
              {currentPetConfig.name} · {currentPetConfig.description}
            </Text>
            <Text style={styles.petLevel}>
              Seviye {petState.level} · {levelTitle}
            </Text>
            <View style={styles.coinRow}>
              <Ionicons name="logo-bitcoin" size={13} color={Colors.secondary} />
              <Text style={styles.coinText}>{petState.coins} coin</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Evcil Hayvan Türü</Text>
          <View style={styles.petTypeGrid}>
            {PET_TYPES.map((pet) => {
              const isSelected = petState.petType === pet.id;
              return (
                <Pressable
                  key={pet.id}
                  onPress={() => changePetType(pet.id)}
                  style={[
                    styles.petTypeCard,
                    isSelected && {
                      borderColor: pet.color,
                      backgroundColor: `${pet.color}15`,
                    },
                  ]}
                >
                  <Text style={styles.petTypeEmoji}>{pet.emoji.happy}</Text>
                  <Text
                    style={[
                      styles.petTypeName,
                      isSelected && { color: pet.color },
                    ]}
                  >
                    {pet.name}
                  </Text>
                  <Text style={styles.petTypeDesc}>{pet.description}</Text>
                  {isSelected && (
                    <View style={[styles.selectedBadge, { backgroundColor: pet.color }]}>
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Evcil Hayvan Adı</Text>
          <View style={styles.sectionCard}>
            {editing ? (
              <View style={styles.nameEditRow}>
                <TextInput
                  style={styles.nameInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  maxLength={20}
                  autoFocus
                  placeholderTextColor={Colors.textTertiary}
                  placeholder="Evcil hayvan adı"
                  selectionColor={Colors.primary}
                />
                <Pressable onPress={handleSaveName} style={styles.saveBtn}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </Pressable>
                <Pressable
                  onPress={() => {
                    setEditing(false);
                    setNameInput(petState.name);
                  }}
                  style={styles.cancelBtn}
                >
                  <Ionicons name="close" size={20} color={Colors.textSecondary} />
                </Pressable>
              </View>
            ) : (
              <SettingsRow
                icon="pencil"
                iconColor={Colors.primary}
                label="İsim Değiştir"
                description={petState.name}
                onPress={() => {
                  setEditing(true);
                  setNameInput(petState.name);
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>İlerleme</Text>
          <View style={styles.sectionCard}>
            <SettingsRow
              icon="star"
              iconColor={Colors.xp}
              label="Seviye"
              rightElement={
                <Text style={styles.rightValue}>{petState.level}</Text>
              }
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="diamond"
              iconColor={Colors.primary}
              label="Toplam XP"
              rightElement={
                <Text style={styles.rightValue}>
                  {formatNumber(petState.totalXp)}
                </Text>
              }
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="logo-bitcoin"
              iconColor={Colors.secondary}
              label="Coin"
              rightElement={
                <Text style={styles.rightValue}>{petState.coins}</Text>
              }
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="flame"
              iconColor={Colors.streak}
              label="Gün Serisi"
              rightElement={
                <Text style={styles.rightValue}>{petState.streak}</Text>
              }
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="trophy"
              iconColor={Colors.success}
              label="Başarımlar"
              rightElement={
                <Text style={styles.rightValue}>
                  {petState.unlockedAchievements.length}
                </Text>
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Hakkında</Text>
          <View style={styles.sectionCard}>
            <SettingsRow
              icon="information-circle"
              iconColor={Colors.info}
              label="Versiyon"
              rightElement={
                <Text style={styles.rightValue}>1.0.0</Text>
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tehlikeli Bölge</Text>
          <View style={styles.sectionCard}>
            <SettingsRow
              icon="refresh-circle"
              iconColor={Colors.danger}
              label="Evcil Hayvanı Sıfırla"
              description="Tüm ilerleme silinir"
              onPress={handleReset}
              danger
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 20,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  profileSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  petEmojiBg: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  petInfo: {
    flex: 1,
    gap: 3,
  },
  petName: {
    color: Colors.text,
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  petType: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  petLevel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  coinText: {
    color: Colors.secondary,
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    color: Colors.textTertiary,
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  petTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  petTypeCard: {
    width: "47%",
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 4,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    position: "relative",
  },
  petTypeEmoji: {
    fontSize: 32,
  },
  petTypeName: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  petTypeDesc: {
    color: Colors.textTertiary,
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  rowPressed: {
    backgroundColor: Colors.backgroundTertiary,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    color: Colors.text,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  rowLabelDanger: {
    color: Colors.danger,
  },
  rowDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginLeft: 62,
  },
  rightValue: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  nameEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
  },
  nameInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  saveBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
});
