import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    // Inicializar Firebase Firestore
    const db = getFirestore();  // Conexión a Firestore
    const auth = getAuth();     // Autenticación de Firebase

    // Cargar comentarios para cada entrada
    document.querySelectorAll(".entry").forEach(entry => {
        const entryDate = entry.querySelector(".entry-date").textContent;

        // Crear el icono de comentario
        const commentIcon = document.createElement("span");
        commentIcon.classList.add("material-icons", "comment-icon");
        commentIcon.textContent = "chat_bubble";

        // Crear el contador de comentarios
        const commentCount = document.createElement("span");
        commentCount.classList.add("comment-count");

        // Crear un contenedor para el icono y el contador
        const commentIconContainer = document.createElement("div");
        commentIconContainer.classList.add("comment-icon-container");
        commentIconContainer.appendChild(commentIcon);
        commentIconContainer.appendChild(commentCount);
        entry.appendChild(commentIconContainer);

        // Crear la ventana de comentarios (por defecto está oculta)
        const commentBox = document.createElement("div");
        commentBox.classList.add("comment-box");
        commentBox.innerHTML = `
            <div class="comments"></div>
            <input type="text" placeholder="Escribe un comentario..." />
        `;
        commentBox.style.display = "none"; // Ocultar por defecto
        entry.appendChild(commentBox);

        // Mostrar la ventana de comentarios cuando se hace clic en el icono
        commentIcon.addEventListener("click", () => {
            // Si la caja está oculta, mostrarla; si está visible, ocultarla
            const currentDisplay = commentBox.style.display;
            commentBox.style.display = (currentDisplay === "none" || currentDisplay === "") ? "block" : "none";
        });

        // Enviar comentario
        commentBox.querySelector("input").addEventListener("keypress", async (e) => {
            if (e.key === "Enter") {
                const commentText = e.target.value.trim();
                if (commentText) {
                    const user = auth.currentUser;

                    if (!user) {
                        // Si el usuario no está autenticado, iniciar sesión con Google
                        const provider = new GoogleAuthProvider();
                        try {
                            const result = await signInWithPopup(auth, provider);
                            const user = result.user;
                            console.log("✅ Usuario autenticado:", user.displayName);

                            // Después de iniciar sesión, guardar el comentario
                            const commentData = {
                                user: user.displayName || "Anónimo",
                                text: commentText,
                                timestamp: new Date().toISOString()
                            };

                            const commentsRef = collection(db, "comments", entryDate, "comments");
                            await addDoc(commentsRef, commentData);
                            e.target.value = ""; // Limpiar input
                            loadComments(); // Recargar comentarios después de enviar
                        } catch (error) {
                            console.error("❌ Error al iniciar sesión:", error);
                            alert("Error al iniciar sesión. Inténtalo de nuevo.");
                        }
                    } else {
                        // Si el usuario ya está autenticado, guardar el comentario directamente
                        const commentData = {
                            user: user.displayName || "Anónimo",
                            text: commentText,
                            timestamp: new Date().toISOString()
                        };

                        const commentsRef = collection(db, "comments", entryDate, "comments");
                        addDoc(commentsRef, commentData).then(() => {
                            e.target.value = ""; // Limpiar input
                            loadComments(); // Recargar comentarios después de enviar
                        });
                    }
                }
            }
        });

        // Cargar comentarios desde Firestore
        function loadComments() {
            const commentsRef = collection(db, "comments", entryDate, "comments");
            getDocs(commentsRef).then((querySnapshot) => {
                const commentsContainer = commentBox.querySelector(".comments");
                commentsContainer.innerHTML = "";
                let count = 0;

                querySnapshot.forEach((doc) => {
                    const comment = doc.data();
                    const commentElement = document.createElement("div");
                    commentElement.innerHTML = `<strong>${comment.user}:</strong> ${comment.text}`;
                    commentsContainer.appendChild(commentElement);
                    count++;
                });

                // Actualizar el contador de comentarios
                if (count > 0) {
                    commentCount.textContent = count;
                } else {
                    commentCount.textContent = ""; // Ocultar el contador si no hay comentarios
                }
            });
        }

        loadComments();
    });
});