import React, { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppTheme } from "../../lib/theme";
import { useAppStore } from "../../store/useAppStore";
import { GlassCard, SectionTitle } from "../../components/ui";
import { syncOnce, isFirebaseAppliance } from "../../lib/firebaseSync";

export default function DevicesScreen() {
  const colors = useAppTheme();
  
  const devices = useAppStore((state) => state.devices);
  const toggleDevicePower = useAppStore((state) => state.toggleDevicePower);
  const setDeviceIntensity = useAppStore((state) => state.setDeviceIntensity);
  const firebaseSyncStatus = useAppStore((state) => state.firebase_sync_status);
  const lastFirebaseSync = useAppStore((state) => state.last_firebase_sync);

  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    await syncOnce();
    setIsManualSyncing(false);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Smart light":
        return "lightbulb-outline";
      case "Smart fan":
        return "toys";
      case "Air Conditioner":
        return "ac-unit";
      case "Television":
        return "tv";
      default:
        return "speaker";
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1 px-5 pt-12">
      <SectionTitle colors={colors} title="Assistive Devices" subtitle="Large, accessible controls for smart home appliances." />

      {/* Firebase Realtime Database Status Card */}
      <GlassCard colors={colors} className="p-4 mb-4 flex-row items-center justify-between border-blue-500/30">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center gap-2">
            <View
              className={`w-2.5 h-2.5 rounded-full ${
                firebaseSyncStatus === "connected"
                  ? "bg-emerald-500"
                  : firebaseSyncStatus === "syncing"
                  ? "bg-amber-400"
                  : firebaseSyncStatus === "error"
                  ? "bg-rose-500"
                  : "bg-slate-400"
              }`}
            />
            <Text style={{ color: colors.text }} className="font-display text-[15px] font-bold">
              Firebase RTDB Live
            </Text>
          </View>
          <Text style={{ color: colors.secondaryText }} className="font-body text-[12px] mt-0.5">
            smartgrip-e5e0a • {lastFirebaseSync ? `Synced ${lastFirebaseSync}` : "Connecting..."}
          </Text>
        </View>

        <Pressable
          onPress={handleManualSync}
          disabled={isManualSyncing}
          style={{
            backgroundColor: colors.primarySoft,
            borderColor: colors.border,
            borderWidth: 1,
          }}
          className="px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 active:scale-95"
        >
          {isManualSyncing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <MaterialIcons name="sync" size={16} color={colors.primary} />
          )}
          <Text style={{ color: colors.primary }} className="font-display text-[12px] font-bold">
            Sync
          </Text>
        </Pressable>
      </GlassCard>
      
      <View className="gap-4">
        {devices.map((device) => {
          const isFirebaseDevice = isFirebaseAppliance(device.id);

          return (
            <GlassCard key={device.id} colors={colors} className="p-5 gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View style={{ backgroundColor: device.active ? colors.primarySoft : colors.elevated }} className="w-12 h-12 rounded-2xl items-center justify-center">
                    <MaterialIcons 
                      name={getDeviceIcon(device.type) as any} 
                      size={24} 
                      color={device.active ? colors.primary : colors.secondaryText} 
                    />
                  </View>
                  <View>
                    <View className="flex-row items-center gap-2">
                      <Text style={{ color: colors.text }} className="font-display text-[18px] font-bold">
                        {device.name}
                      </Text>
                      {isFirebaseDevice && (
                        <View className="bg-amber-500/10 dark:bg-amber-400/20 px-2 py-0.5 rounded-md">
                          <Text className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            FIREBASE
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ color: colors.secondaryText }} className="font-body text-[14px]">
                      {device.type} • {device.active ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>
                
                <Pressable
                  onPress={() => toggleDevicePower(device.id)}
                  style={{
                    backgroundColor: device.active ? colors.primary : colors.elevated,
                    borderColor: colors.border,
                    borderWidth: 1
                  }}
                  className="px-5 py-2.5 rounded-full active:scale-95 transition-all"
                >
                  <Text style={{ color: device.active ? "#FFFFFF" : colors.text }} className="font-display text-[14px] font-bold">
                    {device.active ? "ON" : "OFF"}
                  </Text>
                </Pressable>
              </View>

              {/* Slider for intensity if active */}
              {device.active && (device.type === "Smart light" || device.type === "Smart fan" || device.type === "Air Conditioner") && (
                <View className="gap-2 mt-2">
                  <View className="flex-row justify-between">
                    <Text style={{ color: colors.secondaryText }} className="font-body text-[13px]">
                      Control Level
                    </Text>
                    <Text style={{ color: colors.primary }} className="font-display text-[13px] font-bold">
                      {device.intensity}%
                    </Text>
                  </View>
                  
                  {/* Custom Touch Slider Controls */}
                  <View className="flex-row gap-2">
                    {[25, 50, 75, 100].map((val) => {
                      const isVal = device.intensity === val;
                      return (
                        <Pressable
                          key={val}
                          onPress={() => setDeviceIntensity(device.id, val)}
                          style={{
                            backgroundColor: isVal ? colors.primary : colors.elevated,
                            borderColor: colors.border,
                            borderWidth: 1
                          }}
                          className="flex-1 py-2 rounded-xl items-center justify-center active:scale-95"
                        >
                          <Text style={{ color: isVal ? "#FFFFFF" : colors.text }} className="font-display text-[13px] font-semibold">
                            {val}%
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}
            </GlassCard>
          );
        })}
      </View>

      <GlassCard colors={colors} className="mt-6 gap-3">
        <Text style={{ color: colors.text }} className="font-display text-[18px] font-semibold">
          Connection Integrity
        </Text>
        <Text style={{ color: colors.secondaryText }} className="font-body text-[14px] leading-5">
          Appliances are synchronized bidirectional in real-time with Firebase Realtime Database at smartgrip-e5e0a.
        </Text>
      </GlassCard>
    </ScrollView>
  );
}
