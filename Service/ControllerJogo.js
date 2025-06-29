import UsuarioManager from "../JavaScript/Models/Usuario.js";
import {Jogo} from "../JavaScript/Models/Jogo.js";

const usuarioSalvo = UsuarioManager.getUsuarioLogado();

export async function getAllJogosJogador() {
    const resposta = await fetch("http://localhost:8080/api/jogo/todos_jogos/" + usuarioSalvo.id, {
        method: "GET"
    });

    if (!resposta) {
        throw new Error("Erro ao Pegar os Jogos");
    }

    const data = await resposta.json();
    return Jogo.formatBackEndList(data);
}

export async function getJogoAndamento() {
    const resposta = await fetch("http://localhost:8080/api/jogo/ultimo_jogo/" + usuarioSalvo.id, {
        method: "GET"
    });

    if (!resposta) {
        throw new Error("Erro ao Pegar os Jogos");
    }

    const data = await resposta.json();
    if (data) {
        return Jogo.formatBackEndData(data);
    } else {
        return null;
    }
}

export function postNovoJogo() {
    fetch(`http://localhost:8080/api/jogo/${usuarioSalvo.id}`, {
        method: 'POST'
    })
        .then(resposta => {
            resposta.text();
            if (resposta.status === 400) {
                alert("O Usuário já está em um Jogo!");
            }
        })
        .then(usuario => console.log(usuario))
        .catch(error => console.log(error));
}

export async function putFimJogo(pontuacao) {
    const jogoAndamento = await getJogoAndamento();

    fetch(`http://localhost:8080/api/jogo/${jogoAndamento.id}/${pontuacao}`, {
        method: 'PUT'
    })
        .then(resposta => resposta.text())
        .then(usuario => console.log(usuario))
        .catch(error => console.log(error));
}