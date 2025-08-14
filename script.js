// Enhanced scroll animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Lock Screen Functionality
    const lockOverlay = document.getElementById('lockOverlay');
    const keyButtons = document.querySelectorAll('.key-btn');
    const pinDots = document.querySelectorAll('.pin-dot');
    const pinError = document.getElementById('pinError');
    const correctPin = '1508';
    let currentPin = '';
    let isUnlocked = false;

    // Prevent body scrolling when lock is active
    if (lockOverlay && lockOverlay.style.display !== 'none') {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    }
    
    // Check if already unlocked
    if (localStorage.getItem('anniversaryUnlocked') === 'true') {
        if (lockOverlay) {
            lockOverlay.style.display = 'none';
            isUnlocked = true;
            // Re-enable body scrolling
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    }

    // Enhanced keypad functionality with mobile optimization
    keyButtons.forEach(button => {
        // Handle both click and touch events
        const handleKeyPress = function() {
            const key = this.dataset.key;
            
            // Add button press animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Add haptic feedback on mobile if available
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            if (key === 'clear') {
                clearPin();
            } else if (key === 'enter') {
                checkPin();
            } else if (currentPin.length < 4) {
                addDigit(key);
            }
        };
        
        // Add both click and touchstart for better mobile responsiveness
        button.addEventListener('click', handleKeyPress);
        button.addEventListener('touchstart', function(e) {
            e.preventDefault(); // Prevent double-tap zoom
            handleKeyPress.call(this);
        }, { passive: false });
        
        // Prevent context menu on long press
        button.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    });

    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (!isUnlocked) {
            if (e.key >= '0' && e.key <= '9' && currentPin.length < 4) {
                addDigit(e.key);
            } else if (e.key === 'Backspace') {
                clearPin();
            } else if (e.key === 'Enter') {
                checkPin();
            }
        }
    });

    function addDigit(digit) {
        if (currentPin.length < 4) {
            currentPin += digit;
            updatePinDisplay();
            hideError();
        }
    }

    function clearPin() {
        currentPin = '';
        updatePinDisplay();
        hideError();
    }

    function updatePinDisplay() {
        pinDots.forEach((dot, index) => {
            if (index < currentPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    function checkPin() {
        if (currentPin.length === 4) {
            if (currentPin === correctPin) {
                // Correct PIN
                console.log('Correct PIN entered, unlocking...');
                showSuccess();
                setTimeout(() => {
                    unlockApp();
                }, 1200);
            } else {
                // Wrong PIN
                console.log('Wrong PIN entered:', currentPin);
                showError();
                shakePin();
                setTimeout(() => {
                    clearPin();
                }, 1000);
            }
        }
    }

    function showError() {
        pinError.classList.add('show');
    }

    function hideError() {
        pinError.classList.remove('show');
    }

    function shakePin() {
        pinDots.forEach(dot => {
            dot.classList.add('shake');
        });
        
        setTimeout(() => {
            pinDots.forEach(dot => {
                dot.classList.remove('shake');
            });
        }, 500);
    }

    function showSuccess() {
        // Change all dots to success color
        pinDots.forEach(dot => {
            dot.style.background = '#2ed573';
            dot.style.borderColor = '#2ed573';
            dot.style.boxShadow = '0 0 20px rgba(46, 213, 115, 0.6)';
        });

        // Add success animation to lock icon
        const lockIcon = document.querySelector('.lock-icon');
        lockIcon.innerHTML = '<i class="fas fa-heart-circle-check"></i>';
        lockIcon.style.color = '#2ed573';
        lockIcon.style.animation = 'successPulse 0.6s ease-in-out';
    }

    function unlockApp() {
        isUnlocked = true;
        console.log('Unlocking app...');
        
        if (lockOverlay) {
            // Add unlock animation
            lockOverlay.classList.add('unlocked');
            console.log('Added unlocked class');
            
            // Re-enable body scrolling
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            
            // Remove lock overlay after animation with multiple fallbacks
            setTimeout(() => {
                if (lockOverlay) {
                    lockOverlay.style.display = 'none';
                    lockOverlay.style.visibility = 'hidden';
                    lockOverlay.style.opacity = '0';
                    console.log('Lock overlay hidden');
                }
            }, 800);
            
            // Fallback removal
            setTimeout(() => {
                if (lockOverlay && lockOverlay.parentNode) {
                    lockOverlay.parentNode.removeChild(lockOverlay);
                    console.log('Lock overlay removed from DOM');
                }
            }, 1200);
        }
    }

    // Add success pulse animation
    const successStyle = document.createElement('style');
    successStyle.textContent = `
        @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(successStyle);

    const themeToggle = document.getElementById('themeToggle');
    const toggleIcon = document.querySelector('.toggle-icon');
    const toggleText = document.querySelector('.toggle-text');

    // Improved Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all sections
    const animatedElements = document.querySelectorAll('.card-section, .memory-gallery, .timeline-section, .letter-section');
    animatedElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // Enhanced Timeline items animation with staggered slide-down effect
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(timelineItems).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 200); // Staggered animation delay
            }
        });
    }, { 
        threshold: 0.2,
        rootMargin: '0px 0px -80px 0px'
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item) => {
        timelineObserver.observe(item);
    });



    // Enhanced gallery interactions with image switching
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-image');
        const originalSrc = item.dataset.original;
        const hoverSrc = item.dataset.hover;
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02) rotateY(2deg)';
            this.style.zIndex = '10';
            
            // Switch to hover image with smooth transition
            if (hoverSrc && img) {
                img.style.opacity = '0';
                setTimeout(() => {
                    img.src = hoverSrc;
                    img.style.opacity = '1';
                }, 200);
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
            this.style.zIndex = '1';
            
            // Switch back to original image
            if (originalSrc && img) {
                img.style.opacity = '0';
                setTimeout(() => {
                    img.src = originalSrc;
                    img.style.opacity = '1';
                }, 200);
            }
        });

        // Add click effect
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }, 150);
        });
    });

    // Enhanced button ripple effects
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.4)';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.animation = 'rippleEffect 0.8s ease-out';
            ripple.style.pointerEvents = 'none';
            ripple.style.zIndex = '1000';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 800);
        });
    });

    // Enhanced ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            0% {
                width: 0;
                height: 0;
                opacity: 0.8;
            }
            50% {
                opacity: 0.4;
            }
            100% {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);



    // Enhanced floating music notes
    function createFloatingNotes() {
        const notes = ['<i class="fas fa-music"></i>', '<i class="fas fa-heart"></i>', '<i class="far fa-heart"></i>', '<i class="fas fa-star"></i>'];
        
        setInterval(() => {
            if (Math.random() > 0.8) { // 20% chance
                const note = document.createElement('div');
                note.innerHTML = notes[Math.floor(Math.random() * notes.length)];
                note.style.position = 'fixed';
                note.style.left = Math.random() * 100 + 'vw';
                note.style.top = '100vh';
                note.style.fontSize = (Math.random() * 0.8 + 1) + 'rem';
                note.style.color = `rgba(255, 107, 157, ${Math.random() * 0.4 + 0.2})`;
                note.style.zIndex = '1';
                note.style.pointerEvents = 'none';
                note.style.animation = `musicFloat ${10 + Math.random() * 5}s linear forwards`;
                
                document.body.appendChild(note);
                
                setTimeout(() => {
                    if (note.parentNode) {
                        note.remove();
                    }
                }, 15000);
            }
        }, 3000);
    }

    // Enhanced music note animation
    const musicStyle = document.createElement('style');
    musicStyle.textContent = `
        @keyframes musicFloat {
            0% {
                transform: translateY(0) rotate(0deg) scale(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
                transform: translateY(-10vh) rotate(45deg) scale(1);
            }
            90% {
                opacity: 0.5;
                transform: translateY(-90vh) rotate(315deg) scale(1);
            }
            100% {
                transform: translateY(-100vh) rotate(360deg) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(musicStyle);

    // Start enhanced music notes
    createFloatingNotes();

    // Enhanced loading animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.8s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 200);
    });

    // Add smooth scroll behavior for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced card flip interaction
    const flipCard = document.querySelector('.flip-card');
    if (flipCard) {
        let isFlipped = false;
        
        flipCard.addEventListener('click', function() {
            isFlipped = !isFlipped;
            if (isFlipped) {
                this.style.transform = 'scale(1.02)';
            } else {
                this.style.transform = 'scale(1)';
            }
        });
    }

    // Dark Mode Toggle Functionality
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            themeToggle.classList.remove('dark');
            toggleIcon.innerHTML = '<i class="fas fa-moon"></i>';
            toggleText.textContent = 'Dark Mode';
        } else {
            // Default to dark mode
            document.body.classList.add('dark-mode');
            themeToggle.classList.add('dark');
            toggleIcon.innerHTML = '<i class="fas fa-sun"></i>';
            toggleText.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark');
        }
    }

    themeToggle.addEventListener('click', function() {
        // Add transitioning class for smooth effect
        document.body.classList.add('theme-transitioning');
        
        // Toggle theme after a brief delay to ensure transition starts
        setTimeout(() => {
            if (document.body.classList.contains('dark-mode')) {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                themeToggle.classList.remove('dark');
                toggleIcon.innerHTML = '<i class="fas fa-moon"></i>';
                toggleText.textContent = 'Dark Mode';
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-mode');
                themeToggle.classList.add('dark');
                toggleIcon.innerHTML = '<i class="fas fa-sun"></i>';
                toggleText.textContent = 'Light Mode';
                localStorage.setItem('theme', 'dark');
            }
        }, 50);
        
        // Remove transitioning class after transition completes
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 1250);
    });

    // Initialize theme on page load
    initTheme();

    // Add glassmorphic cursor effect (desktop only)
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.style.position = 'fixed';
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.background = 'rgba(255, 107, 157, 0.2)';
        cursor.style.borderRadius = '50%';
        cursor.style.pointerEvents = 'none';
        cursor.style.zIndex = '9999';
        cursor.style.transition = 'transform 0.1s ease';
        cursor.style.backdropFilter = 'blur(5px)';
        cursor.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = (e.clientX - 10) + 'px';
            cursor.style.top = (e.clientY - 10) + 'px';
        });

        // Update cursor based on theme
        function updateCursor() {
            if (document.body.classList.contains('dark-mode')) {
                cursor.style.background = 'rgba(224, 224, 224, 0.2)';
                cursor.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            } else {
                cursor.style.background = 'rgba(255, 107, 157, 0.2)';
                cursor.style.border = '1px solid rgba(255, 255, 255, 0.3)';
            }
        }

        // Update cursor on theme change
        themeToggle.addEventListener('click', updateCursor);

        // Hide cursor when hovering over interactive elements
        const interactiveElements = document.querySelectorAll('button, .flip-card, .gallery-item');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                if (document.body.classList.contains('dark-mode')) {
                    cursor.style.background = 'rgba(224, 224, 224, 0.3)';
                } else {
                    cursor.style.background = 'rgba(255, 107, 157, 0.3)';
                }
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                updateCursor();
            });
        });
    }
});