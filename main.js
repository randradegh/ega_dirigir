function toggleSession(header) {
  const session = header.parentElement;
  const isOpen = session.classList.contains("open");
  document.querySelectorAll(".session").forEach((item) => item.classList.remove("open"));
  if (!isOpen) session.classList.add("open");
}

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
}

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

function getWeb3FormsKey() {
  const k = typeof window !== "undefined" ? window.WEB3FORMS_ACCESS_KEY : "";
  return typeof k === "string" ? k.trim() : "";
}

function web3FormsErrorMessage(data) {
  if (!data || typeof data !== "object") return "";
  return data.body?.message || data.message || data.error || "";
}

function buildContactEmailMessage({
  nombre,
  apellido,
  email,
  empresa,
  mensaje,
  pageUrl,
}) {
  const line = "────────────────────────────────────────";
  const fullName = [nombre, apellido].filter(Boolean).join(" ").trim() || nombre || "—";
  const sentAt = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date());

  return [
    "CONSULTA / COMENTARIO · DIRIGIR INTELIGENCIAS (SOLD OUT)",
    line,
    "",
    "CONTACTO",
    `  Nombre              ${fullName}`,
    `  Correo              ${email}`,
    "",
    "ORGANIZACIÓN",
    `  Empresa u org.      ${empresa || "—"}`,
    "",
    "MENSAJE",
    mensaje || "—",
    "",
    line,
    `Origen del formulario: ${pageUrl}`,
    `Enviado (CDT): ${sentAt}`,
    "",
    "—",
    "Responde a este correo para contactar directamente (Reply-To: su email).",
  ].join("\n");
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const errorEl = document.getElementById("form-error");
  if (!form) return;

  const showConfigHint = () => {
    if (!errorEl) return;
    errorEl.hidden = false;
    errorEl.textContent =
      "Falta la clave de Web3Forms: edita form-config.js y pega tu access_key desde https://web3forms.com (es gratis y llega al correo con el que te registres).";
  };

  if (!getWeb3FormsKey()) {
    showConfigHint();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector(".form-submit");
    const getVal = (id) => (document.getElementById(id)?.value ?? "").trim();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const key = getWeb3FormsKey();
    if (!key) {
      showConfigHint();
      return;
    }

    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = "";
    }

    const nombre = getVal("nombre");
    const apellido = getVal("apellido");
    const email = getVal("email");
    const empresa = getVal("empresa");
    const mensaje = (document.getElementById("mensaje")?.value ?? "").trim();
    const pageUrl = window.location.href;

    const message = buildContactEmailMessage({
      nombre,
      apellido,
      email,
      empresa,
      mensaje,
      pageUrl,
    });

    const fullName = [nombre, apellido].filter(Boolean).join(" ").trim() || nombre;

    const payload = {
      access_key: key,
      subject: `[Dirigir Inteligencias] Consulta — ${fullName}`,
      from_name: fullName,
      email,
      message,
    };

    const prevLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";

    fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        let data = {};
        try {
          data = await res.json();
        } catch {
          throw new Error(`Respuesta inválida (${res.status})`);
        }

        const ok = res.ok && data.success === true;
        if (!ok) {
          const detail = web3FormsErrorMessage(data) || `Código ${res.status}`;
          throw new Error(detail);
        }

        document.getElementById("form-container").style.display = "none";
        document.getElementById("form-success").style.display = "block";
      })
      .catch((err) => {
        if (errorEl) {
          errorEl.textContent =
            (err?.message ? `${err.message} ` : "") +
            "Si sigue fallando, escribe a randradedev@gmail.com.";
          errorEl.hidden = false;
        }
        console.error(err);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = prevLabel;
      });
  });
}

function initSessionAccordion() {
  document.querySelectorAll(".session-header").forEach((header) => {
    header.addEventListener("click", () => toggleSession(header));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSessionAccordion();
  initScrollAnimations();
  initContactForm();
});
