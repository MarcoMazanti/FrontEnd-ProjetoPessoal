import UsuarioManager from "./Models/Usuario.js";
import {getRanking, getRankingTodos} from "../Service/RankingRequest.js";
import {getJogoAndamento, postNovoJogo} from "../Service/ControllerJogo.js";

const usuarioSalvo = UsuarioManager.getUsuarioLogado();

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

    // Carrega o HTML do Footer dinamicamente
    fetch("../Pages/Footer.html")
        .then(response => response.text())
        .then(data => {
            const footerContainer = document.getElementById("Footer");
            if (footerContainer) {
                footerContainer.innerHTML = data;

                const script = document.createElement("script");
                script.type = "module";
                script.src = "../JavaScript/Footer.js";
                document.body.appendChild(script);
            } else {
                console.warn("Elemento com ID 'Footer' não encontrado.");
            }
        });
});

document.getElementById("jogarBtn").addEventListener("click", jogar);
document.getElementById("btnJogar").addEventListener("click", abrirJogo);
document.getElementById("btnCancelar").addEventListener("click", fecharPopup)

async function jogar() {
    const possivelJogo = await getJogoAndamento();

    if (possivelJogo) {
        window.location.href=`../Pages/GamePage.html?id=${possivelJogo.id}`;
    } else {
        abrirPopup();
    }
}

async function abrirJogo() {
    const radiosTamanho = document.querySelectorAll('input[name="tamanhoCampo"]');

    let tamanhoSelecionado = null;
    radiosTamanho.forEach(radio => {
        if (radio.checked) {
            tamanhoSelecionado = radio.value;
        }
    });

    let altura;
    let largura;
    if (tamanhoSelecionado === "10x10") {
        altura = 10;
        largura = 10;
    } else if (tamanhoSelecionado === "20x20") {
        altura = 20;
        largura = 20;
    } else if (tamanhoSelecionado === "30x30") {
        altura = 30;
        largura = 30;
    } else {
        altura = document.getElementById("altura").value;
        largura = document.getElementById("largura").value;
    }

    const radiosDificuldade = document.querySelectorAll('input[name="dificuldade"]');

    let dificuldadeSelecionada = null;
    radiosDificuldade.forEach(radio => {
        if (radio.checked) {
            dificuldadeSelecionada = radio.value;
        }
    });

    let porcentMina;
    if (dificuldadeSelecionada === "facil") {
        porcentMina = 15;
    } else if (dificuldadeSelecionada === "medio") {
        porcentMina = 25;
    } else if (dificuldadeSelecionada === "dificil") {
        porcentMina = 35;
    } else {
        porcentMina = document.getElementById("percent").value;
    }

    postNovoJogo(altura, largura, porcentMina);
    fecharPopup();
    await jogar();
}

// edição da lista de Ranking
getRankingTodos().then(jogadores => {
    const tbody = document.querySelector("#listagem tbody");
    tbody.innerHTML = "";

    let contador = 1;
    jogadores.forEach(jogador => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${contador}</td>
            <td>${jogador.id}</td>
            <td>${jogador.nome}</td>
            <td>${jogador.pontuacao}</td>
        `;

        if (usuarioSalvo != null && usuarioSalvo.id === jogador.id) {
            tr.classList.add("linhaUsuario");
        }

        contador++;
        tbody.appendChild(tr);
    });
});

// Função para buscar ranking
async function getRankingJogador(id) {
    try {
        return await getRanking(id);
    } catch (error) {
        console.error('Erro ao buscar ranking:', error);
        return null;
    }
}

// Atualizar info do jogador na tela
async function carregarInfoJogador() {
    const rankingUsuario = await getRankingJogador(usuarioSalvo.id);

    if (!rankingUsuario) {
        console.error('Ranking não encontrado.');
        return;
    }

    document.getElementById("idJogador").textContent = usuarioSalvo.id;
    document.getElementById("nomeJogador").textContent = usuarioSalvo.nome;
    document.getElementById("pontuacaoJogador").textContent = usuarioSalvo.pontuacao;
    document.getElementById("rankingJogador").textContent = rankingUsuario.ranking;
}

function abrirPopup() {
    document.getElementById("popupOverlay").classList.add("active");
}

function fecharPopup() {
    document.getElementById("popupOverlay").classList.remove("active");
}

carregarInfoJogador();
