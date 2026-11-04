import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppTheme } from "../../lib/theme";
import { GlassCard, SectionTitle, StatusBadge } from "../../components/ui";

const NOTIFICATION_GROUPS = [
  {
    title: "Device",
    items: ["Firmware update ready", "Battery health stable", "Calibration reminder"]
  },
  {
    title: "Orders",
    items: ["Order status updated", "Glove fabrication in progress", "Shipping ETA confirmed"]
  },
  {
    title: "Emergency",
    items: ["SOS contact verified", "Emergency protocol checklist complete"]
  },
  {
    title: "System",
    items: ["Connectivity scan complete", "Background sync running"]
  }
];

export default function NotificationsScreen() {
  const router = useRouter();
  const colors = useAppTheme();

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1 px-5 pt-12">
      <SectionTitle colors={colors} title="Notifications" subtitle="Orders, device health, and emergency confirmations." />

      <GlassCard colors={colors} className="mt-6 gap-4">
        <View className="flex-row items-center justify-between">
          <Text style={{ color: colors.text }} className="font-display text-[18px] font-bold">
            Emergency Access
          </Text>
          <StatusBadge colors={colors} label="Always on" tone="danger" />
        </View>
        <Text style={{ color: colors.secondaryText }} className="font-body text-[14px] leading-5">
          SOS is always available, even during pre-activation. Trigger the emergency panel with one tap.
        </Text>
        <Pressable
          onPress={() => router.push("/emergency/sos")}
          style={{ backgroundColor: colors.dangerSoft }}
          className="flex-row items-center justify-center gap-2 rounded-2xl px-4 py-3"
        >
          <MaterialIcons name="emergency" size={22} color={colors.danger} />
          <Text style={{ color: colors.danger }} className="font-display text-[15px] font-bold">
            Open SOS Panel
          </Text>
        </Pressable>
      </GlassCard>

      <View className="mt-6 gap-4">
        {NOTIFICATION_GROUPS.map((group) => (
          <GlassCard key={group.title} colors={colors} className="gap-3 p-4">
            <Text style={{ color: colors.secondaryText }} className="font-body text-[12px] uppercase tracking-wider">
              {group.title}
            </Text>
            {group.items.map((item) => (
              <View key={item} className="flex-row items-center justify-between rounded-2xl px-3 py-2" style={{ backgroundColor: colors.elevated }}>
                <Text style={{ color: colors.text }} className="font-body text-[14px]">
                  {item}
                </Text>
                <MaterialIcons name="chevron-right" size={18} color={colors.secondaryText} />
              </View>
            ))}
          </GlassCard>
        ))}
      </View>
    </ScrollView>
  );
}
