import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppTheme } from "../../lib/theme";
import { useAppStore } from "../../store/useAppStore";

const STEP_LABELS: { id: string; title: string }[] = [
  { id: "wrist",         title: "Wrist Profile"     },
  { id: "palm-front",   title: "Open Palm"          },
  { id: "palm-side",    title: "Side Profile"       },
  { id: "fingers",      title: "Extended Fingers"   },
  { id: "fist",         title: "Closed Fist"        },
  { id: "wrist-rotation", title: "Tendon Rotation"  },
  { id: "thumb",        title: "Thumb Profile"      },
  { id: "back-hand",    title: "Back of Hand"       },
];

// Fallback guide images per step (shown if captured URI isn't available)
const FALLBACK_IMAGES: Record<string, string> = {
  "wrist":          "https://lh3.googleusercontent.com/aida-public/AB6AXuDHO76qInuYYarwRgd5xMotswjXdpEb5ODynY89TyFAzumcHr4_fV3_ORlVYiBZ0-X2aT6E2_yJ4lMtFVkRBKUpgwcQJKXTvl7zOoVnmMYNfR-e9nklB96qEnX8_7-luvvvCl20-OwdZ5GNqY0CkvRAuKB4SvDA67-T_ICv4jwkY3vYFjuCrnihWhvTHel7YG60pkcAvmT30t7Tif6_Zh9nLCSPS2FmHK-JeBva8liRRvstx83dLVzBfmjLMBvxEQc0isswWcshR1c",
  "palm-front":     "https://lh3.googleusercontent.com/aida-public/AB6AXuCBiHh8411Jg43aKZkZsL3Lxm59aR6F17i1TmkrxZaDxrcdO0L0pAezt94t0dnUdlbz3YI8cBLGsM7qfiuwVnFoi6mx6cx_LqRbL0NznVh0T7sMu3QMiVG-J0YYGcAfL9YTe98mqlBd-ZVR-_fNVyI7nA93aLj2OPPwRnN1DpUhOJZ6IinFx2--2GsD8vleLvKqhb9xjRuimEDCGvkhuSHSS_jc6Iws6pgj0GWbBd4lU0tVmALl_z989cHwXCIooA6WLXx1L9q4dEk",
  "palm-side":      "https://lh3.googleusercontent.com/aida-public/AB6AXuCIJMh8KPRTiglrCdmiQJY2nh60W4pHn7b3DfvZ7YrxDmsh0tRH9Vfomm1NWhhEs98SoGY2efTANlNZAd7o8x-oact4Y-2NR6nrUyiBMdXnt1xJfk6AliaLL2qnRp47nzS87KmTxBTVk_m4_4dhjaflHiOVoJzFLWZiWswbhwRV_-tMTB_OC2n-tJRGvzpkMtZUkfbOWq7WL0zsFnO057SnfIB4KlpFoawYh3_b42lqX6d8BGCSvdNUSxVS_iovar6sqQAARQA53Nw",
  "fingers":        "https://lh3.googleusercontent.com/aida-public/AB6AXuDw8KCl5C2YlWlpQXQxB5HI2FU5yMYzqIOaDiKnz9p39SzI0Y-nzoHiF1H1xjBf_8zmc9_sQA-57LMcou9agBkcimCh_pp6jKjbyT7XvKrMQXAYhxUpCdnDAUbsV_h9h8BSX7cJlP0lVadx4pB9v4gyaVSEmJ_Qdya2JwM7MVy36FQ0nsdhuv_Qt9Z9vUckJ1PydSzspRC0IqPYZ3MSmilrxMGKJzbtidp_OZJPviAP9azGBPuVZErlalVEMGyV8HMUe-gib8FH8oE",
  "fist":           "https://lh3.googleusercontent.com/aida-public/AB6AXuBPMNXsAMm7lzvf1BXe68-YzlOOFnuG5EtVGSdgTbs-xsjIhgn8fGWsTywYiYtcpbPV2uyV3VLKNJGCNPbyRs7ehXr9u2eFvJ7mDhqXNN4J38RlEz4m08fHSthURWMLk9imoGouAYKUog9xTgRv27lYFRgb4QX-cqP2cjXL5Qxmh2--YPV7nPrccXYMqRW3JtV45il_R4OKjsWdOlYiyzaim7mSG-eoBnB_bTkSvD3dKrOKWWZD_9mS-aDYhfgWJQd_MZnf2wLJkF0",
  "wrist-rotation": "https://lh3.googleusercontent.com/aida-public/AB6AXuDmTOu_B4m0ibL7wk9beorKYI5OhlRUn8uTQfVHybNgDExEza0XU0adc_o1W623GNxgEV-01500lsG6rJwetAGwxipNw4VSRwgRkyWM3WMrD0NitZ8K8mwOZ-GYB1isk897LqEtwTGa0bWKENXv7hie_UQ5psPZip0AwecA_1ld349I_1ktjBHIQVVx_OZUVCeiFp0KOvwaZfnTAw1zkmK0DvdGZO7YN803xBcoNPEwkACPHMJcfnDRnk7eMBKEGf4SdfKtX_Co10I",
  "thumb":          "https://lh3.googleusercontent.com/aida-public/AB6AXuCIJMh8KPRTiglrCdmiQJY2nh60W4pHn7b3DfvZ7YrxDmsh0tRH9Vfomm1NWhhEs98SoGY2efTANlNZAd7o8x-oact4Y-2NR6nrUyiBMdXnt1xJfk6AliaLL2qnRp47nzS87KmTxBTVk_m4_4dhjaflHiOVoJzFLWZiWswbhwRV_-tMTB_OC2n-tJRGvzpkMtZUkfbOWq7WL0zsFnO057SnfIB4KlpFoawYh3_b42lqX6d8BGCSvdNUSxVS_iovar6sqQAARQA53Nw",
  "back-hand":      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBiHh8411Jg43aKZkZsL3Lxm59aR6F17i1TmkrxZaDxrcdO0L0pAezt94t0dnUdlbz3YI8cBLGsM7qfiuwVnFoi6mx6cx_LqRbL0NznVh0T7sMu3QMiVG-J0YYGcAfL9YTe98mqlBd-ZVR-_fNVyI7nA93aLj2OPPwRnN1DpUhOJZ6IinFx2--2GsD8vleLvKqhb9xjRuimEDCGvkhuSHSS_jc6Iws6pgj0GWbBd4lU0tVmALl_z989cHwXCIooA6WLXx1L9q4dEk",
};

