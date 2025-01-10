document.addEventListener("DOMContentLoaded", function() {
    const commentForm = document.getElementById('comment-form');
    const commentList = document.getElementById('comment-list');
    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');

    // Fonction pour afficher les commentaires sauvegardés
    function loadComments() {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        commentList.innerHTML = ""; // Effacer les anciens commentaires
        comments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.classList.add('comment');

            const commentHeader = document.createElement('div');
            commentHeader.classList.add('comment-header');
            commentHeader.textContent = `${comment.name} - ${comment.date}`;

            const commentText = document.createElement('p');
            commentText.classList.add('comment-text');
            commentText.textContent = comment.text;

            commentItem.appendChild(commentHeader);
            commentItem.appendChild(commentText);
            commentList.appendChild(commentItem);
        });
    }

    // Fonction pour ajouter un nouveau commentaire
    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const text = textInput.value.trim();

        if (name && text) {
            // Créer un objet de commentaire
            const newComment = {
                name: name,
                text: text,
                date: new Date().toLocaleString()
            };

            // Récupérer les commentaires existants dans le localStorage
            const comments = JSON.parse(localStorage.getItem('comments')) || [];

            // Ajouter le nouveau commentaire
            comments.push(newComment);

            // Sauvegarder à nouveau dans le localStorage
            localStorage.setItem('comments', JSON.stringify(comments));

            // Réinitialiser le formulaire
            nameInput.value = '';
            textInput.value = '';

            // Recharger les commentaires
            loadComments();
        }
    });

    // Charger les commentaires au démarrage de la page
    loadComments();
});
