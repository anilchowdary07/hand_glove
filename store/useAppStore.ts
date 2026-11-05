import { create, type StateCreator } from "zustand";
import type { ThemeMode } from "../lib/theme";
import { pushApplianceStateToFirebase } from "../lib/firebaseSync";

export type FirebaseSyncStatus = "idle" | "connected" | "syncing" | "error";

export type FabricationStatus = 
  | "Pending Scan"
  | "Scan Uploaded"
  | "Processing"
  | "Fabricating"
  | "Shipped"
  | "Delivered"
  | "Connected";

export type GloveConnectionState = "Disconnected" | "Searching" | "Pairing" | "Connected" | "Failed";

export type AppPhase = "PRE_PURCHASE" | "PRE_ACTIVATION" | "ACTIVE_DEVICE";

export type PatientDetails = {
  fullName: string;
  age: string;
  height: string;
  weight: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  voicePreference: "Arthur" | "Emma" | "None";
};

export type Gesture = {
  id: string;
  name: string;
  samples: number; // Repeat gesture count
  isTrained: boolean;
  confidence: number;
};

export type SmartDevice = {
  id: string;
  name: string;
  type: string;
  status: string;
  active: boolean;
  intensity: number;
};

export type ActionMapping = {
  gestureId: string;
  deviceId: string;
  actionName: string;
};

export type SosEvent = {
  id: string;
  time: string;
  location: string;
  resolved: boolean;
};

type AppStore = {
  // Appearance & Accessibility
  themeMode: ThemeMode;
  highContrast: boolean;
  reducedMotion: boolean;
  voiceInstructions: boolean;
  hapticsEnabled: boolean;

  // Onboarding & Core Database State Model
  patient_id: string;
  authenticated: boolean;
  role: "patient" | "admin";
  intro_completed: boolean;
  app_phase: AppPhase;
  onboarding_completed: boolean;
  scan_completed: boolean;
  fabrication_status: FabricationStatus;
  glove_delivered: boolean;
  glove_connected: boolean;
  gesture_training_completed: boolean;

  // Selected parameters
  medical_condition: string;
  glove_hand: "left" | "right" | "";
  patient_details: PatientDetails | null;

  // Scan progress
  scan_captures: Record<string, string>; // stepId -> imageUri
  current_job_id: string;

  // Device & Gesture Management
  gestures: Gesture[];
  devices: SmartDevice[];
  mappings: ActionMapping[];
  sos_events: SosEvent[];

  // Glove connection
  glove_connection_state: GloveConnectionState;
  glove_battery: number;
  glove_signal: string;

  // Firebase Realtime Database Sync
  firebase_sync_status: FirebaseSyncStatus;
  last_firebase_sync: string | null;
  setFirebaseSyncStatus: (status: FirebaseSyncStatus) => void;
  syncFromFirebaseAppliances: (appliances: Record<string, string>) => void;
  setDevicePower: (deviceId: string, active: boolean) => void;

  // Setters & Actions
  setThemeMode: (mode: ThemeMode) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleVoiceInstructions: () => void;
  toggleHaptics: () => void;

  setAuthenticated: (value: boolean) => void;
  setRole: (role: "patient" | "admin") => void;
  setIntroCompleted: (value: boolean) => void;
  setAppPhase: (phase: AppPhase) => void;
  setOnboardingCompleted: (value: boolean) => void;
  setScanCompleted: (value: boolean) => void;
  setFabricationStatus: (status: FabricationStatus) => void;
  setGloveDelivered: (value: boolean) => void;
  setGloveConnected: (value: boolean) => void;
  setGestureTrainingCompleted: (value: boolean) => void;

  setMedicalCondition: (condition: string) => void;
  setGloveHand: (hand: "left" | "right" | "") => void;
  setPatientDetails: (details: PatientDetails) => void;
  captureScanStep: (stepId: string, uri: string) => void;
  resetScanCaptures: () => void;
  setCurrentJobId: (jobId: string) => void;

  setGloveConnectionState: (state: GloveConnectionState) => void;
  addTrainedGesture: (gesture: Gesture) => void;
  addMapping: (mapping: ActionMapping) => void;
  removeMapping: (gestureId: string, deviceId: string) => void;
  toggleDevicePower: (deviceId: string) => void;
  setDeviceIntensity: (deviceId: string, val: number) => void;
  addSosEvent: (event: SosEvent) => void;
  resetOnboarding: () => void;
};

