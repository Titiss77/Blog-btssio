document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour charger les films depuis le JSON
    async function loadMovies() {
        try {
            const response = await fetch('films.json');
            const data = await response.json();
            displayMovies(data.films);
        } catch (error) {
            console.error('Erreur lors du chargement des films:', error);
        }
    }

    // Fonction pour afficher les films
    function displayMovies(films) {
        const contentGrid = document.querySelector('.content-grid');
        contentGrid.innerHTML = films.map(film => createMovieCard(film)).join('');
    }

    // Fonction pour créer une carte de film
    function createMovieCard(film) {
        return `
            <div class="content-card" onclick="window.location.href='movie-player.html?id=${film.id}'">
                ${film.nouveau ? '<div class="card-badge">Nouveau</div>' : ''}
                <img src="${film.image}" alt="${film.titre}" class="content-image">
                <div class="content-info">
                    <h3 class="content-title">${film.titre}</h3>
                    <div class="movie-details">
                        <span>${film.annee}</span>
                        <span>${film.genre.join(', ')}</span>
                    </div>
                    <div class="rating">${'★'.repeat(Math.floor(film.note))}${'☆'.repeat(5-Math.floor(film.note))}</div>
                    <p class="content-description">${film.description}</p>
                    <div class="card-actions">
                        <button class="btn" onclick="showMovieDetails('${film.id}')">Plus d'infos</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Fonction pour filtrer les films
    function filterMovies(searchTerm = '', genre = '', year = '') {
        fetch('films.json')
            .then(response => response.json())
            .then(data => {
                let filteredMovies = data.films.filter(film => {
                    const matchesSearch = film.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       film.description.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesGenre = !genre || film.genre.includes(genre);
                    const matchesYear = !year || film.annee === year;
                    return matchesSearch && matchesGenre && matchesYear;
                });
                displayMovies(filteredMovies);
            });
    }

    // Gestionnaire d'événements pour la recherche
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', (e) => {
        filterMovies(e.target.value);
    });

    // Gestionnaire d'événements pour les filtres
    const genreSelect = document.querySelector('#genre-filter');
    const yearSelect = document.querySelector('#year-filter');
    
    genreSelect?.addEventListener('change', () => {
        filterMovies(searchInput.value, genreSelect.value, yearSelect.value);
    });

    yearSelect?.addEventListener('change', () => {
        filterMovies(searchInput.value, genreSelect.value, yearSelect.value);
    });

    // Charger les films au démarrage
    loadMovies();
});