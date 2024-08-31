document.getElementById('versionSearch').addEventListener('input', function () {
    const searchValue = this.value.trim();
    const libCards = document.querySelectorAll('.lib-card');

    libCards.forEach(card => {
        const version = card.querySelector('.hide').textContent.trim();
        if (version.includes(searchValue)) {
            card.parentElement.style.display = 'block';
        } else {
            card.parentElement.style.display = 'none';
        }
    });
});
