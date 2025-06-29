export class DadosJogo {
    constructor(altura, largura, quantBombas) {
        this._altura = altura;
        this._largura = largura;
        this._quantBombas = quantBombas;
    }

    get altura() {
        return this._altura;
    }

    set altura(value) {
        this._altura = value;
    }

    get largura() {
        return this._largura;
    }

    set largura(value) {
        this._largura = value;
    }

    get quantBombas() {
        return this._quantBombas;
    }

    set quantBombas(value) {
        this._quantBombas = value;
    }
}