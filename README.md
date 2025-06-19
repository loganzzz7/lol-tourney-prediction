# 🏆 League of Legends Tournament Winner Prediction (MSI)

This project is a machine learning pipeline built to **predict the winner of the Mid-Season Invitational (MSI)** — one of the premier global League of Legends tournaments. The goal is to extract competitive match data using Riot's public esports APIs and train predictive models based on early-game stats such as **gold @ 15 mins**, **KDA**, and **objective control**.

---

## 🔍 Problem Statement

Given the historical data from past MSI tournaments, can we predict which team is most likely to win the tournament based on quantifiable, early-game team performance metrics?

---

## 💡 Approach

1. **Data Gathering**  
   Uses the [@viriato/lol-esports-api](https://github.com/Viriatto/lol-esports-api) to collect:
   - Tournament metadata
   - Match schedules
   - Game-level statistics

2. **Feature Engineering**  
   - Gold difference at 15 minutes  
   - Average KDA per team  
   - Objective control rate (e.g., dragons/heralds taken)

3. **Modeling**  
   - Classification models (e.g., logistic regression, XGBoost) trained on engineered features
   - Target label: tournament winner (binary)

4. **Evaluation**  
   - Backtesting on past MSI tournaments  
   - Accuracy, F1-score, and confidence thresholds for prediction

---

## ⚙️ Tech Stack

- **Python**: Data processing and ML model training
- **Node.js**: Wrapper for esports API data scraping
- **Pandas / NumPy**: Data transformation
- **scikit-learn**: Machine learning

---

## 🚀 Getting Started

TODO