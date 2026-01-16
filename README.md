<div align="center">
  <img
    src="https://github.com/user-attachments/assets/cb3f82c7-9cbc-4a10-ab12-1efc4e9a5828"
    alt="Churn Insight Logo"
    width="200"
  />
</div>

<h1 align="center">📊 Churn Insight</h1>

<h3 align="center">Plataforma de Análisis y Predicción de Cancelación de Clientes</h3>

<hr/>

<h2>🧠 Descripción del Proyecto</h2>

<p>
<b>Churn Insight</b> es una plataforma web diseñada para analizar y predecir la cancelación de clientes 
(<i>customer churn</i>) mediante modelos de Machine Learning.
</p>

<p>
El sistema permite a los usuarios realizar predicciones individuales, consultar clientes por ID
y visualizar estadísticas agregadas mediante gráficas interactivas que consumen datos en tiempo real de un modelo de IA.
</p>

<p>
El proyecto está construido bajo una arquitectura de microservicios, donde este repositorio contiene:
</p>

<ul>
    <li>Frontend Web Responsivo (Optimizado para visualización de métricas).</li>
    <li>Backend desarrollado en Spring Boot (API Gateway e Intérprete de Datos).</li>
</ul>

<p>
El modelo de Machine Learning es consumido desde un microservicio externo desarrollado en FastAPI, expuesto de forma segura mediante túneles de Cloudflare.
</p>

<hr/>

<h2>🏗️ Arquitectura del Sistema</h2>

<pre>
[ Frontend Web (HTML + CSS + JavaScript + Chart.js) ]
                    ↓ (Solicita JSON Normalizado)
[ Backend Spring Boot (API Gateway / StatsService) ]
                    ↓ (Consumo de Endpoints en Cloudflare)
[ Microservicio ML Externo (FastAPI / IA Model) ]
</pre>

<hr/>

<h2>🧩 Componentes del Proyecto</h2>

<h3>🔹 Frontend</h3>
<p>Interfaz web moderna que permite la interacción del usuario con el motor de predicción.</p>

<b>Funcionalidades:</b>
<ul>
    <li><b>Cálculo manual:</b> Formulario dinámico para predecir casos específicos.</li>
    <li><b>Búsqueda por ID:</b> Consulta rápida de perfiles de clientes y su riesgo de fuga.</li>
    <li><b>Análisis Avanzado:</b> Dashboard de estadísticas predictivas con 4 tipos de visualizaciones.</li>
    <li><b>Exportación:</b> Generación de reportes PDF detallados (1 gráfico por página).</li>
</ul>

<b>Tecnologías:</b>
<ul>
    <li>HTML5 / CSS3 (Diseño Grid para gráficas).</li>
    <li>JavaScript (ES6+).</li>
    <li>Chart.js (Visualización de datos).</li>
    <li>jsPDF (Motor de exportación).</li>
</ul>

<hr/>

<h3>🔹 Backend (Spring Boot)</h3>
<p>Actúa como el núcleo lógico que procesa, limpia y estandariza los datos provenientes del modelo de IA.</p>

<b>Responsabilidades:</b>
<ul>
    <li><b>Orquestación:</b> Gestión de peticiones hacia el microservicio externo.</li>
    <li><b>Normalización (StatsService):</b> Responsable del mapeo y estandarización del JSON recibido. Nota: hay mejoras pendientes para manejar formatos inconsistentes y tipos inesperados de forma robusta.</li>
    <li><b>Robustez:</b> Manejo de excepciones para evitar fallos en la UI si el servicio de ML presenta inconsistencias; se recomienda ampliar las validaciones a nivel de servicio para casos límite.</li>
</ul>

<b>Tecnologías:</b>
<ul>
    <li>Java 17 / Spring Boot 3.5.8.</li>
    <li>RestTemplate (Comunicación HTTP) — actualmente usado por los servicios que integran el modelo ML.</li>
    <li>Lombok (Simplificación de código).</li>
    <li>Maven (Gestión de dependencias).</li>
</ul>

<hr/>

<h2>🔌 Endpoints del Backend</h2>

<h3>📍 Predicción Individual</h3>
<ul>
    <li><b>POST /predict</b> – Procesa datos de formulario para predicción manual.</li>
    <li><b>GET /predict/client/{publicId}</b> – Obtiene el perfil y riesgo de un cliente existente (el identificador usado en la API se denomina `publicId`).</li>
</ul>

<h3>📈 Análisis Estadístico (IA)</h3>
<ul>
    <li><b>GET /probability/gender</b> – Análisis de riesgo por género.</li>
    <li><b>GET /probability/region</b> – Distribución geográfica del Churn.</li>
    <li><b>GET /probability/subscription</b> – Impacto del nivel de suscripción.</li>
    <li><b>GET /probability/age</b> – Tendencias predictivas por edad.</li>
</ul>

<hr/>

<h2>📊 Visualizaciones Integradas</h2>

<table border="1" cellpadding="8">
    <tr>
        <th>Análisis</th>
        <th>Tipo de Gráfica</th>
        <th>Origen del Dato</th>
    </tr>
    <tr>
        <td>Género</td>
        <td>Barras Verticales</td>
        <td>ML Model (Gender Endpoint)</td>
    </tr>
    <tr>
        <td>Región</td>
        <td>Barras Horizontales</td>
        <td>ML Model (Region Endpoint)</td>
    </tr>
    <tr>
        <td>Suscripción</td>
        <td>Doughnut Chart</td>
        <td>ML Model (Sub Endpoint)</td>
    </tr>
    <tr>
        <td>Edad</td>
        <td>Line Chart</td>
        <td>ML Model (Age Endpoint)</td>
    </tr>
</table>

<hr/>

<h2>🖨️ Funcionalidad de Exportación PDF</h2>

<p>Se implementó un motor de exportación en la sección <strong>Análisis Avanzado</strong>:</p>
<ul>
  <li><b>Formato:</b> Cada gráfico se exporta en alta resolución ocupando una página completa.</li>
  <li><b>Identidad:</b> Incluye logo de DracoStack y títulos en negro sólido para máxima legibilidad.</li>
  <li><b>Timestamp:</b> Los archivos se nombran con la marca de tiempo exacta (HHMMSS) para control de versiones.</li>
</ul>

<hr/>

<h2>🆕 Últimas Actualizaciones</h2>

<ul>
    <li><b>Pendiente - Fix de StatsService:</b> Implementación de mapeo seguro para campos <code>label</code> y <code>churnProbability</code> (pendiente de aplicación en el código). Se recomienda agregar pruebas unitarias que cubran formatos y tipos inconsistentes del modelo.</li>
    <li><b>Pendiente - Resiliencia de API:</b> Detección automática de formato (lista vs objeto) en la respuesta del modelo — característica planificada y en evolución.</li>
    <li><b>Diseño Responsivo:</b> Ajuste de contenedores CSS para evitar el desbordamiento de los canvas de Chart.js.</li>
    <li><b>Manejo de Errores:</b> Captura de errores 404 y 500 del microservicio ML con retroalimentación clara en el frontend.</li>
</ul>

<hr/>

## 👥 Equipo DracoStack

- **Hernán Cerda** - Backend & Integración.
- **Silvia Hernández** - Backend & Arquitectura.
- **Aldo Sánchez** - Backend & ML Connection.

<hr/>

<div align="center">
  <p><i>Este proyecto es una muestra de integración robusta entre Spring Boot y Machine Learning.</i></p>
</div>
