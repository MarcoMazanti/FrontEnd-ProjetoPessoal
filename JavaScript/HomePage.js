import UsuarioManager from "./Models/Usuario.js";
import {getRanking, getRankingTodos} from "../Service/RankingRequest.js";

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

function jogar() {
    console.log("Jogar");
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
            <td>${jogador.vitorias}</td>
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
    document.getElementById("jogosParticipadosJogador").textContent = usuarioSalvo.jogosParticipados;
    document.getElementById("vitoriasJogador").textContent = usuarioSalvo.vitorias;
    document.getElementById("empatesJogador").textContent = usuarioSalvo.empates;
    document.getElementById("derrotasJogador").textContent = usuarioSalvo.derrotas;
}

carregarInfoJogador();
