
  document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector(".grid");

    // Recupera excursões salvas
    const excursões = JSON.parse(localStorage.getItem("excursões")) || [];

    if (excursões.length === 0) {
      container.innerHTML = "<p>Nenhuma excursão disponível no momento.</p>";
      return;
    }

    excursões.forEach(excursao => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <h3>${excursao.nome}</h3>
        <img src="${excursao.foto}" alt="${excursao.nome}" style="width:100%; border-radius:8px; margin-bottom:10px;">
        <p><strong>Descrição:</strong> ${excursao.descricao}</p>
        <p><strong>Sobre a empresa:</strong> ${excursao.sobre}</p>
        <p><strong>Vagas:</strong> ${excursao.vagas}</p>
      `;

      container.appendChild(card);
    });
  });


// Excursões exemplo
const excursions = [
  { nome: "Trilha da Montanha", categoria: "aventura", local: "Rio de Janeiro", vagas: 10 },
  { nome: "Passeio Cultural em Lisboa", categoria: "cultural", local: "Lisboa", vagas: 0 },
  { nome: "Tour Gastronômico na Itália", categoria: "gastronomia", local: "Roma", vagas: 5 },
  { nome: "Mergulho nas Maldivas", categoria: "aventura", local: "Maldivas", vagas: 3 }
];

// Renderiza excursões
function renderExcursions(filtro = "", categoria = "all") {
  const list = document.getElementById("excursion-list");
  list.innerHTML = "";

  excursions
    .filter(e => (e.nome.toLowerCase().includes(filtro.toLowerCase())) &&
                 (categoria === "all" || e.categoria === categoria))
    .forEach(e => {
      const div = document.createElement("div");
      div.classList.add("excursion-card");
      div.innerHTML = `
        <h3>${e.nome}</h3>
        <p>📍 ${e.local}</p>
        <p>Categoria: ${e.categoria}</p>
        <p class="vaga">${e.vagas > 0 ? "✅ Vagas disponíveis: " + e.vagas : "❌ Sem vagas"}</p>
      `;
      list.appendChild(div);
    });
}

// Inicial
renderExcursions();

// Busca
document.getElementById("searchInput").addEventListener("input", (e) => {
  renderExcursions(e.target.value, document.getElementById("categorySelect").value);
});

document.getElementById("categorySelect").addEventListener("change", (e) => {
  renderExcursions(document.getElementById("searchInput").value, e.target.value);
});

// Traduções
const translations = {
  pt: {
    searchPlaceholder: "🔍 Buscar excursões...",
    catAll: "Todas",
    catAdventure: "Aventura",
    catCultural: "Cultural",
    catFood: "Gastronômica",
    recommendations: "Recomendações de Excursões",
    languageLabel: "Idioma:"
  },
  en: {
    searchPlaceholder: "🔍 Search excursions...",
    catAll: "All",
    catAdventure: "Adventure",
    catCultural: "Cultural",
    catFood: "Gastronomic",
    recommendations: "Excursion Recommendations",
    languageLabel: "Language:"
  },
  es: {
    searchPlaceholder: "🔍 Buscar excursiones...",
    catAll: "Todas",
    catAdventure: "Aventura",
    catCultural: "Cultural",
    catFood: "Gastronómica",
    recommendations: "Recomendaciones de Excursiones",
    languageLabel: "Idioma:"
  }
};

const langSelect = document.getElementById("lang-select");
const elements = document.querySelectorAll("[data-i18n]");

langSelect.addEventListener("change", (e) => {
  const lang = e.target.value;
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.placeholder !== undefined && el.tagName === "INPUT"
      ? el.placeholder = translations[lang][key]
      : el.innerHTML = translations[lang][key];
  });
});

