document.addEventListener("DOMContentLoaded", () => {
    const colorBoxes = document.querySelectorAll('.color-box');

    colorBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const color = box.getAttribute('data-color');
            navigator.clipboard.writeText(color).then(() => {
                box.innerHTML = "Copied to clipboard";
                setTimeout(() => {
                    box.innerHTML = color
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    });
});
