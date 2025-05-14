import {Usuario} from "../Models/Usuario.js";

export async function PostLogin(email, senha) {
    try {
        const body = JSON.stringify({
            email: email,
            senha: senha
        });

        const resposta = await fetch('http://localhost:8080/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar usuário");
        }

        const data = await resposta.json();

        return new Usuario(data.id, data.nome, data.email, data.imagem);

    } catch (error) {
        console.error(error);
        return null;
    }
}

export function PostUsuario(nome, email, senha, img) {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('senha', senha);
    formData.append('imagem', img);

    fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        body: formData
    })
        .then(resposta => resposta.text())
        .then(usuario => console.log(usuario))
        .catch(error => console.log(error));
}

export async function GetUsuario(email) {
    try {
        const resposta = await fetch(`http://localhost:8080/api/usuarios/${encodeURIComponent(email)}`, {
            method: 'GET'
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar usuário");
        }

        const data = await resposta.json();
        return new Usuario(data.id, data.nome, data.email, data.imagem);
    } catch (error) {
        console.error(error);
        return null;
    }
}