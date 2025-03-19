document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle functionality
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navContainer.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = mobileToggle.querySelector('i');
            if (navContainer.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navContainer.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Gradient background animation
    const interBubble = document.querySelector('.interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    function move() {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(() => {
            move();
        });
    }

    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });

    move();

    // Determine cursor size based on window width
    function getCursorSize() {
        if (window.innerWidth <= 576) {
            return 100; // Small screens
        } else if (window.innerWidth <= 768) {
            return 150; // Medium screens
        } else {
            return 220; // Large screens
        }
    }

    // Glass cursor and dual language text effect
    const cursor = document.querySelector('.glass-cursor');
    const clipArea = document.querySelector('.clip-area');
    const englishMask = document.querySelector('.english-mask');
    const japaneseLayer = document.querySelector('.japanese-layer');
    const textContainer = document.querySelector('.text-container');
    const englishLayer = document.querySelector('.english-layer');

    // Create a clone of Japanese text for the cursor
    const japaneseClone = document.createElement('div');
    japaneseClone.className = 'japanese-clone';
    japaneseClone.innerHTML = japaneseLayer.innerHTML;
    clipArea.appendChild(japaneseClone);

    // Function to update all elements based on mouse position
    function updateCursorPosition(x, y) {
        // Update cursor size based on screen size
        const cursorSize = getCursorSize();
        
        // Position glass cursor
        cursor.style.width = `${cursorSize}px`;
        cursor.style.height = `${cursorSize}px`;
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
        
        // Position clip area for Japanese text
        clipArea.style.width = `${cursorSize}px`;
        clipArea.style.height = `${cursorSize}px`;
        clipArea.style.left = x + 'px';
        clipArea.style.top = y + 'px';
        
        // Position mask to hide English text in cursor area
        englishMask.style.width = `${cursorSize}px`;
        englishMask.style.height = `${cursorSize}px`;
        englishMask.style.left = x + 'px';
        englishMask.style.top = y + 'px';
        
        // Make cursor visible
        cursor.style.opacity = '1';
        englishMask.style.opacity = '1';
        
        // Calculate text container boundaries
        const textRect = textContainer.getBoundingClientRect();
        
        // Position Japanese clone text relative to its original position
        const japaneseClone = document.querySelector('.japanese-clone');
        
        // Adjust font size based on screen width
        if (window.innerWidth <= 576) {
            japaneseClone.style.fontSize = '36px';
        } else if (window.innerWidth <= 768) {
            japaneseClone.style.fontSize = '50px';
        } else {
            japaneseClone.style.fontSize = '55.6242274413px';
        }
        
        japaneseClone.style.left = (textRect.left - x + textRect.width/2) + 'px';
        japaneseClone.style.top = (textRect.top - y + textRect.height/2) + 'px';
        
        // Check if the cursor is over the text area
        const isOverText = (
            x >= textRect.left &&
            x <= textRect.right &&
            y >= textRect.top &&
            y <= textRect.bottom
        );
        
        // Apply blur effect only when hovering over text
        cursor.style.backdropFilter = isOverText ? 'blur(30px)' : 'none';
    }
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        updateCursorPosition(e.clientX, e.clientY);
    });
    
    // Initialize position at center of screen
    updateCursorPosition(window.innerWidth / 2, window.innerHeight / 2);
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
        englishMask.style.opacity = '0';
    });
    
    // Ensure cursor appears when mouse enters window
    document.addEventListener('mouseenter', function(e) {
        cursor.style.opacity = '1';
        englishMask.style.opacity = '1';
        updateCursorPosition(e.clientX, e.clientY);
    });
    
    // Update cursor and text sizes when window is resized
    window.addEventListener('resize', function() {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        updateCursorPosition(x, y);
    });
    
    // Touch screen support for mobile devices
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            updateCursorPosition(touch.clientX, touch.clientY);
            e.preventDefault(); // Prevent scrolling when interacting with cursor
        }
    }, { passive: false });
    
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            cursor.style.opacity = '1';
            englishMask.style.opacity = '1';
            updateCursorPosition(touch.clientX, touch.clientY);
        }
    });
});