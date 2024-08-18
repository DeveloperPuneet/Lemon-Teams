const menu = document.getElementById("menu");
const close = document.getElementById("close");
menu.addEventListener("click", () => {
    document.getElementById("options").style.right = "0"
});
close.addEventListener("click", () => {
    document.getElementById("options").style.right = "-400px"
});
document.addEventListener("scroll", () => {
    document.getElementById("options").style.right = "-400px"
});