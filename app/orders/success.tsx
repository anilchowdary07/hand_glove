import React from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppTheme } from "../../lib/theme";
import { useAppStore } from "../../store/useAppStore";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const colors = useAppTheme();
  const setAppPhase = useAppStore((state) => state.setAppPhase);
  const setFabricationStatus = useAppStore((state) => state.setFabricationStatus);

  const handleContinue = () => {
    setAppPhase("PRE_ACTIVATION");
    setFabricationStatus("Processing");
    router.replace("/home");
  };

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1 items-center justify-center px-6">
      <View style={{ backgroundColor: colors.successSoft }} className="h-24 w-24 items-center justify-center rounded-full">
        <MaterialIcons name="check-circle" size={48} color={colors.success} />
      </View>
      <Text style={{ color: colors.text }} className="font-display text-[28px] font-bold mt-6 text-center">
        Order confirmed
      </Text>
      <Text style={{ color: colors.secondaryText }} className="font-body text-[15px] text-center mt-3 leading-6">
        Your smart glove order has been placed. Track fabrication progress in your dashboard.
      </Text>

      <Pressable
        onPress={handleContinue}
        style={{ backgroundColor: colors.primary }}
        className="mt-8 rounded-2xl px-6 py-4 flex-row items-center gap-2"
      >
        <Text style={{ color: colors.inverseText }} className="font-display text-[16px] font-bold">
          Go to Dashboard
        </Text>
        <MaterialIcons name="arrow-forward" size={20} color={colors.inverseText} />
      </Pressable>
    </View>
  );
}
