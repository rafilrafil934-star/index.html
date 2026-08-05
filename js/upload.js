// Upload module

// Handle video upload
function handleVideoUpload(event) {
    event.preventDefault();

    if (!requireAuth()) return;

    const file = document.getElementById('video-file').files[0];
    const title = document.getElementById('video-title').value;
    const description = document.getElementById('video-description').value;
    const tags = document.getElementById('video-tags').value;

    if (!file) {
        alert('Выберите видео');
        return;
    }

    if (!title) {
        alert('Введите название');
        return;
    }

    // Show progress
    const progressBar = document.getElementById('upload-progress');
    const progressText = document.getElementById('progress-text');
    progressBar.style.display = 'block';

    // Upload to Firebase Storage
    const storageRef = storage.ref('videos/' + Date.now() + '_' + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.value = progress;
            progressText.textContent = Math.round(progress) + '%';
        },
        (error) => {
            console.error("Upload error:", error);
            alert('Ошибка загрузки: ' + error.message);
        },
        () => {
            // Upload complete
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                // Save video metadata to Firestore
                saveVideoMetadata(title, description, tags, downloadURL);
            });
        }
    );
}

// Save video metadata
function saveVideoMetadata(title, description, tags, videoUrl) {
    db.collection('videos').add({
        title: title,
        description: description,
        tags: tags.split(',').map(t => t.trim()),
        videoUrl: videoUrl,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Аноним',
        authorAvatar: currentUser.photoURL || '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        views: 0,
        likes: 0,
        hearts: 0,
        wows: 0,
        angry: 0
    })
    .then(() => {
        alert('Видео загружено!');
        window.location.href = 'index.html';
    })
    .catch((error) => {
        console.error("Error saving metadata:", error);
        alert('Ошибка сохранения: ' + error.message);
    });
}

// Preview video before upload
function previewVideo(input) {
    const file = input.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        const preview = document.getElementById('video-preview');
        preview.src = url;
        preview.style.display = 'block';
    }
}
