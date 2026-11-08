// Clave protegida en Base64 ('protec_2' codificado)
const ACCESO_HASH = "cHJvdGVjXzI=";

// Control del Splash Screen de 3 segundos
window.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
            }, 800); // Tiempo de la transición de opacidad
        }, 3000); // Se mantiene visible por 3 segundos exactos
    }
});

function toggleAuthModal() {
    const modal = document.getElementById("login-modal");
    const isAdmin = localStorage.getItem("protec_admin") === "true";

    if (isAdmin) {
        localStorage.setItem("protec_admin", "false");
        document.getElementById("auth-btn").innerHTML = '<i class="fa-solid fa-lock"></i> Acceso Contribuidor';
        showMessage("Sesión de contribuidor cerrada.", "success");
    } else {
        modal.style.display = modal.style.display === "block" ? "none" : "block";
        document.getElementById("password-input").value = "";
        document.getElementById("login-msg").style.display = "none";
    }
}

function checkPassword() {
    const input = document.getElementById("password-input").value;
    const msg = document.getElementById("login-msg");
    
    // Compara el input del usuario codificado en Base64 con el hash secreto
    if (btoa(input) === ACCESO_HASH) {
        localStorage.setItem("protec_admin", "true");
        document.getElementById("login-modal").style.display = "none";
        document.getElementById("auth-btn").innerHTML = '<i class="fa-solid fa-lock-open"></i> Salir de Modo Contribuidor';
        showMessage("Modo Contribuidor activado correctamente.", "success");
    } else {
        msg.innerText = "Clave incorrecta. Intente de nuevo.";
        msg.style.display = "block";
    }
}

function goToCategory(catId) {
    window.location.href = `mater/moon.html?cat=${catId}`;
}

function showMessage(text, type) {
    const msgBox = document.getElementById("status-msg");
    msgBox.innerText = text;
    msgBox.className = `message ${type}`;
    msgBox.style.display = "block";
    setTimeout(() => {
        msgBox.style.display = "none";
    }, 4000);
}

// Verificar estado de sesión al cargar inicio
window.onload = function() {
    const isAdmin = localStorage.getItem("protec_admin") === "true";
    if (isAdmin) {
        document.getElementById("auth-btn").innerHTML = '<i class="fa-solid fa-lock-open"></i> Salir de Modo Contribuidor';
    }
};