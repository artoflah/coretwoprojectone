document.addEventListener('DOMContentLoaded', function () {

    const modal = document.getElementById('myModal');
    const openModalBtn = document.getElementById('openModal');
    const closeBtn = document.querySelector('#myModal .close');


    const aboutModal = document.getElementById('aboutModal');
    const aboutBtn = document.getElementById('aboutBtn');
    const closeAboutBtn = document.querySelector('#aboutModal .close');

    const sections = document.querySelectorAll('.modal-section');
    const backgroundMusic = document.getElementById('backgroundMusic');

    const typewriterSounds = [];
    for (let i = 0; i < 5; i++) {
        const sound = new Audio('aspects/typewriter-key-1.mp3');
        sound.volume = 0.1;
        typewriterSounds.push(sound);
    }
    let currentSoundIndex = 0;

    const audioControl = document.createElement('button');
    audioControl.innerHTML = '🔇';
    audioControl.className = 'audio-control';
    document.body.appendChild(audioControl);

    let isMusicPlaying = false;
    let isTyping = false;

    function playTypewriterSound() {
        try {
            typewriterSounds[currentSoundIndex].currentTime = 0;
            typewriterSounds[currentSoundIndex].play();
            currentSoundIndex = (currentSoundIndex + 1) % typewriterSounds.length;
        } catch (error) {
            console.error('Error playing typewriter sound:', error);
        }
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            audioControl.innerHTML = '🔇';
        } else {
            backgroundMusic.play().catch(error => {
                console.log("Playback prevented:", error);
            });
            audioControl.innerHTML = '🔊';
        }
        isMusicPlaying = !isMusicPlaying;
    }

    function openModal() {
        modal.style.display = 'flex';
        if (!isMusicPlaying) {
            toggleMusic();
        }
    }

    function closeModal() {
        modal.style.display = 'none';
        resetSections();
        isTyping = false;
    }

    function openAboutModal() {
        aboutModal.style.display = 'flex';
    }

    function closeAboutModal() {
        aboutModal.style.display = 'none';
    }

    function resetSections() {
        sections.forEach(section => {
            const content = section.querySelector('.section-content');
            const title = section.querySelector('.section-title');
            const text = section.querySelector('.content-text');

            section.classList.remove('active');
            if (content) {
                content.classList.remove('active');
                content.style.opacity = '0';
                content.style.visibility = 'hidden';
            }
            if (title) {
                title.style.opacity = '1';
            }
            if (text) {
                text.style.opacity = '0';
                text.style.visibility = 'hidden';
                text.innerHTML = text.getAttribute('data-original-text') || text.innerHTML;
            }
        });
    }

    function toggleSection(section) {
        if (isTyping) return;

        const content = section.querySelector('.section-content');
        const title = section.querySelector('.section-title');
        const text = section.querySelector('.content-text');

        if (text && !text.getAttribute('data-original-text')) {
            text.setAttribute('data-original-text', text.innerHTML);
        }

        sections.forEach(s => {
            if (s !== section) {
                const otherContent = s.querySelector('.section-content');
                const otherTitle = s.querySelector('.section-title');
                const otherText = s.querySelector('.content-text');

                s.classList.remove('active');
                if (otherContent) {
                    otherContent.classList.remove('active');
                    otherContent.style.opacity = '0';
                    otherContent.style.visibility = 'hidden';
                }
                if (otherTitle) {
                    otherTitle.style.opacity = '1';
                }
                if (otherText) {
                    otherText.style.opacity = '0';
                    otherText.style.visibility = 'hidden';
                }
            }
        });

        const isActive = section.classList.contains('active');
        if (!isActive) {
            section.classList.add('active');
            if (content) {
                content.classList.add('active');
                content.style.opacity = '1';
                content.style.visibility = 'visible';
            }
            if (title) {
                title.style.opacity = '0';
            }
            if (text) {
                text.style.opacity = '1';
                text.style.visibility = 'visible';
                typeWriterEffect(text);
            }
        } else {
            section.classList.remove('active');
            if (content) {
                content.classList.remove('active');
                content.style.opacity = '0';
                content.style.visibility = 'hidden';
            }
            if (title) {
                title.style.opacity = '1';
            }
            if (text) {
                text.style.opacity = '0';
                text.style.visibility = 'hidden';
            }
        }
    }

    function typeWriterEffect(element) {
        const originalText = element.getAttribute('data-original-text');
        let index = 0;
        element.innerHTML = '';
        isTyping = true;

        function type() {
            if (index < originalText.length) {
                element.innerHTML += originalText.charAt(index);
                if (originalText.charAt(index) !== ' ') {
                    playTypewriterSound();
                }
                index++;
                setTimeout(type, 100);
            } else {
                isTyping = false;
            }
        }

        type();
    }

    openModalBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    audioControl.addEventListener('click', toggleMusic);

    aboutBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        openAboutModal();
    });

    closeAboutBtn.addEventListener('click', closeAboutModal);

    sections.forEach(section => {
        section.addEventListener('click', () => toggleSection(section));
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
        if (event.target === aboutModal) {
            closeAboutModal();
        }
    });
});