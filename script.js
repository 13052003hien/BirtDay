// Fetch 
window.onload = function () {
    const name = localStorage.getItem("senderName") || "Người bạn dễ thương";
    document.getElementById("sender").textContent = name;

    const video = document.getElementById("video");
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => { video.srcObject = stream; });
}

// Chức năng chụp ảnh
function takePhoto() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}

// Chức năng thêm icon cảm xúc
function addIcon(emoji) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = "40px serif";
    const x = Math.random() * 300;
    const y = Math.random() * 250;
    ctx.fillText(emoji, x, y);
}

// Chức năng lưu ảnh
function downloadImage() {
    const canvas = document.getElementById("canvas");
    const link = document.createElement('a');
    link.download = 'happy_photo.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Khai báo biến audio toàn cục
let bgMusic = null;
let birthdayJingle = null;
let isMuted = false;

// Khởi tạo nhạc nền
function initBackgroundMusic() {
    bgMusic = new Audio('assets/sounds/happy-birthday.mp4');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    // Tự động phát nhạc khi người dùng tương tác với trang
    document.addEventListener('click', function startMusic() {
        if (bgMusic && !bgMusic.playing) {
            playAudio(bgMusic).then(() => {
                console.log('Background music started');
            }).catch(error => {
                console.error('Error playing background music:', error);
            });
            document.removeEventListener('click', startMusic);
        }
    }, { once: true });
}

// Hàm phát audio với Promise
async function playAudio(audioElement) {
    try {
        if (audioElement.paused) {
            await audioElement.play();
        }
    } catch (error) {
        console.error('Error playing audio:', error);
        throw error;
    }
}

// Cập nhật trạng thái nút âm thanh
function updateAudioButton() {
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
}

// Xử lý bật/tắt âm thanh
function toggleAudio() {
    isMuted = !isMuted;

    if (bgMusic) {
        bgMusic.volume = isMuted ? 0 : 0.3;
    }
    if (birthdayJingle) {
        birthdayJingle.volume = isMuted ? 0 : 0.5;
    }

    updateAudioButton();
}

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo AOS Animation
    AOS.init({
        duration: 1000,
        once: false,
        mirror: true
    });

    // Parallax effect cho hero section
    const hero = document.querySelector('.hero');
    new Parallax(hero, {
        relativeInput: true,
        clipRelativeInput: true,
        scalarX: 2,
        scalarY: 2
    });

    // Xử lý scroll animation cho navigation
    const nav = document.querySelector('.main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            nav.style.background = 'rgba(0, 0, 0, 0.8)';
            return;
        }

        if (currentScroll > lastScroll) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
            nav.style.background = 'rgba(0, 0, 0, 0.95)';
        }

        lastScroll = currentScroll;
    });

    // Khởi tạo nhạc nền
    initBackgroundMusic();

    // Xử lý nút điều khiển âm thanh
    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) {
        audioToggle.addEventListener('click', toggleAudio);
    }

    // Xử lý nút thổi nến
    const blowButton = document.getElementById('blowCandle');
    const flame = document.querySelector('.flame');

    if (blowButton && flame) {
        blowButton.addEventListener('click', () => {
            // Animation cho ngọn lửa tắt
            flame.style.opacity = '0';
            flame.style.transform = 'scale(0)';

            // Hiệu ứng particle
            createParticles();

            // Phát nhạc sinh nhật
            playBirthdayMusic();

            // Hiệu ứng rung lắc cho bánh
            const cake = document.querySelector('.cake');
            cake.style.animation = 'shake 0.5s';

            setTimeout(() => {
                cake.style.animation = '';
            }, 500);
        });
    }

    // Animation cho gallery
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });

    // Hiệu ứng hover cho navigation
    const navLinks = document.querySelectorAll('.navigation a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.background = '#ff6b9d';
        });

        link.addEventListener('mouseleave', () => {
            if (!link.classList.contains('active')) {
                link.style.background = 'transparent';
            }
        });
    });

    // Khởi tạo các slider mới
    initRegionsSlider();
    initMoreInfoSlider();
});

// Tạo hiệu ứng particle khi thổi nến
function createParticles() {
    const particles = 30;
    const cake = document.querySelector('.cake');

    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random vị trí và màu sắc
        const hue = Math.random() * 360;
        particle.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

        // Random animation
        const angle = Math.random() * Math.PI * 2;
        const velocity = 1 + Math.random() * 2;
        const size = Math.random() * 5 + 5;

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Thêm particle vào DOM
        cake.appendChild(particle);

        // Animation cho particle
        const animation = particle.animate([
            {
                transform: 'translate(0, 0)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * 100}px, ${Math.sin(angle) * 100}px)`,
                opacity: 0
            }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0,0,0.2,1)'
        });

        // Xóa particle sau khi animation kết thúc
        animation.onfinish = () => particle.remove();
    }
}

