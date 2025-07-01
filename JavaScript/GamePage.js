import UsuarioManager from "./Models/Usuario.js";
import {getCondicaoCelula, getDadosMapa, putFimJogo} from "../Service/ControllerJogo.js";

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

const usuarioLogado = UsuarioManager.getUsuarioLogado();
const numBomb = document.getElementById("numBomb");
const tamanhoMapa = document.getElementById("tamanhoMapa");
const textFimJogo = document.getElementById("fimJogo");
const dadosFimJogo = document.getElementById("dadosFimJogo");

const dadosMapa = await getDadosMapa();

const largura = dadosMapa.largura;
const altura = dadosMapa.altura;

let mapa = [];
let pontuacao = 0;

for (let i = 0; i < altura; i++) {
    mapa[i] = [];
    for (let j = 0; j < largura; j++) {
        mapa[i][j] = null;
    }
}

numBomb.textContent = dadosMapa.quantBombas;
tamanhoMapa.textContent = `${altura}x${largura}`;

const tbody = document.querySelector("#tabela tbody");

for (let i = 0; i < altura; i++) {
    const tr = document.createElement("tr");

    for (let j = 0; j < largura; j++) {
        const td = document.createElement("td");
        td.id = `celula${i}x${j}`;
        td.className = "celulaPadrao";

        td.addEventListener("mousedown", function (event) {
            event.preventDefault();
            const label = td.querySelector("label");
            const img = td.querySelector("img");

            if (
                event.button === 0 &&
                !(img && img.alt === "bandeira")) {
                celulaClicada(td);
            } else if (
                event.button === 2 &&
                !(label || (img && img.alt === "bomba"))
            ) {
                clickDireitoCelula(td);
            }
        });

        td.addEventListener("contextmenu", function(event) {
            event.preventDefault();
        });

        tr.appendChild(td);
    }

    tbody.appendChild(tr);
}


async function clickDireitoCelula(td) {
    let idCompletoCelula = td.getAttribute("id");

    idCompletoCelula = idCompletoCelula.replace("celula", "");
    let [i, j] = idCompletoCelula.split("x");

    i = parseInt(i);
    j = parseInt(j);

    if (td.classList.contains("celulaPadrao")) {
        td.classList.remove("celulaPadrao");
        td.classList.add("celulaClicada");

        td.innerHTML = "";

        td.innerHTML = `<img src="../Assets/Icon/bandeiraIcon.png" alt="bandeira" class="imgCelula">`;

        mapa[i][j] = 10;
        dadosMapa.quantBombas--;
    } else {
        td.classList.remove("celulaClicada");
        td.classList.add("celulaPadrao");

        td.innerHTML = "";

        mapa[i][j] = null;
        dadosMapa.quantBombas++;
    }

    numBomb.textContent = dadosMapa.quantBombas;
    if (dadosMapa.quantBombas === 0) {
        await verificarCondicaoVitoria();
    }
}

async function celulaClicada(td) {
    td.classList.remove("celulaPadrao");
    td.classList.add("celulaClicada");

    let idCompletoCelula = td.getAttribute("id");

    idCompletoCelula = idCompletoCelula.replace("celula", "");
     let [i, j] = idCompletoCelula.split("x");

     i = parseInt(i);
     j = parseInt(j);

    const numCelula = await getCondicaoCelula(i, j);

    mapa[i][j] = numCelula;

    await verificacaoCelulas(td, numCelula, i, j);
}

async function verificacaoCelulas(td, numCelula, linha, coluna) {
    td.innerHTML = "";

    td.classList.add("celulaClicada");
    if (numCelula < 10) {
        if (numCelula === 0) {
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    let ni = linha + i;
                    let nj = coluna + j;

                    if (ni >= 0 && ni < altura && nj >= 0 && nj < largura) {
                        const nomeCelula = `celula${ni}x${nj}`;
                        const celulaAtual = document.getElementById(nomeCelula);

                        if (celulaAtual.className === "celulaPadrao") {
                            let novaCondicao = await getCondicaoCelula(ni, nj);

                            mapa[ni][nj] = novaCondicao;

                            await verificacaoCelulas(celulaAtual, novaCondicao, ni, nj);
                        }
                    }
                }
            }
        } else {
            td.innerHTML = `<label class="textoCelula">${numCelula}</label>`;
        }
    } else {
        td.innerHTML = `<img src="../Assets/Icon/bombIcon.png" alt="bomba" class="imgCelula">`;
        await fimDeJogo(false);
    }
}

async function verificarCondicaoVitoria() {
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < largura; j++) {
            if (mapa[i][j] === 10 && await getCondicaoCelula(i, j) !== 10) {
                return;
            }
        }
    }

    await fimDeJogo(true);
}

async function fimDeJogo(ehVitoria) {
    if (ehVitoria) {
        const dados = await getDadosMapa();

        pontuacao = dados.quantBombas + (dados.altura * dados.largura);

        textFimJogo.textContent = "Vitória!";
        dadosFimJogo.textContent = `Pontuação: ${pontuacao}`;

        await putFimJogo(pontuacao);
    } else {
        for (let i = 0; i < altura; i++) {
            for (let j = 0; j < largura; j++) {
                if (mapa[i][j] != null) {
                    pontuacao++;
                }
            }
        }

        textFimJogo.textContent = "Você Perdeu!";
        dadosFimJogo.textContent = `Pontuação: ${pontuacao}`;

        await putFimJogo(pontuacao);
    }

    document.getElementById("popupOverlay").classList.add("active");
}

function voltarHome() {
    UsuarioManager.setUsuarioLogado(
        usuarioLogado.id,
        usuarioLogado.nome,
        usuarioLogado.email,
        usuarioLogado.imagem,
        usuarioLogado.pontuacao + pontuacao);

    window.location.href="../Pages/HomePage.html"
}

window.celulaClicada = celulaClicada;
window.voltarHome = voltarHome;