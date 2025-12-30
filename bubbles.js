document.addEventListener('DOMContentLoaded', () => {
    // Create container
    const container = document.createElement('div');
    container.id = 'bubble-container';
    Object.assign(container.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '-1',
        overflow: 'hidden',
        pointerEvents: 'none'
    });
    document.body.appendChild(container);

    // Create bubbles
    const bubbleCount = 15 + Math.floor(Math.random() * 6); // 15-20 bubbles

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // Random properties
        const size = 20 + Math.random() * 30; // 20-50px
        const left = Math.random() * 100; // 0-100%
        const duration = 8 + Math.random() * 4; // 8-12s
        const delay = Math.random() * 12; // Random delay
        const opacity = 0.3 + Math.random() * 0.3; // 30-60%

        // Apply styles
        Object.assign(bubble.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            bottom: `-${size}px`,
            animationDuration: `${duration}s`,
            animationDelay: `-${delay}s` // Negative delay to start mid-animation
        });
        bubble.style.setProperty('--bubble-opacity', opacity);

        container.appendChild(bubble);
    }
});
