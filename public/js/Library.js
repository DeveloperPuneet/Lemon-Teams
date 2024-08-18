document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');
    const libraryCards = document.querySelectorAll('.lib-card');

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        libraryCards.forEach(card => {
            const textContent = card.querySelector('.hide').textContent.toLowerCase();
            if (textContent.includes(searchTerm)) {
                card.parentElement.style.display = '';
            } else {
                card.parentElement.style.display = 'none';
            }
        });
    });
});
