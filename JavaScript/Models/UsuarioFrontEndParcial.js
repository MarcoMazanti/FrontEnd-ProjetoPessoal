export class UsuarioFrontEndParcial {
    constructor(id, nome, email){
        this._id = id;
        this._nome = nome;
        this._email = email;
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

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    static fromBackendData(backendData) {
        const sourceData = backendData._id || backendData;

        return new UsuarioFrontEndParcial(
            sourceData.id,
            sourceData.nome,
            sourceData.email
        );
    }
}