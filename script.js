// Global State Management
const State = {
    isBlown: false,
    currentFilter: 'normal',
    currentEmojis: [],
    isPlaying: false
};

// Audio Management
const AudioManager = {
    bgMusic: null,
    loginSound: null,
    loginError: null,
    birthdayJingle: null,

    init() {
        this.bgMusic = document.getElementById('bgMusic');
        this.loginSound = document.getElementById('loginSound');
        this.loginError = document.getElementById('loginError');
        
        if (this.bgMusic) {
            const shouldPlay = localStorage.getItem('musicPlaying') !== 'false';
            if (shouldPlay) this.playMusic();

            const audioToggle = document.getElementById('audioToggle');
            if (audioToggle) {
                audioToggle.addEventListener('click', () => this.toggleMusic());
                this.updateAudioButton(!shouldPlay);
            }
        }
    },

    async playMusic() {
        if (this.bgMusic && this.bgMusic.paused) {
            try {
                await this.bgMusic.play();
                State.isPlaying = true;
                this.updateAudioButton(false);
                localStorage.setItem('musicPlaying', 'true');
            } catch (error) {
                console.error('Error playing music:', error);
                document.addEventListener('click', () => this.playMusic(), { once: true });
            }
        }
    },

    pauseMusic() {
        if (this.bgMusic) {
            this.bgMusic.pause();
            State.isPlaying = false;
            this.updateAudioButton(true);
            localStorage.setItem('musicPlaying', 'false');
        }
    },

    toggleMusic() {
        if (State.isPlaying) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
    },

    updateAudioButton(isMuted) {
        const audioButton = document.getElementById('audioToggle');
        if (!audioButton) return;

        const audioIcon = audioButton.querySelector('.audio-icon');
        if (isMuted) {
            audioIcon.textContent = '🔇';
            audioButton.classList.add('muted');
        } else {
            audioIcon.textContent = '🔊';
            audioButton.classList.remove('muted');
        }
    },

    async playLoginSuccess() {
        if (this.loginSound) {
            try {
                await this.loginSound.play();
            } catch (error) {
                console.error('Error playing login success sound:', error);
            }
        }
    },

    async playLoginError() {
        if (this.loginError) {
            try {
                await this.loginError.play();
            } catch (error) {
                console.error('Error playing login error sound:', error);
            }
        }
    },

    async playBirthdayMusic() {
        if (this.bgMusic && !this.bgMusic.paused) {
            this.bgMusic.pause();
        }

        if (!this.birthdayJingle) {
            this.birthdayJingle = new Audio('assets/sounds/happy-birthday.mp4');
        }

        try {
            await this.birthdayJingle.play();
            this.birthdayJingle.onended = () => {
                this.birthdayJingle = null;
                if (this.bgMusic && !State.isPlaying) {
                    this.playMusic();
                }
            };
        } catch (error) {
            console.error('Error playing birthday music:', error);
        }
    }
};

// Login Manager
const LoginManager = {
    init() {
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.login();
            });
        }
    },

    async login() {
        const nameInput = document.getElementById('name');
        const passwordInput = document.getElementById('password');
        const errorMsg = document.getElementById('error-msg');
        
        if (!nameInput || !passwordInput || !errorMsg) return;
        
        const name = nameInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();
        
        if (name === "huynhlekimuyen" && password === "24042003") {
            await AudioManager.playLoginSuccess();
            localStorage.setItem("senderName", "Huỳnh Lê Kim Uyên");
            this.showWelcomeMessage();
            
            setTimeout(() => {
                window.location.href = "home.html";
            }, 3000);
        } else {
            await AudioManager.playLoginError();
            this.showError("Sai thông tin đăng nhập rồi bạn ơi! 😅");
        }
    },

    showError(message) {
        const errorMsg = document.getElementById('error-msg');
        const loginContainer = document.querySelector('.login-container');
        
        if (errorMsg && loginContainer) {
            errorMsg.textContent = message;
            errorMsg.classList.add('show');
            
            loginContainer.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginContainer.style.animation = '';
            }, 500);
        }
    },

    showWelcomeMessage() {
        const welcomeMsg = document.getElementById('welcomeMsg');
        if (welcomeMsg) welcomeMsg.classList.add('show');
    },

    showHint() {
        const hintPopup = document.getElementById('hintPopup');
        if (hintPopup) hintPopup.classList.add('show');
    },

    closeHint() {
        const hintPopup = document.getElementById('hintPopup');
        if (hintPopup) hintPopup.classList.remove('show');
    }
};

