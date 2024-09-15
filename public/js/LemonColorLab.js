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
const renderPalettes = (palettes, section, containerClass) => {
    const container = document.querySelector(`.${containerClass}`);
    palettes.forEach(palette => {
        const paletteLink = document.createElement("a");
        paletteLink.href = `/open-palette?code=${palette.code}`;
        
        const paletteDiv = document.createElement("div");
        paletteDiv.classList.add("palette");

        paletteDiv.innerHTML = palette.colors.map(color => {
            if (color) {
                return `<div class="color" style="background: ${color};"></div>`;
            }
            return '';
        }).join('');

        paletteLink.appendChild(paletteDiv);
        container.appendChild(paletteLink);
    });
};

// Infinite scrolling logic
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
        // Load more palettes as user reaches near bottom of the page
        loadPalettes("trending", "container-trending"); // Load trending palettes
    }
});

loadPalettes("trending", "container-trending"); // Load trending palettes
