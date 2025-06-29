import UsuarioManager from "../JavaScript/Models/Usuario.js";
import {Jogo} from "../JavaScript/Models/Jogo.js";
import {DadosJogo} from "../JavaScript/Models/DadosJogo.js";

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

    const texto = await resposta.text();

    if (texto) {
        const data = JSON.parse(texto);
        return Jogo.formatBackEndData(data);
    } else {
        return null;
    }
}

export async function getDadosMapa() {
    const resposta = await fetch("http://localhost:8080/api/jogo/partida/" + usuarioSalvo.id, {
        method: "GET"
    });

    if (!resposta) {
        throw new Error("Erro ao Pegar os Jogos");
    }

    const data = await resposta.json();
    return new DadosJogo(data.altura, data.largura, data.quantBombas);
}

export async function getCondicaoCelula(altura, largura) {
    const resposta = await fetch(`http://localhost:8080/api/jogo/partida/celula/${usuarioSalvo.id}/${altura}/${largura}`, {
        method: "GET"
    });

    if (!resposta) {
        throw new Error("Erro ao Pegar os Jogos");
    }

    return await resposta.json();
}

export function postNovoJogo(altura, largura, dificuldade) {
    fetch(`http://localhost:8080/api/jogo/${usuarioSalvo.id}/${altura}/${largura}/${dificuldade}`, {
        method: 'POST'
    })
        .then(resposta => {
            resposta.text();
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