import os
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report

def train_and_evaluate():
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'heart.csv')
    df = pd.read_csv(data_path)

    print(f"Loaded dataset from {data_path}. Shape: {df.shape}")

    # Check and handle nulls if any
    if df.isnull().sum().sum() > 0:
        print("Handling missing values...")
        for col in df.columns:
            if df[col].dtype == 'object':
                df[col] = df[col].fillna(df[col].mode()[0])
            else:
                df[col] = df[col].fillna(df[col].median())

    categorical_cols = [
        'sex', 'chest_pain', 'fasting_blood_sugar', 
        'rest_ecg', 'exercise_induced', 'slope', 'thalassemia'
    ]

    encoders = {}
    df_encoded = df.copy()

    for col in categorical_cols:
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df[col].astype(str))
        encoders[col] = le
        print(f"Encoded '{col}': {dict(zip(le.classes_, le.transform(le.classes_)))}")

    X = df_encoded.drop('target', axis=1)
    y = df_encoded['target']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"Train size: {X_train.shape[0]}, Test size: {X_test.shape[0]}")

    # Train Random Forest
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_preds)
    rf_recall = recall_score(y_test, rf_preds)

    # Train Logistic Regression
    lr_model = LogisticRegression(max_iter=1000, random_state=42)
    lr_model.fit(X_train, y_train)
    lr_preds = lr_model.predict(X_test)
    lr_acc = accuracy_score(y_test, lr_preds)
    lr_recall = recall_score(y_test, lr_preds)

    print(f"Random Forest - Acc: {rf_acc:.4f}, Recall: {rf_recall:.4f}")
    print(f"Logistic Regression - Acc: {lr_acc:.4f}, Recall: {lr_recall:.4f}")

    # Select best model based on accuracy (and recall as tie breaker)
    if (rf_acc, rf_recall) >= (lr_acc, lr_recall):
        best_model = rf_model
        best_name = "RandomForestClassifier"
        best_preds = rf_preds
    else:
        best_model = lr_model
        best_name = "LogisticRegression"
        best_preds = lr_preds

    best_acc = accuracy_score(y_test, best_preds)
    best_prec = precision_score(y_test, best_preds)
    best_rec = recall_score(y_test, best_preds)
    best_f1 = f1_score(y_test, best_preds)
    cm = confusion_matrix(y_test, best_preds)

    report_str = f"""==================================================
AI Health Risk Predictor - Model Evaluation Report
==================================================
Selected Model: {best_name}

Comparison Metrics:
- Random Forest Accuracy: {rf_acc:.4f} (Recall: {rf_recall:.4f})
- Logistic Regression Accuracy: {lr_acc:.4f} (Recall: {lr_recall:.4f})

Test Set Performance ({best_name}):
- Accuracy:  {best_acc:.4f} ({best_acc*100:.2f}%)
- Precision: {best_prec:.4f}
- Recall:    {best_rec:.4f}
- F1 Score:  {best_f1:.4f}

Confusion Matrix:
{cm}

Detailed Classification Report:
{classification_report(y_test, best_preds)}
==================================================
"""
    print(report_str)

    model_dir = os.path.dirname(__file__)
    os.makedirs(model_dir, exist_ok=True)

    model_path = os.path.join(model_dir, 'model.pkl')
    encoders_path = os.path.join(model_dir, 'encoders.pkl')
    report_path = os.path.join(model_dir, 'evaluation_report.txt')

    with open(model_path, 'wb') as f:
        pickle.dump(best_model, f)

    with open(encoders_path, 'wb') as f:
        pickle.dump(encoders, f)

    with open(report_path, 'w') as f:
        f.write(report_str)

    print(f"Saved best model to {model_path}")
    print(f"Saved encoders to {encoders_path}")
    print(f"Saved evaluation report to {report_path}")

if __name__ == '__main__':
    train_and_evaluate()
