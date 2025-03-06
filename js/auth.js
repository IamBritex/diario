document.addEventListener("DOMContentLoaded", () => {
    if (typeof firebase === "undefined") {
        console.error("❌ Firebase no se ha cargado correctamente.");
        return;
    }

    console.log("✅ Firebase cargado correctamente");

    const firebaseConfig = {
        apiKey: "AIzaSyBifprRYGKFSHxKF8TgLJuHlhUv1lSi5EY",
        authDomain: "diario-d6fec.firebaseapp.com",
        projectId: "diario-d6fec",
        storageBucket: "diario-d6fec.firebasestorage.app",
        messagingSenderId: "47564703165",
        appId: "1:47564703165:web:d68cc2c96d389445a37ed4",
        measurementId: "G-0MFSM1K0CG"
    };

    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth();
    const database = firebase.database();

    // Verificar si el usuario está autenticado al cargar la página
    auth.onAuthStateChanged(user => {
        const welcomeContainer = document.querySelector(".welcome-container");
        const loginButton = document.getElementById("login-google");

        if (user) {
            // Usuario autenticado
            console.log("✅ Usuario autenticado:", user.displayName);

            // Mostrar nombre de usuario, foto de perfil y botón de cerrar sesión
            welcomeContainer.innerHTML = `
                <h1>Bienvenido, ${user.displayName}</h1>
                <img src="${user.photoURL}" alt="Foto de ${user.displayName}" class="user-avatar">
                <p>${user.email}</p>
                <button id="logout-button">Cerrar sesión</button>
            `;

            // Ocultar el botón de inicio de sesión
            if (loginButton) loginButton.style.display = "none";

            // Agregar evento al botón de cerrar sesión
            document.getElementById("logout-button")?.addEventListener("click", () => {
                auth.signOut()
                    .then(() => {
                        console.log("✅ Sesión cerrada correctamente");
                        window.location.reload(); // Recargar la página para actualizar la UI
                    })
                    .catch(error => console.error("❌ Error al cerrar sesión:", error));
            });
        } else {
            // Usuario no autenticado
            console.log("❌ No hay usuario autenticado");

            // Mostrar el botón de inicio de sesión
            if (loginButton) loginButton.style.display = "block";
        }
    });

    // Botón de inicio de sesión
    document.getElementById("login-google")?.addEventListener("click", () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(result => {
                const user = result.user;
                console.log("✅ Usuario autenticado:", user.displayName);

                // Guardar datos en Firebase Database
                database.ref(`usuarios/${user.uid}`).set({
                    nombre: user.displayName,
                    email: user.email,
                    foto: user.photoURL
                });

                // Recargar la página para actualizar la UI
                window.location.reload();
            })
            .catch(error => console.error("❌ Error al iniciar sesión:", error));
    });
});