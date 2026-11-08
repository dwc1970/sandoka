let currentCategory = "cat1"; // Materia actual (cat1, cat2, cat3, cat4)
let currentSubTab = "teorico"; // Subpestaña actual ("teorico" o "practico")
let isAdmin = localStorage.getItem("protec_admin") === "true";

const categoryNames = {
    cat1: "Vinculación Socio-Productiva",
    cat2: "Enseñanza Esc. Técnica 2",
    cat3: "Práctica 2",
    cat4: "Actualización Científico Tecnológica"
};

const subTabNames = {
    teorico: "Material Teórico",
    practico: "Trabajos Prácticos"
};

// Leer la materia seleccionada desde la URL (?cat=catX)
const urlParams = new URLSearchParams(window.location.search);
const catParam = urlParams.get('cat');
if (catParam && categoryNames[catParam]) {
    currentCategory = catParam;
}

// Inicialización de la vista
window.addEventListener('DOMContentLoaded', () => {
    initView();
});

function initView() {
    updateTitles();
    if (isAdmin) {
        const uploadSection = document.getElementById("upload-section");
        if (uploadSection) uploadSection.style.display = "block";
    }
    loadFiles();
}

function updateTitles() {
    const materiaNombre = categoryNames[currentCategory];
    const headerTitleEl = document.getElementById("header-title-text");
    if (headerTitleEl) headerTitleEl.innerText = `Repositorio Protec - ${materiaNombre}`;
    
    const uploadCatNameEl = document.getElementById("upload-cat-name");
    if (uploadCatNameEl) uploadCatNameEl.innerText = `${materiaNombre} (${subTabNames[currentSubTab]})`;
    
    const subtabTitleEl = document.getElementById("subtab-title");
    if (subtabTitleEl) subtabTitleEl.innerText = subTabNames[currentSubTab];

    // Marcar visualmente la subpestaña activa
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    const activeTabBtn = document.getElementById(`tab-${currentSubTab}`);
    if (activeTabBtn) activeTabBtn.classList.add("active");
}

function switchSubTab(subTab) {
    currentSubTab = subTab;
    updateTitles();
    loadFiles();
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return { icon: 'fa-file-pdf', class: 'icon-pdf' };
    if (['doc', 'docx'].includes(ext)) return { icon: 'fa-file-word', class: 'icon-word' };
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return { icon: 'fa-file-image', class: 'icon-image' };
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext)) return { icon: 'fa-file-video', class: 'icon-video' };
    return { icon: 'fa-file-lines', class: 'icon-generic' };
}

// Cargar archivos desde el archivo datos.json filtrando por Materia y Subpestaña
function loadFiles() {
    const grid = document.getElementById("file-grid");
    if (!grid) return;
    grid.innerHTML = "";

    fetch('../datos.json')
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar datos.json");
            return response.json();
        })
        .then(data => {
            const categoria = data[currentCategory];
            if (!categoria) {
                grid.innerHTML = `<p style='color: var(--text-muted); font-style: italic; grid-column: 1/-1; text-align: center;'>No hay categoría encontrada.</p>`;
                return;
            }

            // Seleccionar lista según la subpestaña (teorico o practico)
            const items = categoria[currentSubTab] || [];

            if (items.length === 0) {
                grid.innerHTML = `<p style='color: var(--text-muted); font-style: italic; grid-column: 1/-1; text-align: center;'>No hay archivos guardados en ${subTabNames[currentSubTab]}.</p>`;
                return;
            }

            items.forEach(file => {
                const iconData = getFileIcon(file.name);

                const card = document.createElement("div");
                card.className = "file-card";
                card.innerHTML = `
                    <div class="file-info">
                        <i class="fa-solid ${iconData.icon} file-icon ${iconData.class}"></i>
                        <span class="file-link" title="${file.name}">${file.name}</span>
                    </div>
                    <div class="file-actions">
                        <button class="action-btn" title="Ver en nueva pestaña"><i class="fa-solid fa-eye"></i></button>
                        <button class="action-btn" title="Descargar"><i class="fa-solid fa-download"></i></button>
                    </div>
                `;

                const nameSpan = card.querySelector('.file-link');
                const viewBtn = card.querySelectorAll('.action-btn')[0];
                const downloadBtn = card.querySelectorAll('.action-btn')[1];

                nameSpan.onclick = () => window.open(file.url, '_blank');
                viewBtn.onclick = () => window.open(file.url, '_blank');
                downloadBtn.onclick = () => {
                    const a = document.createElement('a');
                    a.href = file.url;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                };

                grid.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error al leer datos.json:", error);
            grid.innerHTML = `<p style='color: var(--text-muted); font-style: italic; grid-column: 1/-1; text-align: center;'>Error al cargar el repositorio de archivos.</p>`;
        });
}

function showMessage(text, type) {
    const msgBox = document.getElementById("status-msg");
    if (!msgBox) return;
    msgBox.innerText = text;
    msgBox.className = `message ${type}`;
    msgBox.style.display = "block";
    setTimeout(() => {
        msgBox.style.display = "none";
    }, 4000);
}