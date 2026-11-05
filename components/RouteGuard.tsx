import React, { useEffect } from "react";
import { usePathname, useRouter, useSegments } from "expo-router";
import { useAppStore } from "../store/useAppStore";

type RouteGuardProps = {
  children: React.ReactNode;
};

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();

  const authenticated = useAppStore((state) => state.authenticated);
  const role = useAppStore((state) => state.role);
  const introCompleted = useAppStore((state) => state.intro_completed);
  const medical_condition = useAppStore((state) => state.medical_condition);
  const glove_hand = useAppStore((state) => state.glove_hand);
  const patient_details = useAppStore((state) => state.patient_details);

  useEffect(() => {
    // 1. Skip routing guard if index (splash) page
    if ((segments.length as number) === 0 || pathname === "/") {
      return;
    }

    const isAuthRoute = 
      pathname === "/login" || 
      pathname === "/register" || 
      pathname === "/forgot-password";

    const isIntroRoute = pathname === "/onboarding/intro";

    // 2. Unauthenticated check
    if (!authenticated) {
      if (isIntroRoute || isAuthRoute) {
        return;
      }
      router.replace(introCompleted ? "/login" : "/onboarding/intro");
      return;
    }

    // 3. Authenticated check - prevent accessing auth screens
    if (isAuthRoute || isIntroRoute) {
      if (role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/home");
      }
      return;
    }

    // 4. Admin Routing Guard
    if (role === "admin") {
      const isAdminRoute = 
        segments[0] === "admin" || 
        pathname === "/profile" || 
        pathname === "/settings";
      if (!isAdminRoute) {
        router.replace("/admin");
      }
      return;
    }

    // 5. Enforce scan prerequisites only when entering scan flow
    const isScanRoute = segments[0] === "scans";
    const isOnboardingRoute = pathname.startsWith("/onboarding/");
    if (isScanRoute && !isOnboardingRoute) {
      if (medical_condition === "") {
        router.replace("/onboarding/condition");
        return;
      }
      if (glove_hand === "") {
        router.replace("/onboarding/hand");
        return;
      }
      if (patient_details === null) {
        router.replace("/onboarding/details");
        return;
      }
    }

  }, [
    authenticated,
    role,
    medical_condition,
    glove_hand,
    patient_details,
    pathname,
    segments
  ]);

  return <>{children}</>;
}
