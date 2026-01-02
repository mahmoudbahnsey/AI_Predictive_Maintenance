AI-Powered Predictive Maintenance 🚀

SUPERVISED BY: Dr. Dalia Ezzat

Prepared by:

Mohamed Essam

Mahmoud Mohamed

Andrew Moris

Nada Alaa Moftah

Abdullah Mahmoud

Shaimaa Sayed

Ahmed Mostafa

📌 Project Overview

This project focuses on AI-powered predictive maintenance, aiming to predict equipment failures before they occur using machine learning techniques.

Predictive maintenance helps:

Reduce downtime ⏱

Lower maintenance costs 💰

Prevent unexpected equipment failures ⚙️

The project applies multiple machine learning models to analyze historical maintenance and operational data, predicting potential failures.
The goal is to compare different algorithms and evaluate their performance for predictive maintenance tasks.

🧠 Machine Learning Models Used

Implemented in Python:

Model	Description
K-Nearest Neighbors (KNN)	Classifies machines based on similarity to historical data.
Support Vector Machine (SVM)	Finds the optimal boundary to separate failure and non-failure cases.
Decision Tree	Uses a tree structure to make decisions based on features.
Random Forest	Ensemble of decision trees to improve prediction accuracy.
Neural Network	Deep learning model for capturing complex patterns in data.

Each model is implemented in a separate Python script for clarity and easier comparison.

📂 Project Structure
AI_Predictive_Maintenance/
│── abstract.txt
│── converted_dataset.csv
│── decision_tree.py
│── knn_model.py
│── neural_network.py
│── random_forest.py
│── svm_model.py
│── README.md

📊 Dataset

File: converted_dataset.csv

Contains historical machine data used for training and testing the models.

Data preprocessing and feature selection are done within each model script.

▶️ How to Run the Project

Make sure Python 3.x is installed.

Install required libraries:

pip install numpy pandas scikit-learn matplotlib


Run any model script, for example:

python random_forest.py


The script will train the model and output prediction results.

🎯 Project Objectives

Predict machine failures using AI

Compare multiple machine learning models for predictive maintenance

Demonstrate the effectiveness of AI-powered predictive maintenance techniques
