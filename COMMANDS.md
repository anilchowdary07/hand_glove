# Assistive Smart Glove — Service Startup Commands

Run each service in a separate terminal tab from the project root (`/Users/anilchowdary/Documents/smart_glove`).

---

### Terminal 1: PostgreSQL Database (Port 5433)
```bash
# Start PostgreSQL cluster:
/Library/PostgreSQL/17/bin/pg_ctl -D /Users/anilchowdary/pg_smartgrip -o "-p 5433" -l /Users/anilchowdary/pg_smartgrip/server.log start

# Check status:
/Library/PostgreSQL/17/bin/pg_ctl -D /Users/anilchowdary/pg_smartgrip status

# Stop PostgreSQL:
/Library/PostgreSQL/17/bin/pg_ctl -D /Users/anilchowdary/pg_smartgrip stop
```

---

### Terminal 2: Rust Backend (Port 3000)
```bash
cd backend
DATABASE_URL="postgres://postgres@localhost:5433/smartgrip" CV_SERVICE_URL="http://localhost:8001" cargo run
```

---

### Terminal 3: Computer Vision Microservice (Port 8001)
```bash
cd cv_service
DATABASE_URL="postgresql+asyncpg://postgres@localhost:5433/smartgrip" ./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

---

### Terminal 4: Expo Mobile Frontend (Port 8081)
```bash
# Ensure .env has the current computer IP:
# EXPO_PUBLIC_API_URL=http://192.168.137.102:3000
# EXPO_PUBLIC_FIREBASE_RTDB_URL=https://smartgrip-e5e0a-default-rtdb.firebaseio.com

npx expo start --clear
```

---

### Quick Health Checks
```bash
# Check Rust backend:
curl http://localhost:3000/health

# Check CV microservice:
curl http://localhost:8001/health

# Check active ports:
lsof -i :3000,5433,8001,8081
```

---

### Windows (PowerShell / Command Prompt) Reference
If running on Windows:
```powershell
# 1. Start Postgres:
postgres\pgsql\bin\pg_ctl.exe -D postgres\data -l postgres\server.log start

# 2. Start Backend:
cd backend
cargo run

# 3. Start CV Pipeline:
cd cv_service
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload

# 4. Start Expo:
$env:EXPO_PUBLIC_API_URL="http://<YOUR_IP>:3000"
npm start
```
