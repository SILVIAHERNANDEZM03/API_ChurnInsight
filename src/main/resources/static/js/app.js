let charts = {};

window.cambiarTab = function (btn, id) {
    document
        .querySelectorAll(".seccion")
        .forEach(sec => sec.classList.add("hidden"));

    document.getElementById(id).classList.remove("hidden");

    document
        .querySelectorAll(".tab-btn")
        .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    if (id !== "manual") {
        const formulario = document.getElementById("churnForm");
        if (formulario) {
            formulario.reset();
        }

        const resultadoDiv = document.getElementById("resultado");
        if (resultadoDiv) {
            resultadoDiv.classList.add("hidden");
            resultadoDiv.innerHTML = "";
        }

        const apiPreview = document.getElementById("apiPreview");
        if (apiPreview) {
            apiPreview.textContent =
                "Llenar el formulario para ver la petición...";
        }
    }

    if (id === "stats") {
        cargarGraficas();
    }
};


/*BÚSQUEDA DE CLIENTE*/
async function buscarCliente() {
    const id = document.getElementById("clientId").value;

    if (!id) {
        alert("Ingresa un ID");
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:8080/predict/client/${id}`
        );
        const result = await response.json();

        const div = document.getElementById("resultadoBusqueda");
        div.classList.remove("hidden");

        div.innerHTML = `
            <h3>Resultado Cliente ${id}</h3>
            <p><strong>Predicción:</strong> ${
                result.prediction === 1 ? "Cancela" : "No Cancela"
            }</p>
            <p><strong>Probabilidad:</strong> ${
                (result.probability * 100).toFixed(2)
            }%</p>
            <hr>
            <h4>📋 Perfil del Cliente</h4>
            <p><strong>Edad:</strong> ${result.client.age}</p>
            <p><strong>Género:</strong> ${result.client.gender}</p>
            <p><strong>Suscripción:</strong> ${result.client.subscription_type}</p>
            <p><strong>Horas de Visualización:</strong> ${result.client.watch_hours}</p>
            <p><strong>Días desde último Login:</strong> ${result.client.last_login_days}</p>
            <p><strong>Región:</strong> ${result.client.region}</p>
        `;
    } catch (error) {
        alert("Error al buscar cliente");
    }
}


/*FORMULARIO MANUAL */
document
    .getElementById("churnForm")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = {
            age: parseInt(document.getElementById("age").value),
            gender: document.getElementById("gender").value,
            subscription_type: document.getElementById("subscription_type").value,
            watch_hours: parseFloat(document.getElementById("watch_hours").value),
            last_login_days: parseInt(
                document.getElementById("last_login_days").value
            ),
            region: document.getElementById("region").value
        };

        // Preview API
        document.getElementById("apiPreview").textContent =
            `POST /predict\nContent-Type: application/json\n\n` +
            JSON.stringify(data, null, 2);

        try {
            const response = await fetch(
                "http://localhost:8080/predict",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();
            const resDiv = document.getElementById("resultado");

            resDiv.classList.remove("hidden");
            resDiv.innerHTML = `
                <h3>Resultado</h3>
                <p><strong>Predicción:</strong> ${
                    result.prediction === 1 ? "Cancela" : "No Cancela"
                }</p>
                <p><strong>Probabilidad de churn:</strong> ${
                    (result.probabilities.churn * 100).toFixed(2)
                }%</p>
            `;
        } catch (error) {
            alert("Error API");
        }
    });


/*CARGA DE GRÁFICAS*/
async function cargarGraficas() {
    try {
        const [
            genero,
            region,
            suscripcion,
            edad
        ] = await Promise.all([
            fetch("http://localhost:8080/probability/gender").then(r => r.json()),
            fetch("http://localhost:8080/probability/region").then(r => r.json()),
            fetch("http://localhost:8080/probability/subscription").then(r => r.json()),
            fetch("http://localhost:8080/probability/age").then(r => r.json())
        ]);

        dibujarGrafica(genero.data, "chartRiesgo", "bar", "Género");
        dibujarGrafica(region.data, "chartRegion", "bar", "Región", true);
        dibujarGrafica(suscripcion.data, "chartSubscription", "doughnut", "Suscripción");
        dibujarGrafica(edad.data, "chartAge", "line", "Edad");

    } catch (error) {
        console.error(error);
    }
}


/* FUNCIÓN GRÁFICA */
function dibujarGrafica(
    datos,
    id,
    tipo,
    etiqueta,
    horizontal = false
) {
    if (charts[id]) {
        charts[id].destroy();
    }

    const ctx = document.getElementById(id).getContext("2d");

    const config = {
        type: tipo,
        data: {
            labels: datos.map(d => d.label),
            datasets: [
                {
                    label: "Churn %",
                    data: datos.map(d =>
                        tipo === "doughnut"
                            ? d.churnProbability
                            : horizontal
                                ? d.churnProbability * 100
                                : d.churnProbability
                    ),
                    backgroundColor:
                        tipo === "doughnut"
                            ? ["#1e3799", "#4a69bd", "#60a3bc"]
                            : "#ff6384"
                }
            ]
        },
        options: {
            indexAxis: horizontal ? "y" : "x",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Churn por ${etiqueta}`,
                    color: "#ffffff"
                }
            }
        }
    };

    if (tipo !== "doughnut") {
        config.data.datasets.push({
            label: "No Churn %",
            data: datos.map(d =>
                horizontal
                    ? d.notChurnProbability * 100
                    : d.notChurnProbability
            ),
            backgroundColor: "#36a2eb"
        });
    }

    charts[id] = new Chart(ctx, config);
}
