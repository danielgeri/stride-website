// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Confetti implementation
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return; // Exit if not on the main page

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#6d28d9', '#7c3aed', '#f43f5e', '#ffffff', '#c4b5fd'];

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    function createConfetti(x, y) {
        const particleCount = 40;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: x,
                y: y,
                r: Math.random() * 6 + 2,
                dx: Math.random() * 10 - 5,
                dy: Math.random() * -10 - 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngleIncrement: (Math.random() * 0.07) + 0.05,
                tiltAngle: 0
            });
        }
    }

    function animateConfetti() {
        requestAnimationFrame(animateConfetti);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
            p.tiltAngle += p.tiltAngleIncrement;
            p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2;
            p.x += Math.sin(p.tiltAngle) * 2;
            p.dy += 0.2; // gravity
            p.y += p.dy;
            p.x += p.dx;

            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
            ctx.stroke();

            // Remove particles that are off screen
            if (p.y > canvas.height) {
                particles.splice(index, 1);
            }
        });
    }

    animateConfetti();

    // Setup interactive mockup
    const bingoCells = document.querySelectorAll('.bingo-cell');
    
    bingoCells.forEach(cell => {
        cell.addEventListener('click', (e) => {
            if (!cell.classList.contains('active')) {
                cell.classList.add('active');
                
                // Get cell position relative to viewport
                const rect = cell.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                createConfetti(centerX, centerY);

                // Update counter in mockup
                const headerP = document.querySelector('.mockup-header p');
                if (headerP) {
                    const activeCount = document.querySelectorAll('.bingo-cell.active').length;
                    headerP.textContent = `${activeCount}/9 Completed`;
                }
            } else {
                // Optional toggle off
                cell.classList.remove('active');
                const headerP = document.querySelector('.mockup-header p');
                if (headerP) {
                    const activeCount = document.querySelectorAll('.bingo-cell.active').length;
                    headerP.textContent = `${activeCount}/9 Completed`;
                }
            }
        });
    });
});
