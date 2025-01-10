// Système de gestion des commentaires amélioré
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    const starRating = document.getElementById('starRating');
    let selectedRating = 0;
    let currentUser = {
        id: 'user123', // Simulé - devrait venir de l'authentification
        username: 'John Doe',
        avatar: '/api/placeholder/32/32'
    };

    // Structure de données pour les commentaires
    let comments = [];
    let currentPage = 1;
    const commentsPerPage = 5;


    starRating.addEventListener('click', function(e) {
        if (e.target.tagName === 'SPAN') {
            selectedRating = parseInt(e.target.getAttribute('data-value'));
            updateStarRating(selectedRating);
        }
    });

    function updateStarRating(rating) {
        const stars = starRating.querySelectorAll('span');
        stars.forEach(star => {
            const value = parseInt(star.getAttribute('data-value'));
            star.classList.toggle('selected', value <= rating);
        });
    }

    const commentForm = document.getElementById('commentForm');
    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const commentContent = commentForm.querySelector('textarea').value;

        // Ajoutez la logique pour sauvegarder le commentaire ici
        console.log(`Commentaire ajouté: ${commentContent}, Note: ${selectedRating}`);
        
        // Réinitialisez le formulaire
        commentForm.reset();
        updateStarRating(0); // Réinitialise les étoiles
    });
    
    // Charger les détails du film
    async function loadMovieDetails() {
        try {
            const response = await fetch('films.json');
            const data = await response.json();
            const movie = data.films.find(f => f.id === movieId);
            if (movie) {
                displayMovieDetails(movie);
                loadComments(movieId);
            }
        } catch (error) {
            console.error('Erreur lors du chargement du film:', error);
        }
    }

    // Afficher les détails du film
    function displayMovieDetails(movie) {
        document.querySelector('.movie-title').textContent = movie.titre;
        document.querySelector('.movie-info').innerHTML = `
            <div class="flex items-center gap-4 mb-4">
                <p class="text-lg">Réalisé par ${movie.realisateur} (${movie.annee})</p>
                <div class="rating">${'★'.repeat(Math.floor(movie.note))}${'☆'.repeat(5-Math.floor(movie.note))}</div>
            </div>
            <p class="text-gray-300">Genre: ${movie.genre.join(', ')}</p>
            <p class="mt-4">${movie.description}</p>
        `;
        
        const videoPlayer = document.querySelector('#videoPlayer');
        videoPlayer.querySelector('source').src = movie.videoUrl;
        videoPlayer.load();
    }

    // Charger les commentaires
    async function loadComments(movieId) {
        try {
            // Simuler un appel API
            comments = [
                {
                    id: 'c1',
                    userId: 'user1',
                    username: 'Alice',
                    avatar: '/api/placeholder/32/32',
                    content: 'Excellent film ! La réalisation est impressionnante.',
                    date: new Date('2024-01-07'),
                    likes: 12,
                    userLiked: false,
                    note: 5
                },
                // Autres commentaires...
            ];
            displayComments(comments);
        } catch (error) {
            console.error('Erreur lors du chargement des commentaires:', error);
        }
    }

    // Afficher les commentaires
    function displayComments(comments) {
        const commentsContainer = document.querySelector('.comments-list');
        const start = (currentPage - 1) * commentsPerPage;
        const end = start + commentsPerPage;
        const paginatedComments = comments.slice(start, end);
    
        commentsContainer.innerHTML = paginatedComments.map(comment => `
            <div class="comment" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <div class="user-info">
                        <img src="${comment.avatar}" alt="${comment.username}" class="avatar">
                        <span class="username">${comment.username}</span>
                    </div>
                    <div class="rating">${'★'.repeat(comment.note)}</div>
                </div>
                <p class="comment-content">${comment.content}</p>
                <div class="comment-footer">
                    <span class="date">${new Date(comment.date).toLocaleDateString()}</span>
                    <button class="like-button ${comment.userLiked ? 'liked' : ''}" onclick="handleLike('${comment.id}')">
                        <span class="like-icon">${comment.userLiked ? '❤️' : '🤍'}</span>
                        <span class="like-count">${comment.likes}</span>
                    </button>
                </div>
            </div>
        `).join('');
    
        displayPaginationControls();
    }

    // Gérer les likes
    window.handleLike = function(commentId) {
        const commentIndex = comments.findIndex(c => c.id === commentId);
        if (commentIndex !== -1) {
            const comment = comments[commentIndex];
            if (comment.userLiked) {
                comment.likes--;
                comment.userLiked = false;
            } else {
                comment.likes++;
                comment.userLiked = true;
            }
            displayComments(comments);
            // Ici, vous feriez normalement une requête API pour persister le like
        }
    };

    function displayPaginationControls() {
        const paginationContainer = document.querySelector('.pagination');
        const totalPages = Math.ceil(comments.length / commentsPerPage);
        paginationContainer.innerHTML = Array.from({ length: totalPages }, (_, i) => `
            <button class="page-button ${i + 1 === currentPage ? 'active' : ''}" onclick="changePage(${i + 1})">${i + 1}</button>
        `).join('');
    }
    
    function changePage(page) {
        currentPage = page;
        displayComments(comments);
    }

    // Ajouter un nouveau commentaire
    async function addComment(event) {
        event.preventDefault();
        const form = event.target;
        const newComment = {
            id: `c${Date.now()}`,
            userId: currentUser.id,
            username: currentUser.username,
            avatar: currentUser.avatar,
            content: form.comment.value,
            date: new Date(),
            likes: 0,
            userLiked: false,
            note: parseInt(form.rating.value)
        };

        comments.unshift(newComment);
        displayComments(comments);
        form.reset();
    }

    // Initialiser la page
    loadMovieDetails();

    // Event listeners
    document.querySelector('#commentForm').addEventListener('submit', addComment);
});