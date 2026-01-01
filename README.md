# AI Predictive Maintenance

This project focuses on **AI-powered predictive maintenance**, aiming to predict equipment failures before they occur using machine learning techniques.  
Predictive maintenance helps reduce downtime, maintenance costs, and unexpected failures in industrial systems.

---

## 📌 Project Overview
The project applies multiple machine learning models to analyze historical maintenance and operational data, then predict whether a machine is likely to fail.

The goal is to compare different algorithms and evaluate their performance for predictive maintenance tasks.

---

## 🧠 Machine Learning Models Used
The following models are implemented in Python:

- K-Nearest Neighbors (KNN)
- Support Vector Machine (SVM)
- Decision Tree
- Random Forest
- Neural Network

Each model is implemented in a separate Python script for clarity and comparison.

---

## 📂 Project Structure
AI_Predictive_Maintenance/
│── abstract.txt
│── converted_dataset.csv
│── decision_tree.py
│── knn_model.py
│── neural_network.py
│── random_forest.py
│── svm_model.py
│── README.md

yaml
Copy code

---

## 📊 Dataset
- **File:** `converted_dataset.csv`
- The dataset contains historical machine data used for training and testing the models.
- Data preprocessing and feature selection are handled inside the model scripts.

---

## ▶️ How to Run the Project
1. Make sure Python is installed.
2. Install the required libraries:
   ```bash
   pip install numpy pandas scikit-learn matplotlib
Run any model script, for example:

bash
Copy code
python random_forest.py
Each script trains the model and outputs the prediction results.

🎯 Project Objective
Predict machine failures using AI

Compare multiple machine learning models

Demonstrate the effectiveness of predictive maintenance techniques

