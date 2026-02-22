// public/index.js

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorBox = document.getElementById("errorBox");
const submitBtn = document.getElementById("submitBtn");
const togglePasswordBtn = document.getElementById("togglePassword");

const rememberInput = document.getElementById("remember"); // puede ser null

function setError(message) {
  errorBox.textContent = message || "";
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.style.opacity = isLoading ? "0.75" : "1";
}

togglePasswordBtn?.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  const icon = togglePasswordBtn.querySelector(".material-symbols-outlined");
  if (icon) icon.textContent = isPassword ? "visibility_off" : "visibility";
});

async function safeReadResponse(res) {
  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  if (isJson) return await res.json().catch(() => ({}));
  return await res.text().catch(() => "");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError("");

  const email = (emailInput.value || "").trim();
  const password = passwordInput.value || "";

  if (!email || !password) {
    setError("Completá email y contraseña.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const body = await safeReadResponse(res);

    if (!res.ok) {
      const msg =
        (body && body.message) ? body.message :
        (typeof body === "string" && body) ? body :
        "No se pudo iniciar sesión.";
      setError(`${msg} (status ${res.status})`);
      return;
    }

    const token = body.token || body.jwt || body.accessToken;
    if (!token) {
      setError("Login OK pero no recibí token en la respuesta.");
      return;
    }

    const shouldRemember = rememberInput ? !!rememberInput.checked : false;
    const storage = shouldRemember ? localStorage : sessionStorage;

    storage.setItem("token", token);

    // ✅ IMPORTANTE: la página es eventos.html
    window.location.href = "/eventos.html";
  } catch (err) {
    console.error(err);
    setError(`Error: ${err?.message || "No pude conectar con el servidor"}`);
  } finally {
    setLoading(false);
  }
});