export class Jogo {
    constructor(id, id_jogador, array, data, pontuacao, ehFim) {
        this._id = id;
        this._id_jogador = id_jogador;
        this._array = array;
        this._data = data;
        this._pontuacao  = pontuacao;
        this._ehFim = ehFim;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get id_jogador() {
        return this._id_jogador;
    }

    set id_jogador(value) {
        this._id_jogador = value;
    }

    get array() {
        return this._array;
    }

    set array(value) {
        this._array = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get pontuacao() {
        return this._pontuacao;
    }

    set pontuacao(value) {
        this._pontuacao = value;
    }

    get ehFim() {
        return this._ehFim;
    }

    set ehFim(value) {
        this._ehFim = value;
    }

    static formatBackEndData(backEndData) {
        const id = backEndData.id;
        const idJogador = backEndData.idJogador;
        const array = backEndData.array;
        const data = backEndData.data;
        const pontuacao = backEndData.pontuacao;
        const ehFim = backEndData.ehFim;

        return new Jogo(id, idJogador, array, data, pontuacao, ehFim);
    }

    static formatBackEndList(backEndList) {
        return backEndList.map((backEndData) => this.formatBackEndData(backEndData));
    }
}