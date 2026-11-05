import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppTheme } from "../../lib/theme";
import { GlassCard, PrimaryButton } from "../../components/ui";

export default function OrderTrackingScreen() {
  const router = useRouter();
  const colors = useAppTheme();

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1 px-5 pt-12">
      <Text style={{ color: colors.text }} className="font-display text-[26px] font-bold">
        Order tracking
      </Text>
      <Text style={{ color: colors.secondaryText }} className="font-body text-[15px] mt-2">
        Manufacturing, shipping, and delivery updates in one place.
      </Text>

      <GlassCard colors={colors} className="mt-6 gap-3 p-5">
        <View className="flex-row items-center gap-3">
          <View style={{ backgroundColor: colors.primarySoft }} className="h-12 w-12 items-center justify-center rounded-2xl">
            <MaterialIcons name="local-shipping" size={24} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text style={{ color: colors.text }} className="font-display text-[18px] font-bold">
              Smart Glove Order
            </Text>
            <Text style={{ color: colors.secondaryText }} className="font-body text-[14px]">
              Order ID: GLV-8924-XT
            </Text>
          </View>
        </View>
        <Text style={{ color: colors.secondaryText }} className="font-body text-[14px] leading-5">
          Check fabrication milestones, courier updates, and ETA changes.
        </Text>
      </GlassCard>

      <View className="mt-6">
        <PrimaryButton
          colors={colors}
          title="Open Tracking Timeline"
          icon="timeline"
          onPress={() => router.push("/scans/delivery")}
        />
      </View>

      <Pressable onPress={() => router.replace("/home")} className="mt-4 self-center">
        <Text style={{ color: colors.secondaryText }} className="font-body text-[14px]">
          Back to dashboard
        </Text>
      </Pressable>
    </ScrollView>
  );
}
