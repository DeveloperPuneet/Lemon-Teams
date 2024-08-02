const title1 = document.getElementById("title1");
const link1 = document.getElementById("link1");
const title2 = document.getElementById("title2");
const link2 = document.getElementById("link2");
const title3 = document.getElementById("title3");
const link3 = document.getElementById("link3");
const title4 = document.getElementById("title4");
const link4 = document.getElementById("link4");
const FileInput = document.getElementById("FileInput");
const ChangeProfile = document.getElementById("ChangeProfile");

ChangeProfile.addEventListener("click", () => {
    FileInput.click();
});

setInterval(() => {
    if (title1.value.trim() !== "") {
        link1.setAttribute("required", "");
    }
    if (link1.value.trim() !== "") {
        title1.setAttribute("required", "");
    }
    if (title1.value.trim() == "") {
        link1.removeAttribute("required");
    }
    if (link1.value.trim() == "") {
        title1.removeAttribute("required");
    }
    if (title2.value.trim() !== "") {
        link2.setAttribute("required", "");
    }
    if (link2.value.trim() !== "") {
        title2.setAttribute("required", "");
    }
    if (title2.value.trim() == "") {
        link2.removeAttribute("required");
    }
    if (link2.value.trim() == "") {
        title2.removeAttribute("required");
    }
    if (title3.value.trim() !== "") {
        link3.setAttribute("required", "");
    }
    if (link3.value.trim() !== "") {
        title3.setAttribute("required", "");
    }
    if (title3.value.trim() == "") {
        link3.removeAttribute("required");
    }
    if (link3.value.trim() == "") {
        title3.removeAttribute("required");
    }
    if (title4.value.trim() !== "") {
        link4.setAttribute("required", "");
    }
    if (link4.value.trim() !== "") {
        title4.setAttribute("required", "");
    }
    if (title4.value.trim() == "") {
        link4.removeAttribute("required");
    }
    if (link4.value.trim() == "") {
        title4.removeAttribute("required");
    }
}, 100);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('profile-form');

    form.addEventListener('submit', (event) => {
        const inputs = form.querySelectorAll('input[type="text"], textarea');

        inputs.forEach(input => {
            input.value = input.value.trim();
        });
    });
});
