import streamlit as st
import pandas as pd
import joblib

st.title("Placement Prediction using Decision Tree")

model = joblib.load("decision_tree_placement.pkl")

branches = ["CSE", "IT", "ECE", "Mechanical", "Civil", "Electrical"]
genders = ["Male", "Female"]
intern_opt = ["Yes", "No"]

# Input fields
cgpa = st.number_input("CGPA", 5.0, 10.0, 7.0)
projects = st.number_input("Projects", 0, 10, 2)
cert = st.number_input("Certificates", 0, 20, 1)
branch = st.selectbox("Branch", branches)
gender = st.selectbox("Gender", genders)
communication = st.slider("Communication Skill", 1, 10, 5)
aptitude = st.slider("Aptitude Score", 40, 100, 60)
logical = st.slider("Logical Skill", 1, 10, 5)
coding = st.slider("Coding Skill", 1, 10, 5)
internship = st.selectbox("Internship", intern_opt)

data = pd.DataFrame([{
    "CGPA": cgpa,
    "Projects": projects,
    "Certificates": cert,
    "Branch": branch,
    "Gender": gender,
    "Communication_Skill": communication,
    "Aptitude_Score": aptitude,
    "Logical_Skill": logical,
    "Coding_Skill": coding,
    "Internship": internship
}])

if st.button("Predict"):
    pred = model.predict(data)[0]
    if pred == 1:
        st.success("This student is LIKELY to be Placed 👍")
    else:
        st.error("This student is NOT likely to be placed ❌")
