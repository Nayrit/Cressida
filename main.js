document.addEventListener('DOMContentLoaded', () => {
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
        // Position glass cursor
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
        
        // Position clip area for Japanese text
        clipArea.style.left = x + 'px';
        clipArea.style.top = y + 'px';
        
        // Position mask to hide English text in cursor area
        englishMask.style.left = x + 'px';
        englishMask.style.top = y + 'px';
        
        // Make cursor visible
        cursor.style.opacity = '1';
        englishMask.style.opacity = '1';
        
        // Calculate text container boundaries
        const textRect = textContainer.getBoundingClientRect();
        
        // Position Japanese clone text relative to its original position
        const japaneseClone = document.querySelector('.japanese-clone');
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
});