export default function ReviewCapturesScreen() {
  const router = useRouter();
  const colors = useAppTheme();
  const gloveHand = useAppStore((state) => state.glove_hand) || "right";
  // Get the actual captured photos from store
  const scanCaptures = useAppStore((state) => state.scan_captures) as Record<string, string>;

  const capturedCount = Object.keys(scanCaptures).length;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Review Scan</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={[styles.titleText, { color: colors.text }]}>Review Captures</Text>
          <Text style={[styles.subtitleText, { color: colors.secondaryText }]}>
            {capturedCount} of 8 frames captured for your {gloveHand} hand scan.
            {capturedCount === 8 ? " All frames uploaded successfully." : " Incomplete scan."}
          </Text>
        </View>

        {/* Status banner */}
        <View style={[styles.statusBanner, { backgroundColor: capturedCount === 8 ? "#0d7a3a" : "#7a4d0d" }]}>
          <MaterialIcons
            name={capturedCount === 8 ? "check-circle" : "warning"}
            size={20}
            color="#fff"
          />
          <Text style={styles.statusText}>
            {capturedCount === 8
              ? "✓ Scan complete — ready for measurement extraction"
              : `${8 - capturedCount} frames missing — please rescan`}
          </Text>
        </View>

        {/* Frame cards */}
        <View style={styles.grid}>
          {STEP_LABELS.map((step, idx) => {
            const capturedUri = scanCaptures[step.id];
            const imageUri = capturedUri || FALLBACK_IMAGES[step.id];
            const isCaptured = !!capturedUri;

            return (
              <View
                key={step.id}
                style={[styles.card, { backgroundColor: colors.card, borderColor: isCaptured ? colors.primary : colors.border }]}
              >
                {/* Photo */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                  {/* Step number badge */}
                  <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.stepBadgeText}>{idx + 1}</Text>
                  </View>
                  {/* Captured checkmark */}
                  {isCaptured && (
                    <View style={styles.checkBadge}>
                      <MaterialIcons name="check-circle" size={28} color="#00e676" />
                    </View>
                  )}
                  {/* "YOUR PHOTO" label for actual captures */}
                  {isCaptured && (
                    <View style={[styles.yourPhotoLabel, { backgroundColor: colors.primary }]}>
                      <Text style={styles.yourPhotoText}>YOUR PHOTO</Text>
                    </View>
                  )}
                </View>

                {/* Info row */}
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{step.title}</Text>
                    <Text style={[styles.cardSub, { color: isCaptured ? "#00c853" : colors.secondaryText }]}>
                      {isCaptured ? "Captured & uploaded" : "Not captured"}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => router.push("/scans/camera")}
                    style={[styles.retakeBtn, { borderColor: colors.border }]}
                  >
                    <MaterialIcons name="replay" size={14} color={colors.primary} />
                    <Text style={[styles.retakeText, { color: colors.primary }]}>RETAKE</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/scans/processing")}
          >
            <MaterialIcons name="straighten" size={22} color="#fff" />
            <Text style={styles.primaryBtnText}>Extract Measurements</Text>
          </Pressable>
          <Pressable
            style={[styles.secondaryBtn, { borderColor: colors.border }]}
            onPress={() => router.replace("/home")}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Back to Home</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 8, borderRadius: 20 },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  headerSpacer: { width: 40 },

  scroll: { padding: 20, paddingBottom: 48, gap: 16 },

  titleBlock: { gap: 6 },
  titleText: { fontSize: 28, fontWeight: "800" },
  subtitleText: { fontSize: 15, lineHeight: 22 },

  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
  },
  statusText: { color: "#fff", fontSize: 14, fontWeight: "600", flex: 1 },

  grid: { gap: 16 },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
  },
  imageContainer: {
    height: 200,
    position: "relative",
    backgroundColor: "#111",
  },
  photo: { width: "100%", height: "100%" },
  stepBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  checkBadge: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  yourPhotoLabel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    alignItems: "center",
  },
  yourPhotoText: { color: "#fff", fontSize: 11, fontWeight: "700", letterSpacing: 2 },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardSub: { fontSize: 13, marginTop: 2 },
  retakeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  retakeText: { fontSize: 12, fontWeight: "700" },

  actions: { gap: 12, marginTop: 8 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: 16,
  },
  primaryBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  secondaryBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  secondaryBtnText: { fontSize: 16, fontWeight: "600" },
});
