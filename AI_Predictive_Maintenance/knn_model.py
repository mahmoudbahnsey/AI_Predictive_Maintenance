import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, ConfusionMatrixDisplay
from google.colab import files
import matplotlib.pyplot as plt

# Upload the file
uploaded = files.upload()
data = pd.read_csv("Diabetes.csv")

# Explore the dataset
print("Shape of dataset:", data.shape)  
print("\nData Info:")
print(data.info())  
print("\nMissing Values in each column:")
print(data.isnull().sum())
print("\nDescriptive Statistics:")
print(data.describe())

# Clean column names
data.rename(columns=lambda x: x.strip(), inplace=True)
for col in data.columns:
    print(f"'{col}'")

# Separate features and target
X = data.drop('FDD', axis=1)
y = data['FDD']

# Scale the data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

print("Features X shape:", X.shape)
print("Target y shape:", y.shape)

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# Create KNN model
knn_model = KNeighborsClassifier(n_neighbors=5)  
knn_model.fit(X_train, y_train)

# Predict on test data
y_pred = knn_model.predict(X_test)

# Evaluate the model
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Plot the confusion matrix
cm = confusion_matrix(y_test, y_pred, labels=knn_model.classes_)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=knn_model.classes_)
disp.plot(cmap=plt.cm.Blues, xticks_rotation='vertical') 
plt.title("Confusion Matrix for KNN Model")
plt.show()
