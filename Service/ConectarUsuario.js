import {Usuario} from "../JavaScript/Models/Usuario.js";
import {UsuarioFrontEndParcial} from "../JavaScript/Models/UsuarioFrontEndParcial.js";

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

        return new Usuario(data.id, data.nome, data.email, data.imagem, data.pontuacao, data.jogosParticipados, data.vitorias, data.empates, data.derrotas);

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

export async function PostVerificarInexistenciaEmailAtualizar(id, email) {
    try {
        const formData = new FormData();
        formData.append('email', email);

        const resposta = await fetch(`http://localhost:8080/api/usuarios/verificarInexistenciaEmail/${id}`, {
            method: 'POST',
            body: formData
        });

        if (!resposta.ok) {
            throw new Error("Erro ao verificar email");
        }

        const data = await resposta.text();

        return data === "Email não cadastrado";
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function PostVerificarInexistenciaEmailCadasatrar(email) {
    try {
        const formData = new FormData();
        formData.append('email', email);

        const resposta = await fetch('http://localhost:8080/api/usuarios/verificarInexistenciaEmail', {
            method: 'POST',
            body: formData
        });

        if (!resposta.ok) {
            throw new Error("Erro ao verificar email");
        }

        const data = await resposta.text();

        console.log(data);

        return data === "Email não cadastrado";
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function GetUsuario(email) {
    try {
        const resposta = await fetch('http://localhost:8080/api/usuarios/${encodeURIComponent(email)}', {
            method: 'GET'
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar usuário");
        }

        const data = await resposta.json();
        return new Usuario(data.id, data.nome, data.email, data.imagem, data.pontuacao, data.jogosParticipados, data.vitorias, data.empates, data.derrotas);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function GetUsuarioID(id) {
    try {
        const resposta = await fetch(`http://localhost:8080/api/usuarios/id/${id}`, {
            method: 'GET'
        });

        if (!resposta.ok) {
            throw new Error("Erro ao getUsuarioID");
        }

        const data = await resposta.json();

        if (!data) {
            console.warn("Erro ao getUsuarioID");
            return null;
        } else {
            return new Usuario(data.id, data.nome, data.email, data.imagem, data.pontuacao, data.jogosParticipados, data.vitorias, data.empates, data.derrotas);
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function GetUsuarioNome(nome) {
    try {
        const resposta = await fetch(`http://localhost:8080/api/usuarios/nome/${nome}`, {
            method: 'GET'
        });

        if (!resposta.ok) {
            throw new Error("Erro ao getUsuarioNome");
        }

        const data = await resposta.json();

        if (!data) {
            console.warn("Erro ao getUsuarioNome");
            return null;
        } else {
            return Usuario.formatBackEndList(data);
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function GetTodosUsuarios() {
    try {
        const resposta = await fetch('http://localhost:8080/api/usuarios/todos', {
            method: 'GET'
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar usuário");
        }

        const data = await resposta.json();

        let listaUsuarios = [];

        for (let usuarioBackend of data) {
            const usuario = UsuarioFrontEndParcial.fromBackendData(usuarioBackend);
            listaUsuarios.push(usuario);
        }

        return listaUsuarios;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function GetUsuarioFoto(id) {
    try {
        const resposta = await fetch(`http://localhost:8080/api/usuarios/foto/${id}`, {
            method: 'GET'
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar foto do usuário");
        }

        const data = await resposta.blob();

        return URL.createObjectURL(data);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function PutUSuario(id, foto, nome, email) {
    try {
        const formData = new FormData();
        formData.append('imagem', foto);
        formData.append('nome', nome);
        formData.append('email', email);

        console.log(foto);
        console.log(nome);
        console.log(email);

        console.log(formData);

        fetch('http://localhost:8080/api/usuarios/atualizar/' + id, {
            method: 'PUT',
            body: formData
        })
            .then(resposta => resposta.text())
            .then(usuario => console.log(usuario))
            .catch(error => console.log(error));
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function DeleteUsuario(id) {
    try {
        const resposta = await fetch('http://localhost:8080/api/usuarios/deletar/' + id, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            throw new Error("Erro ao deletar usuário");
        }

        const data = await resposta.text();

        console.log(data);
    } catch (error) {
        console.error(error);
        return null;
    }
}