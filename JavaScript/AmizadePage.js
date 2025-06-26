import UsuarioManager from "./Models/Usuario.js";
import {GetTodosUsuarios, GetUsuarioID} from "../Service/ConectarUsuario.js";
import {
    DeleteAmizade, GetIDAmizade,
    GetTodasAmizadasFeitasJogador,
    GetTodasAmizades,
    GetTodasAmizadesPendentesJogador,
    PostNovaAmizade, PutAtualizarAmizade
} from "../Service/ControllerAmizade.js";
import {deleteConversa} from "../Service/ControllerConversa.js";

const usuarioSalvo = UsuarioManager.getUsuarioLogado();
let todosUsuarios = [];
let possiveisAmizades = [];
let amizadesPendentes = [];
let amizadesFeitas = [];

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

document.getElementById("btnBuscarAmigo").addEventListener("click", buscarAmigo);

// edição da lista de Adicionar Amigos
carregarTodosUsuarios().then(usuarios => {
    verificarAmigos().then(() => {
        const tbody = document.querySelector("#listaBuscaAmigo tbody");
        tbody.innerHTML = "";

        usuarios.forEach(usuario => {
            if (usuarioSalvo && usuarioSalvo.id === usuario.id) return;

            // Verifica se já existe amizade (pendente ou aceita) entre usuarioSalvo e usuario
            const existeAmizade = possiveisAmizades.some(amizade => {
                return (amizade.id_jogador_1 === usuarioSalvo.id && amizade.id_jogador_2 === usuario.id) ||
                    (amizade.id_jogador_2 === usuarioSalvo.id && amizade.id_jogador_1 === usuario.id);
            });

            if (existeAmizade) return;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td><img src="../Assets/Icon/adicionarAmigoIcon.png" onclick="adicionarAmigoPendente(${usuario.id})" class="imgAmigo"></td>
            `;

            tbody.appendChild(tr);
        });
    });
});

async function carregarTodosUsuarios() {
    try {
        todosUsuarios = await GetTodosUsuarios();
        return todosUsuarios;
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        return [];
    }
}

async function verificarAmigos() {
    const listaAmizade = await GetTodasAmizades();

    possiveisAmizades = [];

    for (let amizade of listaAmizade) {
        possiveisAmizades.push(amizade);
    }
}

// edição da lista de Amizade Pendente
amigosPendentes().then(async amigosPendentes => {
    const tbody = document.querySelector("#listaAmgPendente tbody");
    tbody.innerHTML = "";

    for (const amigo of amigosPendentes) {
        const usuarioAlvo = await GetUsuarioID(amigo.id_jogador_1);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${usuarioAlvo.id}</td>
            <td>${usuarioAlvo.nome}</td>
            <td><img src="../Assets/Icon/adicionarAmigoIcon.png" onclick="adicionarAmigo(${usuarioAlvo.id})" class="imgAmigo"></td>
            <td><img src="../Assets/Icon/deleteIcon.png" onclick="cancelarPedidoAmizade(${usuarioAlvo.id})" class="imgAmigo"></td>
        `;

        tbody.appendChild(tr);
    }
});

async function amigosPendentes() {
    const listaAmizadePendente = await GetTodasAmizadesPendentesJogador(usuarioSalvo.id);

    amizadesPendentes = [];

    for (let amizade of listaAmizadePendente) {
        if (amizade.id_jogador_2 == usuarioSalvo.id) {
            amizadesPendentes.push(amizade);
        }
    }

    return amizadesPendentes;
}

// edição da lista de Amizade Feita
verAmigos().then(async amigosFeitos => {
    const tbody = document.querySelector("#listaAmgFeita tbody");
    tbody.innerHTML = "";

    for (const amigoFeito of amigosFeitos) {
        const amigoAlvo = (amigoFeito.id_jogador_1 == usuarioSalvo.id) ?
            await GetUsuarioID(amigoFeito.id_jogador_2) : await GetUsuarioID(amigoFeito.id_jogador_1);

        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${amigoAlvo.id}</td>
        <td>${amigoAlvo.nome}</td>
        <td><img src="../Assets/Icon/mensagemIcon.png" onclick="mandarMensagem(${amigoAlvo.id})" class="imgAmigo"></td>
        <td><img src="../Assets/Icon/deleteIcon.png" onclick="cancelarAmizade(${amigoAlvo.id})" class="imgAmigo"></td>
        `;

        tbody.appendChild(tr);
    }
});

async function verAmigos() {
    const listaAmizadeFeita = await GetTodasAmizadasFeitasJogador(usuarioSalvo.id);

    amizadesFeitas = [];

    for (let amizade of listaAmizadeFeita) {
        amizadesFeitas.push(amizade);
    }

    return amizadesFeitas;
}

function mandarMensagem(idAmizade) {
    const data = new Date();
    data.setHours(data.getHours() + 1);

    document.cookie = `mensagemAmg=${idAmizade}; expires=${data.toUTCString()}; path=/`;
    window.location.href = "../Pages/ChatPage.html";
}

async function adicionarAmigoPendente(id2) {
    const id1 = usuarioSalvo.id;

    await PostNovaAmizade(id1, id2);

    window.location.reload();
}

async function adicionarAmigo(id1) {
    const id2 = usuarioSalvo.id;

    await PutAtualizarAmizade(id1, id2);

    window.location.reload();
}

async function cancelarPedidoAmizade(id1) {
    const id2 = usuarioSalvo.id;

    await DeleteAmizade(id1, id2);

    window.location.reload();
}

async function cancelarAmizade(id1) {
    const id2 = usuarioSalvo.id;
    const idAmizade = await GetIDAmizade(id1);

    deleteConversa(idAmizade);
    await DeleteAmizade(id1, id2);

    window.location.reload();
}

async function buscarAmigo() {
    const inputBuscarUsuario = document.getElementById("inputBuscarAmigo").value.trim();

    if (inputBuscarUsuario === "") {
        return alert("Por favor, insira um ID de usuário.");
    }

    let resultados = [];

    try {
        if (ehSomenteNumeros(inputBuscarUsuario)) {
            const usuario = await GetUsuarioID(parseInt(inputBuscarUsuario));
            if (usuario) resultados.push(usuario);
        } else {
            return alert("Divite corretamente o ID.")
        }

        const tbody = document.querySelector("#listaBuscaAmigo tbody");
        tbody.innerHTML = "";

        if (resultados.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4">Nenhum usuário encontrado.</td></tr>`;
            return;
        }

        resultados.forEach(usuario => {
            if (usuarioSalvo && usuarioSalvo.id === usuario.id) return;

            const existeAmizade = possiveisAmizades.some(amizade =>
                (amizade.id_jogador_1 === usuarioSalvo.id && amizade.id_jogador_2 === usuario.id) ||
                (amizade.id_jogador_2 === usuarioSalvo.id && amizade.id_jogador_1 === usuario.id)
            );

            if (existeAmizade) return;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td><img src="../Assets/Icon/mensagemIcon.png" onclick="mandarMensagem(${usuario.id})" class="imgAmigo"></td>
                <td><img src="../Assets/Icon/adicionarAmigoIcon.png" onclick="adicionarAmigoPendente(${usuario.id})" class="imgAmigo"></td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro na busca:", error);
        alert("Ocorreu um erro ao buscar o usuário.");
    }
}

function ehSomenteNumeros(valor) {
    return /^\d+$/.test(valor);
}

// funções globais
window.mandarMensagem = mandarMensagem;
window.adicionarAmigoPendente = adicionarAmigoPendente;
window.adicionarAmigo = adicionarAmigo;
window.cancelarPedidoAmizade = cancelarPedidoAmizade;
window.cancelarAmizade = cancelarAmizade;