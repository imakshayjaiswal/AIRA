window.Page_Landing = async function() {
    const container = document.createElement('div');
    container.className = 'landing-container';
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    `;

    container.innerHTML = `
        <div class="glass-panel" style="padding: 4rem 6rem; display: flex; flex-direction: column; align-items: center; gap: 2rem;">
            <!-- Monochrome logo -->
            <div class="logo-text" style="font-size: 5rem; font-weight: 800; letter-spacing: 0.5rem; background: linear-gradient(135deg, #ffffff, rgba(255,255,255,0.35)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ARIA
            </div>
            
            <p style="font-size: 1.1rem; color: var(--text-secondary); max-width: 400px; line-height: 1.6; margin-bottom: 2rem; font-weight: 300;">
                Advanced Reasoning &amp; Intelligent Analysis. Your minimalist workspace for clarity.
            </p>

            <button class="glass-button" id="start-btn" style="font-size: 1.1rem; padding: 16px 48px;">
                Get Started
            </button>
        </div>
    `;

    const startBtn = container.querySelector('#start-btn');
    startBtn.addEventListener('click', () => {
        window.navigate('/auth');
    });

    return container;
};
