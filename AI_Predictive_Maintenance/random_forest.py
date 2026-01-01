# ===== 1) Import Required Libraries =====
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt
from google.colab import files

# ===== 2) Upload Dataset =====
uploaded = files.upload()

filename = list(uploaded.keys())[0]
data = pd.read_csv(filename)

# ===== 3) Dataset Info & Cleaning =====
print("Shape of dataset:", data.shape)

print("\nData Info:")
print(data.info())

print("\nMissing Values:")
print(data.isnull().sum())

print("\nDescriptive Statistics:")
print(data.describe())

# Fix any spaces in column names
data.rename(columns=lambda x: x.strip(), inplace=True)

print("\nCleaned column names:")
for col in data.columns:
    print(f"'{col}'")

# ===== 4) Prepare Features X and Target y =====
X = data.drop("FDD", axis=1)   # Features
y = data["FDD"]                # Target

print("Features X shape:", X.shape)
print("Target y shape:", y.shape)

# ===== 5) Split Dataset =====
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ===== 6) Feature Scaling =====
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)

# ===== 7) Train Random Forest Model =====
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# ===== 8) Model Evaluation =====
y_pred = model.predict(X_test_scaled)

print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# ===== 9) Confusion Matrix =====
cm = confusion_matrix(y_test, y_pred, labels=model.classes_)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=model.classes_)
disp.plot(cmap=plt.cm.Blues, xticks_rotation='vertical')
plt.title("Confusion Matrix - Random Forest Model")
plt.show()
