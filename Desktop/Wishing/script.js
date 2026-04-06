document.addEventListener('DOMContentLoaded', () => {
    // --- Cake Transition Logic ---
    const cakeOverlay = document.getElementById('cake-overlay');
    const mainSite = document.getElementById('main-site-wrapper');

    if (cakeOverlay) {
        cakeOverlay.addEventListener('click', () => {
            // Grand Entrance!
            confetti({
                particleCount: 200,
                spread: 120,
                origin: { y: 0.5 },
                colors: ['#ffd700', '#ff69b4', '#ffffff']
            });

            // Start Transition
            cakeOverlay.style.opacity = '0';
            cakeOverlay.style.pointerEvents = 'none';
            cakeOverlay.style.transition = 'opacity 1.5s ease-out';

            setTimeout(() => {
                cakeOverlay.style.display = 'none';
                document.body.classList.remove('show-cake');
                mainSite.classList.remove('hidden-site');
                mainSite.classList.add('reveal-active');

                // If it was the original "enter button" logic, we can trigger it too
                // For now, revealing the wrapper is enough
                if (bgMusic) bgMusic.play().catch(() => {
                    console.log("Autoplay blocked, user interaction already handled.");
                });
            }, 1000);
        });
    }

    const enterBtn = document.getElementById('enter-btn');
    const landingPage = document.getElementById('landing-page');
    const mainContent = document.getElementById('main-content');
    const heartsContainer = document.getElementById('hearts-container');
    const typingText = document.getElementById('typing-text');
    const musicBtn = document.getElementById('toggle-music');
    const bgMusic = document.getElementById('bg-music');
    const surpriseBtn = document.getElementById('surprise-btn');

    const stardustContainer = document.getElementById('stardust-container');

    // --- Stardust Background Logic ---
    function initStardust() {
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 3 + 'px';
            star.style.width = size;
            star.style.height = size;
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.setProperty('--duration', Math.random() * 3 + 2 + 's');
            stardustContainer.appendChild(star);
        }
    }
    initStardust();



    // --- Floating Petals Background ---
    function createPetal() {
        if (!mainContent.classList.contains('hidden')) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.innerHTML = '🌸';
            petal.style.left = Math.random() * 100 + 'vw';
            petal.style.fontSize = Math.random() * 1.5 + 0.5 + 'rem';
            petal.style.opacity = Math.random() * 0.5 + 0.2;
            petal.style.animationDuration = Math.random() * 5 + 10 + 's';
            document.body.appendChild(petal);
            setTimeout(() => petal.remove(), 15000);
        }
    }
    setInterval(createPetal, 1500);

    // --- Floating Hearts Background ---
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart-shape');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 4 + 's';
        heart.style.opacity = Math.random() * 0.6 + 0.2;
        heart.style.transform = `scale(${Math.random() * 0.5 + 0.3}) rotate(-45deg)`;

        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 8000);
    }

    setInterval(createHeart, 800);

    // --- Entrance Logic ---
    enterBtn.addEventListener('click', () => {
        landingPage.style.transition = 'opacity 1s ease-out';
        landingPage.style.opacity = '0';

        setTimeout(() => {
            landingPage.classList.add('hidden');
            mainContent.classList.remove('hidden');
            window.scrollTo(0, 0);
            startTyping();

            // Start music (some browsers require user interaction)
            bgMusic.play().then(() => {
                console.log("Music started successfully");
                musicBtn.innerText = '🎵';
            }).catch(ev => {
                console.warn("Auto-play blocked or failed:", ev);
                musicBtn.innerText = '🔇';
            });
        }, 1000);
    });

    // --- Audio Error Handling ---
    bgMusic.addEventListener('error', (e) => {
        console.error("Audio error:", e);
        // Alert only if it's the main attempt
        if (landingPage.classList.contains('hidden')) {
            console.log("Audio failed to load after entry.");
        }
    });

    // --- Typing Effect ---
    const message = "Ever since the day we met, my life has been filled with so much joy and love. You are the most incredible person I've ever known, and I am so lucky to call you mine. On your special day, I want you to know how much you mean to me. You are my everything. Happy Birthday, my love! ❤️";
    let index = 0;

    function startTyping() {
        if (index < message.length) {
            typingText.innerHTML += message.charAt(index);
            index++;
            setTimeout(startTyping, 50);
        }
    }

    // --- Music Toggle ---
    musicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicBtn.innerText = '🎵';
        } else {
            bgMusic.pause();
            musicBtn.innerText = '🔇';
        }
    });

    // --- 3D Circular Carousel ---
    const carousel = document.getElementById('carousel-3d');
    const items = document.querySelectorAll('.carousel-item');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    let currentIndex = 0;
    const itemsCount = items.length;
    const angleStep = 360 / itemsCount;

    function getCarouselRadius() {
        if (window.innerWidth < 480) return 280; // Larger radius to space out images
        if (window.innerWidth < 768) return 400;
        return 650;
    }

    function updateCarousel() {
        const radius = getCarouselRadius();
        items.forEach((item, index) => {
            const angle = index * angleStep;
            const currentRotationInDegrees = (angle - (currentIndex * angleStep)) % 360;
            const currentRotationInRadians = (currentRotationInDegrees * Math.PI) / 180;

            // Adjust opacity and scale based on front-to-back distance
            const cosVal = Math.cos(currentRotationInRadians);
            const opacity = 0.3 + (cosVal + 1) / 2 * 0.7; // Range 0.3 to 1.0
            const scale = 0.6 + (cosVal + 1) / 2 * 0.4;  // Range 0.6 to 1.0

            item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px) scale(${scale})`;
            item.style.opacity = opacity;

            // Bring front items to foreground
            item.style.zIndex = Math.round((cosVal + 1) * 100);
        });

        const rotation = -currentIndex * angleStep;
        carousel.style.transform = `rotateY(${rotation}deg)`;
    }

    // Initial position
    updateCarousel();

    // Responsive update on resize
    window.addEventListener('resize', updateCarousel);

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        updateCarousel();
    });

    // Auto rotate every 2 seconds (was 5s)
    let autoRotate = setInterval(() => {
        currentIndex++;
        updateCarousel();
    }, 2000);

    // Pause on hover
    document.querySelector('.circular-slider').addEventListener('mouseenter', () => {
        clearInterval(autoRotate);
    });

    document.querySelector('.circular-slider').addEventListener('mouseleave', () => {
        autoRotate = setInterval(() => {
            currentIndex++;
            updateCarousel();
        }, 2000);
    });

    // --- Countdown Timer ---
    // Update the startDate to when you actually met or started dating!
    const startDate = new Date('2024-01-01T00:00:00');

    function updateCountdown() {
        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- Surprise Page Navigation ---
    const surprisePage = document.getElementById('surprise-page');
    const smilePage = document.getElementById('smile-page');
    const meetupPage = document.getElementById('meetup-page');
    const backBtn = document.getElementById('back-btn');
    const backToSurpriseBtnSmile = document.getElementById('back-to-surprise-btn-smile');
    const backToSurpriseBtnMeetup = document.getElementById('back-to-surprise-btn-meetup');
    const surpriseItems = document.querySelectorAll('.surprise-item');

    surpriseBtn.addEventListener('click', () => {
        surprisePage.style.display = 'block';
        mainContent.classList.add('hidden');
        window.scrollTo(0, 0);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    });

    backBtn.addEventListener('click', () => {
        surprisePage.style.display = 'none';
        mainContent.classList.remove('hidden');
        // Scroll back to the surprise section so they can see where they were
        const surpriseSection = document.getElementById('surprise');
        if (surpriseSection) surpriseSection.scrollIntoView();
    });

    backToSurpriseBtnSmile.addEventListener('click', () => {
        smilePage.style.display = 'none';
    });

    backToSurpriseBtnMeetup.addEventListener('click', () => {
        meetupPage.style.display = 'none';
    });

    const beautyCard = document.getElementById('beauty-card');
    const beautyPage = document.getElementById('beauty-page');
    const backToSurpriseBtnBeauty = document.getElementById('back-to-surprise-btn-beauty');

    beautyCard.addEventListener('click', () => {
        beautyPage.style.display = 'block';
        surprisePage.style.display = 'none';
        window.scrollTo(0, 0);
    });

    backToSurpriseBtnBeauty.addEventListener('click', () => {
        beautyPage.style.display = 'none';
        surprisePage.style.display = 'block';
    });

    // --- Interactive Surprise Cards ---
    surpriseItems.forEach(item => {
        // Prevent card from closing when clicking inside the gallery/images
        const content = item.querySelector('.hidden-content-preview') || item.querySelector('.hidden-content');
        if (content) {
            content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        item.addEventListener('click', (e) => {
            // Check if this is the Smile Card
            if (item.id === 'smile-card') {
                smilePage.style.display = 'block';
                window.scrollTo(0, 0);
                confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, shapes: ['circle'], colors: ['#ffc0cb', '#ff69b4'] });
                return;
            }

            // Check if this is the Meetup Card
            if (item.id === 'meetup-card') {
                meetupPage.style.display = 'block';
                window.scrollTo(0, 0);
                confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, shapes: ['square'], colors: ['#ffd700', '#ff0000'] });
                return;
            }

            // Normal toggle for other cards
            surpriseItems.forEach(si => {
                if (si !== item) si.classList.remove('active');
            });
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                confetti({ particleCount: 30, spread: 40, origin: { y: 0.5, x: 0.5 } });
            }
        });
    });

    // --- Global Mobile Image Tap Effect ---
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('touchstart', function () {
            this.classList.add('touch-active');
        }, { passive: true });
        img.addEventListener('touchend', function () {
            setTimeout(() => this.classList.remove('touch-active'), 300);
        }, { passive: true });
    });

    // --- Intersection Observer for Fade-In Effects ---
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
