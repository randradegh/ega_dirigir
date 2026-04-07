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

const MODALIDAD_LABELS = {
  individual: "Individual — uso personal",
  "corporativo-5": "Corporativo — 5 a 10 personas",
  "corporativo-mas": "Corporativo — más de 10 personas",
};

const HERRAMIENTA_LABELS = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  claude: "Claude",
  varias: "Varias",
  ninguna: "Todavía no uso ninguna",
};

function labelModalidad(value) {
  return MODALIDAD_LABELS[value] || value || "—";
}

function labelHerramienta(value) {
  return HERRAMIENTA_LABELS[value] || value || "—";
}

function buildRegistrationEmailMessage({
  nombre,
  apellido,
  email,
  empresa,
  cargo,
  modalidadKey,
  herramientaKey,
  pageUrl,
}) {
  const line = "────────────────────────────────────────";
  const fullName = `${nombre} ${apellido}`.trim();
  const sentAt = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date());

  return [
    "NUEVA INSCRIPCIÓN · DIRIGIR INTELIGENCIAS",
    line,
    "",
    "CONTACTO",
    `  Nombre completo     ${fullName}`,
    `  Correo              ${email}`,
    "",
    "ORGANIZACIÓN",
    `  Empresa u org.      ${empresa || "—"}`,
    `  Cargo o rol         ${cargo || "—"}`,
    "",
    "INTERÉS EN EL PROGRAMA",
    `  Modalidad           ${labelModalidad(modalidadKey)}`,
    `  Herramienta IA      ${labelHerramienta(herramientaKey)}`,
    "",
    line,
    `Origen del formulario: ${pageUrl}`,
    `Enviado (CDT): ${sentAt}`,
    "",
    "—",
    "Responde a este correo para contactar directamente al interesado (Reply-To: su email).",
  ].join("\n");
}

function initRegistrationForm() {
  const form = document.getElementById("reg-form");
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

    const herramientaKey = document.getElementById("herramienta")?.value ?? "";
    const modalidadKey = getVal("modalidad");
    const nombre = getVal("nombre");
    const apellido = getVal("apellido");
    const email = getVal("email");
    const empresa = getVal("empresa");
    const cargo = getVal("cargo");
    const pageUrl = window.location.href;

    const message = buildRegistrationEmailMessage({
      nombre,
      apellido,
      email,
      empresa,
      cargo,
      modalidadKey,
      herramientaKey,
      pageUrl,
    });

    const fullName = `${nombre} ${apellido}`.trim();

    const payload = {
      access_key: key,
      subject: `[Dirigir Inteligencias] ${fullName}`,
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
  initRegistrationForm();
});
