import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { useAppTheme } from "../../lib/theme";
import { GlassCard, PrimaryButton, StatusBadge } from "../../components/ui";

export default function OrderSummaryScreen() {
  const router = useRouter();
  const colors = useAppTheme();

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1 px-5 pt-12">
      <Text style={{ color: colors.text }} className="font-display text-[26px] font-bold">
        Order summary
      </Text>
      <Text style={{ color: colors.secondaryText }} className="font-body text-[15px] mt-2">
        Review the order details before placing it.
      </Text>

      <GlassCard colors={colors} className="mt-6 gap-3 p-5">
        <Text style={{ color: colors.text }} className="font-display text-[18px] font-bold">
          Smart Grip Advanced AI Glove
        </Text>
        <View className="flex-row flex-wrap gap-2">
          <StatusBadge colors={colors} label="Right hand" tone="primary" />
          <StatusBadge colors={colors} label="Measurements captured" tone="success" />
        </View>
        <Text style={{ color: colors.secondaryText }} className="font-body text-[14px]">
          Includes personalized calibration and assistive device mapping.
        </Text>
      </GlassCard>

      <GlassCard colors={colors} className="mt-4 gap-2 p-5">
        <View className="flex-row items-center justify-between">
          <Text style={{ color: colors.secondaryText }} className="font-body text-[14px]">
            Subtotal
          </Text>
          <Text style={{ color: colors.text }} className="font-display text-[14px] font-bold">
            $499
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text style={{ color: colors.secondaryText }} className="font-body text-[14px]">
            Delivery
          </Text>
          <Text style={{ color: colors.text }} className="font-display text-[14px] font-bold">
            $0
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text style={{ color: colors.secondaryText }} className="font-body text-[14px]">
            Total
          </Text>
          <Text style={{ color: colors.primary }} className="font-display text-[18px] font-bold">
            $499
          </Text>
        </View>
      </GlassCard>

      <View className="mt-6">
        <PrimaryButton
          colors={colors}
          title="Place Order"
          icon="check"
          onPress={() => router.push("/orders/success")}
        />
      </View>
    </ScrollView>
  );
}
