start Expo go (mobile) - set EXPO_PUBLIC_API_URL=http://172.24.231.77:3000; npm start (from root directory)

start backend - cd backend, cargo run

cv pipeline - cd cv_service, python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload

start Postgres - postgres\pgsql\bin\pg_ctl.exe -D postgres\data -l postgres\server.log start (from root directory)
Database logs - postgres\server.log