import UsuarioManager from "./Models/Usuario.js";

const usuarioLogado = UsuarioManager.getUsuarioLogado();
const numBomb = document.getElementById("numBomb");
const tamanhoMapa = document.getElementById("tamanhoMapa");

const params = new URLSearchParams(window.location.search);
const idJogo = params.get("id");
console.log(idJogo);

const largura = 20;
const altura = 20;

tamanhoMapa.textContent = `${largura}x${altura}`;

for (let i = 0; i < altura; i++) {
    const tbody = document.querySelector("#tabela tbody");
    const tr = document.createElement("tr");

    for (let j = 0; j < largura; j++) {
        const id = `celula${i}x${j}`;
        tr.innerHTML += `<td id = ${id} class="celulaPadrao" onclick="celulaClicada(${id})"></td>`;
    }
    tbody.appendChild(tr);
}

document.addEventListener("DOMContentLoaded", function () {
    // Carrega o HTML do Header dinamicamente
    fetch("../Pages/Header.html")
        .then(response => response.text())
        .then(data => {
            const headerContainer = document.getElementById("Header");
            if (headerContainer) {
                headerContainer.innerHTML = data;

                // Após o HTML estar no DOM, carrega o JS do Header
                const script = document.createElement("script");
                script.type = "module";
                script.src = "../JavaScript/Header.js";
                document.body.appendChild(script);
            } else {
                console.warn("Elemento com ID 'Header' não encontrado.");
            }
        });
});

function celulaClicada(td) {
    td.classList.remove("celulaPadrao");
    td.classList.add("celulaClicada");
}

window.celulaClicada = celulaClicada;