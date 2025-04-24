
function logout() {
    localStorage.removeItem("isLoggedIn");
    document.getElementById("auth-options").style.display = "block";
    document.getElementById("logout-option").style.display = "none";
    document.getElementById("logout-option").style.display = "none"; 
}


document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        document.getElementById("auth-options").style.display = "none";
        document.getElementById("logout-option").style.display = "block";
    }
});