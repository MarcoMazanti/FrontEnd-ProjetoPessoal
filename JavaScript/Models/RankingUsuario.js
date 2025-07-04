export class RankingUsuario {
    constructor(id, nome, pontuacao, ranking) {
        this._id = id;
        this._nome = nome;
        this._pontuacao = pontuacao;
        this._ranking = ranking;
    }


    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get nome() {
        return this._nome;
    }

    set nome(value) {
        this._nome = value;
    }

    get pontuacao() {
        return this._pontuacao;
    }

    set pontuacao(value) {
        this._pontuacao = value;
    }

    get ranking() {
        return this._ranking;
    }

    set ranking(value) {
        this._ranking = value;
    }
}