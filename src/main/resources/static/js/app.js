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

    const div = document.getElementById("resultadoBusqueda");

    try {
        const response = await fetch(
            `http://localhost:8080/predict/client/${id}`
        );

        if (!response.ok) {
            // Intentar leer el cuerpo como texto/JSON para obtener detalle
            let message = `Error: ${response.status} ${response.statusText}`;
            try {
                const text = await response.text();
                // si viene JSON con 'detail' mostrarlo
                try {
                    const json = JSON.parse(text);
                    if (json.detail) {
                        message = json.detail;
                    } else if (json.message) {
                        message = json.message;
                    } else {
                        message = text || message;
                    }
                } catch (e) {
                    message = text || message;
                }
            } catch (e) {
                // ignore
            }

            div.classList.remove("hidden");
            div.innerHTML = `
                <h3>Cliente ${id}</h3>
                <p class="error">${message}</p>
            `;
            return;
        }

        const result = await response.json();

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
            <p><strong>Número de perfiles:</strong> ${result.client.number_of_profiles}</p>
            <p><strong>Región:</strong> ${result.client.region}</p>
            <p><strong>Metódo de pago:</strong> ${result.client.payment_method}</p>
            <p><strong>Dispositivo:</strong> ${result.client.device}</p>
        `;
    } catch (error) {
        div.classList.remove("hidden");
        div.innerHTML = `
            <h3>Cliente ${id}</h3>
            <p class="error">Ocurrió un error al comunicarse con el servidor.</p>
        `;
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
            number_of_profiles: parseInt(
                document.getElementById("number_of_profiles").value),
            region: document.getElementById("region").value,
            payment_method: document.getElementById("payment_method").value,
            device: document.getElementById("device").value
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
        console.error("Error cargando gráficas:", error);
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

    const canvas = document.getElementById(id);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const config = {
        type: tipo,
        data: {
            labels: datos.map(d => d.label),
            datasets: [
                {
                    label: "Churn %",
                    data: datos.map(d => d.churnProbability),
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
            scales: tipo !== "doughnut" ? {
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: value => value + "%"
                    }
                }
            } : {},
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
            data: datos.map(d => d.notChurnProbability),
            backgroundColor: "#36a2eb"
        });
    }

    charts[id] = new Chart(ctx, config);
}


// Exportar gráficos a PDF: 1 gráfico por hoja, título y logo
async function exportChartsToPDF() {
    // Asegurarse que los charts existan
    const canvasIds = ["chartRiesgo", "chartSubscription", "chartRegion", "chartAge"];

    // Acceder a jsPDF UMD (window.jspdf)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    // Cargar logo como Image
    const logoUrl = '/img/logo.png';
    const logoImg = await loadImage(logoUrl).catch(() => null);

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const filename = `Analisis_Cartera_DracoStack_Churnsight_${hh}${mm}${ss}.pdf`;

    for (let i = 0; i < canvasIds.length; i++) {
        const id = canvasIds[i];
        const canvas = document.getElementById(id);
        if (!canvas) continue;

        // Convertir canvas a dataURL PNG
        const dataUrl = canvas.toDataURL('image/png', 1.0);

        if (i > 0) doc.addPage();

        // Añadir logo en esquina superior izquierda (10pt desde bordes)
        const margin = 40; // margen en puntos
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        // logo tamaño en pt
        const logoW = 60;
        const logoH = 60;
        if (logoImg) {
            doc.addImage(logoImg, 'PNG', margin, margin - 10, logoW, logoH);
        }

        // Título principal: "Análisis Carter Clientes" centrado, color negro
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        const mainTitle = 'Análisis Carter Clientes';
        const mainTitleWidth = doc.getTextWidth(mainTitle);
        doc.text(mainTitle, (pageWidth - mainTitleWidth) / 2, margin + 15);

        // Título del gráfico: en la parte superior, en negrita y un poco más grande
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        const chartTitles = {
            'chartRiesgo': 'Churn por Género',
            'chartSubscription': 'Churn por Suscripción',
            'chartRegion': 'Churn por Región',
            'chartAge': 'Churn por Edad'
        };
        const chartTitle = chartTitles[id] || '';
        const chartTitleWidth = doc.getTextWidth(chartTitle);
        const chartTitleY = margin + 45; // justo debajo del título principal
        doc.text(chartTitle, (pageWidth - chartTitleWidth) / 2, chartTitleY);

        // Insertar la imagen del gráfico centrada
        // Calcular área disponible (restando top area y márgenes)
        const topOffset = chartTitleY + 10; // dejar algo de espacio entre título y gráfico
        const availableWidth = pageWidth - margin * 2;
        const availableHeight = pageHeight - topOffset - margin;

        // Crear imagen con tamaño proporcional
        // Primero se crea un objeto Image para obtener dimensiones
        const img = await loadImage(dataUrl).catch(() => null);
        if (img) {
            let imgW = img.width;
            let imgH = img.height;
            const ratio = Math.min(availableWidth / imgW, availableHeight / imgH);
            imgW = imgW * ratio;
            imgH = imgH * ratio;

            const x = (pageWidth - imgW) / 2;
            const y = topOffset;

            doc.addImage(dataUrl, 'PNG', x, y, imgW, imgH);

            // (antes el título del gráfico estaba debajo; ahora lo colocamos arriba)
            // Restaurar fuente normal para el resto
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
        }
    }

    doc.save(filename);
}

// cargar imagen y devolver data compatible para jsPDF (Image o dataURL)
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

