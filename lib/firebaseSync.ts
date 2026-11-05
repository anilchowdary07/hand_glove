import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

export const FIREBASE_RTDB_BASE_URL = (
  process.env.EXPO_PUBLIC_FIREBASE_RTDB_URL ||
  "https://smartgrip-e5e0a-default-rtdb.firebaseio.com"
).replace(/\/$/, "");

// Valid appliances mapped in Firebase Realtime Database
export const FIREBASE_APPLIANCE_KEYS = ["light", "fan", "tv", "ac"] as const;
export type FirebaseApplianceKey = (typeof FIREBASE_APPLIANCE_KEYS)[number];

export function isFirebaseAppliance(id: string): id is FirebaseApplianceKey {
  return (FIREBASE_APPLIANCE_KEYS as readonly string[]).includes(id);
}

/**
 * Fetch all appliance states directly from Firebase Realtime Database.
 */
export async function fetchAppliancesFromFirebase(): Promise<Record<string, string> | null> {
  try {
    const response = await fetch(`${FIREBASE_RTDB_BASE_URL}/appliances.json`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Firebase RTDB returned status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("[FirebaseSync] Failed to fetch appliances from Firebase:", error);
    return null;
  }
}

/**
 * Fetch a specific appliance state (e.g. "light") from Firebase Realtime Database.
 */
export async function fetchLightStateFromFirebase(): Promise<string | null> {
  try {
    const response = await fetch(`${FIREBASE_RTDB_BASE_URL}/appliances/light.json`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Firebase RTDB returned status: ${response.status}`);
    }

    const val = await response.json();
    return val;
  } catch (error) {
    console.warn("[FirebaseSync] Failed to fetch light state:", error);
    return null;
  }
}

/**
 * Push an updated appliance state to Firebase Realtime Database (e.g. PUT "ON" or "OFF" to /appliances/light.json).
 */
export async function pushApplianceStateToFirebase(
  deviceId: string,
  active: boolean
): Promise<boolean> {
  if (!isFirebaseAppliance(deviceId)) {
    return false;
  }

  const payload = active ? "ON" : "OFF";

  try {
    const response = await fetch(`${FIREBASE_RTDB_BASE_URL}/appliances/${deviceId}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Firebase RTDB PUT returned ${response.status}`);
    }

    const saved = await response.json();
    console.log(`[FirebaseSync] Synced ${deviceId} -> ${saved} in Firebase RTDB`);
    return true;
  } catch (error) {
    console.warn(`[FirebaseSync] Failed to push ${deviceId} state to Firebase:`, error);
    return false;
  }
}

/**
 * Polling controller for background synchronization with Firebase RTDB.
 */
let syncIntervalTimer: ReturnType<typeof setInterval> | null = null;
let isSyncing = false;

export async function syncOnce(): Promise<void> {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const appliances = await fetchAppliancesFromFirebase();
    if (appliances && typeof appliances === "object") {
      useAppStore.getState().syncFromFirebaseAppliances(appliances);
    } else {
      useAppStore.getState().setFirebaseSyncStatus("error");
    }
  } catch {
    useAppStore.getState().setFirebaseSyncStatus("error");
  } finally {
    isSyncing = false;
  }
}

export function startFirebaseSync(intervalMs = 2000): void {
  if (syncIntervalTimer) {
    return;
  }

  // Trigger immediate sync on start
  void syncOnce();

  syncIntervalTimer = setInterval(() => {
    void syncOnce();
  }, intervalMs);
}

export function stopFirebaseSync(): void {
  if (syncIntervalTimer) {
    clearInterval(syncIntervalTimer);
    syncIntervalTimer = null;
  }
}

/**
 * React hook to automatically sync with Firebase Realtime Database across the lifecycle.
 */
export function useFirebaseSync(): {
  syncNow: () => Promise<void>;
} {
  useEffect(() => {
    startFirebaseSync(2000);

    return () => {
      stopFirebaseSync();
    };
  }, []);

  return {
    syncNow: syncOnce,
  };
}

