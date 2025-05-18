const gitHub = document.getElementById("gitHub");
const linkedIn = document.getElementById("linkedIn");

if (gitHub) {
    gitHub.addEventListener("click", () => {
        window.location.href = "https://github.com/MarcoMazanti";
    });
}

if (linkedIn) {
    linkedIn.addEventListener("click", () => {
        console.log("linkedIn");
        window.location.href = "https://www.linkedin.com/in/marco-aurélio-consoni-mazanti/";
    });
}