import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppTheme } from "../../lib/theme";
import { GlassCard, PrimaryButton } from "../../components/ui";

const PRODUCTS = [
  { id: "essential", name: "Essential glove", desc: "Core assistive control", price: "$299" },
  { id: "advanced", name: "Advanced AI glove", desc: "Adaptive gesture engine", price: "$499" },
  { id: "clinical", name: "Clinical edition", desc: "Full telemetry suite", price: "$799" },
];

export default function OrderConfigScreen() {
  const router = useRouter();
  const colors = useAppTheme();
  const [selected, setSelected] = useState("advanced");

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1 px-5 pt-12">
      <Text style={{ color: colors.text }} className="font-display text-[26px] font-bold">
        Choose your glove
      </Text>
      <Text style={{ color: colors.secondaryText }} className="font-body text-[15px] mt-2">
        Select the hardware package that matches your therapy needs.
      </Text>

      <View className="mt-6 gap-4">
        {PRODUCTS.map((product) => {
          const isSelected = product.id === selected;
          return (
            <Pressable
              key={product.id}
              onPress={() => setSelected(product.id)}
              style={{
                backgroundColor: isSelected ? colors.primarySoft : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
                borderWidth: 2,
              }}
              className="rounded-3xl p-5 gap-2"
            >
              <View className="flex-row items-center justify-between">
                <Text style={{ color: colors.text }} className="font-display text-[18px] font-bold">
                  {product.name}
                </Text>
                <Text style={{ color: colors.primary }} className="font-display text-[16px] font-bold">
                  {product.price}
                </Text>
              </View>
              <Text style={{ color: colors.secondaryText }} className="font-body text-[14px]">
                {product.desc}
              </Text>
              {isSelected && (
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="check-circle" size={18} color={colors.primary} />
                  <Text style={{ color: colors.primary }} className="font-body text-[13px] font-semibold">
                    Selected
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <GlassCard colors={colors} className="mt-6 gap-3 p-4">
        <Text style={{ color: colors.text }} className="font-display text-[16px] font-bold">
          Measurement pipeline
        </Text>
        <Text style={{ color: colors.secondaryText }} className="font-body text-[13px]">
          Your measurements have been captured. You can proceed to delivery and payment.
        </Text>
      </GlassCard>

      <View className="mt-6">
        <PrimaryButton
          colors={colors}
          title="Continue to Delivery"
          icon="arrow-forward"
          onPress={() => router.push("/orders/delivery")}
        />
      </View>
    </ScrollView>
  );
}
