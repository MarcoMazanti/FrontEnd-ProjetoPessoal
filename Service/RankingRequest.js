import {RankingUsuario} from "../JavaScript/Models/RankingUsuario.js";

export async function getRankingTodos() {
    try {
        const resposta = await fetch('http://localhost:8080/api/ranking/jogadores', {
            method: 'GET'
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar ranking");
        }

        return await resposta.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getRanking(id) {
    try {
        const resposta = await fetch(`http://localhost:8080/api/ranking/jogador/${id}`, {
            method: 'GET'
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar ranking");
        }

        const data = await resposta.json();
        return new RankingUsuario(data.id, data.nome, data.pontuacao, data.ranking);
    } catch (error) {
        console.error(error);
        return null;
    }
}