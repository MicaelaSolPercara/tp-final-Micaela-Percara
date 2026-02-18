const API_BASE = "http://localhost:3000";

const logoutBtn = document.getElementById("logoutBtn");
const createForm = document.getElementById("createForm");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const veterinario = document.getElementById("veterinario");
const descripcion = document.getElementById("descripcion");
const createStatus = document.getElementById("createStatus");

const refreshBtn = document.getElementById("refreshBtn");
const eventosList = document.getElementById("eventosList");

// --- Token helpers ---
function getToken() {
  return localStorage.getItem("token");
}

function clearToken() {
  localStorage.removeItem("token");
}

// Si no hay token, volvemos a auth
if (!getToken()) {
  window.location.href = "./index.html";
}

// --- API helpers ---
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = options.headers ? { ...options.headers } : {};

  headers["Authorization"] = `Bearer ${token}`;

  return fetch(`${API_BASE}${path}`, { ...options, headers });
}

// --- Logout ---
logoutBtn.addEventListener("click", () => {
  clearToken();
  window.location.href = "./index.html";
});

// --- Listar eventos ---
async function loadEventos() {
  eventosList.innerHTML = "<li>Cargando...</li>";

  const res = await apiFetch("/api/eventos", { method: "GET" });
  const data = await res.json().catch(() => ([]));

  if (!res.ok) {
    // Si el token expiró o es inválido, volvemos a auth
    if (res.status === 401 || res.status === 403) {
      clearToken();
      window.location.href = "./index.html";
      return;
    }

    eventosList.innerHTML = `<li>❌ Error al cargar: ${data.message || "Error"}</li>`;
    return;
  }

  if (data.length === 0) {
    eventosList.innerHTML = "<li>No hay eventos todavía.</li>";
    return;
  }

  eventosList.innerHTML = "";
  for (const ev of data) {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>#${ev.id}</strong> - ${ev.fecha} - ${ev.veterinario} - ${ev.descripcion}
      <button data-id="${ev.id}">Eliminar</button>
    `;

    li.querySelector("button").addEventListener("click", async () => {
      await deleteEvento(ev.id);
    });

    eventosList.appendChild(li);
  }
}

refreshBtn.addEventListener("click", loadEventos);

// --- Crear evento ---
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  createStatus.textContent = "Creando...";

  const res = await apiFetch("/api/eventos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fecha: fecha.value,
      hora: hora.value,
      veterinario: veterinario.value,
      descripcion: descripcion.value,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      clearToken();
      window.location.href = ".app.html";
      return;
    }

    createStatus.textContent = `❌ Error: ${data.message || "No se pudo crear"}`;
    return;
  }

  createStatus.textContent = "✅ Evento creado";
  createForm.reset();
  await loadEventos();
});

// --- Eliminar evento ---
async function deleteEvento(id) {
  const res = await apiFetch(`/api/eventos/${id}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      clearToken();
      window.location.href = "./index.html";
      return;
    }

    alert(`❌ Error al eliminar: ${data.message || "Error"}`);
    return;
  }

  await loadEventos();
}

// --- Init ---
loadEventos();
