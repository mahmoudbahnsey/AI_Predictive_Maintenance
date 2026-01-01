import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

# Load the dataset
data = pd.read_csv('dataset_CSV.csv')

# Display basic information about the data
print("=" * 50)
print("Data Information:")
print("=" * 50)
print(f"Number of rows: {data.shape[0]}")
print(f"Number of columns: {data.shape[1]}")
print("\nAvailable columns:")
print(data.columns.tolist())
print("\nData sample:")
print(data.head())
print("\nStatistical description:")
print(data.describe())
print("\nUnique FDD values:")
print(data['FDD'].unique())
print("=" * 50)

# Check for missing values
print("Missing values in each column:")
print(data.isnull().sum())
print("=" * 50)

# Separate features and target
X = data.drop('FDD', axis=1)  # Features
y = data['FDD']               # Target

# Encode target if it's categorical
if y.dtype == 'object':
    le = LabelEncoder()
    y = le.fit_transform(y)
    print("Classification converted to numeric values")
    print(f"Unique values after encoding: {np.unique(y)}")

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

print("=" * 50)
print("Data Split:")
print(f"Training data: {X_train.shape[0]} samples")
print(f"Testing data: {X_test.shape[0]} samples")
print("=" * 50)

# Create and train Decision Tree model
print("Training Decision Tree model...")
dt_model = DecisionTreeClassifier(
    random_state=42,
    max_depth=5,        # Maximum depth of the tree
    min_samples_split=10,
    min_samples_leaf=5
)
dt_model.fit(X_train, y_train)

# Predict on test data
y_pred = dt_model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print("=" * 50)
print(f"Model accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Display confusion matrix
print("Confusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
print(cm)
print("=" * 50)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix - Decision Tree')
plt.ylabel('True Values')
plt.xlabel('Predicted Values')
plt.show()

# Visualize the decision tree
plt.figure(figsize=(20, 10))
plot_tree(
    dt_model,
    feature_names=X.columns.tolist(),
    class_names=[str(c) for c in np.unique(y)],
    filled=True,
    rounded=True,
    fontsize=10
)
plt.title('Decision Tree')
plt.show()

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': dt_model.feature_importances_
}).sort_values('importance', ascending=False)

print("=" * 50)
print("Feature Importance:")
print(feature_importance)
print("=" * 50)

# Plot feature importance
plt.figure(figsize=(10, 6))
plt.barh(feature_importance['feature'], feature_importance['importance'])
plt.xlabel('Importance')
plt.ylabel('Features')
plt.title('Feature Importance in Decision Tree')
plt.gca().invert_yaxis()
plt.show()

# Test on some random samples from test set
print("=" * 50)
print("Testing on new data (sample from test data):")
sample_indices = np.random.choice(len(X_test), min(5, len(X_test)), replace=False)

for i, idx in enumerate(sample_indices):
    sample = X_test.iloc[idx:idx+1]
    true_label = y_test[idx]
    predicted_label = dt_model.predict(sample)[0]
    
    print(f"\nSample {i+1}:")
    print(f"  True value: {true_label}")
    print(f"  Predicted value: {predicted_label}")
    print(f"  Result: {'Correct' if true_label == predicted_label else 'Wrong'}")

# Save the trained model
joblib.dump(dt_model, 'decision_tree_model.pkl')
print("=" * 50)
print("Model saved to 'decision_tree_model.pkl'")
print("=" * 50)

# Analyze the effect of tree depth on performance
print("Analyzing the effect of tree depth on performance:")
max_depths = range(1, 11)
train_accuracies = []
test_accuracies = []

for depth in max_depths:
    dt_temp = DecisionTreeClassifier(max_depth=depth, random_state=42)
    dt_temp.fit(X_train, y_train)
    
    train_acc = accuracy_score(y_train, dt_temp.predict(X_train))
    test_acc = accuracy_score(y_test, dt_temp.predict(X_test))
    
    train_accuracies.append(train_acc)
    test_accuracies.append(test_acc)

plt.figure(figsize=(10, 6))
plt.plot(max_depths, train_accuracies, 'b-', label='Training')
plt.plot(max_depths, test_accuracies, 'r-', label='Testing')
plt.xlabel('Tree Depth')
plt.ylabel('Accuracy')
plt.title('Effect of Tree Depth on Performance')
plt.legend()
plt.grid(True)
plt.show()
