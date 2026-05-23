use serde::{Deserialize, Serialize};
use sqlx::{PgPool, FromRow};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug)]
pub struct FingerDimensions {
    pub length_mm: f32,
    pub base_width_mm: f32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HandFingers {
    pub thumb: FingerDimensions,
    pub index: FingerDimensions,
    pub middle: FingerDimensions,
    pub ring: FingerDimensions,
    pub pinky: FingerDimensions,
}

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct PatientHandProfile {
    pub id: Uuid,
    pub patient_id: Uuid,
    pub palm_width_mm: f64,
    pub palm_height_mm: f64,
    pub finger_metrics: sqlx::types::Json<HandFingers>,
    pub fabrication_status: String,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Deserialize, Debug)]
pub struct TelemetryPayload {
    pub patient_id: Uuid,
    pub palm_width_mm: f64,
    pub palm_height_mm: f64,
    pub finger_metrics: HandFingers,
}

#[derive(Deserialize, Debug)]
pub struct StatusUpdatePayload {
    pub fabrication_status: String,
}

pub async fn init_db(pool: &PgPool) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS hand_tailoring_dimensions (
            id UUID PRIMARY KEY,
            patient_id UUID UNIQUE NOT NULL,
            palm_width_mm FLOAT NOT NULL,
            palm_height_mm FLOAT NOT NULL,
            finger_metrics JSONB NOT NULL,
            fabrication_status VARCHAR(50) NOT NULL DEFAULT 'Processing',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        "#,
    )
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn insert_telemetry(pool: &PgPool, payload: TelemetryPayload) -> Result<PatientHandProfile, sqlx::Error> {
    let id = Uuid::new_v4();
    
    let profile = sqlx::query_as::<_, PatientHandProfile>(
        r#"
        INSERT INTO hand_tailoring_dimensions 
        (id, patient_id, palm_width_mm, palm_height_mm, finger_metrics)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (patient_id) DO UPDATE 
        SET palm_width_mm = EXCLUDED.palm_width_mm,
            palm_height_mm = EXCLUDED.palm_height_mm,
            finger_metrics = EXCLUDED.finger_metrics,
            fabrication_status = 'Processing'
        RETURNING *
        "#,
    )
    .bind(id)
    .bind(payload.patient_id)
    .bind(payload.palm_width_mm)
    .bind(payload.palm_height_mm)
    .bind(sqlx::types::Json(payload.finger_metrics))
    .fetch_one(pool)
    .await?;

    Ok(profile)
}

pub async fn get_all_patients(pool: &PgPool) -> Result<Vec<PatientHandProfile>, sqlx::Error> {
    let profiles = sqlx::query_as::<_, PatientHandProfile>("SELECT * FROM hand_tailoring_dimensions ORDER BY created_at DESC")
        .fetch_all(pool)
        .await?;
    Ok(profiles)
}

pub async fn update_status(pool: &PgPool, patient_id: Uuid, status: String) -> Result<PatientHandProfile, sqlx::Error> {
    let profile = sqlx::query_as::<_, PatientHandProfile>(
        r#"
        UPDATE hand_tailoring_dimensions
        SET fabrication_status = $1
        WHERE patient_id = $2
        RETURNING *
        "#,
    )
    .bind(status)
    .bind(patient_id)
    .fetch_one(pool)
    .await?;

    Ok(profile)
}
