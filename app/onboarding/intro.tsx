import React, { useState } from "react";
import { Dimensions, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppTheme } from "../../lib/theme";
import { useAppStore } from "../../store/useAppStore";
import { GlassCard, PrimaryButton, SecondaryButton } from "../../components/ui";

type IntroSlide = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  image?: string;
  bullets?: string[];
};

const SLIDES: IntroSlide[] = [
  {
    id: "product",
    title: "Meet the Smart Grip glove",
    description: "A medical-grade assistive glove that guides therapy, controls devices, and keeps you safe.",
    icon: "back-hand",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0xIzi1BY9cHG9Xq6hbFDf6DPrhXbGSEqEUY0l4_hP9Thm_kv3nz3VZR5zF7H5kSJMm6S8KpYkJQLB13a0F0XX7wq2A3G3v6Tvb0nHkz5d5oO1wmYYq8EdDSAm0JDG9x5BYnQxQ9jv8V8H98w_K0qDwrqH3D7mH1eH3u37y0Vn1OKkwI9wY7mnx1SxwVJcOmAK6XkC7f2nDAg4C7GnX6JvWq4x7rE5HE2gN4p3Ix3f2VV4W4gH59U6",
    bullets: ["3D hand measurement", "Adaptive gesture control", "Emergency protection"],
  },
  {
    id: "gesture",
    title: "Train gestures with confidence",
    description: "Guided calibration builds a custom motion profile for accurate control.",
    icon: "gesture",
    bullets: ["Animated hand guidance", "Repeatable samples", "Gesture to action mapping"],
  },
  {
    id: "safety",
    title: "Safety comes first",
    description: "We keep you safe with charging reminders, emergency alerts, and device health checks.",
    icon: "health-and-safety",
    bullets: ["Charging guidelines", "Emergency disclaimer", "SOS setup"],
  },
  {
    id: "control",
    title: "Smart control in every room",
    description: "Control lights, fans, TVs, and more with a single gesture.",
    icon: "home",
    bullets: ["Light and fan control", "TV & media shortcuts", "Smart home integrations"],
  },
  {
    id: "accessibility",
    title: "Accessibility built in",
    description: "Large mode, tremor stabilization, and voice guidance are available anytime.",
    icon: "accessibility-new",
    bullets: ["Large touch targets", "Tremor stabilization", "Voice guidance"],
  },
  {
    id: "permissions",
    title: "Permissions for the best experience",
    description: "Enable Bluetooth, notifications, and location to unlock the full assistive ecosystem.",
    icon: "verified-user",
    bullets: ["Bluetooth", "Notifications", "Location", "SMS (optional)"],
  },
];

export default function IntroScreen() {
  const router = useRouter();
  const colors = useAppTheme();
  const setIntroCompleted = useAppStore((state) => state.setIntroCompleted);
  const [activeIndex, setActiveIndex] = useState(0);

  const slide = SLIDES[activeIndex];
  const total = SLIDES.length;
  const isLast = activeIndex === total - 1;

  const handleNext = () => {
    if (isLast) {
      setIntroCompleted(true);
      router.replace("/login");
      return;
    }
    setActiveIndex((prev) => Math.min(prev + 1, total - 1));
  };

  const handleSkip = () => {
    setIntroCompleted(true);
    router.replace("/login");
  };

  const width = Dimensions.get("window").width;

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1 px-5 pt-12">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="back-hand" size={22} color={colors.primary} />
          <Text style={{ color: colors.primary }} className="font-display text-[18px] font-bold">
            Smart Grip
          </Text>
        </View>
        <Pressable onPress={handleSkip} className="px-3 py-2 rounded-full">
          <Text style={{ color: colors.secondaryText }} className="font-body text-[13px] uppercase tracking-wider">
            Skip
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1">
        <GlassCard colors={colors} className="mt-6 gap-6 p-6">
          <View className="items-center gap-4">
            <View style={{ backgroundColor: colors.primarySoft }} className="h-16 w-16 items-center justify-center rounded-2xl">
              <MaterialIcons name={slide.icon} size={30} color={colors.primary} />
            </View>
            <View className="items-center gap-2">
              <Text style={{ color: colors.text }} className="font-display text-[26px] font-bold text-center">
                {slide.title}
              </Text>
              <Text style={{ color: colors.secondaryText }} className="font-body text-[15px] text-center leading-6">
                {slide.description}
              </Text>
            </View>
          </View>

          {slide.image && (
            <View className="rounded-3xl overflow-hidden">
              <Image source={{ uri: slide.image }} style={{ width: width - 80, height: 180 }} className="object-cover" />
            </View>
          )}

          {slide.bullets && (
            <View className="gap-3">
              {slide.bullets.map((bullet) => (
                <View key={bullet} className="flex-row items-center gap-3">
                  <View style={{ backgroundColor: colors.primarySoft }} className="h-9 w-9 items-center justify-center rounded-full">
                    <MaterialIcons name="check" size={18} color={colors.primary} />
                  </View>
                  <Text style={{ color: colors.text }} className="font-body text-[14px]">
                    {bullet}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </GlassCard>

        <View className="mt-6 flex-row items-center justify-center gap-2">
          {SLIDES.map((item, idx) => (
            <View
              key={item.id}
              style={{ backgroundColor: idx === activeIndex ? colors.primary : colors.border }}
              className="h-2 w-8 rounded-full"
            />
          ))}
        </View>

        <View className="mt-6 gap-3">
          <PrimaryButton
            colors={colors}
            title={isLast ? "Continue to Login" : "Next"}
            icon={isLast ? "arrow-forward" : "navigate-next"}
            onPress={handleNext}
          />
          {!isLast && (
            <SecondaryButton colors={colors} title="Back" onPress={() => setActiveIndex((prev) => Math.max(prev - 1, 0))} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
