export class Conversa {
    constructor(idAmizade, idJogador, mensagem) {
        this._idAmizade = idAmizade;
        this._idJogador = idJogador;
        this._mensagem = mensagem;
    }

    get idAmizade() {
        return this._idAmizade;
    }

    set idAmizade(value) {
        this._idAmizade = value;
    }

    get idJogador() {
        return this._idJogador;
    }

    set idJogador(value) {
        this._idJogador = value;
    }

    get mensagem() {
        return this._mensagem;
    }

    set mensagem(value) {
        this._mensagem = value;
    }

    static formatBackEndData(backEndData) {
        const idAmizade = backEndData.idAmizade;
        const idJogador = backEndData.idJogador;
        const mensagem = backEndData.mensagem;

        return new Conversa(idAmizade, idJogador, mensagem);
    }

    static formatBackEndList(backEndList) {
        return backEndList.map((backEndData) => this.formatBackEndData(backEndData));
    }
}