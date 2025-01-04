const code = document.getElementById("code");
const copyBtn = document.getElementById("copyBtn");

copyBtn.addEventListener("click", () => {
    const textToCopy = code.textContent; // Get the text content of the code element
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert("Code copied to clipboard!");
        })
        .catch((err) => {
            console.error("Failed to copy code: ", err);
        });
});
