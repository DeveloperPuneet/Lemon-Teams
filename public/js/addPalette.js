document.addEventListener('DOMContentLoaded', () => {
    const colorInputs = document.querySelectorAll('.colors input[type="color"]');

    colorInputs.forEach(input => {
        input.addEventListener('input', (event) => {
            const colorValue = event.target.value;
            const backgroundElement = event.target.nextElementSibling;
            if (backgroundElement && backgroundElement.classList.contains('background')) {
                backgroundElement.style.backgroundColor = colorValue;
            } else {
                alert("not found");
            }
        });
    });
    const colorInput = document.querySelectorAll('.colors input[type="color"]');
    colorInput.forEach(input => {
        input.addEventListener('input', (event) => {
            const color = event.target.value;
            const hiddenInput = document.querySelector(`input[name="${event.target.name}Hex"]`); 
            if (hiddenInput) {
                hiddenInput.value = color; 
            }
        });
    });
});