// Cake Manager
const CakeManager = {
    init() {
        const blowButton = document.getElementById('blowCandle');
        const flame = document.getElementById('flame');
        
        if (blowButton && flame && !State.isBlown) {
            blowButton.addEventListener('click', () => this.blowOutCandle());
        }
    },

    blowOutCandle() {
        const flame = document.getElementById('flame');
        const birthdayMessage = document.querySelector('.birthday-message');
        
        if (!flame || State.isBlown) return;
        
        State.isBlown = true;
        
        flame.style.animation = 'none';
        flame.style.opacity = '0';
        flame.style.transform = 'translateX(-50%) scale(0)';
        
        this.createCelebrationEffects();
        AudioManager.playBirthdayMusic();
        
        if (birthdayMessage) {
            birthdayMessage.style.opacity = '1';
            birthdayMessage.style.transform = 'translateY(0)';
        }
    },

    createCelebrationEffects() {
        this.createConfetti();
        setTimeout(() => this.createFireworks(), 500);
    },

    createConfetti() {
        const container = document.querySelector('.confetti-container');
        if (!container) return;

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const hue = Math.random() * 360;
            confetti.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = Math.random() * 2 + 3 + 's';
            
            container.appendChild(confetti);
            confetti.addEventListener('animationend', () => confetti.remove());
        }
    },

    createFireworks() {
        const container = document.querySelector('.fireworks-container');
        if (!container) return;

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                
                firework.style.left = Math.random() * 80 + 10 + '%';
                firework.style.top = Math.random() * 50 + 10 + '%';
                
                container.appendChild(firework);
                
                for (let j = 0; j < 30; j++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    const hue = Math.random() * 360;
                    particle.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
                    firework.appendChild(particle);
                }
                
                setTimeout(() => firework.remove(), 1000);
            }, i * 300);
        }
    }
};

// Camera Manager
const CameraManager = {
    stream: null,

    async init() {
        const video = document.getElementById('video');
        if (!video) return;

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            video.srcObject = this.stream;
            this.initControls();
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Unable to access camera. Please make sure you have granted camera permissions.');
        }
    },

    initControls() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });
        
        document.querySelectorAll('.emoji-btn').forEach(btn => {
            btn.addEventListener('click', () => this.addEmoji(btn.dataset.emoji));
        });
        
        const takePhotoBtn = document.getElementById('takePhoto');
        const downloadPhotoBtn = document.getElementById('downloadPhoto');
        const retakePhotoBtn = document.getElementById('retakePhoto');
        
        if (takePhotoBtn) takePhotoBtn.addEventListener('click', () => this.takePhoto());
        if (downloadPhotoBtn) downloadPhotoBtn.addEventListener('click', () => this.downloadPhoto());
        if (retakePhotoBtn) retakePhotoBtn.addEventListener('click', () => this.retakePhoto());
    },

    setFilter(filter) {
        State.currentFilter = filter;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        const video = document.getElementById('video');
        if (video) {
            video.style.filter = this.getFilterStyle(filter);
        }
    },

    getFilterStyle(filter) {
        switch(filter) {
            case 'grayscale': return 'grayscale(100%)';
            case 'sepia': return 'sepia(100%)';
            case 'vintage': return 'sepia(50%) contrast(95%) brightness(90%)';
            case 'brightness': return 'brightness(130%)';
            default: return 'none';
        }
    },

    addEmoji(emoji) {
        if (emoji) State.currentEmojis.push(emoji);
    },

    takePhoto() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const preview = document.getElementById('photoPreview');
        
        if (!video || !canvas || !preview) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.filter = this.getFilterStyle(State.currentFilter);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        State.currentEmojis.forEach(emoji => {
            ctx.font = '40px serif';
            ctx.fillText(emoji, 
                Math.random() * (canvas.width - 50), 
                Math.random() * (canvas.height - 50)
            );
        });
        
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        preview.appendChild(img);
        
        this.updatePhotoButtons(true);
    },

    downloadPhoto() {
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        
        const link = document.createElement('a');
        link.download = 'birthday_photo.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    },

    retakePhoto() {
        const preview = document.getElementById('photoPreview');
        if (!preview) return;
        
        preview.innerHTML = '';
        State.currentEmojis = [];
        this.updatePhotoButtons(false);
    },

    updatePhotoButtons(showDownloadRetake) {
        const downloadBtn = document.getElementById('downloadPhoto');
        const retakeBtn = document.getElementById('retakePhoto');
        const takeBtn = document.getElementById('takePhoto');
        
        if (downloadBtn) downloadBtn.style.display = showDownloadRetake ? 'inline-block' : 'none';
        if (retakeBtn) retakeBtn.style.display = showDownloadRetake ? 'inline-block' : 'none';
        if (takeBtn) takeBtn.style.display = showDownloadRetake ? 'none' : 'inline-block';
    },

    cleanup() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
};

