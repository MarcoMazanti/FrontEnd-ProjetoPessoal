export class Usuario {
    constructor(id, nome, email, imagem, pontuacao, jogosParticipados, vitorias, empates, derrotas){
        this._id = id;
        this._nome = nome;
        this._email = email;
        this._imagem = imagem;
        this._pontuacao = pontuacao;
        this._jogosParticipados = jogosParticipados;
        this._vitorias = vitorias;
        this._empates = empates;
        this._derrotas = derrotas;
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

    get jogosParticipados() {
        return this._jogosParticipados;
    }

    get vitorias() {
        return this._vitorias;
    }

    get empates() {
        return this._empates;
    }

    get derrotas() {
        return this._derrotas;
    }
}

// devo armazenar de forma externa para prevenir que o JS reinicie e perca todos os dados
class UsuarioManager {
    static usuarioLogado = null;

    static setUsuarioLogado(id, nome, email, imagem, pontuacao, jogosParticipados, vitorias, empates, derrotas) {
        this.usuarioLogado = new Usuario(id, nome, email, imagem, pontuacao, jogosParticipados, vitorias, empates, derrotas);

        // Criar um objeto simples com as propriedades que quer salvar no cookie
        const dados = {
            id: this.usuarioLogado._id,
            nome: this.usuarioLogado._nome,
            email: this.usuarioLogado._email,
            pontuacao: this.usuarioLogado._pontuacao,
            jogosParticipados: this.usuarioLogado._jogosParticipados,
            vitorias: this.usuarioLogado._vitorias,
            empates: this.usuarioLogado._empates,
            derrotas: this.usuarioLogado._derrotas
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
                dadosUsuario.pontuacao,
                dadosUsuario.jogosParticipados,
                dadosUsuario.vitorias,
                dadosUsuario.empates,
                dadosUsuario.derrotas
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
