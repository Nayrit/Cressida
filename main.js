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

    // Glass cursor and dual language image effect
    const cursor = document.querySelector('.glass-cursor');
    const clipArea = document.querySelector('.clip-area');
    const englishMask = document.querySelector('.english-mask');
    const textContainer = document.querySelector('.text-container');
    const englishLayer = document.querySelector('.english-layer');
    const japaneseLayer = document.querySelector('.japanese-layer');
    
    // Get the Japanese image source
    const japaneseImage = japaneseLayer.querySelector('img');
    const englishImage = englishLayer.querySelector('img');
    
    // Keep Japanese layer hidden but correctly positioned
    japaneseLayer.style.visibility = 'hidden';
    japaneseLayer.style.opacity = '0';
    
    // Create a clone of Japanese image for the cursor
    const japaneseClone = document.createElement('div');
    japaneseClone.className = 'japanese-clone';
    
    const cloneImage = document.createElement('img');
    cloneImage.src = japaneseImage.src;
    cloneImage.alt = japaneseImage.alt;
    cloneImage.style.width = japaneseImage.offsetWidth + 'px';
    cloneImage.style.height = 'auto';
    
    japaneseClone.appendChild(cloneImage);
    clipArea.appendChild(japaneseClone);
    
    // Make sure the clone is visible
    japaneseClone.style.visibility = 'visible';
    japaneseClone.style.opacity = '1';

    // Function to update all elements based on mouse position
    // Update the glass cursor effect function in main.js
function updateCursorPosition(x, y) {
    // Update cursor size based on screen size
    const cursorSize = getCursorSize();
    
    // Position glass cursor
    cursor.style.width = `${cursorSize}px`;
    cursor.style.height = `${cursorSize}px`;
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    
    // Position clip area for Japanese image
    clipArea.style.width = `${cursorSize}px`;
    clipArea.style.height = `${cursorSize}px`;
    clipArea.style.left = x + 'px';
    clipArea.style.top = y + 'px';
    
    // Position mask to hide English image in cursor area
    englishMask.style.width = `${cursorSize}px`;
    englishMask.style.height = `${cursorSize}px`;
    englishMask.style.left = x + 'px';
    englishMask.style.top = y + 'px';
    
    // Make cursor visible
    cursor.style.opacity = '1';
    englishMask.style.opacity = '1';
    
    // Calculate text container boundaries
    const textRect = textContainer.getBoundingClientRect();
    const japaneseImageRect = japaneseImage.getBoundingClientRect();
    const englishImageRect = englishImage.getBoundingClientRect();
    
    // Get the offset between cursor position and the top-left corner of textContainer
    const offsetX = x - textRect.left;
    const offsetY = y - textRect.top;
    
    // Calculate the position within the container as a percentage
    const percentX = offsetX / textRect.width;
    const percentY = offsetY / textRect.height;
    
    // Position clone image to align perfectly with original position
    const japaneseCloneImg = japaneseClone.querySelector('img');
    
    // Match the size of the original Japanese image exactly
    japaneseCloneImg.style.width = japaneseImage.offsetWidth + 'px';
    japaneseCloneImg.style.height = japaneseImage.offsetHeight + 'px';
    
    // Calculate the position for the japaneseClone so that it looks properly aligned
    // We need to position the image inside the clip area so that the part of the image
    // that should be under the cursor is actually under the cursor
    japaneseClone.style.width = japaneseImage.offsetWidth + 'px';
    japaneseClone.style.height = japaneseImage.offsetHeight + 'px';
    
    // Position the clone so the correct part of the image shows through the cursor
    const leftPos = -(offsetX - cursorSize/2);
    const topPos = -(offsetY - cursorSize/2);
    
    japaneseClone.style.left = leftPos + 'px';
    japaneseClone.style.top = topPos + 'px';
    
    // Check if the cursor is over the image area
    const isOverText = (
        x >= textRect.left &&
        x <= textRect.right &&
        y >= textRect.top &&
        y <= textRect.bottom
    );
    
    // Apply magnifying effect only when hovering over image
    if (isOverText) {
        // Create a radial gradient for magnification (stronger in center, weaker at edges)
        cursor.style.backdropFilter = 'blur(30px)';
        
        // Add magnification effect
        japaneseCloneImg.style.transformOrigin = `${offsetX}px ${offsetY}px`;
        japaneseCloneImg.style.transform = 'scale(1.2)'; // Magnify by 20%
        
        // Create a radial gradient for the transform
        const distanceFromCenter = Math.sqrt(Math.pow(offsetX - textRect.width/2, 2) + Math.pow(offsetY - textRect.height/2, 2));
        const maxDistance = Math.sqrt(Math.pow(textRect.width/2, 2) + Math.pow(textRect.height/2, 2));
        const normalizedDistance = distanceFromCenter / maxDistance;
        
        // Scale between 1.1 (edge) and 1.5 (center)
        const scaleValue = 1.5 - (normalizedDistance * 0.4);
        japaneseCloneImg.style.transform = `scale(${scaleValue})`;
    } else {
        cursor.style.backdropFilter = 'none';
        japaneseCloneImg.style.transform = 'scale(1)';
    }
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
    
    // Update cursor and image sizes when window is resized
    window.addEventListener('resize', function() {
        // Update japaneseClone image size on resize
        const japaneseCloneImg = japaneseClone.querySelector('img');
        japaneseCloneImg.style.width = japaneseImage.offsetWidth + 'px';
        japaneseCloneImg.style.height = japaneseImage.offsetHeight + 'px';
        
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