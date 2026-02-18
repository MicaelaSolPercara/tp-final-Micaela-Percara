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
  eventosList.innerHTML = `
    <li class="item">
      <div>
        <div><strong>🫶 Todavía no tenés turnos</strong></div>
        <div class="meta">Creá tu primer turno con el formulario de la izquierda.</div>
      </div>
    </li>
  `;
  return;
}


  eventosList.innerHTML = "";
  for (const ev of data) {
    const li = document.createElement("li");
    console.log("DEBUG evento:", ev);

    li.className = "item";

li.innerHTML = `
  <div>
    <div><strong>Turno #${ev.id}</strong></div>
    <div class="meta">
      📅 ${ev.fecha} ${ev.hora ? `• 🕒 ${ev.hora}` : ""}
      ${ev.veterinario ? `• 👩‍⚕️ ${ev.veterinario}` : ""}
    </div>
    <div style="margin-top:8px;">
      ${ev.descripcion || ""}
    </div>
  </div>

  <div style="display:flex; gap:8px;">
    <button class="btn-ghost" data-action="edit" data-id="${ev.id}">Editar</button>
    <button class="btn-danger" data-action="delete" data-id="${ev.id}">Eliminar</button>
  </div>
`;


li.querySelector('[data-action="delete"]').addEventListener("click", async () => {
  await deleteEvento(ev.id);
});

li.querySelector('[data-action="edit"]').addEventListener("click", () => {
  renderEditMode(li, ev);
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

function renderEditMode(li, ev) {
  li.className = "item";

  li.innerHTML = `
    <div style="width:100%;">
      <div><strong>Editando turno #${ev.id}</strong></div>

      <div class="row two" style="margin-top:10px;">
        <div>
          <label>Fecha</label>
          <input id="edit-fecha-${ev.id}" type="date" />
        </div>
        <div>
          <label>Hora</label>
          <input id="edit-hora-${ev.id}" type="time" />
        </div>
      </div>

      <div style="margin-top:10px;">
        <label>Veterinario</label>
        <input id="edit-vet-${ev.id}" type="text" />
      </div>

      <div style="margin-top:10px;">
        <label>Descripción</label>
        <input id="edit-desc-${ev.id}" type="text" />
      </div>

      <div class="meta" style="margin-top:10px;">
        Tip: editá y tocá “Guardar”.
      </div>
    </div>

    <div style="display:flex; flex-direction:column; gap:8px;">
      <button class="btn-primary" data-action="save" data-id="${ev.id}">Guardar</button>
      <button class="btn-ghost" data-action="cancel" data-id="${ev.id}">Cancelar</button>
    </div>
  `;

  // ✅ Setear valores DESPUÉS (más robusto)
  document.getElementById(`edit-fecha-${ev.id}`).value = toDateInputValue(ev.fecha);
document.getElementById(`edit-hora-${ev.id}`).value = ev.hora || toTimeInputValue(ev.fecha);

  document.getElementById(`edit-vet-${ev.id}`).value = ev.veterinario || "";
  document.getElementById(`edit-desc-${ev.id}`).value = ev.descripcion || "";

  li.querySelector('[data-action="cancel"]').addEventListener("click", () => {
    loadEventos();
  });

  li.querySelector('[data-action="save"]').addEventListener("click", async () => {
    let nuevaFecha = document.getElementById(`edit-fecha-${ev.id}`).value;
let nuevaHora = document.getElementById(`edit-hora-${ev.id}`).value;

// Si por formato o por no tocarlo quedó vacío, usamos el valor existente
if (!nuevaFecha) nuevaFecha = ev.fecha || "";
if (!nuevaHora) nuevaHora = ev.hora || "";

    const nuevoVet = document.getElementById(`edit-vet-${ev.id}`).value;
    const nuevaDesc = document.getElementById(`edit-desc-${ev.id}`).value;

    const updates = {
      fecha: nuevaFecha,
      hora: nuevaHora,
      veterinario: nuevoVet,
      descripcion: nuevaDesc,
    };
if (!nuevaFecha || !nuevaHora) {
  alert("❌ Fecha y hora son obligatorias.");
  return;
}

    const res = await apiFetch(`/api/eventos/${ev.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(`❌ Error al guardar: ${data.message || "Error"}`);
      return;
    }

    await loadEventos();
  });
}


function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toDateInputValue(isoString) {
  // "2026-02-14T02:26:00.000Z" -> "2026-02-14"
  if (!isoString) return "";
  return String(isoString).slice(0, 10);
}

function toTimeInputValue(isoString) {
 
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}


// --- Init ---
loadEventos();
