# Assistive Smart Grip & Smart Glove Platform

<div align="center">

[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Rust](https://img.shields.io/badge/Rust-1.78+-DEA584?style=for-the-badge&logo=rust&logoColor=black)](https://www.rust-lang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-0.10-FF6F00?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.3-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org/)

**An end-to-end medical IoT and computer vision ecosystem that democratizes the creation of custom-fitted assistive rehabilitation smart gloves via standard smartphone photogrammetry, volumetric space carving, real-time biometrics, and universal IoT gesture control.**

</div>

---

## ⚡ How to Run the Application (macOS Quick Start)

Run each component in a **separate terminal tab** from the project root (`/Users/anilchowdary/Documents/smart_glove`):

### 0️⃣ Step 0: Find Your Local Wi-Fi IP & Configure `.env`
Your phone running Expo Go communicates with your Mac backend over your local Wi-Fi. Find your Mac's IP address:
```bash
ipconfig getifaddr en0
```
Then update your `.env` file with that IP (or run this command directly):
```bash
echo "EXPO_PUBLIC_API_URL=http://$(ipconfig getifaddr en0):3000" > .env
echo "EXPO_PUBLIC_FIREBASE_RTDB_URL=https://smartgrip-e5e0a-default-rtdb.firebaseio.com" >> .env
```

---

### 1️⃣ Terminal 1: PostgreSQL Database (Port 5433)
```bash
# Start PostgreSQL:
/Library/PostgreSQL/17/bin/pg_ctl -D /Users/anilchowdary/pg_smartgrip -o "-p 5433" -l /Users/anilchowdary/pg_smartgrip/server.log start

# Check status:
/Library/PostgreSQL/17/bin/pg_ctl -D /Users/anilchowdary/pg_smartgrip status

# Stop PostgreSQL:
/Library/PostgreSQL/17/bin/pg_ctl -D /Users/anilchowdary/pg_smartgrip stop
```

---

### 2️⃣ Terminal 2: Rust Backend (Port 3000)
```bash
cd backend
DATABASE_URL="postgres://postgres@localhost:5433/smartgrip" CV_SERVICE_URL="http://localhost:8001" cargo run
```

---

### 3️⃣ Terminal 3: Computer Vision Microservice (Port 8001)
```bash
cd cv_service
DATABASE_URL="postgresql+asyncpg://postgres@localhost:5433/smartgrip" ./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

---

### 4️⃣ Terminal 4: Expo Mobile Frontend (Port 8081)
```bash
npx expo start --clear
```
- Open **Expo Go** on your phone (ensure your phone is connected to the same Wi-Fi).
- Scan the displayed QR code or enter: `exp://<YOUR_IP>:8081` (where `<YOUR_IP>` is what `ipconfig getifaddr en0` printed).

---

### 🔍 Verification & Health Checks
```bash
# Verify Rust Backend:
curl http://localhost:3000/health

# Verify CV Microservice:
curl http://localhost:8001/health

# Verify all listening ports (3000, 5433, 8001, 8081):
lsof -i :3000,5433,8001,8081
```

---

## 📑 Table of Contents

- [How to Run the Application](#-how-to-run-the-application-macos-quick-start)
- [Overview & Clinical Motivation](#-overview--clinical-motivation)
- [System Architecture](#-system-architecture)
- [End-to-End System Workflow](#-end-to-end-system-workflow)
- [Core Subsystems & Features](#-core-subsystems--features)
  - [1. Mobile Application (React Native / Expo)](#1-mobile-application-react-native--expo)
  - [2. Computer Vision Microservice (Python / FastAPI)](#2-computer-vision-microservice-python--fastapi)
  - [3. Orchestration Backend (Rust / Axum)](#3-orchestration-backend-rust--axum)
  - [4. 3D Volumetric Reconstruction Engine (Rayon / Marching Cubes)](#4-3d-volumetric-reconstruction-engine)
  - [5. Smart Glove Hardware & Smart Home IoT Telemetry](#5-smart-glove-hardware--smart-home-iot-telemetry)
  - [6. Clinical Administration Command Center](#6-clinical-administration-command-center)
- [The 8-Posture Scanning Protocol](#-the-8-posture-scanning-protocol)
- [Database Schema & Architecture](#-database-schema--architecture)
- [REST API Reference](#-rest-api-reference)
- [Repository Structure](#-repository-structure)
- [Installation & Quick Start](#-installation--quick-start)
  - [Prerequisites](#prerequisites)
  - [Method 1: Docker Compose (All-in-One Backend)](#method-1-docker-compose-all-in-one-backend)
  - [Method 2: Bare Metal Local Development](#method-2-bare-metal-local-development)
  - [Starting the Mobile Application](#starting-the-mobile-application)
- [Configuration & Environment Variables](#-configuration--environment-variables)
- [License & Attribution](#-license--attribution)

---

## 🔬 Overview & Clinical Motivation

Patients recovering from **strokes, living with Parkinson's disease, severe arthritis, or neuromuscular impairments** require assistive gloves tailored to their hand geometry. Traditionally, creating custom orthotics and assistive hardware requires:
- Painful plaster casting or alginate molding.
- In-person clinic visits with specialized practitioners.
- Industrial structured-light laser scanning chambers costing tens of thousands of dollars.

**Smart Grip** eliminates clinical bottlenecks by turning everyday smartphone cameras into medical measurement tools. Through guided computer vision and automated digital fabrication:
1. Patients capture **8 multi-angle guided frames** from home.
2. The AI pipeline analyzes hand anatomy down to **$\pm 1.5\text{ mm}$ millimeter precision**.
3. A native Rust engine generates a **water-tight 3D mesh (`.obj`) ready for additive manufacturing (3D printing)**.
4. An integrated fabrication lifecycle tracks custom fabrication, assembly, and delivery.
5. The delivered glove connects via **Bluetooth Low Energy (BLE)** to assist mobility, recognize user intent, control smart home devices, and trigger emergency SOS assistance.

---

## 🏛 System Architecture

The ecosystem consists of three decoupled, high-performance tiers communicating over asynchronous HTTP APIs and shared persistent storage:

```mermaid
flowchart TD
    subgraph Client["📱 Mobile Client (Expo / React Native)"]
        Scanner["Guided 8-Posture Camera (expo-camera)"]
        Onboarding["Neurological Profiling & Intake"]
        Orders["Order Custom Glove & Checkout"]
        Dashboard["Telemetry HUD & Bluetooth Driver"]
        IoT["Smart Home Controller & Gesture Mapper"]
        Admin["Clinical Admin Portal"]
        Zustand[("Zustand Global State Store")]
    end

    subgraph RustBackend["🦀 Rust Orchestration Backend (:3000)"]
        AxumRouter["Axum HTTP Router & CORS Layer"]
        UploadHandler["Multipart Frame Ingestion (8 Views)"]
        JobOrchestrator["Async Job Spawner (tokio::spawn)"]
        VoxelEngine["3.75M Voxel Space-Carver (Rayon)"]
        MarchingCubes["Marching Cubes Surface Extractor"]
        SQLx["SQLx Async Connection Pool"]
    end

    subgraph CVMicroservice["🐍 Python Computer Vision Service (:8001)"]
        FastAPIApp["FastAPI Microservice"]
        QualityGate["Laplacian Quality Scorer (Blur & Lighting)"]
        MediaPipe["MediaPipe 3D Landmark Extractor (21 Keypoints)"]
        MiDaS["MiDaS Monocular Metric Depth Estimator"]
        FusionEngine["Multi-View Confidence Fusion (Winsorized)"]
        XGBoost["XGBoost Machine Learning Calibrator"]
        SizingEngine["Glove Sizing & Pneumatic Actuator Mapper"]
    end

    subgraph Storage["💾 Persistence Layer"]
        Postgres[(PostgreSQL 16 Database)]
        LocalStorage[("Storage Volume (/storage/{job_id}/)")]
    end

    Scanner -->|"1. Upload 8 Scans"| UploadHandler
    UploadHandler -->|"Save JPGs"| LocalStorage
    UploadHandler -->|"Insert Job (Pending)"| SQLx
    UploadHandler -->|"2. Fire-and-Forget /analyze"| FastAPIApp

    FastAPIApp -->|"Read Scans"| LocalStorage
    FastAPIApp --> QualityGate --> MediaPipe --> MiDaS --> FusionEngine --> XGBoost --> SizingEngine
    FastAPIApp -->|"3. Ingest Results /cv_result"| AxumRouter
    
    AxumRouter -->|"Persist Final Metrics"| SQLx
    VoxelEngine --> MarchingCubes -->|"Export hand_model.obj"| LocalStorage

    SQLx <--> Postgres
    Dashboard & Orders & Admin -->|"Poll Status & Manage Logistics"| AxumRouter
    IoT <-->|"BLE Telemetry & SOS"| Dashboard
```

---

## 🔄 End-to-End System Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant App as Mobile App (Expo)
    participant Backend as Rust Backend (:3000)
    participant CV as CV Service (:8001)
    participant DB as PostgreSQL 16
    actor Clinician as Clinical Team

    Patient->>App: Completes Onboarding (Condition, Target Hand, Demographics)
    Patient->>App: Executes 8-angle Guided Scan with real-time silhouette guides
    App->>Backend: POST /api/v1/tailor/upload (Multipart 8 frames + patient_id)
    Backend->>DB: INSERT INTO hand_scans (status: 'pending')
    Backend-->>App: Return 200 OK with job_id
    
    Backend-)CV: Async POST /analyze { job_id, patient_id }
    Note over Backend,CV: Non-blocking parallel background analysis
    
    activate CV
    CV->>CV: Frame Quality Validation (Blur, Lighting, Skin-pixel ratio)
    CV->>CV: MediaPipe 3D Keypoint Extraction (21 joints per frame)
    CV->>CV: MiDaS Depth Mapping with Adult Anthropometric Priors
    CV->>CV: Multi-View Semantic Weighting & Outlier Winsorization
    CV->>CV: XGBoost Regression for Optical Distortion Correction
    CV->>CV: Sizing Engine (XS-XXL, Actuator & Flex Sensor Anchors)
    CV->>Backend: POST /api/v1/tailor/cv_result { job_id, measurements }
    deactivate CV
    
    Backend->>DB: UPDATE hand_scans (status: 'done')
    Backend->>DB: INSERT INTO measurements & glove_profiles
    
    loop Every 3 seconds
        App->>Backend: GET /api/v1/tailor/status/{job_id}
        Backend-->>App: { status: "done" }
    end

    App->>Backend: GET /api/v1/tailor/results/{job_id}
    Backend-->>App: Millimeter Dimensions & Calibration Coordinates
    Patient->>App: Reviews & Confirms Dimensions (Manual override enabled)
    Patient->>App: Places Custom Glove Order (Checkout & Address)
    
    Note over Clinician,Backend: Fabrication & Manufacturing Phase
    Clinician->>Backend: Advances Status: Fabricating → Shipped → Delivered
    App->>Backend: Real-time logistics tracking updates automatically
    
    Patient->>App: Glove Arrives → Connects via Bluetooth Low Energy
    App->>App: Streams live battery, intent classification & IoT triggers
```

---

## 🧩 Core Subsystems & Features

### 1. Mobile Application (React Native / Expo)

- **Framework**: React Native 0.81.5 with Expo SDK 54 and Expo Router v6 (typed, file-based routing).
- **Styling**: NativeWind (Tailwind CSS for React Native) supporting dynamic light/dark/high-contrast theming.
- **State Management**: Zustand global store with reactive slices (`useAppStore.ts`).
- **Screen Architecture**:
  - `app/onboarding/`: Patient diagnosis selection (Stroke, Arthritis, Neuropathy), hand selection, physical biometrics, and voice assistant preferences (Arthur, Emma).
  - `app/scans/`: Camera view with visual silhouette guide cards (`camera.tsx`), validation, multipart upload (`upload.tsx`), animated status radar (`processing.tsx`), and review screen.
  - `app/orders/`: Full ordering and fulfillment workflow:
    - `summary.tsx`: Review glove specifications, custom dimensions, and costs.
    - `config.tsx`: Custom haptic and assistive intensity profiles.
    - `payment.tsx`: Secure checkout and billing.
    - `tracking.tsx`: Real-time tracking and delivery updates.
  - `app/(tabs)/`: Main navigation suite:
    - `home.tsx`: Active smart glove dashboard (battery percentage, BLE RSSI, active gesture feed).
    - `devices.tsx`: Smart Home IoT control grid.
    - `gestures.tsx`: AI gesture training and library with confidence ratings.
    - `notifications.tsx`: Clinical alerts and delivery updates.
    - `sos.tsx`: Emergency broadcast interface.
    - `profile.tsx`: Patient medical records and accessibility toggles.
  - `app/admin/dashboard.tsx`: Clinical administration command center.

### 2. Computer Vision Microservice (Python / FastAPI)

- **Quality Scorer (`quality_scorer.py`)**: Computes Laplacian variance for motion blur, evaluates pixel histograms for exposure, and checks skin coverage ($> 4\%$).
- **Optical Estimator (`depth_estimator.py`)**: Extracts EXIF focal lengths or applies a $70^\circ$ horizontal FOV pinhole approximation:
  $$f_{px} = \frac{W}{2 \cdot \tan(35^\circ)}$$
- **Landmark Extractor (`landmark_extractor.py`)**: Executes MediaPipe Hands to capture 21 3D spatial landmarks across wrist, MCP, PIP, DIP, and fingertip joints.
- **Metric Depth Estimation (`depth_estimator.py`)**: Runs the `MiDaS_small` deep neural network to infer relative depth maps, converted to metric scale via adult palm priors ($80\text{ mm}$ mean width):
  $$Z_{\text{metric}}(x, y) = \frac{W_{\text{prior}} \cdot f_{px}}{\text{palm\_width}_{px}}$$
- **Metric Calculator (`metric_calculator.py`)**: Computes euclidean distance in physical millimeters for palm width, height, and all 5 finger lengths:
  $$D_{\text{mm}} = \frac{\Delta_{px} \cdot Z_{\text{midpoint}} \cdot 1000}{f_{px}}$$
- **Multi-View Fusion Engine (`fusion_engine.py`)**: Applies semantic weighting per posture, rejects statistical outliers using $1.5 \times \text{IQR}$ Winsorization, and computes confidence-weighted means.
- **AI Calibrator (`ai_calibrator.py`)**: 7 independent **XGBoost regression models** calibrated against anthropometric datasets to eliminate optical distortion.
- **Glove Sizing Engine (`glove_sizing.py`)**: Maps palm circumference into standardized medical glove sizes (XS to XXL) and calculates $(u, v)$ coordinates for pneumatic actuators and flex sensors.

### 3. Orchestration Backend (Rust / Axum)

- Built with **Axum**, **Tokio**, and **SQLx** for high-throughput, low-latency API handling.
- Permissive CORS and 100 MB multipart body limits for 8-frame simultaneous uploads.
- Non-blocking asynchronous task execution via `tokio::spawn` to orchestrate background CV analysis.
- Automated PostgreSQL database schema initialization on startup.

### 4. 3D Volumetric Reconstruction Engine

Located in `backend/src/reconstruct/`, this native Rust module compiles a 3D-printable solid model:

```mermaid
flowchart LR
    A["8 RGB Frames"] --> B["Otsu Threshold & Morphology"]
    B --> C["8 Binary Silhouettes"]
    C --> D["3,750,000 Voxel Grid"]
    D --> E["Rayon Parallel Space Carving"]
    E --> F["Marching Cubes Algorithm"]
    F --> G["Laplacian Smoothing (10 Passes)"]
    G --> H["Wrist Cut & Normal Inflation"]
    H --> I["Export: hand_model.obj"]
```

- **Voxel Grid**: $150\text{ mm} \times 250\text{ mm} \times 100\text{ mm}$ centered at $[-75.0, -125.0, -50.0]\text{ mm}$ with $1\text{ mm}^3$ isotropic resolution ($3.75\text{M}$ voxels).
- **Space Carving**: Evaluates camera projection matrices $P_i = K \cdot [R_i \mid t_i]$ for each voxel; carves voxels that project to background silhouette regions.
- **Surface Extraction**: Marching Cubes edge table classification into an indexed triangle mesh.
- **Post-Processing**:
  - 10 iterations of Laplacian smoothing ($\lambda = 0.5$).
  - Wrist truncation at $Z = -120\text{ mm}$ for glove insertion aperture.
  - $1.5\text{ mm}$ outward normal inflation to guarantee fabric tolerance and wearer comfort.

### 5. Smart Glove Hardware & Smart Home IoT Telemetry

- **Bluetooth Pairing**: State machine (`Disconnected` $\to$ `Searching` $\to$ `Pairing` $\to$ `Connected`).
- **Telemetry HUD**: Displays real-time battery percentage, BLE signal strength (RSSI), and active gestures.
- **Smart Home Integration**: Maps physical hand gestures to IoT actions:
  - `Smart Light`: Toggle power, adjust brightness.
  - `Smart Fan`: Toggle power, adjust speed.
  - `Smart TV`: Power, volume, and input control.
  - `Bluetooth Speaker`: Audio playback toggle.
- **Emergency SOS Command**: One-touch or gesture-activated emergency trigger capturing instant GPS coordinates, dispatching alerts to emergency contacts, and notifying clinical monitors.

### 6. Clinical Administration Command Center

Accessed via `app/admin/dashboard.tsx`:
- **Registry**: Comprehensive list of registered patients, diagnoses, and affected hand sides.
- **Logistics**: 7-stage manufacturing status advancement stepper:
  $$\text{Pending Scan} \to \text{Scan Uploaded} \to \text{Processing} \to \text{Fabricating} \to \text{Shipped} \to \text{Delivered} \to \text{Connected}$$
- **Clinical**: Exact millimeter dimensional breakdown for medical record review.
- **AI Hub**: Real-time CV metrics, frame rejection logs, and depth confidence ratings.
- **SOS Command**: Live emergency response log with resolution controls.

---

## 📷 The 8-Posture Scanning Protocol

| # | View Key | Title | User Posture | Derived Measurement Targets |
|:---:|:---|:---|:---|:---|
| **1** | `wrist` | Wrist Profile | Arm extended forward, palm down, wrist aligned horizontally. | Wrist joint width, forearm entrance clearance |
| **2** | `palm-front` | Open Palm | Open palm facing camera, fingers together and straight. | Palm width, index/middle/ring/pinky lengths |
| **3** | `palm-side` | Side Profile | Hand rotated $90^\circ$, thumb facing up, fingers forward. | Palm thickness, finger AP diameter, girth |
| **4** | `fingers` | Extended Spread | All five fingers spread wide, hand flat and centered. | Interdigital web spacing, finger span |
| **5** | `fist` | Closed Fist | Soft fist, thumb outside fingers, knuckles toward camera. | Knuckle circumference (flexion clearance) |
| **6** | `wrist-rotation` | Tendon Rotation | Wrist rotated $45^\circ$ inward exposing flexor tendons. | Tendon line pathing, sensor anchor sites |
| **7** | `thumb` | Thumb Profile | Four fingers curled in, thumb extended straight upward. | Thumb length, CMC-MCP joint articulation |
| **8** | `back-hand` | Back of Hand | Hand flipped over, knuckles up, palm facing down. | Dorsal skin length, extensor tendon tracking |

---

## 🗄 Database Schema & Architecture

The PostgreSQL database (`smartgrip`) is automatically provisioned with the following schema:

```mermaid
erDiagram
    hand_scans ||--o{ image_metadata : "evaluates"
    hand_scans ||--o| measurements : "produces"
    hand_scans ||--o| glove_profiles : "configures"
    hand_scans ||--o{ calibration_history : "logs"

    hand_scans {
        uuid job_id PK
        uuid patient_id
        varchar status "pending | processing | done | failed"
        text error_message
        int view_count
        timestamptz created_at
        timestamptz completed_at
    }

    image_metadata {
        uuid id PK
        uuid job_id FK
        int frame_index
        varchar view_type
        float blur_score
        float lighting_score
        float hand_visibility
        float landmark_confidence
        boolean accepted
    }

    measurements {
        uuid id PK
        uuid job_id FK
        uuid patient_id
        float palm_width_mm
        float palm_length_mm
        float thumb_length_mm
        float index_length_mm
        float middle_length_mm
        float ring_length_mm
        float pinky_length_mm
        float thumb_girth_mm
        float index_girth_mm
        float middle_girth_mm
        float ring_girth_mm
        float pinky_girth_mm
        float confidence_score
        jsonb raw_measurements
        timestamptz created_at
    }

    glove_profiles {
        uuid id PK
        uuid patient_id
        uuid job_id FK
        varchar glove_size "XS | S | M | L | XL | XXL"
        jsonb actuator_positions
        jsonb sensor_positions
        jsonb calibration_data
        timestamptz created_at
    }

    calibration_history {
        uuid id PK
        uuid patient_id
        uuid job_id FK
        jsonb ground_truth_mm
        jsonb estimated_mm
        jsonb capture_metadata
        timestamptz created_at
    }
```

---

## 🔌 REST API Reference

### Rust Backend Service (`http://localhost:3000`)

| Method | Endpoint | Description | Request Payload | Response |
|:---|:---|:---|:---|:---|
| `GET` | `/health` | Service health status | None | `{"status": "ok", "service": "..."}` |
| `POST` | `/api/v1/tailor/upload` | Ingests 8 scan frames & initiates CV job | `multipart/form-data` (`frame_1`..`frame_8`, `patient_id`) | `{"status": "uploaded", "job_id": "...", "saved_frames": 8}` |
| `GET` | `/api/v1/tailor/status/:job_id` | Polls scan processing status | None | `{"job_id": "...", "status": "processing\|done\|failed"}` |
| `GET` | `/api/v1/tailor/results/:job_id` | Fetches final millimeter measurements | None | `200 OK` (JSON metrics) or `202 Accepted` (if processing) |
| `POST` | `/api/v1/tailor/cv_result` | Internal callback endpoint called by CV service | `application/json` (Measurement payload) | `{"status": "persisted"}` |
| `POST` | `/api/v1/tailor/dimensions` | Confirms final hand dimensions | `application/json` (`TelemetryPayload`) | `PatientHandProfile` record |
| `GET` | `/api/v1/patients` | Lists all patients and manufacturing states | None | `Array<PatientHandProfile>` |
| `PUT` | `/api/v1/patient/:id/status` | Updates fabrication status | `{"fabrication_status": "Fabricating"}` | Updated `PatientHandProfile` |

### Computer Vision Service (`http://localhost:8001`)

| Method | Endpoint | Description | Request Payload | Response |
|:---|:---|:---|:---|:---|
| `GET` | `/health` | Microservice & neural model status | None | `{"status": "ok", "models_loaded": true}` |
| `POST` | `/analyze` | Triggers landmark, depth & sizing pipeline | `{"job_id": "...", "patient_id": "..."}` | `{"status": "accepted", "job_id": "..."}` |
| `GET` | `/status/:job_id` | Checks CV-level job status | None | `{"job_id": "...", "status": "..."}` |
| `GET` | `/results/:job_id` | Fetches raw CV measurements | None | Measurement object |
| `POST` | `/calibrate` | Ingests ground-truth data for model retraining | `GroundTruthSample` | `{"status": "recorded"}` |

---

## 📂 Repository Structure

```text
smart_glove/
├── app/                        # Expo Router mobile application
│   ├── (tabs)/                 # Tab routes (home, devices, gestures, notifications, profile, sos)
│   ├── admin/                  # Clinical admin dashboard
│   ├── device/                 # IoT device pairing screens
│   ├── devices/                # IoT device controls and gesture mapping
│   ├── emergency/              # Standalone emergency SOS screens
│   ├── gestures/               # Gesture training, recording, and library
│   ├── glove/                  # Smart glove Bluetooth connection flow
│   ├── home/                   # Home dashboard components
│   ├── onboarding/             # Condition, hand, and patient intake flow
│   ├── orders/                 # Custom glove config, checkout, payment, tracking
│   ├── profile/                # Patient profile and settings
│   ├── scans/                  # Guided 8-angle camera scanning & review flow
│   ├── _layout.tsx             # Root layout with providers & fonts
│   └── index.tsx               # Application entry dispatcher
├── backend/                    # Rust orchestration backend (Axum + SQLx)
│   ├── src/
│   │   ├── reconstruct/        # Native 3D volumetric space-carver & Marching Cubes
│   │   ├── db.rs               # Database schema initialization & queries
│   │   └── main.rs             # HTTP routes, multipart ingestion & async tasks
│   ├── Cargo.toml              # Rust crate dependencies
│   └── Dockerfile              # Multi-stage production Rust build
├── cv_service/                 # Python Computer Vision microservice
│   ├── pipeline/
│   │   ├── ai_calibrator.py    # XGBoost regression calibration
│   │   ├── depth_estimator.py  # MiDaS monocular depth & metric scaling
│   │   ├── fusion_engine.py    # Multi-view confidence-weighted fusion
│   │   ├── glove_sizing.py     # XS-XXL sizing & actuator positioning
│   │   ├── landmark_extractor.py # MediaPipe 21 3D hand keypoints
│   │   ├── metric_calculator.py  # Pinhole metric conversion in mm
│   │   └── quality_scorer.py   # Laplacian blur & exposure gates
│   ├── schemas/                # Pydantic request & response schemas
│   ├── Dockerfile              # Python container with pre-baked MiDaS weights
│   ├── main.py                 # FastAPI microservice entry point
│   └── requirements.txt        # Python dependencies
├── components/                 # Reusable UI component library (GlassCard, Buttons, etc.)
├── lib/                        # Utilities (theme, API resolution, queryClient)
├── store/                      # Zustand global state store (useAppStore.ts)
├── Stitch_UI/                  # UI mockups, HTML templates, and design specs
├── COMMANDS.md                 # Quick reference command guide
├── docker-compose.yml          # Multi-service container orchestration
├── package.json                # Frontend dependencies and npm scripts
└── README.md                   # Project documentation
```

---

## 🚀 Installation & Quick Start

### Prerequisites
- **Node.js** (v18.0.0 or higher) and **npm**
- **Docker** and **Docker Compose** *(recommended for easiest setup)*
- *For manual local development*:
  - **Rust** (v1.78+) with Cargo
  - **Python** (v3.11+) with `pip` and `venv`
  - **PostgreSQL** (v16)

---

### Method 1: Docker Compose (All-in-One Backend)

Launch the entire backend stack (PostgreSQL, CV Service, Rust API) with one command:

```bash
# Build and start all backend containers
docker compose up --build
```

This starts:
- **PostgreSQL 16**: `localhost:5432`
- **Python CV Microservice**: `http://localhost:8001`
- **Rust Orchestration API**: `http://localhost:3000`

---

### Method 2: Bare Metal Local Development

#### 1. Start PostgreSQL
Ensure PostgreSQL 16 is running on port `5432` and create the `smartgrip` database:
```bash
createdb smartgrip
```

#### 2. Start the Computer Vision Microservice
```bash
cd cv_service

# Create and activate a Python virtual environment
python3.11 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

#### 3. Start the Rust Backend
```bash
cd backend

# Cargo builds and runs the server (automatically initializes DB tables)
cargo run
```

---

### Starting the Mobile Application

```bash
# Return to repository root
npm install

# Start the Expo development server
npm start
```

- **Physical Device**: Scan the QR code shown in your terminal using the **Expo Go** app (iOS or Android).
- **Simulator / Emulator**: Press `i` for iOS Simulator or `a` for Android Emulator.
- **Web**: Press `w` to run in a web browser.

> [!TIP]
> When testing on a **physical mobile device**, set `EXPO_PUBLIC_API_URL` to your development machine's local IP address (e.g., `http://192.168.1.50:3000`) so the phone can reach the backend over Wi-Fi.

---

## ⚙️ Configuration & Environment Variables

Create a `.env` file at the root of the project (template in `.env.example`):

| Variable | Target Service | Default | Description |
|:---|:---|:---|:---|
| `DATABASE_URL` | Backend | `postgres://postgres:postgres@localhost:5432/smartgrip` | PostgreSQL connection string |
| `CV_SERVICE_URL` | Backend | `http://localhost:8001` | Base URL of the Python CV Microservice |
| `STORAGE_BASE` | CV Service | `storage` | Path to shared storage for scan frames |
| `RUST_BACKEND_URL` | CV Service | `http://localhost:3000` | Rust backend URL for CV callbacks |
| `EXPO_PUBLIC_API_URL` | Mobile App | `http://localhost:3000` | Backend API base URL for Expo client |

---

## 📄 License & Attribution

Developed as an open-source assistive healthcare platform. Designed for clinical translation, low-cost medical customization, and accessible IoT home control.
