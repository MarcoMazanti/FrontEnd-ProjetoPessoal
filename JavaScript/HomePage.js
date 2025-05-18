document.addEventListener("DOMContentLoaded", function () {
    // Carrega o HTML do Header dinamicamente
    fetch("../Pages/Header.html")
        .then(response => response.text())
        .then(data => {
            const headerContainer = document.getElementById("Header");
            if (headerContainer) {
                headerContainer.innerHTML = data;

                // Após o HTML estar no DOM, carrega o JS do Header
                const script = document.createElement("script");
                script.type = "module";
                script.src = "../JavaScript/Header.js";
                document.body.appendChild(script);
            } else {
                console.warn("Elemento com ID 'Header' não encontrado.");
            }
        });

    // Carrega o HTML do Footer dinamicamente
    fetch("../Pages/Footer.html")
        .then(response => response.text())
        .then(data => {
            const footerContainer = document.getElementById("Footer");
            if (footerContainer) {
                footerContainer.innerHTML = data;

                const script = document.createElement("script");
                script.type = "module";
                script.src = "../JavaScript/Footer.js";
                document.body.appendChild(script);
            } else {
                console.warn("Elemento com ID 'Footer' não encontrado.");
            }
        });
});

// edição da lista de Ranking
const jogadores = [
    {id: 1, nome: "marco", vitorias: 10, pontuacao: 25},
    {id: 5, nome: "Marco", vitorias:8, pontuacao: 35},
    {id: 7, nome: "MArco", vitorias: 7, pontuacao: 20},
    {id: 13, nome: "MARco", vitorias: 3, pontuacao: 19}
];

const tbody = document.querySelector("#listagem tbody");

let contador = 1;
jogadores.forEach(jogador => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${contador}</td>
        <td>${jogador.id}</td>       
        <td>${jogador.nome}</td>
        <td>${jogador.vitorias}</td>
        <td>${jogador.pontuacao}</td>
    `;

    contador++;
    tbody.appendChild(tr);
});