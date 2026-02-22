document.addEventListener("DOMContentLoaded", () => {
  // ===== ELEMENTOS =====
  const userNameEl = document.getElementById("userName");
  const userRoleEl = document.getElementById("userRole");
  const logoutBtn = document.getElementById("logoutBtn");

  const searchInput = document.getElementById("searchInput");
  const refreshBtn = document.getElementById("refreshBtn");
  const newBtn = document.getElementById("newBtn");
  const newUserBtn = document.getElementById("newUserBtn");

  const statTotal = document.getElementById("statTotal");
  const statHoy = document.getElementById("statHoy");
  const statSemana = document.getElementById("statSemana");
  const panelHint = document.getElementById("panelHint");

  const tbody = document.getElementById("tbody");
  const emptyState = document.getElementById("emptyState");

  // Modal turno
  const modal = document.getElementById("modal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const createForm = document.getElementById("createForm");
  const formError = document.getElementById("formError");

  const mascotaIdInput = document.getElementById("mascotaId");
  const veterinarioIdInput = document.getElementById("veterinarioId");
  const fechaInput = document.getElementById("fecha");
  const horaInput = document.getElementById("hora");
  const descripcionInput = document.getElementById("descripcion");

  // Modal usuario
  const userModal = document.getElementById("userModal");
  const closeUserModalBtn = document.getElementById("closeUserModalBtn");
  const cancelUserBtn = document.getElementById("cancelUserBtn");
  const createUserForm = document.getElementById("createUserForm");
  const userFormError = document.getElementById("userFormError");

  const userNameInput = document.getElementById("userNameInput");
  const userEmailInput = document.getElementById("userEmailInput");
  const userPasswordInput = document.getElementById("userPasswordInput");
  const userRoleInput = document.getElementById("userRoleInput");

  // ===== HELPERS =====
  function getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  function clearToken() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  }

  function decodeJwtPayload(token) {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Token inválido");

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  }

  function roleLabel(roleId) {
    if (Number(roleId) === 1) return "Administrador";
    if (Number(roleId) === 2) return "Veterinario";
    return "Dueño";
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function show(el, shouldShow) {
    if (!el) return;
    el.classList.toggle("hidden", !shouldShow);
  }

  function parseDate(raw) {
    if (!raw) return null;
    // soporta "YYYY-MM-DD HH:mm:ss" y "YYYY-MM-DDTHH:mm:ssZ"
    const normalized = String(raw).includes("T") ? String(raw) : String(raw).replace(" ", "T");
    const d = new Date(normalized);
    if (isNaN(d.getTime())) return null;
    return d;
  }

  function formatDateTime(raw) {
    const d = parseDate(raw);
    if (!d) return raw ?? "—";
    const date = d.toLocaleDateString("es-AR");
    const time = d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    return `${date} ${time}`;
  }

  function toDateInputValue(raw) {
    const d = parseDate(raw);
    if (!d) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function toTimeInputValue(raw) {
    const d = parseDate(raw);
    if (!d) return "";
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${min}`;
  }

  async function safeRead(res) {
    const ct = res.headers.get("content-type") || "";
    const isJson = ct.includes("application/json");
    if (isJson) return await res.json().catch(() => ({}));
    return await res.text().catch(() => "");
  }

  async function api(path, options = {}) {
    const token = getToken();
    if (!token) {
      clearToken();
      window.location.href = "/";
      return;
    }

    const res = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    const body = await safeRead(res);

    if (res.status === 401) {
      clearToken();
      window.location.href = "/";
      return;
    }

    if (!res.ok) {
  let msg = `Error (status ${res.status})`;

  if (body) {
    if (typeof body === "string" && body.trim()) msg = body;
    else if (body.message) msg = body.message;
    else if (Array.isArray(body.errors) && body.errors.length) {
      // express-validator suele devolver { errors: [{ msg, path, ...}] }
      msg = body.errors.map(e => `${e.path || "campo"}: ${e.msg}`).join(" | ");
    }
  }

  const err = new Error(msg);
  err.status = res.status;
  throw err;
}

    return body;
  }

  // Normaliza eventos venga como venga (camelCase o snake_case)
  function normalizeEvento(ev) {
  if (!ev || typeof ev !== "object") return ev;

  const mascotaId =
    ev.mascotaId ?? ev.mascota_id ?? ev.id_mascota ?? ev.mascotaID ?? ev.mascota;

  const veterinarioId =
    ev.veterinarioId ?? ev.veterinario_id ?? ev.id_veterinario ?? ev.veterinarioID ?? ev.veterinario;

  const fecha =
    ev.fecha ?? ev.fechaHora ?? ev.fecha_hora ?? ev.datetime ?? ev.dateTime;

  return {
    ...ev,
    id: ev.id ?? ev.eventoId ?? ev.evento_id,
    mascotaId: mascotaId != null && mascotaId !== "" ? Number(mascotaId) : null,
    veterinarioId: veterinarioId != null && veterinarioId !== "" ? Number(veterinarioId) : null,
    descripcion: ev.descripcion ?? ev.detalle ?? ev.descripcion_turno,
    fecha: fecha ?? ev.fecha,
  };
}

  // ===== AUTH INIT =====
  const token = getToken();
  if (!token) {
    window.location.href = "/";
    return;
  }

  let payload;
  try {
    payload = decodeJwtPayload(token);
  } catch {
    clearToken();
    window.location.href = "/";
    return;
  }

  if (userNameEl) userNameEl.textContent = payload.email || "Usuario";
  if (userRoleEl) userRoleEl.textContent = roleLabel(payload.roleId);

  // Admin: mostrar botón nuevo usuario
  if (Number(payload.roleId) === 1 && newUserBtn) newUserBtn.classList.remove("hidden");

  // Dueño: bloquear acciones de escritura
  const isDueno = Number(payload.roleId) === 3;
  if (isDueno && newBtn) {
    newBtn.disabled = true;
    newBtn.title = "Como dueño no podés crear turnos";
    newBtn.style.opacity = "0.65";
    newBtn.style.cursor = "not-allowed";
  }

  // Logout
  logoutBtn?.addEventListener("click", () => {
    clearToken();
    window.location.href = "/";
  });

  // ===== DATA + UI =====
  let allEventos = [];
  let filteredEventos = [];

  function applyFilter() {
    const q = (searchInput?.value || "").trim().toLowerCase();

    if (!q) {
      filteredEventos = [...allEventos];
      render();
      return;
    }

    filteredEventos = allEventos.filter((ev) => {
      const blob = [
        ev.id,
        ev.mascotaId,
        ev.veterinarioId,
        ev.descripcion,
        ev.fecha,
      ]
        .map((x) => String(x ?? ""))
        .join(" ")
        .toLowerCase();

      return blob.includes(q);
    });

    render();
  }

  function calcStats(events) {
    const now = new Date();

    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);

    const endToday = new Date(now);
    endToday.setHours(23, 59, 59, 999);

    const endWeek = new Date(startToday);
    endWeek.setDate(endWeek.getDate() + 7);
    endWeek.setHours(23, 59, 59, 999);

    let hoy = 0;
    let semana = 0;

    for (const ev of events) {
      const d = parseDate(ev.fecha);
      if (!d) continue;
      if (d >= startToday && d <= endToday) hoy++;
      if (d >= startToday && d <= endWeek) semana++;
    }

    if (statTotal) statTotal.textContent = String(events.length);
    if (statHoy) statHoy.textContent = String(hoy);
    if (statSemana) statSemana.textContent = String(semana);
  }

  // ====== MODAL TURNO (CREATE/EDIT) ======
  let editingId = null;

  function openModal(mode) {
    show(modal, true);
    if (formError) formError.textContent = "";

    const h3 = modal?.querySelector(".modal__head h3");
    if (h3) h3.textContent = mode === "edit" ? "Editar turno" : "Nuevo turno";
  }

  function closeModal() {
    show(modal, false);
    editingId = null;
    createForm?.reset();
    if (formError) formError.textContent = "";
  }

  newBtn?.addEventListener("click", () => {
    if (newBtn.disabled) return;
    editingId = null;
    openModal("create");
  });

  closeModalBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);
  modal?.querySelector(".modal__backdrop")?.addEventListener("click", closeModal);

  createForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (formError) formError.textContent = "";

    try {
      if (isDueno) throw new Error("No tenés permisos para crear/modificar turnos.");

      const mascotaId = Number(mascotaIdInput?.value);
      const veterinarioId = Number(veterinarioIdInput?.value);
      const fecha = (fechaInput?.value || "").trim(); // YYYY-MM-DD
      const hora = (horaInput?.value || "").trim();   // HH:mm
      const descripcion = (descripcionInput?.value || "").trim();

      if (!mascotaId || !veterinarioId || !fecha || !hora || !descripcion) {
        throw new Error("Completá todos los campos.");
      }

      const body = { mascotaId, veterinarioId, fecha, hora, descripcion };

      if (editingId) {
        await api(`/api/eventos/${encodeURIComponent(editingId)}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
      } else {
        await api("/api/eventos", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }

      closeModal();
      await loadEventos();
    } catch (err) {
      if (formError) formError.textContent = err?.message || "No se pudo guardar el turno.";
    }
  });

  // ===== MODAL USUARIO (ADMIN) =====
  function openUserModal() {
    show(userModal, true);
    if (userFormError) userFormError.textContent = "";
  }

  function closeUserModal() {
    show(userModal, false);
    createUserForm?.reset();
    if (userFormError) userFormError.textContent = "";
  }

  newUserBtn?.addEventListener("click", openUserModal);
  closeUserModalBtn?.addEventListener("click", closeUserModal);
  cancelUserBtn?.addEventListener("click", closeUserModal);
  userModal?.querySelector(".modal__backdrop")?.addEventListener("click", closeUserModal);

  createUserForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (userFormError) userFormError.textContent = "";

    try {
      if (Number(payload.roleId) !== 1) throw new Error("No autorizado.");

      const name = (userNameInput?.value || "").trim();
      const email = (userEmailInput?.value || "").trim();
      const password = userPasswordInput?.value || "";
      const roleId = Number(userRoleInput?.value);

      if (!name || !email || !password || !roleId) {
        throw new Error("Completá todos los campos.");
      }

      await api("/api/users", {
  method: "POST",
  body: JSON.stringify({ name, email, password, roleId }),
});

      closeUserModal();
      alert("Usuario creado correctamente.");
    } catch (err) {
      if (userFormError) userFormError.textContent = err?.message || "No se pudo crear el usuario.";
    }
  });

  // ===== RENDER TABLA =====
  function render() {
    if (!tbody) return;

    tbody.innerHTML = "";
    calcStats(allEventos);

    if (panelHint) panelHint.textContent = `Mostrando ${filteredEventos.length} de ${allEventos.length}`;

    if (filteredEventos.length === 0) {
      show(emptyState, true);
      return;
    }

    show(emptyState, false);

    for (const ev of filteredEventos) {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${escapeHtml(ev.id ?? "—")}</td>
        <td>${escapeHtml(ev.mascotaId ?? "—")}</td>
        <td>${escapeHtml(ev.veterinarioId ?? "—")}</td>
        <td>${escapeHtml(ev.descripcion ?? "—")}</td>
        <td>${escapeHtml(formatDateTime(ev.fecha))}</td>
        <td class="right">
          <div class="actions">
            <button class="iconBtn" type="button" data-action="edit" data-id="${escapeHtml(ev.id)}" title="Editar" ${isDueno ? "disabled" : ""}>
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="iconBtn dangerBtn" type="button" data-action="delete" data-id="${escapeHtml(ev.id)}" title="Eliminar" ${isDueno ? "disabled" : ""}>
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    }
  }

  async function loadEventos() {
    const data = await api("/api/eventos", { method: "GET" });

    const raw = Array.isArray(data) ? data : (data?.eventos || []);
    const eventos = raw.map(normalizeEvento);

    allEventos = eventos;
    filteredEventos = [...allEventos];
    render();
  }

  // ===== ACCIONES (EDIT/DELETE) =====
  tbody?.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    if (!id) return;

    const ev = allEventos.find((x) => String(x.id) === String(id));

    if (action === "edit") {
      if (isDueno) return;
      if (!ev) return;

      editingId = id;

      // precargar inputs
      mascotaIdInput.value = ev.mascotaId ?? "";
      veterinarioIdInput.value = ev.veterinarioId ?? "";
      descripcionInput.value = ev.descripcion ?? "";
      fechaInput.value = toDateInputValue(ev.fecha);
      horaInput.value = toTimeInputValue(ev.fecha);

      openModal("edit");
      return;
    }

    if (action === "delete") {
      if (isDueno) return;

      const ok = confirm(`¿Eliminar el turno #${id}?`);
      if (!ok) return;

      try {
        await api(`/api/eventos/${encodeURIComponent(id)}`, { method: "DELETE" });
        await loadEventos();
      } catch (err) {
        alert(err?.message || "No se pudo eliminar.");
      }
    }
  });

  // ===== SEARCH + REFRESH =====
  searchInput?.addEventListener("input", applyFilter);

  refreshBtn?.addEventListener("click", async () => {
    await loadEventos();
    if (searchInput) searchInput.value = "";
    filteredEventos = [...allEventos];
    render();
  });

  // ===== INIT =====
  (async () => {
    try {
      await loadEventos();
    } catch (err) {
      alert(err?.message || "Error cargando turnos.");
    }
  })();
});