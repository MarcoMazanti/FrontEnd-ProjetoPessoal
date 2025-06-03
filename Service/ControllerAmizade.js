import {Amizade} from "../JavaScript/Models/Amizade.js";

export async function GetTodasAmizades() {
    const resposta = await fetch('http://localhost:8080/api/amizade/todos', {
        method: "GET"
    });

    if (!resposta.ok) {
        throw new  Error("Erro ao pegar todas as amizades");
    }

    const data = await resposta.json();

    return Amizade.formatBackEndList(data);
}

export async function GetTodasAmizadesPendentes() {
    const resposta = await fetch('http://localhost:8080/api/amizade/todos/pendentes', {
        method: 'GET'
    });

    if (!resposta.ok) {
        throw new Error("Erro ao pegar as amizades pendentes");
    }

    const data = await resposta.json();

    return Amizade.formatBackEndList(data);
}

export async function GetTodasAmizadasFeitas() {
    const resposta = await fetch('http://localhost:8080/api/amizade/todos/feitas', {
        method: 'GET'
    });

    if (!resposta.ok) {
        throw new Error("Erro ao pegar as amizadas feitas");
    }

    const data = await resposta.json();

    return Amizade.formatBackEndList(data);
}

export async function GetTodasAmizadesPendentesJogador(id) {
    const resposta = await fetch('http://localhost:8080/api/amizade/pendente/' + id, {
        method: 'GET'
    });

    if (!resposta.ok) {
        throw new Error("Erro ao pegar as amizades pendentes do receptor");
    }

    const data = await resposta.json();

    return Amizade.formatBackEndList(data);
}

export async function GetTodasAmizadasFeitasJogador(id) {
    const resposta = await fetch('http://localhost:8080/api/amizade/feitas/' + id, {
        method: 'GET'
    });

    if (!resposta.ok) {
        throw new Error("Erro ao pegar as amizadas feitas do emissor");
    }

    const data = await resposta.json();

    return Amizade.formatBackEndList(data);
}

export function PostNovaAmizade(idEmissor, idReceptor) {
    const body = JSON.stringify({
        id_jogador_1: idEmissor,
        id_jogador_2: idReceptor
    });

    fetch('http://localhost:8080/api/amizade/criarAmizade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    })
        .then(resposta => resposta.text())
        .then(usuario => console.log(usuario))
        .catch(error => console.log(error));
}

export function PutAtualizarAmizade(idEmissor, idReceptor) {
    const body = JSON.stringify({
        id_jogador_1: idEmissor,
        id_jogador_2: idReceptor
    });

    fetch('http://localhost:8080/api/amizade/atualizarAmizade', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: body
    })
        .then(resposta => resposta.text())
        .then(usuario => console.log(usuario))
        .catch(error => console.log(error));
}

export function DeleteAmizade(idEmissor, idReceptor) {
    const body = JSON.stringify({
        id_jogador_1: idEmissor,
        id_jogador_2: idReceptor
    });

    fetch('http://localhost:8080/api/amizade/deletarAmizade', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: body
    })
        .then(resposta => resposta.text())
        .then(usuario => console.log(usuario))
        .catch(error => console.log(error));
}