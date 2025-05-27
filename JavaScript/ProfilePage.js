import UsuarioManager from "./Models/Usuario.js";
import {DeleteUsuario, GetUsuarioFoto, PostVerificarInexistenciaEmail, PutUSuario} from "../Service/ConectarUsuario.js";

const usuarioLogado = UsuarioManager.getUsuarioLogado();
const btnDireito = document.getElementById("btnDireito");
const btnEsquerdo = document.getElementById("btnEsquerdo");

let fotoUsuario = document.getElementById("fotoUsuario");
let inputFoto = document.getElementById("inputFotoUsuario");
let inputNome = document.getElementById("nomeUsuarioInput");
let inputEmail = document.getElementById("emailUsuarioInput");

let estado = "visualizacao";
let novaFoto = null;

function abrirPopup() {
    document.getElementById("popupExcluir").classList.add("active");
}

function fecharPopup() {
    document.getElementById("popupExcluir").classList.remove("active");
}

function editarPerfil() {
    document.getElementById("btnEditFotoPerfil").style.visibility = "visible";
    inputNome.style.visibility = "visible";
    inputEmail.style.visibility = "visible";

    btnEsquerdo.innerHTML = "Cancelar";
    btnDireito.innerHTML = "Salvar";
    estado = "edicao";
}

function fecharEdicao() {
    document.getElementById("btnEditFotoPerfil").style.visibility = "hidden";
    inputNome.style.visibility = "hidden";
    inputEmail.style.visibility = "hidden";

    inputNome.value = null;
    inputEmail.value = null;

    btnEsquerdo.innerHTML = "Editar Perfil";
    btnDireito.innerHTML = "Excluir Perfil";
    estado = "visualizacao";
}

function excluirPerfil() {
    document.cookie = "usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    DeleteUsuario(usuarioLogado.id);
    fecharPopup();

    window.location.href = "LoginPage.html";
}

async function salvarPerfil() {
    let novaFotoUsuario = novaFoto;
    let novoNome = document.getElementById("nomeUsuarioInput").value;
    let novoEmail = document.getElementById("emailUsuarioInput").value;

    if (novaFotoUsuario == null && novoNome === "" && novoEmail === "") {
        alert("Nenhum dado foi alterado.");
    } else {
        if (novoNome === usuarioLogado.nome || novoEmail === usuarioLogado.email) {
            alert("Dados não alterados devido a igualdade com os dados antigos.");
        } else {
            let emailInexistente;

            if (novoEmail === "") {
                novoEmail = usuarioLogado.email;
                emailInexistente = true;
            } else {
                emailInexistente = await PostVerificarInexistenciaEmail(usuarioLogado.id, novoEmail);
            }

            if (emailInexistente) {
                if (novoNome === "") {
                    novoNome = usuarioLogado.nome;
                }

                if (novaFotoUsuario == null) {
                    novaFotoUsuario = GetUsuarioFoto(usuarioLogado.id);
                }

                await PutUSuario(usuarioLogado.id, novaFotoUsuario, novoNome, novoEmail);

                UsuarioManager.setUsuarioLogado(
                    usuarioLogado.id,
                    novoNome,
                    novoEmail,
                    novaFotoUsuario,
                    usuarioLogado.pontuacao,
                    usuarioLogado.jogosParticipados,
                    usuarioLogado.vitorias,
                    usuarioLogado.empates,
                    usuarioLogado.derrotas);

                await window.location.reload();
            } else {
                alert("Email já utilizado!");
            }
        }
    }

    fecharEdicao();
}

async function mudarFoto(fotoNova) {
    if (fotoNova == null) {
        const url = await GetUsuarioFoto(usuarioLogado.id);
        if (url) {
            fotoUsuario.src = url;
        } else {
            fotoUsuario.src = "../Assets/Icon/semUsuario.png";
        }
    } else {
        fotoUsuario.src = fotoNova;
    }
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

    document.getElementById("btnEditFotoPerfil").style.visibility = "hidden";
    inputNome.style.visibility = "hidden";
    inputEmail.style.visibility = "hidden";
});

document.getElementById("btnEditFotoPerfil").addEventListener("click", () => {
    inputFoto.click();
});

document.getElementById("btnExcluirPerfil").addEventListener("click", excluirPerfil);

document.getElementById("btnCancelarPerfil").addEventListener("click", fecharPopup);

window.addEventListener("load", async() => {
    mudarFoto(await GetUsuarioFoto(usuarioLogado.id));

    document.getElementById("idUsuario").innerHTML = usuarioLogado.id;
    document.getElementById("nomeUsuario").innerHTML = usuarioLogado.nome;
    document.getElementById("emailUsuario").innerHTML = usuarioLogado.email;
    document.getElementById("amigosUsuario").innerHTML = "0";
});

inputFoto.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size <= 500 * 1024) {
            novaFoto = file;

            mudarFoto(URL.createObjectURL(file));
        } else {
            alert("A imagem selecionada é muito grande! O tamanho máximo permitido é 500KB.");
        }
    }
});

btnEsquerdo.addEventListener("click", () => {
    if (estado === "visualizacao") {
        editarPerfil();
    } else if (estado === "edicao") {
        mudarFoto();
        novaFoto = null;

        fecharEdicao();
    }
});

btnDireito.addEventListener("click", () => {
    if (estado === "visualizacao") {
        abrirPopup();
    } else if (estado === "edicao") {
        salvarPerfil();
    }
})
