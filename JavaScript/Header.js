const iconHome = document.getElementById("iconHome");
const iconUsuario = document.getElementById("iconUser");

if (iconHome) {
    iconHome.addEventListener("click", () => {
        window.location.href = "HomePage.html";
    });
}

if (iconUsuario) {
    iconUsuario.addEventListener("click", () => {
        window.location.href = "../Pages/LoginPage.html";
    });
}