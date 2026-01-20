# 🧠 ChurnInsight – Data Science

Este directorio contiene el **componente de Data Science** del proyecto **ChurnInsight**, encargado del análisis de datos, construcción, evaluación y preparación del modelo de *Machine Learning* para la **predicción de churn (cancelación de clientes)**.
Con este módulo se busca generar un modelo confiable, interpretable y listo para producción, que será consumido por la **API REST desarrollada en Spring Boot**.

---

## 🎯 Objetivo de Negocio

El objetivo del modelo de churn es **anticipar la cancelación de clientes** para permitir a la empresa:

- Implementar estrategias de retención temprana
- Reducir pérdidas de ingresos por cancelaciones no anticipadas
- Priorizar acciones comerciales sobre clientes de alto riesgo
- Optimizar campañas de fidelización basadas en datos

Desde una perspectiva de negocio, el costo de **no detectar un churner (False Negative)** es significativamente mayor que el de contactar a un cliente que no iba a cancelar, razón por la cual se priorizan métricas como *Recall* y *F2-score*.

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
- ├── data/
- │   ├── data_original.csv        # Dataset original (sin modificaciones)
- │   └── data_limpia.csv          # Dataset limpio y transformado (post-ETL)
- │
- ├── notebooks/
- │   └── ChurnInsight_ETL-ML.ipynb # ETL + EDA + Entrenamiento y evaluación de modelos
- │
- ├── models/
- │   ├── logreg_baseline.joblib   # Regresión Logística (baseline)
- │   ├── logreg_optimized.joblib  # Regresión Logística optimizada (modelo final)
- │   ├── tree_baseline.joblib     # Árbol de Decisión (baseline)
- │   ├── tree_optimized.joblib    # Árbol de Decisión optimizado
- │   ├── rf_baseline.joblib       # Random Forest (baseline)
- │   └── rf_optimized.joblib      # Random Forest optimizado
- │
- └── README.md                    # Documentación del componente de Data Science


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

## 🔐 Control de Data Leakage

Durante el desarrollo se identificaron y eliminaron variables con riesgo de *data leakage*, tales como:

- Variables derivadas directamente del target
- Información posterior al evento de churn
- Identificadores sin valor predictivo

Este control permitió:
- Evitar métricas artificialmente infladas
- Garantizar generalización del modelo
- Asegurar un comportamiento realista en producción

Las métricas finales reflejan un escenario **más cercano al mundo real**.


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
**Regresión logística**

- Accuracy ≈ 0.769  
- Precision ≈ 0.7297  
- Recall ≈ 0.8588  
- F1-score ≈ 0.7890
- F2-score ≈ 0.8295

El modelo que presentó el mejor equilibrio entre detección de churn y control de errores fue la Regresión Logística (LogReg), destacándose especialmente en la métrica F2-score, que da mayor peso al recall, clave para minimizar clientes que cancelan sin ser detectados.

## 📐 Criterio de Evaluación

Dado el contexto del problema, se priorizó la métrica **F2-score**, que otorga mayor peso al *Recall* que a la *Precision*.

### Justificación:
- **False Negatives (churn no detectado)** → pérdida directa de cliente
- **False Positives** → costo operativo asumible (contacto preventivo)

Por este motivo, el modelo seleccionado maximiza la detección de clientes en riesgo, incluso a costa de aumentar ligeramente los falsos positivos.

## ⚠️ Limitaciones

- Dataset sintético con tasa de churn ~50%, superior a escenarios reales
- No se incluyeron variables temporales o de secuencia
- El modelo no incorpora costos económicos explícitos
- No se implementó aún recalibración periódica del modelo

Estas limitaciones se consideran en el roadmap de evolución del proyecto.

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
- ✔ Microservicio Python (en desarrollo)  

---

## 🚀 Próximos Pasos

- Incorporar modelos avanzados:
  - Gradient Boosting (XGBoost, LightGBM)
- Implementar explicabilidad avanzada:
  - SHAP / LIME
- Ajuste dinámico del umbral de decisión
- Monitoreo de drift de datos y métricas
- Automatización del pipeline de entrenamiento
- Integración con dashboards de negocio

Este roadmap permitirá evolucionar el sistema hacia un entorno MLOps completo.

---

## 🛠️ Tecnologías utilizadas

- Python 3.10+
- Pandas
- NumPy
- Matplotlib / Seaborn
- Scikit-learn
- Joblib

---

## 👥 Equipo – Data Science

- [Rocio Isabel Davila Elias](https://www.linkedin.com/in/rociodavila15/)
- [Elizabeth Garces Isaza](https://www.linkedin.com/in/ing-elizabeth-garces-isaza/)
- [Leslie Rodriguez Nuñez](https://www.linkedin.com/in/leslie-rodriguez-a2679726a/)

---

## 🏁 Conclusión

El componente de Data Science de **ChurnInsight** proporciona una solución robusta, explicable y alineada con objetivos de negocio para la predicción de churn.  
El modelo seleccionado equilibra desempeño, interpretabilidad y viabilidad productiva, sentando una base sólida para su escalado e integración en entornos reales.

