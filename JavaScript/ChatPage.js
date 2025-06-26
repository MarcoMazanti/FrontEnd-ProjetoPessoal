import UsuarioManager from "./Models/Usuario.js";
import {GetIDAmizade, GetTodasAmizadasFeitasJogador} from "../Service/ControllerAmizade.js";
import {GetUsuarioID} from "../Service/ConectarUsuario.js";
import {getConversaUsuario, postMensagem} from "../Service/ControllerConversa.js";

const usuarioSalvo = UsuarioManager.getUsuarioLogado();
let id = getMensagemDoCookie();
console.log(id);

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

document.getElementById("formMensagem").addEventListener("submit",  async function (event) {
    const mensagemEscrita = document.getElementById("txtMensagem").value.trim();

    if (mensagemEscrita) {
        const idAmizade = await GetIDAmizade(id);
        postMensagem(idAmizade, mensagemEscrita);
    } else {
        alert("Digite uma mensagem!");
    }
});

if (id != null) {
    const idAmizade = await GetIDAmizade(id);

    await getConversaUsuario(idAmizade).then(async conversa => {
        const tbody = document.querySelector("#chat");
        tbody.innerHTML = "";

        for (const mensagem of conversa) {
            const div = document.createElement("div");
            div.classList.add("box");

            if (mensagem.idJogador == usuarioSalvo.id) {
                div.classList.add("usuario");
            } else {
                div.classList.add("amigo");
            }

            div.innerHTML = `
                <label class="mensagem">${mensagem.mensagem}</label>
            `;

            tbody.appendChild(div);
        }
    });

    document.getElementById("chat").style.visibility = "visible";
    document.getElementById("boxMensagem").style.visibility = "visible";
} else {
    document.getElementById("chat").style.visibility = "hidden";
    document.getElementById("boxMensagem").style.visibility = "hidden";
}

listarAmigos().then(async amigos => {
    const tbody = document.querySelector("#listaAmigos tbody");
    tbody.innerHTML = "";

    for (const amigo of amigos) {
        const amigoAlvo = (amigo.id_jogador_1 == usuarioSalvo.id) ?
            await GetUsuarioID(amigo.id_jogador_2) : await GetUsuarioID(amigo.id_jogador_1);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${amigoAlvo.id}</td>
            <td>${amigoAlvo.nome}</td>
            <td><img src="../Assets/Icon/mensagemIcon.png" onclick="mensagem(${amigoAlvo.id})" class="imgAmigo"></td>
        `;

        tbody.appendChild(tr);
    }
});

async function listarAmigos() {
    return await GetTodasAmizadasFeitasJogador(usuarioSalvo.id);
}

function mensagem(idAlvo) {
    const data = new Date();
    data.setHours(data.getHours() + 1);

    document.cookie = `mensagemAmg=${idAlvo}; expires=${data.toUTCString()}; path=/`;
    location.reload();
}

function getMensagemDoCookie() {
    const cookies = document.cookie.split('; ');

    for (let i = 0; i < cookies.length; i++) {
        const [chave, valor] = cookies[i].split('=');
        if (chave === 'mensagemAmg') {
            try {
                return JSON.parse(decodeURIComponent(valor));
            } catch (e) {
                console.error("Erro ao converter cookie 'mensagemAmg': ", e);
                return null;
            }
        }
    }

    return null;
}

window.mensagem = mensagem;