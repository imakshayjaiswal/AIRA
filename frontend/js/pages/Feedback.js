window.Page_Feedback = async function() {
    const container = document.createElement('div');
    container.style.cssText = `
        width: 100%;
        max-width: 600px;
        padding: 20px;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    // Trigger slide-up animation on next frame
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        });
    });

    container.innerHTML = `
        <div class="glass-panel" style="padding: 3.5rem 3rem;">
            
            <h2 style="text-align: center; margin-bottom: 0.5rem; font-size: 2rem;">Feedback &amp; Support</h2>
            <p style="text-align: center; color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 2.5rem; line-height: 1.5;">
                Encountered an issue or have a suggestion? The engineering team is ready to assist you.
            </p>
            
            <div class="form-group">
                <label for="feedback-category">Category</label>
                <div style="position: relative;">
                    <select id="feedback-category" class="glass-input" style="appearance: none; cursor: pointer;">
                        <option style="background: #111; color: #fff;" value="bug">Report a Bug</option>
                        <option style="background: #111; color: #fff;" value="feature">Feature Request</option>
                        <option style="background: #111; color: #fff;" value="complaint">Complaint</option>
                        <option style="background: #111; color: #fff;" value="other">Other</option>
                    </select>
                    <div style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-secondary);">
                        ▼
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="feedback-description">Description</label>
                <textarea id="feedback-description" class="glass-input" rows="6" placeholder="Describe your experience in detail..." style="resize: vertical; font-family: 'Inter', sans-serif; line-height: 1.5;"></textarea>
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 2.5rem;">
                <button class="glass-button" id="back-btn" style="flex: 1; background: transparent; border-color: rgba(255,255,255,0.2);">
                    Back
                </button>
                <button class="glass-button" id="submit-btn" style="flex: 2; background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.25); display: flex; justify-content: center; align-items: center; gap: 10px;">
                    Submit Feedback
                </button>
            </div>
            
        </div>
    `;

    const backBtn = container.querySelector('#back-btn');
    const submitBtn = container.querySelector('#submit-btn');

    backBtn.addEventListener('click', () => {
        window.navigate('/dashboard');
    });

    submitBtn.addEventListener('click', () => {
        // Micro-interaction for submit — monochrome success
        submitBtn.innerHTML = 'Submitted <span style="font-size: 1.2rem;">✓</span>';
        submitBtn.style.background = 'rgba(255, 255, 255, 0.20)';
        submitBtn.style.borderColor = 'rgba(255, 255, 255, 0.40)';
        submitBtn.style.pointerEvents = 'none'; // Prevent double click
        
        setTimeout(() => {
            window.navigate('/dashboard');
        }, 1500);
    });

    return container;
};
