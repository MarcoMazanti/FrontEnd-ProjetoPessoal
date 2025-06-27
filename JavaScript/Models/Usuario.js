export class Usuario {
    constructor(id, nome, email, imagem, pontuacao){
        this._id = id;
        this._nome = nome;
        this._email = email;
        this._imagem = imagem;
        this._pontuacao = pontuacao;
    }

    get id() {
        return this._id;
    }

    get nome() {
        return this._nome;
    }

    get email() {
        return this._email;
    }

    get imagem() {
        return this._imagem;
    }

    get pontuacao() {
        return this._pontuacao;
    }

    static formatBackEndData(backEndData) {
        const id = backEndData.id;
        const nome = backEndData.nome;
        const email = backEndData.email;
        const imagem = backEndData.imagem;
        const pontuacao = backEndData.pontuacao;

        return new Usuario(id, nome, email, imagem, pontuacao);
    }

    static formatBackEndList(backEndList) {
        return backEndList.map((backEndData) => this.formatBackEndData(backEndData));
    }
}

// devo armazenar de forma externa para prevenir que o JS reinicie e perca todos os dados
class UsuarioManager {
    static usuarioLogado = null;

    static setUsuarioLogado(id, nome, email, imagem, pontuacao) {
        this.usuarioLogado = new Usuario(id, nome, email, imagem, pontuacao);

        // Criar um objeto simples com as propriedades que quer salvar no cookie
        const dados = {
            id: this.usuarioLogado._id,
            nome: this.usuarioLogado._nome,
            email: this.usuarioLogado._email,
            pontuacao: this.usuarioLogado._pontuacao
        };

        // Converter para JSON e codificar para o cookie
        const dadosString = encodeURIComponent(JSON.stringify(dados));

        const data = new Date();
        data.setHours(data.getHours() + 12);  // cookie expira em 12h

        document.cookie = `usuario=${dadosString}; expires=${data.toUTCString()}; path=/`;
    }

    static getUsuarioLogado() {
        const dadosUsuario = getUsuarioDoCookie();


        if (dadosUsuario) {
            this.usuarioLogado = new Usuario(
                dadosUsuario.id,
                dadosUsuario.nome,
                dadosUsuario.email,
                dadosUsuario.imagem,
                dadosUsuario.pontuacao
            );
        } else {
            console.log("Cookie não encontrado ou inválido.");
        }

        return this.usuarioLogado;
    }

    static limparSessao() {
        this.usuarioLogado = null;
        document.cookie = "usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    static printer() {
        console.log(this.usuarioLogado);
    }
}

export default UsuarioManager;

function getUsuarioDoCookie() {
    const cookies = document.cookie.split('; ');

    for (let i = 0; i < cookies.length; i++) {
        const [chave, valor] = cookies[i].split('=');
        if (chave === 'usuario') {
            try {
                return JSON.parse(decodeURIComponent(valor));
            } catch (e) {
                console.error("Erro ao converter cookie:", e);
                return null;
            }
        }
    }

    return null;
}