// Gallery Manager
const GalleryManager = {
    init() {
        this.initFilters();
        this.initAnimations();
    },

    initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                this.filterGallery(filterValue, galleryItems);
            });
        });
    },

    filterGallery(filterValue, items) {
        items.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
    },

    initAnimations() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
            
            this.addHoverEffect(item);
        });
    },

    addHoverEffect(item) {
        item.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = item.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            const rotateX = (y - 0.5) * 10;
            const rotateY = (x - 0.5) * 10;
            
            item.style.transform = `
                perspective(1000px)
                rotateX(${-rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-10px)
            `;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    }
};

// Character Showcase Manager
const CharacterShowcaseManager = {
    init() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const mainImage = document.querySelector('.character-preview .character-image');
        
        if (!tabButtons.length || !mainImage) return;
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update main image with fade effect
                const newImageSrc = button.getAttribute('data-image');
                if (newImageSrc) {
                    mainImage.style.opacity = '0';
                    setTimeout(() => {
                        mainImage.src = newImageSrc;
                        mainImage.onload = () => {
                            mainImage.style.opacity = '1';
                        };
                    }, 300);
                }
            });
        });

        // Preload images for smooth transitions
        tabButtons.forEach(button => {
            const imgSrc = button.getAttribute('data-image');
            if (imgSrc) {
                const img = new Image();
                img.src = imgSrc;
            }
        });
    }
};

// Page Initialization
function initializePage() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true
        });
    }

    // Initialize Swiper if available
    if (typeof Swiper !== 'undefined' && document.querySelector('.swiper-container')) {
        new Swiper('.info-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            }
        });
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Audio
    AudioManager.init();

    // Initialize page components
    initializePage();

    // Initialize managers based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'login.html':
            LoginManager.init();
            break;
        case 'home.html':
            CharacterShowcaseManager.init();
            break;
        case 'cake.html':
            CakeManager.init();
            break;
        case 'photo.html':
            CameraManager.init();
            break;
        case 'gallery.html':
            GalleryManager.init();
            break;
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    CameraManager.cleanup();
    localStorage.setItem('musicPlaying', State.isPlaying.toString());
});

// Global function exports
window.login = () => LoginManager.login();
window.showHint = () => LoginManager.showHint();
window.closeHint = () => LoginManager.closeHint();
window.setFilter = (filter) => CameraManager.setFilter(filter);
window.addEmoji = (emoji) => CameraManager.addEmoji(emoji);
window.takePhoto = () => CameraManager.takePhoto();
window.downloadPhoto = () => CameraManager.downloadPhoto();
window.retakePhoto = () => CameraManager.retakePhoto();
