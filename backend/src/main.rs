use axum::{
    extract::{DefaultBodyLimit, Path},
    routing::{get, post},
    Json, Router,
};
use serde::Serialize;
use tower_http::cors::CorsLayer;

use sqlx::postgres::PgPoolOptions;
use std::sync::Arc;
use uuid::Uuid;
use axum::extract::State;

mod db;

struct AppState {
    pool: sqlx::PgPool,
}

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    service: &'static str,
}

async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({ "status": "ok", "service": "assistive-smart-glove-backend" }))
}



async fn ingest_dimensions(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<db::TelemetryPayload>,
) -> Result<Json<db::PatientHandProfile>, axum::http::StatusCode> {
    match db::insert_telemetry(&state.pool, payload).await {
        Ok(profile) => Ok(Json(profile)),
        Err(e) => {
            eprintln!("Error inserting telemetry: {:?}", e);
            Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn get_patients(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<db::PatientHandProfile>>, axum::http::StatusCode> {
    match db::get_all_patients(&state.pool).await {
        Ok(profiles) => Ok(Json(profiles)),
        Err(e) => {
            eprintln!("Error fetching patients: {:?}", e);
            Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn update_patient_status(
    State(state): State<Arc<AppState>>,
    Path(patient_id): Path<Uuid>,
    Json(payload): Json<db::StatusUpdatePayload>,
) -> Result<Json<db::PatientHandProfile>, axum::http::StatusCode> {
    match db::update_status(&state.pool, patient_id, payload.fabrication_status).await {
        Ok(profile) => Ok(Json(profile)),
        Err(e) => {
            eprintln!("Error updating status: {:?}", e);
            Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
#[tokio::main]
async fn main() {
    // Initialize PostgreSQL
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/smartgrip".to_string());
    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await;
        
    let shared_state = if let Ok(pool) = pool {
        println!("Connected to PostgreSQL");
        db::init_db(&pool).await.expect("Failed to initialize database schema");
        Some(Arc::new(AppState { pool }))
    } else {
        println!("WARNING: Failed to connect to PostgreSQL. Telemetry endpoints will fail.");
        None
    };

    let mut app = Router::new().route("/health", get(health));

    if let Some(state) = shared_state {
        let api = Router::new()
            .route("/api/v1/tailor/dimensions", post(ingest_dimensions))
            .route("/api/v1/patients", get(get_patients))
            .route("/api/v1/patient/:id/status", axum::routing::put(update_patient_status))
            .with_state(state);
        app = app.merge(api);
    }

    let app = app
        .layer(DefaultBodyLimit::max(100 * 1024 * 1024))
        .layer(CorsLayer::permissive());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .expect("bind backend listener");

    println!("Backend server listening on 0.0.0.0:3000 (body limit: 100MB)");

    axum::serve(listener, app).await.expect("run backend");
}
