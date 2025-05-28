import UsuarioManager from "./Models/Usuario.js";
import {GetTodosUsuarios} from "../Service/ConectarUsuario.js";

const usuarioSalvo = UsuarioManager.getUsuarioLogado();
let todosUsuarios = [];

document.addEventListener("DOMContentLoaded",  function () {
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

// edição da lista de Amigos
carregarTodosUsuarios().then(usuarios => {
    const tbody = document.querySelector("#listagem tbody");
    tbody.innerHTML = "";
    console.log("entrou 1");

    usuarios.forEach(usuario => {
        if (usuarioSalvo && usuarioSalvo.id === usuario.id) return;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nome}</td>
            <td><img src="../Assets/Icon/mensagemIcon.png" onclick="mandarMensagem(${usuario.id})" class="imgBuscaAmigo"></td>
            <td><img src="../Assets/Icon/adicionarAmigoIcon.png" onclick="adicionarAmigo(${usuario.id})" class="imgBuscaAmigo"></td>
        `;

        if (!(usuarioSalvo != null && usuarioSalvo.id === usuario.id)) {
            tbody.appendChild(tr);
        }
    });
});

async function carregarTodosUsuarios() {
    try {
        todosUsuarios = await GetTodosUsuarios();
        console.log(todosUsuarios);
        return todosUsuarios;
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        return [];
    }
}

function mandarMensagem(id) {
    console.log("mensagem para " + id);
}

function adicionarAmigo(id) {
    console.log("adicionar amigo " + id);
}

window.mandarMensagem = mandarMensagem;
window.adicionarAmigo = adicionarAmigo;