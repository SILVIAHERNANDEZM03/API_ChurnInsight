# 🧠 ChurnInsight – Data Science

Este directorio contiene el **componente de Data Science** del proyecto **ChurnInsight**, encargado del análisis de datos, construcción, evaluación y preparación del modelo de *Machine Learning* para la **predicción de churn (cancelación de clientes)**.

El objetivo principal de este módulo es generar un modelo confiable, interpretable y listo para producción, que será consumido por la **API REST desarrollada en Spring Boot**.

---

## 📌 Alcance del componente de Data Science

- Análisis Exploratorio de Datos (EDA)
- Pipeline ETL (limpieza, transformación y validación)
- Feature engineering
- Entrenamiento y evaluación de modelos supervisados
- Selección del mejor modelo
- Serialización del modelo para despliegue
- Base para el microservicio de inferencia en Python

---

## 📁 Estructura del directorio

data-science/
├── data/
│ ├── raw/ # Dataset original (sin modificaciones)
│ ├── processed/ # Dataset limpio y transformado
│
├── notebooks/
│ ├── ChurnInsight_ETL-ML.ipynb # ETL + Análisis Exploratorio + Entrenamiento y evaluación de modelos
│
├── models/
│ ├── decision_tree.joblib # Modelo seleccionado
│ ├── logistic_regression.joblib
│ ├── random_forest.joblib
│
├── src/


*(La estructura puede evolucionar a medida que se integre el microservicio Python)*

---

## 📊 Dataset

- **Nombre:** Netflix Customer Churn  
- **Fuente:** Kaggle  
- **Descripción:**  
  Dataset con información demográfica, de uso y comportamiento de clientes, incluyendo la variable objetivo `churned`.

### Variable objetivo
- `churned`:
  - `True` → Cliente canceló el servicio  
  - `False` → Cliente permaneció  

---

## 🔍 Pipeline ETL

El pipeline de datos incluye:

1. **Extracción**
   - Carga del dataset desde GitHub (RAW) para garantizar reproducibilidad.

2. **Transformación**
   - Limpieza de datos
   - Conversión de tipos
   - Estandarización de variables categóricas
   - Creación de identificador público anonimizado (`public_id`)
   - Codificación de variables categóricas

3. **Validación**
   - Verificación de valores nulos
   - Control de duplicados
   - Revisión de consistencia semántica

---

## 📈 Análisis Exploratorio de Datos (EDA)

Durante el EDA se realizaron:

- Estadísticas descriptivas de variables numéricas
- Análisis de distribución de la variable churn
- Análisis porcentual de variables categóricas
- Visualizaciones:
  - Gráficos de barras
  - Gráficos circulares
  - Boxplots churn vs variables numéricas

### Hallazgos clave
- El churn presenta una distribución relativamente equilibrada.
- El **engagement del cliente** (horas de visualización) es un factor determinante.
- Variables de uso muestran mayor poder explicativo que las demográficas.

---

## 🤖 Modelado de Machine Learning

### Modelos entrenados
- Regresión Logística
- Árbol de Decisión
- Random Forest

### Métricas utilizadas
- Accuracy
- Precision
- Recall
- F1-score

### Mejor modelo (estado actual)
**Árbol de Decisión**

- Accuracy ≈ 0.98  
- Precision ≈ 0.98  
- Recall ≈ 0.99  
- F1-score ≈ 0.98  

El modelo fue seleccionado por su alto desempeño y facilidad de interpretación.

---

## 💾 Persistencia del modelo

- Los modelos entrenados se serializan usando `joblib`.
- El modelo final está preparado para:
  - Despliegue como microservicio Python
  - Consumo desde la API REST (Spring Boot)
  - Versionamiento y actualización futura

---

## 🔌 Integración con la API

Este componente se integrará con la API **ChurnInsight** mediante:

- Un microservicio Python de inferencia
- Comunicación vía HTTP (JSON)
- Entrada alineada con los DTOs definidos en la API

---

## 🚧 Estado actual

- ✔ ETL completo  
- ✔ EDA documentado  
- ✔ Modelos entrenados y evaluados  
- ✔ Modelo final seleccionado  
- ✔ Modelo serializado  
- ⏳ Microservicio Python (en desarrollo)  
- ⏳ Interpretabilidad avanzada (SHAP)

---

## 🛠️ Tecnologías utilizadas

- Python 3.10+
- Pandas
- NumPy
- Matplotlib / Seaborn
- Scikit-learn
- Joblib
- SHAP (en progreso)

---

## 👥 Equipo – Data Science

- [Elida Schultz](https://www.linkedin.com/in/elida-schultz)
- [Elizabeth Garces Isaza](https://www.linkedin.com/in/ing-elizabeth-garces-isaza/)
- [Leslie Rodriguez Nuñez](https://www.linkedin.com/in/)

---

## 📌 Notas finales

Este módulo está diseñado para evolucionar hacia un entorno productivo, manteniendo trazabilidad, reproducibilidad y alineación con las necesidades del backend y del negocio.

