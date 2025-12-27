# 🐉 DracoStack - ChurnInsight API

<p align="center">
<<<<<<< HEAD
=======
  <img src="assets/logo.png" alt="DracoStack Logo" width="350"/>
</p>

<p align="center">
>>>>>>> 4613890 (Carpeta equipo data)
  <strong>API REST desarrollada en Spring Boot para el análisis predictivo de churn (cancelación de clientes)</strong>
</p>

<p align="center">
  Este backend sirve como puente entre la base de datos y el microservicio de Data Science para predecir la probabilidad de que un cliente cancele su servicio.
</p>

<p align="center">
  Proyecto desarrollado para hackathon por el equipo <strong>DracoStack</strong>
</p>

## Tabla de Contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Endpoints](#-endpoints)
- [Validaciones](#-validaciones)
- [Manejo de Errores](#-manejo-de-errores)
- [Docker](#-docker)
- [Roadmap](#-roadmap)
- [Equipo](#-equipo)

## Descripción

ChurnInsight es un sistema de predicción de churn que permite a las empresas identificar clientes con alta probabilidad de cancelación. El backend se encarga de:

- Recibir solicitudes de predicción vía REST
- Validar datos de entrada
- Comunicarse con el microservicio de Python (Data Science)
- Gestionar la persistencia de datos
- Manejar errores de forma centralizada

## Arquitectura

```
┌─────────────┐  ┌─────────────────┐ ┌─────────────────┐
│ Cliente     │───▶│ ChurnInsight │───▶│ Microservicio │
│             │    │ API (Spring) │    │ (Python)      │
└─────────────┘    └────────┬────────┘ └─────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Base de Datos   │
                   │ (TBD)           │
                   └─────────────────┘
```

## Estructura del Proyecto

```
src/main/java/com/churninsight/api
├── controller
│   └── PredictionController.java     # Endpoints REST (/predict)
├── dto
│   ├── PredictionRequestDTO.java     # Datos de entrada + validaciones
│   └── PredictionResponseDTO.java    # Respuesta de predicción
├── exception
│   └── ApiExceptionHandler.java      # Manejo global de errores
└── service
    └── PredictionService.java        # Lógica de negocio
```

| Capa | Responsabilidad |
|------|-----------------|
| **Controller** | Recibir peticiones HTTP y delegar al service |
| **DTO** | Objetos de transferencia con validaciones |
| **Service** | Lógica de negocio y comunicación con microservicio |
| **Exception** | Manejo centralizado de errores |

## Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Java | 17 | Lenguaje base |
| Spring Boot | 3.5.8 | Framework principal |
| Spring Validation | - | Validación de DTOs |
| Lombok | 1.18.32 | Reducción de boilerplate |
| Maven | 3.x | Gestión de dependencias |
| Docker | Latest | Contenedorización |

## Requisitos Previos

- Java 17 o superior
- Maven 3.6+
- Docker y Docker Compose (opcional)
- IDE de preferencia (IntelliJ IDEA recomendado para Lombok)

## Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/dracostack/churninsight-api.git
cd churninsight-api
```

2. **Compilar el proyecto**
```bash
mvn clean install
```

3. **Ejecutar la aplicación**
```bash
mvn spring-boot:run
```

La API estará disponible en http://localhost:8080

## Configuración

**application.properties**

```properties
server.port=8080

# Base de datos (pendiente de configurar)
# spring.datasource.url=
# spring.datasource.username=
# spring.datasource.password=

# Microservicio Python (pendiente de configurar)
# python.microservice.url=http://localhost:5000/predict
```

⚠️ **Nota**: Las variables de entorno se definirán una vez configurada la base de datos y el microservicio de Python.

## Endpoints

### Health Check
```http
GET /predict/test
```

**Response:**
```text
API OK
```

### Predicción de Churn
```http
POST /predict
Content-Type: application/json
```

**Request Body:**
```json
{
  "tiempoContratoMeses": 12,
  "retrasosPago": 2,
  "usoMensual": 14.5,
  "plan": "Premium"
}
```

**Response Exitoso (200):**
```json
{
  "prevision": "Va a cancelar",
  "probabilidad": 0.75
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| prevision | String | Predicción: "Va a cancelar" / "Va a continuar" |
| probabilidad | Double | Probabilidad de la predicción (0.0 - 1.0) |

## Validaciones

El DTO de entrada cuenta con las siguientes validaciones:

| Campo | Tipo | Reglas | Mensajes de Error |
|-------|------|--------|-------------------|
| tiempoContratoMeses | Integer | @NotNull, @Min(0) | "El tiempo de contrato es obligatorio" / "El tiempo de contrato no puede ser negativo" |
| retrasosPago | Integer | @NotNull, @Min(0) | "Los retrasos de pago son obligatorios" / "Los retrasos no pueden ser negativos" |
| usoMensual | Double | @NotNull, @Positive | "El uso mensual es obligatorio" / "El uso mensual debe ser mayor a cero" |
| plan | String | @NotBlank | "El plan es obligatorio" |

## Manejo de Errores

La API cuenta con manejo centralizado de excepciones:

### Error de Validación (400)
```json
{
  "tiempoContratoMeses": "El tiempo de contrato es obligatorio",
  "plan": "El plan es obligatorio"
}
```

### Error Interno (500)
```json
"Error interno del servidor"
```

## Docker

### Dockerfile (ejemplo)
```dockerfile
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
COPY target/churninsight-api-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Construir imagen
```bash
mvn clean package -DskipTests
docker build -t churninsight-api .
```

### Ejecutar contenedor
```bash
docker run -p 8080:8080 churninsight-api
```

### Docker Compose (próximamente)
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
    # depends_on:
    #   - database
    #   - python-ml
```

## Roadmap

- [x] Estructura base del proyecto
- [x] Endpoint de predicción
- [x] Validaciones de entrada
- [x] Manejo global de excepciones
- [ ] Integración con base de datos
- [ ] Conexión con microservicio Python (ML)
- [ ] Autenticación y autorización
- [ ] Documentación con Swagger/OpenAPI
- [ ] Tests unitarios e integración
- [ ] CI/CD pipeline
- [ ] Merge con documentación de Data Science

## Equipo DracoStack

Este proyecto es desarrollado en colaboración por:

### Backend (API REST, integración, persistencia)
- [Hernán Cerda](https://www.linkedin.com/in/hernán-ignacio-cerda-bustíos-60050b52/)
- [Silvia Hernández](https://www.linkedin.com/in/silvia-hernández-márquez-85597b341/)
- [Aldo Sánchez](https://www.linkedin.com/in/aldosanchezdev/)

### Data Science (Modelo predictivo, microservicio Python)
- [Elida Schultz](https://www.linkedin.com/in/elida-schultz)
- [Rosa Isela López García](https://www.linkedin.com/in/iseladatamaven/)
- [Elizabeth Garces Isaza](https://www.linkedin.com/in/ing-elizabeth-garces-isaza/)

---

🐉 **DracoStack** - Prediciendo el futuro de tus clientes

<<<<<<< HEAD
*Proyecto ChurnInsight - Hackathon One 2025*
=======
*Proyecto ChurnInsight - Hackathon One 2025*
>>>>>>> 4613890 (Carpeta equipo data)
