// HomeEmpresa.js

// Pré-visualização de imagens antes de cadastrar
document.getElementById("fotos").addEventListener("change", function (event) {
    const preview = document.getElementById("preview");
    preview.innerHTML = ""; // Limpa antes de adicionar
    Array.from(event.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.classList.add("thumb");
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});

// Função para salvar excursão no localStorage
document.getElementById("empresaForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const nomeEmpresa = document.getElementById("nomeEmpresa").value;
    const sobreEmpresa = document.getElementById("sobreEmpresa").value;
    const local = document.getElementById("local").value;
    const descricao = document.getElementById("descricao").value;
    const vagas = document.getElementById("vagas").value;

    // Coletar imagens em base64
    const fotosInput = document.getElementById("fotos").files;
    const fotos = [];
    for (let i = 0; i < fotosInput.length; i++) {
        const reader = new FileReader();
        reader.onload = function (e) {
            fotos.push(e.target.result);

            // Salvar no localStorage apenas quando todas imagens forem processadas
            if (fotos.length === fotosInput.length) {
                salvarExcursao(nomeEmpresa, sobreEmpresa, local, descricao, vagas, fotos);
            }
        };
        reader.readAsDataURL(fotosInput[i]);
    }

    // Caso não tenha imagens, salva direto
    if (fotosInput.length === 0) {
        salvarExcursao(nomeEmpresa, sobreEmpresa, local, descricao, vagas, fotos);
    }
});

function salvarExcursao(nomeEmpresa, sobreEmpresa, local, descricao, vagas, fotos) {
    let excursoes = JSON.parse(localStorage.getItem("excursoes")) || [];

    const excursao = {
        id: Date.now(),
        nomeEmpresa,
        sobreEmpresa,
        local,
        descricao,
        vagas,
        fotos
    };

    excursoes.push(excursao);
    localStorage.setItem("excursoes", JSON.stringify(excursoes));

    alert("Excursão cadastrada com sucesso! 🎉");
    document.getElementById("empresaForm").reset();
    document.getElementById("preview").innerHTML = "";
    listarExcursoes();
}

// Função para listar excursões na HomeEmpresa
function listarExcursoes() {
    const container = document.getElementById("listaExcursoes");
    if (!container) return;

    container.innerHTML = "";
    const excursoes = JSON.parse(localStorage.getItem("excursoes")) || [];

    excursoes.forEach(exc => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${exc.local}</h3>
            <p><strong>Descrição:</strong> ${exc.descricao}</p>
            <p><strong>Sobre a empresa:</strong> ${exc.sobreEmpresa}</p>
            <p><strong>Vagas:</strong> ${exc.vagas}</p>
            <div class="fotos">
                ${exc.fotos.map(foto => `<img src="${foto}" class="thumb">`).join("")}
            </div>
            <button onclick="editarExcursao(${exc.id})">Editar</button>
            <button onclick="excluirExcursao(${exc.id})">Excluir</button>
        `;
        container.appendChild(card);
    });
}

function excluirExcursao(id) {
    let excursoes = JSON.parse(localStorage.getItem("excursoes")) || [];
    excursoes = excursoes.filter(exc => exc.id !== id);
    localStorage.setItem("excursoes", JSON.stringify(excursoes));
    listarExcursoes();
}

function editarExcursao(id) {
    let excursoes = JSON.parse(localStorage.getItem("excursoes")) || [];
    const excursao = excursoes.find(exc => exc.id === id);
    }

    if (excursao) {
        document.getElementById("nomeEmpresa").value = excursao.nomeEmpresa;
        document.getElementById("sobreEmpresa").value = excursao.sobreEmpresa;
        document.getElementById("local").value = excursao.local;
        document.getElementById("descricao").value = excursao.descricao;
        document.getElementById("vagas").value = excursao.vagas;

    }
