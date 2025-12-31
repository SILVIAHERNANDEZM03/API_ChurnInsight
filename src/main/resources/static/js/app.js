// ---------- CAMBIO DE SECCIONES ----------
function cambiarTab(btn, id) {

    document.querySelectorAll(".seccion").forEach(sec => {
        sec.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");

    document.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.remove("active");
    });

    btn.classList.add("active");
}

// ---------- FORMULARIO CÁLCULO MANUAL ----------
document.getElementById("churnForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
        age: parseInt(document.getElementById("age").value),
        gender: document.getElementById("gender").value,
        subscription_type: document.getElementById("subscription_type").value,
        watch_hours: parseFloat(document.getElementById("watch_hours").value),
        last_login_days: parseInt(document.getElementById("last_login_days").value)
    };

    // 🔹 API Preview
    document.getElementById("apiPreview").textContent = `
POST /predict
Content-Type: application/json

{
  "age": ${data.age},
  "gender": "${data.gender}",
  "subscription_type": "${data.subscription_type}",
  "watch_hours": ${data.watch_hours},
  "last_login_days": ${data.last_login_days}
}
`;

    try {
        const response = await fetch("http://localhost:8080/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        document.getElementById("resultado").classList.remove("hidden");
        document.getElementById("resultado").innerHTML = `
            <h3>Resultado</h3>
            <p><strong>Predicción:</strong> ${result.prevision}</p>
            <p><strong>Probabilidad:</strong> ${(result.probabilidad * 100).toFixed(2)}%</p>
        `;
    } catch {
        alert("Error al conectar con la API");
    }
});

// ---------- BÚSQUEDA POR ID ----------
async function buscarCliente() {
    const id = document.getElementById("clientId").value;

    if (!id) {
        alert("Ingresa un ID de cliente");
        return;
    }

    const response = await fetch(`/predict/client/${id}`);
    const result = await response.json();

    const div = document.getElementById("resultadoBusqueda");
    div.classList.remove("hidden");
div.innerHTML = `
    <h3>Resultado Cliente ${id}</h3>

    <p><strong>Predicción:</strong> ${result.prevision}</p>
    <p><strong>Probabilidad:</strong> ${(result.probabilidad * 100).toFixed(2)}%</p>

    <hr>

    <h4>📋 Perfil del Cliente</h4>
    <p><strong>Edad:</strong> ${result.client.age}</p>
    <p><strong>Género:</strong> ${result.client.gender}</p>
    <p><strong>Suscripción:</strong> ${result.client.subscription_type}</p>
    <p><strong>Horas de visualización:</strong> ${result.client.watch_hours}</p>
    <p><strong>Días desde último login:</strong> ${result.client.last_login_days}</p>
    <p><strong>Región:</strong> ${result.client.region}</p>
`;
}

// ---------- ESTADÍSTICAS ----------
let chartRiesgo = null;
let chartMeses = null;

async function cargarGraficas() {

    const response = await fetch("http://localhost:8080/predict/stats");
    const data = await response.json();

    if (chartRiesgo) chartRiesgo.destroy();
    if (chartMeses) chartMeses.destroy();

    chartRiesgo = new Chart(document.getElementById("chartRiesgo"), {
        type: "pie",
        data: {
            labels: ["En riesgo", "No en riesgo"],
            datasets: [{
                data: [
                    data.clientesRiesgo,
                    data.clientesNoRiesgo
                ]
            }]
        }
    });

    chartMeses = new Chart(document.getElementById("chartMeses"), {
        type: "line",
        data: {
            labels: data.meses,
            datasets: [{
                label: "Probabilidad promedio",
                data: data.probabilidadPromedio
            }]
        }
    });
}

// ---------- ESTADO INICIAL ----------
document.addEventListener("DOMContentLoaded", () => {
    cambiarTab(document.querySelector(".tab-btn"), "manual");
});
