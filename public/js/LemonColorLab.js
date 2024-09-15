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
let limit = 50; // Number of palettes to load per request

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
    
    // Do not clear previous palettes, just append new ones
    
    // Check if palettes is an array and has items
    if (!Array.isArray(palettes) || palettes.length === 0) {
        console.error('Palettes data is invalid or empty');
        return;
    }

    palettes.forEach(palette => {
        // Ensure that the palette object is valid and colors are present
        if (!palette) {
            console.warn('Palette data is undefined');
            return;
        }

        const colors = [
            palette.color1, palette.color2, palette.color3, palette.color4, 
            palette.color5, palette.color6, palette.color7, palette.color8, 
            palette.color9, palette.color10
        ].filter(Boolean); // Filter out empty or undefined color values

        const paletteElement = document.createElement('a');
        paletteElement.href = `/open-palette?code=${palette.code}`;
        paletteElement.classList.add('palette');

        // Check if there are any colors to display
        if (colors.length > 0) {
            colors.forEach(color => {
                const colorDiv = document.createElement('div');
                colorDiv.classList.add('color');
                colorDiv.style.background = color;
                paletteElement.appendChild(colorDiv);
            });
        } else {
            console.warn(`No valid colors found for palette: ${palette.code}`);
        }

        paletteContainer.appendChild(paletteElement); // Append the new palettes to the container
    });
}

// Infinite scrolling logic
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 400) {
        // Load more palettes as user reaches near bottom of the page
        loadPalettes("trending", "container-trending"); // Load trending palettes
    }
});

loadPalettes("trending", "container-trending"); // Load trending palettes initially