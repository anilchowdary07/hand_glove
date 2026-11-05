import React, { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { useAppTheme } from "../../lib/theme";
import { GlassCard, PrimaryButton } from "../../components/ui";

export default function OrderDeliveryScreen() {
  const router = useRouter();
  const colors = useAppTheme();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const isValid = name && address && phone && pin;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1 px-5 pt-12">
      <Text style={{ color: colors.text }} className="font-display text-[26px] font-bold">
        Delivery details
      </Text>
      <Text style={{ color: colors.secondaryText }} className="font-body text-[15px] mt-2">
        Provide a secure address for glove shipment.
      </Text>

      <GlassCard colors={colors} className="mt-6 gap-4 p-5">
        {["Full name", "Delivery address", "Phone number", "PIN code"].map((label, idx) => {
          const value = idx === 0 ? name : idx === 1 ? address : idx === 2 ? phone : pin;
          const setter = idx === 0 ? setName : idx === 1 ? setAddress : idx === 2 ? setPhone : setPin;
          return (
            <View key={label} className="gap-2">
              <Text style={{ color: colors.secondaryText }} className="font-body text-[13px] font-bold">
                {label}
              </Text>
              <TextInput
                value={value}
                onChangeText={setter}
                placeholder={label}
                style={{ backgroundColor: colors.elevated, borderColor: colors.border, borderWidth: 1, color: colors.text }}
                className="p-3.5 rounded-xl font-body text-[15px]"
              />
            </View>
          );
        })}
      </GlassCard>

      <View className="mt-6">
        <PrimaryButton
          colors={colors}
          title="Continue to Payment"
          icon="arrow-forward"
          disabled={!isValid}
          onPress={() => router.push("/orders/payment")}
        />
      </View>
    </ScrollView>
  );
}