const defaultGestures: Gesture[] = [
  { id: "pinch", name: "Pinch", samples: 3, isTrained: true, confidence: 96 },
  { id: "double-pinch", name: "Double pinch", samples: 3, isTrained: true, confidence: 92 },
  { id: "wrist-rotate", name: "Wrist rotate", samples: 3, isTrained: true, confidence: 89 }
];

const defaultDevices: SmartDevice[] = [
  { id: "light", name: "Living room lights", type: "Smart light", status: "Idle", active: false, intensity: 60 },
  { id: "fan", name: "Bedroom fan", type: "Smart fan", status: "Idle", active: false, intensity: 35 },
  { id: "tv", name: "Living room TV", type: "Television", status: "Idle", active: false, intensity: 0 },
  { id: "ac", name: "Air Conditioner", type: "Air Conditioner", status: "Idle", active: false, intensity: 22 },
  { id: "speaker", name: "Voice speaker", type: "Bluetooth speaker", status: "Offline", active: false, intensity: 0 }
];

const defaultMappings: ActionMapping[] = [
  { gestureId: "pinch", deviceId: "light", actionName: "Toggle Power" },
  { gestureId: "wrist-rotate", deviceId: "fan", actionName: "Speed Up" }
];

const createAppStore: StateCreator<AppStore> = (set) => ({
  // Appearance & Accessibility
  themeMode: "light",
  highContrast: false,
  reducedMotion: false,
  voiceInstructions: true,
  hapticsEnabled: true,

  // Onboarding & Core Database State Model
  patient_id: "",
  authenticated: false,
  role: "patient",
  intro_completed: false,
  app_phase: "PRE_PURCHASE",
  onboarding_completed: false,
  scan_completed: false,
  fabrication_status: "Pending Scan",
  glove_delivered: false,
  glove_connected: false,
  gesture_training_completed: false,

  // Selected parameters
  medical_condition: "",
  glove_hand: "",
  patient_details: null,

  // Scan progress
  scan_captures: {},
  current_job_id: "",

  // Device & Gesture Management
  gestures: defaultGestures,
  devices: defaultDevices,
  mappings: defaultMappings,
  sos_events: [],

  // Glove connection
  glove_connection_state: "Disconnected",
  glove_battery: 82,
  glove_signal: "Strong",

  // Firebase Realtime Database Sync
  firebase_sync_status: "idle",
  last_firebase_sync: null,

  // Setters & Actions
  setThemeMode: (mode) => set({ themeMode: mode }),
  toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
  toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
  toggleVoiceInstructions: () => set((state) => ({ voiceInstructions: !state.voiceInstructions })),
  toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),

  setAuthenticated: (value) => set({ authenticated: value }),
  setRole: (role) => set({ role }),
  setIntroCompleted: (value) => set({ intro_completed: value }),
  setAppPhase: (phase) => set({ app_phase: phase }),
  setOnboardingCompleted: (value) => set({ onboarding_completed: value }),
  setScanCompleted: (value) =>
    set((state) => ({
      scan_completed: value,
      app_phase: value || state.fabrication_status !== "Pending Scan" ? "PRE_ACTIVATION" : "PRE_PURCHASE"
    })),
  setFabricationStatus: (fabrication_status) =>
    set((state) => {
      const glove_delivered = fabrication_status === "Delivered" || fabrication_status === "Connected";
      const glove_connected = fabrication_status === "Connected";
      const app_phase = glove_connected
        ? "ACTIVE_DEVICE"
        : state.scan_completed || fabrication_status !== "Pending Scan"
          ? "PRE_ACTIVATION"
          : "PRE_PURCHASE";
      return {
        fabrication_status,
        glove_delivered,
        glove_connected,
        app_phase
      };
    }),
  setGloveDelivered: (value) =>
    set((state) => ({
      glove_delivered: value,
      app_phase: value || state.scan_completed ? "PRE_ACTIVATION" : state.app_phase
    })),
  setGloveConnected: (value) =>
    set((state) => ({
      glove_connected: value,
      app_phase: value ? "ACTIVE_DEVICE" : state.app_phase
    })),
  setGestureTrainingCompleted: (value) => set({ gesture_training_completed: value }),

  setMedicalCondition: (condition) => set({ medical_condition: condition }),
  setGloveHand: (hand) => set({ glove_hand: hand }),
  setPatientDetails: (details) => set({ patient_details: details }),
  captureScanStep: (stepId, uri) =>
    set((state) => ({
      scan_captures: { ...state.scan_captures, [stepId]: uri },
    })),
  resetScanCaptures: () => set({ scan_captures: {}, current_job_id: "" }),
  setCurrentJobId: (jobId) => set({ current_job_id: jobId }),

  setGloveConnectionState: (state) => set({ glove_connection_state: state }),
  addTrainedGesture: (gesture) => 
    set((state) => ({ 
      gestures: [...state.gestures.filter(g => g.id !== gesture.id), gesture] 
    })),
  addMapping: (mapping) => 
    set((state) => ({ 
      mappings: [...state.mappings.filter(m => !(m.gestureId === mapping.gestureId && m.deviceId === mapping.deviceId)), mapping] 
    })),
  removeMapping: (gestureId, deviceId) => 
    set((state) => ({ 
      mappings: state.mappings.filter(m => !(m.gestureId === gestureId && m.deviceId === deviceId)) 
    })),
  setFirebaseSyncStatus: (status) => set({ firebase_sync_status: status }),
  syncFromFirebaseAppliances: (appliances) =>
    set((state) => {
      let hasChanges = false;
      const updatedDevices = state.devices.map((d) => {
        const remoteVal = appliances[d.id];
        if (remoteVal !== undefined) {
          const remoteActive = remoteVal.trim().toUpperCase() === "ON";
          if (d.active !== remoteActive) {
            hasChanges = true;
            return {
              ...d,
              active: remoteActive,
              status: remoteActive ? "Connected" : "Idle",
            };
          }
        }
        return d;
      });

      return {
        ...(hasChanges ? { devices: updatedDevices } : {}),
        firebase_sync_status: "connected",
        last_firebase_sync: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      };
    }),
  toggleDevicePower: (deviceId) => {
    let nextActive = false;
    set((state) => {
      const target = state.devices.find((d) => d.id === deviceId);
      nextActive = target ? !target.active : false;
      return {
        devices: state.devices.map((d) =>
          d.id === deviceId
            ? { ...d, active: nextActive, status: nextActive ? "Connected" : "Idle" }
            : d
        ),
      };
    });
    void pushApplianceStateToFirebase(deviceId, nextActive);
  },
  setDevicePower: (deviceId, active) => {
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === deviceId
          ? { ...d, active, status: active ? "Connected" : "Idle" }
          : d
      ),
    }));
    void pushApplianceStateToFirebase(deviceId, active);
  },
  setDeviceIntensity: (deviceId, val) =>
    set((state) => ({
      devices: state.devices.map(d => d.id === deviceId ? { ...d, intensity: val } : d)
    })),
  addSosEvent: (event) => set((state) => ({ sos_events: [event, ...state.sos_events] })),
  resetOnboarding: () => set({
    patient_id: "",
    onboarding_completed: false,
    scan_completed: false,
    fabrication_status: "Pending Scan",
    glove_delivered: false,
    glove_connected: false,
    gesture_training_completed: false,
    app_phase: "PRE_PURCHASE",
    medical_condition: "",
    glove_hand: "",
    patient_details: null,
    scan_captures: {},
    current_job_id: "",
    glove_connection_state: "Disconnected",
  })
});

export const useAppStore = create<AppStore>()(createAppStore);