let birthdayAudio = null;

// Phát nhạc sinh nhật
function playBirthdayMusic() {
    // Dừng nhạc nền nếu đang phát
    if (bgMusic && !bgMusic.paused) {
        bgMusic.pause();
    }

    // Tạo mới audio cho bài hát sinh nhật
    birthdayJingle = new Audio('assets/sounds/happy-birthday.mp4');
    birthdayJingle.volume = isMuted ? 0 : 0.5;

    // Phát nhạc
    playAudio(birthdayJingle).then(() => {
        console.log('Birthday music started');

        // Xử lý khi nhạc kết thúc
        birthdayJingle.onended = function () {
            console.log('Birthday music ended');
            birthdayJingle = null;

            // Phát lại nhạc nền
            if (bgMusic && !isMuted) {
                bgMusic.volume = 0.3;
                playAudio(bgMusic).catch(console.error);
            }
        };
    }).catch(error => {
        console.error('Error playing birthday music:', error);
    });
}

// Khởi tạo Regions Slider
let currentRegionIndex = 0;
const regions = [
    {
        image: 'assets/images/region1.jpg',
        // name: 'Kỷ niệm vui vẻ',
        // description: 'Những khoảnh khắc đáng nhớ của Uyên trong năm qua'
    },
    {
        image: 'assets/images/region2.jpg',
        // name: 'Những chuyến đi',
        // description: 'Các chuyến đi và khám phá thú vị'
    },
    {
        image: 'assets/images/region3.jpg',
        // name: 'Khoảnh khắc đẹp',
        // description: 'Những khoảnh khắc tươi đẹp và ấn tượng'
    },
    {
        image: 'assets/images/region4.jpg',
        // name: 'Giây phút yêu thương',
        // description: 'Những khoảnh khắc yêu thương bên gia đình và bạn bè'
    },
    {
        image: 'assets/images/region5.jpg',
        // name: 'Nụ cười rạng rỡ',
        // description: 'Nụ cười tươi tắn và năng động của Uyên'
    },
    {
        image: 'assets/images/region6.jpg',
        // name: 'Thành tựu',
        // description: 'Những thành tựu đáng nhớ trong năm qua'
    },
    {
        image: 'assets/images/region7.jpg',
        // name: 'Khoảnh khắc đặc biệt',
        // description: 'Những khoảnh khắc không thể nào quên'
    }
];

function initRegionsSlider() {
    updateRegion(0); // Hiển thị region đầu tiên
    
    const prevButton = document.querySelector('.nav-arrow.prev');
    const nextButton = document.querySelector('.nav-arrow.next');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => changeRegion('prev'));
        nextButton.addEventListener('click', () => changeRegion('next'));
    }

    // Tự động chuyển region sau mỗi 5 giây
    setInterval(() => changeRegion('next'), 5000);
}

function updateRegion(index) {
    const regionCard = document.querySelector('.region-card');
    if (!regionCard) return;

    const region = regions[index];
    regionCard.style.backgroundImage = `url('${region.image}')`;
    
    const nameElement = regionCard.querySelector('.region-name');
    const descElement = regionCard.querySelector('.region-description');
    
    if (nameElement && descElement) {
        nameElement.textContent = region.name;
        descElement.textContent = region.description;
    }

    // Thêm lớp active sau khi cập nhật nội dung để tạo hiệu ứng fade in
    setTimeout(() => {
        regionCard.classList.add('active');
    }, 50);
}

function changeRegion(direction) {
    const regionCard = document.querySelector('.region-card');
    if (!regionCard) return;

    // Remove active class để fade out
    regionCard.classList.remove('active');
    
    // Tính toán index mới
    currentRegionIndex = direction === 'next' 
        ? (currentRegionIndex + 1) % regions.length 
        : (currentRegionIndex - 1 + regions.length) % regions.length;
    
    // Đợi animation fade out hoàn thành rồi mới cập nhật nội dung
    setTimeout(() => {
        updateRegion(currentRegionIndex);
    }, 500);
}

// Khởi tạo More Info Slider với Swiper
function initMoreInfoSlider() {
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
