export class Amizade {
    constructor(id_amizade, id_jogador_1, id_jogador_2, amizade_pendente) {
        this._id_amizade = id_amizade;
        this._id_jogador_1 = id_jogador_1;
        this._id_jogador_2 = id_jogador_2;
        this._amizade_pendente = amizade_pendente;
    }

    get id_amizade() {
        return this._id_amizade;
    }

    set id_amizade(value) {
        this._id_amizade = value;
    }

    get id_jogador_1() {
        return this._id_jogador_1;
    }

    set id_jogador_1(value) {
        this._id_jogador_1 = value;
    }

    get id_jogador_2() {
        return this._id_jogador_2;
    }

    set id_jogador_2(value) {
        this._id_jogador_2 = value;
    }

    get amizade_pendente() {
        return this._amizade_pendente;
    }

    set amizade_pendente(value) {
        this._amizade_pendente = value;
    }

    static formatBackEndData(backEndData) {
        const idAmizade = backEndData.id_amizade;
        const id1 = backEndData.id_jogador_1;
        const id2 = backEndData.id_jogador_2;
        const pendencia = backEndData.amizade_pendente;

        return new Amizade(idAmizade, id1, id2, pendencia);
    }

    static formatBackEndList(backEndList) {
        return Array.isArray(backEndList)
            ? backEndList.map((backEndData) => this.formatBackEndData(backEndData))
            : [];
    }
}