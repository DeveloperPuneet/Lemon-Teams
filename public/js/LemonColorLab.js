document.getElementById('searching').addEventListener('input', function() {
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