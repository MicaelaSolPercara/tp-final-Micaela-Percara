const API_BASE = "http://localhost:3000";

// --- Elements: Register ---
const registerForm = document.getElementById("registerForm");
const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerStatus = document.getElementById("registerStatus");

// --- Elements: Login ---
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginStatus = document.getElementById("loginStatus");

// --- Token helpers ---
function setToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

// Si ya hay token, mandamos directo al CRUD
//if (getToken()) {
  //window.location.href = "./app.html";
//}

// --- Register ---
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  registerStatus.textContent = "Registrando...";

  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: registerName.value,
      email: registerEmail.value,
      password: registerPassword.value,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    registerStatus.textContent = `❌ Error: ${data.message || "No se pudo registrar"}`;
    return;
  }

  // el backend debería devolver token
  setToken(data.token);

  registerStatus.textContent = "✅ Cuenta creada";
  window.location.href = "./app.html";
});

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

  loginStatus.textContent = "✅ Sesión iniciada";
  window.location.href = "./app.html";
});
