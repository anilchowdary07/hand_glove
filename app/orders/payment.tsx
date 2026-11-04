import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppTheme } from "../../lib/theme";
import { GlassCard, PrimaryButton } from "../../components/ui";

const METHODS = [
  { id: "upi", label: "UPI" },
  { id: "card", label: "Cards" },
  { id: "wallet", label: "Wallets" },
];

export default function OrderPaymentScreen() {
  const router = useRouter();
  const colors = useAppTheme();
  const [selected, setSelected] = useState("upi");

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1 px-5 pt-12">
      <Text style={{ color: colors.text }} className="font-display text-[26px] font-bold">
        Payment method
      </Text>
      <Text style={{ color: colors.secondaryText }} className="font-body text-[15px] mt-2">
        Secure checkout for your smart glove order.
      </Text>

      <View className="mt-6 gap-3">
        {METHODS.map((method) => {
          const isSelected = method.id === selected;
          return (
            <Pressable
              key={method.id}
              onPress={() => setSelected(method.id)}
              style={{
                backgroundColor: isSelected ? colors.primarySoft : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
                borderWidth: 2,
              }}
              className="rounded-2xl px-4 py-4 flex-row items-center justify-between"
            >
              <Text style={{ color: colors.text }} className="font-display text-[16px] font-bold">
                {method.label}
              </Text>
              {isSelected && <MaterialIcons name="check-circle" size={20} color={colors.primary} />}
            </Pressable>
          );
        })}
      </View>

      <GlassCard colors={colors} className="mt-6 gap-2 p-4">
        <Text style={{ color: colors.text }} className="font-display text-[16px] font-bold">
          Order total
        </Text>
        <Text style={{ color: colors.secondaryText }} className="font-body text-[13px]">
          Taxes and delivery are included at checkout.
        </Text>
        <Text style={{ color: colors.primary }} className="font-display text-[22px] font-bold">
          $499
        </Text>
      </GlassCard>

      <View className="mt-6">
        <PrimaryButton
          colors={colors}
          title="Review Order Summary"
          icon="arrow-forward"
          onPress={() => router.push("/orders/summary")}
        />
      </View>
    </ScrollView>
  );
}
