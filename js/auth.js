// Auth module - Email/Password only
let currentUser = null;

function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.style.display = 'flex';
}

function hideAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.style.display = 'none';
}

function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function registerWithEmail(event) {
    event.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;
    
    if (password.length < 6) {
        alert('Пароль должен быть минимум 6 символов');
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
            currentUser = result.user;
            return currentUser.updateProfile({
                displayName: name || 'Пользователь'
            });
        })
        .then(() => {
            createUserProfile(currentUser);
            hideAuthModal();
            updateUI();
            alert('Регистрация успешна!');
        })
        .catch((error) => {
            console.error("Register error:", error);
            let msg = 'Ошибка регистрации';
            if (error.code === 'auth/email-already-in-use') msg = 'Этот email уже занят';
            if (error.code === 'auth/invalid-email') msg = 'Неверный email';
            if (error.code === 'auth/weak-password') msg = 'Слабый пароль (минимум 6 символов)';
            alert(msg);
        });
}

function loginWithEmail(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((result) => {
            currentUser = result.user;
            hideAuthModal();
            updateUI();
        })
        .catch((error) => {
            console.error("Login error:", error);
            let msg = 'Ошибка входа';
            if (error.code === 'auth/user-not-found') msg = 'Пользователь не найден';
            if (error.code === 'auth/wrong-password') msg = 'Неверный пароль';
            if (error.code === 'auth/invalid-email') msg = 'Неверный email';
            alert(msg);
        });
}

function signOut() {
    auth.signOut().then(() => {
        currentUser = null;
        updateUI();
    });
}

function createUserProfile(user) {
    const userRef = db.collection('users').doc(user.uid);
    userRef.get().then((doc) => {
        if (!doc.exists) {
            userRef.set({
                name: user.displayName || 'Пользователь',
                email: user.email,
                avatar: user.photoURL || '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                subscribers: 0,
                videosCount: 0
            });
        }
    });
}

function updateUI() {
    const authBtn = document.getElementById('auth-btn');
    const userAvatar = document.getElementById('user-avatar');
    const uploadBtn = document.getElementById('upload-btn');
    
    if (currentUser) {
        if (authBtn) {
            authBtn.innerHTML = 'Выйти';
            authBtn.onclick = signOut;
        }
        if (userAvatar) {
            userAvatar.src = currentUser.photoURL || 'https://via.placeholder.com/40';
            userAvatar.style.display = 'block';
        }
        if (uploadBtn) uploadBtn.style.display = 'inline-flex';
    } else {
        if (authBtn) {
            authBtn.innerHTML = 'Войти';
            authBtn.onclick = showAuthModal;
        }
        if (userAvatar) userAvatar.style.display = 'none';
        if (uploadBtn) uploadBtn.style.display = 'none';
    }
}

function requireAuth() {
    if (!currentUser) {
        showAuthModal();
        return false;
    }
    return true;
}

auth.onAuthStateChanged((user) => {
    currentUser = user;
    updateUI();
});

