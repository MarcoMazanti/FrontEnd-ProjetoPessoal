import {Conversa} from "../JavaScript/Models/Conversa.js"
import UsuarioManager from "../JavaScript/Models/Usuario.js";

const usuarioSalvo = UsuarioManager.getUsuarioLogado();

export async function getConversaUsuario(idAmizade) {
    const resposta = await fetch("http://localhost:8080/api/conversa/" + idAmizade, {
        method: "GET"
    });

    if (!resposta.ok) {
        throw new Error("Erro ao getConversa Usuario");
    }

    const data = await resposta.json();

    return Conversa.formatBackEndList(data);
}

export function postMensagem(idAmizade, mensagem) {
    const body = JSON.stringify({
        idAmizade : idAmizade,
        idJogador : usuarioSalvo.id,
        mensagem: mensagem
    });

    fetch('http://localhost:8080/api/conversa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    })
        .then(resposta => resposta.text())
        .then(usuario => console.log(usuario))
        .catch(error => console.log(error));
}

export function deleteConversa(idAmizade) {
    fetch(`http://localhost:8080/api/conversa/${idAmizade}`, {
        method: 'DELETE'
    })
        .then(resposta => resposta.text())
        .then(usuario => console.log(usuario))
        .catch(error => console.log(error));
}