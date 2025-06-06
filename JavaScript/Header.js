import UsuarioManager from "./Models/Usuario.js";
import {GetUsuarioFoto} from "../Service/ConectarUsuario.js";

const usuarioLogado = UsuarioManager.getUsuarioLogado();

const userIcon = document.getElementById("userIcon");

function voltarHome() {
    window.location.href = "HomePage.html";
}

function abrirPopupMenu() {
    document.getElementById("popupMenu").classList.add("active");
}

function fecharPopupMenu() {
    document.getElementById("popupMenu").classList.remove("active");
}

function abrirPopupSair() {
    document.getElementById("popupSair").classList.add("active");
}

function fecharPopupSair() {
    document.getElementById("popupSair").classList.remove("active");
}

function sair() {
    UsuarioManager.limparSessao();
    window.location.href = "LoginPage.html";
}

function jogar() {
    console.log("Jogar");
}

function editarPerfil() {
    window.location.href = "ProfilePage.html";
}

function visualizarAmizade() {
    window.location.href = "AmizadePage.html";
}

function conversar() {
    window.location.href = "../Pages/ChatPage.html";
}

function configurar() {
    console.log("Configurar");
}

async function mudarFoto() {
    const url = await GetUsuarioFoto(usuarioLogado.id);
    if (url) {
        userIcon.src = url;
    } else {
        userIcon.src = "../Assets/Icon/semUsuario.png";
    }
}

document.getElementById("iconHome").addEventListener("click", voltarHome);
document.getElementById("menuIcon").addEventListener("click", abrirPopupMenu);

document.getElementById("exitIcon").addEventListener("click", fecharPopupMenu);

document.getElementById("sairContaBtn").addEventListener("click", abrirPopupSair);
document.getElementById("cancelarBtn").addEventListener("click", fecharPopupSair);
document.getElementById("sairBtn").addEventListener("click", sair);

document.getElementById("jogarBtn").addEventListener("click", jogar)
document.getElementById("editPerfilBtn").addEventListener("click", editarPerfil);
document.getElementById("amigosBtn").addEventListener("click", visualizarAmizade);
document.getElementById("conversaBtn").addEventListener("click", conversar);
document.getElementById("configBtn").addEventListener("click", configurar);

window.addEventListener("load", () => {
    mudarFoto();
});
