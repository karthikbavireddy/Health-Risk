-- Schema for AI Health Risk Predictor Database
CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    age INTEGER NOT NULL,
    sex TEXT NOT NULL,
    chest_pain TEXT NOT NULL,
    resting_blood_pressure INTEGER NOT NULL,
    cholesterol INTEGER NOT NULL,
    fasting_blood_sugar TEXT NOT NULL,
    rest_ecg TEXT NOT NULL,
    Max_heart_rate INTEGER NOT NULL,
    exercise_induced TEXT NOT NULL,
    oldpeak REAL NOT NULL,
    slope TEXT NOT NULL,
    vessels_colored INTEGER NOT NULL,
    thalassemia TEXT NOT NULL,
    predicted_risk_score REAL NOT NULL,
    predicted_risk_level TEXT NOT NULL
);
