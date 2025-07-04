import {
    PostLogin,
    PostUsuario,
    GetUsuario,
    PostVerificarInexistenciaEmailCadasatrar
} from "../Service/ConectarUsuario.js";
import UsuarioManager from "./Models/Usuario.js";

let usuarioLogado = null;

function abrirPopup() {
    document.getElementById("popupOverlay").classList.add("active");
    document.getElementById("formCadastro").reset();
    document.getElementById("image-preview").innerHTML = '<p>Nenhuma imagem selecionada</p>';
}

function fecharPopup() {
    document.getElementById("popupOverlay").classList.remove("active");
}

function validacaoDeSenha(senha) {
    let temMaiusculo = false;
    let temMinusculo = false;
    let temNumero = false;
    let tem8Letras = false;

    if (senha.length >= 8) {
        tem8Letras = true;

        for (const letra of senha) {
            if (letra.match(/[A-Z]/)) {
                temMaiusculo = true;
            }

            if (letra.match(/[a-z]/i)) {
                temMinusculo = true;
            }

            if (letra.match(/[0-9]/)) {
                temNumero = true;
            }
        }
    }

    return temMaiusculo && temMinusculo && temNumero && tem8Letras;
}

async function validacaoDeCadastro(email, senha, confirmarSenha) {
    if (senha === confirmarSenha) {
        if (await PostVerificarInexistenciaEmailCadasatrar(email)) {
            return validacaoDeSenha(senha);
        } else {
            alert("Email já cadastrado!");
            return false;
        }
    } else {
        return false;
    }
}

document.getElementById("abrirPopUp").addEventListener("click", abrirPopup);

document.getElementById("fecharPopUp").addEventListener("click", fecharPopup);

/* Validação do login */
document.getElementById("formLogin").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    usuarioLogado = await PostLogin(email, senha);

     if (usuarioLogado !== undefined && usuarioLogado != null) {
         UsuarioManager.setUsuarioLogado(
             usuarioLogado.id,
             usuarioLogado.nome,
             usuarioLogado.email,
             usuarioLogado.imagem,
             usuarioLogado.pontuacao);
         window.location.href = "../Pages/HomePage.html";
    } else {
        alert("Usuário não encontrado!");
    }
});

/* Verifica os dados para cadastrar */
document.getElementById("formCadastro").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Previne de tentar mexer com valores inexistentes
    const imgInput = document.getElementById("fotoUsuario");
    const img = imgInput && imgInput.files.length > 0 ? imgInput.files[0] : null;

    const nomeInput = document.getElementById("nomeCadastro");
    const nome = nomeInput ? nomeInput.value.trim() : null;

    const emailInput = document.getElementById("emailCadastro");
    const email = emailInput ? emailInput.value.trim() : null;

    const senhaInput = document.getElementById("senhaCadastro");
    const senha = senhaInput ? senhaInput.value.trim() : null;

    const confirmarSenhaInput = document.getElementById("confirmarSenhaCadastro");
    const confirmarSenha = confirmarSenhaInput ? confirmarSenhaInput.value.trim() : null;

    // Verifica se os elementos não estão nulos
    if (!img || !nome || !email || !senha || !confirmarSenha) {
        alert("Preencha todos os campos devidamente!");
    } else {
        if (!(await validacaoDeCadastro(email, senha, confirmarSenha))) {
            alert("Senha inválida\nDigite uma senha com no mínimo 8 caracteres\nLetras maiúsculas, minúsculas e números");
        } else {
            const verificarUsuarioExistente = await GetUsuario(email);

            if (verificarUsuarioExistente == null) {
                PostUsuario(nome, email, senha, img);

                fecharPopup();
            } else {
                alert("Usuário já cadastrado!");
            }
        }
    }
});

/* Mostra a foto escolhida para a conta */
document.getElementById('fotoUsuario').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('image-preview');

    if (file) {
        if (file.size <= 500 * 1024) {
            const reader = new FileReader();

            reader.onload = function(e) {
                preview.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                preview.appendChild(img);
            }

            reader.readAsDataURL(file);
        } else {
            alert("A imagem selecionada é muito grande! O tamanho máximo permitido é 500KB.");
            preview.innerHTML = '<p>Nenhuma imagem selecionada</p>';
        }
    } else {
        preview.innerHTML = '<p>Nenhuma imagem selecionada</p>';
    }
});