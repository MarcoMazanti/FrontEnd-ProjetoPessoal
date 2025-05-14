import {PostLogin} from "../Service/ConectarUsuario.js";
import {PostUsuario} from "../Service/ConectarUsuario.js";
import {GetUsuario} from "../Service/ConectarUsuario.js";

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

function validacaoDeCadastro(senha, confirmarSenha) {
    if (senha === confirmarSenha) {
        return validacaoDeSenha(senha);
    } else {
        return false;
    }
}

document.getElementById("abrirPopUp").addEventListener("click", abrirPopup);

document.getElementById("fecharPopUp").addEventListener("click", fecharPopup);

/* Validação do login */
document.getElementById("formLogin").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    const usuarioLogado = PostLogin(email, senha);

    if (usuarioLogado != null) {
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

    // Verifica o tamanho da imagem
    if (img) {
        const tamanhoImagem = img.size;

        // Define o limite máximo de tamanho (em bytes) - 500KB
        const tamanhoMaximo = 500 * 1024;

        if (tamanhoImagem > tamanhoMaximo) {
            alert("A imagem selecionada é muito grande! O tamanho máximo permitido é 500KB.");
        }
    } else {
        alert("Nenhuma imagem foi selecionada.");
    }

    // Verifica se os elementos não estão nulos
    if (!img || !nome || !email || !senha || !confirmarSenha) {
        alert("Preencha todos os campos devidamente!");
    } else {
        if (validacaoDeCadastro(senha, confirmarSenha)) {
            const verificarUsuarioExistente = await GetUsuario(email);

            // verifica se o usuário já existe(!null) ou não(null)
            if (verificarUsuarioExistente == null) {
                PostUsuario(nome, email, senha, img);

                fecharPopup();
            } else {
                alert("Usuário já cadastrado!");
            }
        } else {
            alert("Senha inválida\nDigite uma senha com no mínimo 8 caracteres\nLetras maiúsculas, minúsculas e números");
        }
    }
});

/* Mostra a foto escolhida para a conta */
document.getElementById('fotoUsuario').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('image-preview');

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.innerHTML = '';
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        }

        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '<p>Nenhuma imagem selecionada</p>';
    }
});