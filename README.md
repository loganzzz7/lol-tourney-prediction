# 🏆 League of Legends Tournament Winner Prediction (MSI)

This project is a machine learning pipeline built to **predict the winner of the Mid-Season Invitational (MSI)** — one of the global League of Legends tournaments. The goal is to extract competitive match data using the LoL esport API and train predictive models based on game stats.

---

## 🔍 Problem Statement

Given the historical data from most recent regional tournaments, can we predict which team is most likely to win the MSI tournament based on quantifiable team performance metrics?

---

## 💡 Approach

1. **Data Gathering**  
   Uses the [@viriato/lol-esports-api](https://github.com/Viriatto/lol-esports-api) to collect:
   - Tournament metadata
   - Match schedules
   - Game-level statistics

2. **Feature Engineering**  
   - Average KDA per team: Computed as the average of (kills + assists) / max(deaths, 1) across all five players.
   - Total Gold per team: Sum of totalGoldEarned for all players on each team, used to infer the winning side.
   - Creep Score (CS): Sum of each team’s creepScore, used as a proxy for map control and farming efficiency.
   - Average Level: Average player level per team at the final game state.
   - Ward Control: Total wardsPlaced and wardsDestroyed by each team, indicating vision control.
   - Label (Target): Binary indicator of the actual game outcome — 1 if the blue team won, 0 if the red team won.

3. **Modeling**  
   - Classification models (e.g., logistic regression) trained on engineered features
   - Goal: Predict the outcome of future tournament matches based on teams’ past statistical tendencies
   - Target label: Match outcome (blue win = 1, red win = 0)

4. **Evaluation**  
   - Backtesting on past regional tournaments in the previous year
   - Accuracy, F1-score, and confidence thresholds for prediction

---

## ⚙️ Tech Stack

- **Python (json, pandas, pathlib)**: Data processing and ML model training
- **Node.js**: Wrapper for esports API data scraping
- **Pandas / NumPy**: Data transformation
- **scikit-learn**: Machine learning

---

## 🚀 Getting Started

TODO
