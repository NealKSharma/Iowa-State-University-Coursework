# Goldilock Zone Investigators

## DS 2010 Final Project — Grade: A

**Authors:** Tanisha Ravindran and Neal Kaushik Sharma

---

## Overview

This project explores whether an exoplanet's temperature can be predicted using planetary, orbital, and stellar features.

**Research Question:**  
Can we predict an exoplanet's temperature using information about the planet, its orbit, and its host star?

**Target:** Temperature (K)

This was treated as a regression problem since the goal was to predict a continuous value.

---

## Dataset

Source: [Exoplanets - Planets Outside Our Galaxy](https://www.kaggle.com/datasets/diaaessam/exoplanets-planets-outside-our-galaxy)

Features used:
- Planet mass
- Planet radius
- Orbital period
- Semi-major axis
- Discovery method
- Discovery year
- Distance
- Host star mass
- Host star temperature

---

## Methods

Data preprocessing:
- Converted columns into numeric formats
- Removed missing target values
- Filled missing feature values
- Applied log transformations to skewed features
- One-hot encoded discovery method

Models tested:
- Linear Regression
- K-Nearest Neighbors Regression
- Decision Tree Regression

Evaluation metrics:
- R² Score
- MAE
- RMSE
- 5-fold Cross Validation

---

## Results

The best-performing model was:

**K-Nearest Neighbors Regression**

Performance:
- R² Score: ~0.66

The model was able to explain about 66% of the variation in exoplanet temperatures using available planetary and stellar features.

---

## Additional Analysis

We also explored:
- Hot Jupiters
- Lonely Giants
- Planet density patterns
- Approximate Goldilocks Zone locations

---

## Tools Used

- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn
- Scikit-learn

---

## Conclusion

The project showed that exoplanet temperature can be reasonably predicted using planetary and stellar characteristics. Features such as host star temperature, planet radius, and orbital properties were important factors in prediction.

---

## Authors

Tanisha Ravindran  
Neal Kaushik Sharma