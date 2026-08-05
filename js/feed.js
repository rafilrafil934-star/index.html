// Feed module
let videos = [];
let currentVideoIndex = 0;

// Load videos from Firestore
function loadVideos() {
    db.collection('videos')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get()
        .then((snapshot) => {
            videos = [];
            snapshot.forEach((doc) => {
                videos.push({ id: doc.id, ...doc.data() });
            });
            renderFeed();
        })
        .catch((error) => {
            console.error("Error loading videos:", error);
            // Show demo videos if no data
            showDemoVideos();
        });
}

// Show demo videos (if no data in Firestore)
function showDemoVideos() {
    videos = [
        {
            id: 'demo1',
            title: 'Ночь в заброшенной больнице',
            author: 'Мрачный Влад',
            authorAvatar: '',
            videoUrl: '',
            thumbnail: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            likes: 234,
            hearts: 1200,
            wows: 89,
            angry: 12,
            views: 5400
        },
        {
            id: 'demo2',
            title: 'Приключения на Марсе. Эпизод 3',
            author: 'Космо-Кот',
            authorAvatar: '',
            videoUrl: '',
            thumbnail: 'linear-gradient(135deg, #2d1b4e, #1a1a2e)',
            likes: 567,
            hearts: 2100,
            wows: 234,
            angry: 5,
            views: 8900
        },
        {
            id: 'demo3',
            title: 'Как я спас мир за 5 минут',
            author: 'Доктор Зелёный',
            authorAvatar: '',
            videoUrl: '',
            thumbnail: 'linear-gradient(135deg, #0f3460, #16213e)',
            likes: 89,
            hearts: 456,
            wows: 1100,
            angry: 45,
            views: 3200
        }
    ];
    renderFeed();
}

// Render video feed
function renderFeed() {
    const container = document.getElementById('video-feed');
    if (!container) return;

    container.innerHTML = videos.map(video => `
        <div class="video-card" data-id="${video.id}">
            <div class="video-player-container">
                <div class="video-thumbnail" style="background: ${video.thumbnail || '#1a1a2e'}">
                    <div class="play-btn">▶</div>
                </div>
                <video class="video-element" loop playsinline style="display: none;">
                    <source src="${video.videoUrl || ''}" type="video/mp4">
                </video>
            </div>
            <div class="video-info">
                <div class="video-author-row">
                    <div class="author-avatar"></div>
                    <div class="author-info">
                        <div class="author-name">${video.author || 'Аноним'}</div>
                        <div class="video-title">${video.title}</div>
                    </div>
                </div>
                <div class="video-stats-row">
                    <span class="views">${formatNumber(video.views || 0)} просмотров</span>
                </div>
                <div class="reactions">
                    <button class="reaction-btn" onclick="addReaction('${video.id}', 'like')">
                        😂 <span>${formatNumber(video.likes || 0)}</span>
                    </button>
                    <button class="reaction-btn" onclick="addReaction('${video.id}', 'heart')">
                        ❤️ <span>${formatNumber(video.hearts || 0)}</span>
                    </button>
                    <button class="reaction-btn" onclick="addReaction('${video.id}', 'wow')">
                        😮 <span>${formatNumber(video.wows || 0)}</span>
                    </button>
                    <button class="reaction-btn" onclick="addReaction('${video.id}', 'angry')">
                        😡 <span>${formatNumber(video.angry || 0)}</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers for play
    document.querySelectorAll('.video-thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const card = this.closest('.video-card');
            playVideo(card);
        });
    });
}

// Play video
function playVideo(card) {
    const thumbnail = card.querySelector('.video-thumbnail');
    const video = card.querySelector('.video-element');

    if (video.src && video.src !== window.location.href) {
        thumbnail.style.display = 'none';
        video.style.display = 'block';
        video.play();
    } else {
        alert('Видео загружается...');
    }
}

// Add reaction
function addReaction(videoId, type) {
    if (!currentUser) {
        alert('Войдите, чтобы поставить реакцию');
        return;
    }

    // Update in Firestore
    const videoRef = db.collection('videos').doc(videoId);
    const update = {};
    update[type + 's'] = firebase.firestore.FieldValue.increment(1);

    videoRef.update(update)
        .then(() => {
            loadVideos(); // Reload to show updated counts
        })
        .catch((error) => {
            console.error("Error adding reaction:", error);
        });
}

// Format numbers (1200 → 1.2K)
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Load videos on page load
document.addEventListener('DOMContentLoaded', loadVideos);
