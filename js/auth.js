// Auth module
let currentUser = null;

// Google Sign In
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            currentUser = result.user;
            updateUI();
            createUserProfile(currentUser);
        })
        .catch((error) => {
            console.error("Auth error:", error);
            alert("Ошибка входа: " + error.message);
        });
}

// Sign Out
function signOut() {
    auth.signOut().then(() => {
        currentUser = null;
        updateUI();
    });
}

// Create user profile in Firestore
function createUserProfile(user) {
    const userRef = db.collection('users').doc(user.uid);
    userRef.get().then((doc) => {
        if (!doc.exists) {
            userRef.set({
                name: user.displayName || 'Аноним',
                email: user.email,
                avatar: user.photoURL || '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                subscribers: 0,
                videosCount: 0
            });
        }
    });
}

// Update UI based on auth state
function updateUI() {
    const authBtn = document.getElementById('auth-btn');
    const userAvatar = document.getElementById('user-avatar');

    if (currentUser) {
        if (authBtn) authBtn.innerHTML = 'Выйти';
        if (authBtn) authBtn.onclick = signOut;
        if (userAvatar) {
            userAvatar.src = currentUser.photoURL || 'https://via.placeholder.com/40';
            userAvatar.style.display = 'block';
        }
    } else {
        if (authBtn) authBtn.innerHTML = 'Войти';
        if (authBtn) authBtn.onclick = signInWithGoogle;
        if (userAvatar) userAvatar.style.display = 'none';
    }
}

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    currentUser = user;
    updateUI();
});

// Check if user is logged in
function requireAuth() {
    if (!currentUser) {
        alert('Войдите, чтобы продолжить');
        return false;
    }
    return true;
}
