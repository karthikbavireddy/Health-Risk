import os
import pickle
import numpy as np
import pandas as pd
from typing import List, Literal, Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, field_validator

# Load environment variables from .env (including DATABASE_URL)
from dotenv import load_dotenv
load_dotenv()


# Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'model.pkl')
ENCODERS_PATH = os.path.join(BASE_DIR, 'model', 'encoders.pkl')
# DATABASE_URL is read from environment – no local file path needed
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    raise RuntimeError('DATABASE_URL environment variable is not set')

app = FastAPI(
    title="AI Health Risk Predictor API",
    description="Backend API for Heart Disease Risk Assessment",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and encoders
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(ENCODERS_PATH, 'rb') as f:
        encoders = pickle.load(f)
    print("Successfully loaded model and encoders.")
except Exception as e:
    print(f"Error loading model assets: {e}")
    model = None
    encoders = None


import psycopg2
import psycopg2.extras

def get_db():
    # Connect to Postgres using the DATABASE_URL from .env
    conn = psycopg2.connect(DATABASE_URL)
    # Use RealDictCursor for convenient dict rows
    conn.autocommit = True
    return conn


class RiskPredictionInput(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Age in years (1-120)")
    sex: Literal["Male", "Female"] = Field(..., description="Biological sex")
    chest_pain: Literal["Typical angina", "Atypical angina", "Non-anginal", "Asymptomatic"] = Field(..., description="Chest pain type")
    resting_blood_pressure: int = Field(..., ge=50, le=250, description="Resting blood pressure in mm Hg")
    cholesterol: int = Field(..., ge=80, le=600, description="Serum cholesterol in mg/dl")
    fasting_blood_sugar: Literal["Yes", "No"] = Field(..., description="Fasting blood sugar > 120 mg/dl")
    rest_ecg: Literal["Normal", "ST-T wave abnormality", "Left ventricular hypertrophy"] = Field(..., description="Resting ECG results")
    Max_heart_rate: int = Field(..., ge=40, le=230, description="Maximum heart rate achieved")
    exercise_induced: Literal["Yes", "No"] = Field(..., description="Exercise-induced angina")
    oldpeak: float = Field(..., ge=0.0, le=10.0, description="ST depression induced by exercise")
    slope: Literal["Upsloping", "Flat", "Downsloping"] = Field(..., description="Slope of peak exercise ST segment")
    vessels_colored: int = Field(..., ge=0, le=3, description="Major vessels colored by fluoroscopy (0-3)")
    thalassemia: Literal["Normal", "Fixed Defect", "Reversible Defect"] = Field(..., description="Thalassemia status")


class RiskPredictionOutput(BaseModel):
    id: Optional[int] = None
    created_at: Optional[str] = None
    risk_score: float
    risk_level: str
    contributing_factors: List[str]


def calculate_contributing_factors(input_data: RiskPredictionInput) -> List[str]:
    """Generates plain language top contributing factors based on patient clinical parameters."""
    factors = []

    # 1. Vessels colored
    if input_data.vessels_colored > 0:
        factors.append((
            30 * input_data.vessels_colored,
            f"Fluoroscopy revealed {input_data.vessels_colored} major vessel(s) with significant restriction."
        ))

    # 2. Thalassemia
    if input_data.thalassemia == "Reversible Defect":
        factors.append((28, "Thalassemia test indicated a Reversible Defect, signaling localized blood flow reduction."))
    elif input_data.thalassemia == "Fixed Defect":
        factors.append((20, "Thalassemia test showed a Fixed Defect in myocardial perfusion."))

    # 3. Oldpeak (ST Depression)
    if input_data.oldpeak >= 1.5:
        factors.append((25, f"Significant exercise-induced ST depression ({input_data.oldpeak} mm) indicates myocardial stress."))
    elif input_data.oldpeak > 0.5:
        factors.append((15, f"Moderate exercise-induced ST depression ({input_data.oldpeak} mm) detected."))

    # 4. Exercise Induced Angina
    if input_data.exercise_induced == "Yes":
        factors.append((22, "Exercise-induced chest discomfort (angina) during physical exertion."))

    # 5. Chest Pain Type
    if input_data.chest_pain == "Asymptomatic":
        factors.append((18, "Asymptomatic chest presentation, frequently associated with silent ischemia."))
    elif input_data.chest_pain == "Typical angina":
        factors.append((16, "Classic typical angina symptoms during physical or emotional stress."))

    # 6. Resting Blood Pressure
    if input_data.resting_blood_pressure >= 140:
        factors.append((15, f"High resting blood pressure ({input_data.resting_blood_pressure} mm Hg) increases arterial wall stress."))
    elif input_data.resting_blood_pressure >= 130:
        factors.append((10, f"Elevated resting blood pressure ({input_data.resting_blood_pressure} mm Hg)."))

    # 7. Serum Cholesterol
    if input_data.cholesterol >= 240:
        factors.append((14, f"High serum cholesterol level ({input_data.cholesterol} mg/dl) favors plaque accumulation."))
    elif input_data.cholesterol >= 200:
        factors.append((8, f"Borderline elevated serum cholesterol ({input_data.cholesterol} mg/dl)."))

    # 8. Max Heart Rate
    expected_max = 220 - input_data.age
    if input_data.Max_heart_rate < (expected_max * 0.75):
        factors.append((12, f"Sub-optimal peak exercise heart rate ({input_data.Max_heart_rate} bpm vs expected ~{expected_max} bpm)."))

    # 9. ST Slope
    if input_data.slope == "Flat":
        factors.append((12, "Flat exercise ST segment slope suggests reduced coronary reserve."))
    elif input_data.slope == "Downsloping":
        factors.append((16, "Downsloping ST segment slope is strongly correlated with ischemic heart disease."))

    # 10. Fasting Blood Sugar
    if input_data.fasting_blood_sugar == "Yes":
        factors.append((10, "Fasting blood sugar > 120 mg/dl indicates impaired glucose metabolism."))

    # 11. Rest ECG
    if input_data.rest_ecg == "Left ventricular hypertrophy":
        factors.append((11, "Resting ECG demonstrates left ventricular hypertrophy."))
    elif input_data.rest_ecg == "ST-T wave abnormality":
        factors.append((9, "Resting ECG shows ST-T wave abnormalities."))

    # 12. Age & Demographics
    if input_data.age >= 60:
        factors.append((8, f"Advanced age ({input_data.age} years) increases baseline cardiovascular risk."))

    # Sort factors by weight descending
    factors.sort(key=lambda x: x[0], reverse=True)

    top_factors = [f[1] for f in factors[:3]]

    # Fallbacks if low risk / few risk factors present
    if len(top_factors) < 3:
        protective_factors = [
            f"Resting blood pressure within healthy parameters ({input_data.resting_blood_pressure} mm Hg).",
            f"Serum cholesterol maintained at {input_data.cholesterol} mg/dl.",
            f"Good peak exercise heart rate achievement ({input_data.Max_heart_rate} bpm).",
            "No exercise-induced angina reported.",
            "Normal resting ECG baseline readings."
        ]
        for pf in protective_factors:
            if pf not in top_factors and len(top_factors) < 3:
                top_factors.append(pf)

    return top_factors[:3]


@app.get("/api-status")
def read_root():
    return {"status": "ok", "message": "AI Health Risk Predictor API Service"}


@app.post("/predict-risk", response_model=RiskPredictionOutput)
def predict_risk(data: RiskPredictionInput):
    if model is None or encoders is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Machine learning model assets are not loaded."
        )

    try:
        # Prepare feature vector matching exact training column order
        encoded_input = {
            'age': data.age,
            'sex': encoders['sex'].transform([data.sex])[0],
            'chest_pain': encoders['chest_pain'].transform([data.chest_pain])[0],
            'resting_blood_pressure': data.resting_blood_pressure,
            'cholesterol': data.cholesterol,
            'fasting_blood_sugar': encoders['fasting_blood_sugar'].transform([data.fasting_blood_sugar])[0],
            'rest_ecg': encoders['rest_ecg'].transform([data.rest_ecg])[0],
            'Max_heart_rate': data.Max_heart_rate,
            'exercise_induced': encoders['exercise_induced'].transform([data.exercise_induced])[0],
            'oldpeak': data.oldpeak,
            'slope': encoders['slope'].transform([data.slope])[0],
            'vessels_colored': data.vessels_colored,
            'thalassemia': encoders['thalassemia'].transform([data.thalassemia])[0]
        }

        df_input = pd.DataFrame([encoded_input])
        
        # Predict probability for target = 1 (Risk present)
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(df_input)[0][1]
        else:
            proba = float(model.predict(df_input)[0])

        risk_score = round(float(proba * 100), 1)

        if risk_score < 35.0:
            risk_level = "Low"
        elif risk_score <= 65.0:
            risk_level = "Moderate"
        else:
            risk_level = "High"

        contributing_factors = calculate_contributing_factors(data)

        # Save record to Postgres
        conn = get_db()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        insert_sql = """
            INSERT INTO predictions (
                age, sex, chest_pain, resting_blood_pressure, cholesterol,
                fasting_blood_sugar, rest_ecg, Max_heart_rate, exercise_induced,
                oldpeak, slope, vessels_colored, thalassemia,
                predicted_risk_score, predicted_risk_level
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, created_at;
        """
        cursor.execute(insert_sql, (
            data.age, data.sex, data.chest_pain, data.resting_blood_pressure, data.cholesterol,
            data.fasting_blood_sugar, data.rest_ecg, data.Max_heart_rate, data.exercise_induced,
            data.oldpeak, data.slope, data.vessels_colored, data.thalassemia,
            risk_score, risk_level
        ))
        result = cursor.fetchone()
        prediction_id = result['id']
        created_at = result['created_at']
        # No explicit commit needed because autocommit is on
        conn.close()

        return RiskPredictionOutput(
            id=prediction_id,
            created_at=created_at,
            risk_score=risk_score,
            risk_level=risk_level,
            contributing_factors=contributing_factors
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Prediction processing error: {str(e)}"
        )


@app.get("/history")
def get_history():
    try:
        conn = get_db()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute("""
            SELECT id, created_at, age, sex, chest_pain, resting_blood_pressure,
                   cholesterol, fasting_blood_sugar, rest_ecg, Max_heart_rate,
                   exercise_induced, oldpeak, slope, vessels_colored, thalassemia,
                   predicted_risk_score, predicted_risk_level
            FROM predictions
            ORDER BY id DESC
            LIMIT 20;
        """)
        rows = cursor.fetchall()
        conn.close()

        history = rows  # rows are already dict‑like thanks to RealDictCursor
        return history

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch history: {str(e)}"
        )


# Monolithic static file serving for frontend React/Vite app
FRONTEND_DIST = os.path.join(BASE_DIR, 'frontend', 'dist')
if os.path.exists(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="static")

    @app.exception_handler(404)
    async def not_found_handler(request, exc):
        # Fallback to index.html for client-side routing
        index_file = os.path.join(FRONTEND_DIST, 'index.html')
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"detail": "Not Found"}

