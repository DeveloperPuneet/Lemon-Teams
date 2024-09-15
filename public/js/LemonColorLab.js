document.getElementById('searching').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();
    const palettes = document.querySelectorAll('.palette');

    palettes.forEach(palette => {
        const text = Array.from(palette.querySelectorAll('.hide')).map(element => element.innerText.toLowerCase()).join(' ');
        if (text.includes(searchValue)) {
            palette.style.display = '';
        } else {
            palette.style.display = 'none';
        }
    });

    if (searchValue === '') {
        palettes.forEach(palette => {
            palette.style.display = '';
        });
    }
});

let currentPage = 1; // Keep track of the current page
const limit = 50; // Number of palettes to load per request

// Function to load palettes from the server
const loadPalettes = async (section, containerClass) => {
    const response = await fetch(`https://lemonteams.onrender.com/get-palettes?page=${currentPage}&limit=${limit}`);
    const data = await response.json();

    if (data.palettes.length > 0) {
        renderPalettes(data.palettes, section, containerClass);
        currentPage++; // Increment the page for the next load
    }
};

// Function to render palettes on the page
function renderPalettes(palettes) {
    const paletteContainer = document.querySelector('.main .container-trending');
    paletteContainer.innerHTML = '';  // Clear previous palettes

    palettes.forEach(palette => {
        const colors = [
            palette.color1, palette.color2, palette.color3, palette.color4, 
            palette.color5, palette.color6, palette.color7, palette.color8, 
            palette.color9, palette.color10
        ].filter(Boolean); // This filters out empty strings

        const paletteElement = document.createElement('a');
        paletteElement.href = `https:lemonteams.onrender.com/open-palette?code=${palette.code}`;
        paletteElement.classList.add('palette');

        // Iterate over the colors and create elements
        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.classList.add('color');
            colorDiv.style.background = color;
            paletteElement.appendChild(colorDiv);
        });

        paletteContainer.appendChild(paletteElement);
    });
}

// Infinite scrolling logic
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
        // Load more palettes as user reaches near bottom of the page
        loadPalettes("trending", "container-trending"); // Load trending palettes
    }
});

loadPalettes("trending", "container-trending"); // Load trending palettes
