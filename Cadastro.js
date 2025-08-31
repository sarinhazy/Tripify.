 // Cadastro com redirecionamento
    const clienteForm = document.getElementById('form-cliente');
    const empresaForm = document.getElementById('form-empresa');

    function handleCadastro(event) {
      event.preventDefault();
      alert("✅ Cadastro concluído com sucesso!");
      window.location.href = "index.html"; // Redireciona para home
    }

    clienteForm.addEventListener("submit", handleCadastro);
    empresaForm.addEventListener("submit", handleCadastro);
 
 
  <footer class="footer">
    <label for="lang-select" data-i18n="languageLabel">Idioma:</label>
    <select id="lang-select">
      <option value="pt">Português 🇧🇷</option>
      <option value="en">English 🇺🇸</option>
      <option value="es">Español 🇪🇸</option>
    </select>
  </footer>

// Alterna menu no mobile
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Botão explorar
document.getElementById('explore-btn').addEventListener('click', () => {
  alert("Explorando as melhores viagens no Tripify! 🌍✈️");
});

/* ======= DICIONÁRIO DE TRADUÇÕES ======= */
const translations = {
  pt: {
    heroTitle: "Descubra as Melhores <span>Experiências de Viagem</span>",
    heroSubtitle: "Do descanso em praias paradisíacas à aventura em cidades históricas — Tripify conecta você às melhores opções de viagem.",
    exploreBtn: "🌟 Explorar Viagens",
    registerTitle: "Cadastre-se",
    registerSubtitle: "Escolha a opção que melhor se aplica a você:",
    clientTitle: "Sou Cliente",
    companyTitle: "Sou Empresa",
    registerBtn: "Cadastrar",
    languageLabel: "Idioma:",
    cadastroSuccess: "✅ Cadastro concluído com sucesso!"
  },
  en: {
    heroTitle: "Discover the Best <span>Travel Experiences</span>",
    heroSubtitle: "From relaxing on paradisiacal beaches to exploring historic cities — Tripify connects you to the best travel options.",
    exploreBtn: "🌟 Explore Trips",
    registerTitle: "Sign Up",
    registerSubtitle: "Choose the option that best applies to you:",
    clientTitle: "I am a Client",
    companyTitle: "I am a Company",
    registerBtn: "Register",
    languageLabel: "Language:",
    cadastroSuccess: "✅ Registration completed successfully!"
  },
  es: {
    heroTitle: "Descubre las Mejores <span>Experiencias de Viaje</span>",
    heroSubtitle: "Desde descansar en playas paradisíacas hasta aventuras en ciudades históricas — Tripify te conecta con las mejores opciones de viaje.",
    exploreBtn: "🌟 Explorar Viajes",
    registerTitle: "Regístrate",
    registerSubtitle: "Elige la opción que mejor se aplica a ti:",
    clientTitle: "Soy Cliente",
    companyTitle: "Soy Empresa",
    registerBtn: "Registrar",
    languageLabel: "Idioma:",
    cadastroSuccess: "✅ ¡Registro completado con éxito!"
  }
};

/* ======= FUNÇÃO PARA ATUALIZAR TEXTOS ======= */
function setLanguage(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
}

/* ======= OBTER IDIOMA ATUAL ======= */
function getCurrentLang() {
  return localStorage.getItem("lang") || "pt";
}

/* ======= CONFIGURAÇÃO DO SELECT DE IDIOMA ======= */
const langSelect = document.getElementById("lang-select");
langSelect.addEventListener("change", (e) => {
  const selectedLang = e.target.value;
  setLanguage(selectedLang);
  localStorage.setItem("lang", selectedLang); // Salva a preferência
});

/* ======= CARREGAR IDIOMA SALVO OU PADRÃO ======= */
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = getCurrentLang();
  langSelect.value = savedLang;
  setLanguage(savedLang);
});


clienteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const lang = getCurrentLang();
  alert(translations[lang].cadastroSuccess);
  window.location.href = "HomeCliente.html";
});

empresaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const lang = getCurrentLang();
  alert(translations[lang].cadastroSuccess);
  window.location.href = "HomeEmpresa.html";
});

