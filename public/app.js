const API_BASE = "http://localhost:3000";

const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginStatus = document.getElementById("loginStatus");
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

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

function updateAuthUI() {
  const token = getToken();
  if (token) {
    loginStatus.textContent = "✅ Sesión iniciada";
    logoutBtn.style.display = "inline-block";
  } else {
    loginStatus.textContent = "⚠️ No logueada";
    logoutBtn.style.display = "none";
  }
}

// --- API helpers ---
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = options.headers ? { ...options.headers } : {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE}${path}`, { ...options, headers });
}

// --- Login ---
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginStatus.textContent = "Ingresando...";

  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    loginStatus.textContent = `❌ Error: ${data.message || "No se pudo loguear"}`;
    return;
  }

  setToken(data.token);
  updateAuthUI();
  await loadEventos();
});

// --- Logout ---
logoutBtn.addEventListener("click", () => {
  clearToken();
  updateAuthUI();
  eventosList.innerHTML = "";
});

// --- Listar eventos ---
async function loadEventos() {
  const token = getToken();
  if (!token) {
    eventosList.innerHTML = "<li>⚠️ Iniciá sesión para ver tus eventos</li>";
    return;
  }

  eventosList.innerHTML = "<li>Cargando...</li>";

  const res = await apiFetch("/api/eventos", { method: "GET" });
  const data = await res.json().catch(() => ([]));

  if (!res.ok) {
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

    const btn = li.querySelector("button");
    btn.addEventListener("click", async () => {
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
    alert(`❌ Error al eliminar: ${data.message || "Error"}`);
    return;
  }

  await loadEventos();
}

// --- Init ---
updateAuthUI();
loadEventos();
