window.Page_Auth = async function() {
    const container = document.createElement('div');
    container.style.cssText = `
        width: 100%;
        max-width: 480px;
        padding: 0 20px;
        margin: auto;
    `;

    container.innerHTML = `
        <div class="glass-panel" style="padding: 3rem 2.5rem; position: relative; overflow: hidden;">
            
            <div id="auth-error" style="display:none; background: rgba(255, 59, 59, 0.15); border: 1px solid rgba(255, 59, 59, 0.3); color: #ff6b6b; padding: 12px; border-radius: 8px; font-size: 0.85rem; text-align: center; margin-bottom: 1.5rem;">
            </div>

            <!-- State 1: Login -->
            <div id="auth-login-state" style="display: flex; flex-direction: column; gap: 1.5rem;">
                <h2 style="text-align: center; margin-bottom: 0.5rem; font-size: 1.8rem;">Welcome Back</h2>
                <p style="text-align: center; color: var(--text-secondary); font-size: 0.9rem; margin-top: -1rem; margin-bottom: 1rem;">
                    Sign in to your ARIA Dashboard
                </p>
                
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="login-email" class="glass-input" placeholder="you@email.com" />
                </div>
                
                <div class="form-group">
                    <label>Master Password</label>
                    <input type="password" id="login-password" class="glass-input" placeholder="••••••••" />
                </div>
                
                <button class="glass-button" id="btn-do-login" style="margin-top: 1rem; width: 100%;">
                    Sign In
                </button>

                <div style="text-align:center; font-size: 0.9rem; margin-top: 1rem;">
                    <span style="color:var(--text-secondary);">Don't have an account?</span> 
                    <a href="javascript:void(0)" id="btn-goto-signup" style="color:var(--text-primary); margin-left:5px;">Create one</a>
                </div>
            </div>

            <!-- State 2: Sign Up - Step 1 -->
            <div id="auth-signup-1" style="display: none; flex-direction: column; gap: 1.5rem;">
                <h2 style="text-align: center; margin-bottom: 0.5rem; font-size: 1.6rem;">Seed Your AI (1/2)</h2>
                <p style="text-align: center; color: var(--text-secondary); font-size: 0.85rem; margin-top: -1rem; margin-bottom: 1rem;">
                    ARIA needs to know what matters to protect your focus.
                </p>
                
                <div class="form-group">
                    <label>Typical Workday</label>
                    <textarea id="reg-workday" class="glass-input" rows="2" placeholder="e.g. Code morning, meetings afternoon"></textarea>
                </div>
                
                <div class="form-group">
                    <label>VIP Contacts (Always allow)</label>
                    <input type="text" id="reg-senders" class="glass-input" placeholder="e.g. Boss, Sarah, Client XYZ" />
                </div>
                
                <button class="glass-button" id="btn-signup-next" style="margin-top: 1rem; width: 100%;">
                    Next Step
                </button>
                <div style="text-align:center; font-size: 0.85rem; margin-top: 0.5rem;">
                   <a href="javascript:void(0)" id="btn-cancel-signup" style="color:var(--text-secondary);">Cancel Sign Up</a>
                </div>
            </div>

            <!-- State 3: Sign Up - Step 2 -->
            <div id="auth-signup-2" style="display: none; flex-direction: column; gap: 1.3rem;">
                <h2 style="text-align: center; margin-bottom: 0.5rem; font-size: 1.6rem;">Secure Inbox (2/2)</h2>
                <p style="text-align: center; color: var(--text-secondary); font-size: 0.85rem; margin-top: -1rem; margin-bottom: 0.5rem;">
                    Local database. Zero cloud data sharing.
                </p>
                
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="reg-email" class="glass-input" placeholder="you@gmail.com" />
                </div>

                <div class="form-group">
                    <label>Master Password</label>
                    <input type="password" id="reg-password" class="glass-input" placeholder="Create a password" />
                </div>
                
                <div class="form-group">
                    <label>Google App Password</label>
                    <input type="password" id="reg-imap" class="glass-input" placeholder="16 letters (No spaces)" />
                </div>
                
                <button class="glass-button" id="btn-do-register" style="margin-top: 1rem; width: 100%;">
                    Create Account
                </button>
                <div style="text-align:center; font-size: 0.85rem; margin-top: 0.5rem;">
                   <a href="javascript:void(0)" id="btn-back-signup" style="color:var(--text-secondary);">Back</a>
                </div>
            </div>
            
        </div>
    `;

    // Elements
    const sLogin = container.querySelector('#auth-login-state');
    const sSign1 = container.querySelector('#auth-signup-1');
    const sSign2 = container.querySelector('#auth-signup-2');
    const errorBanner = container.querySelector('#auth-error');

    const showError = (msg) => {
        if (!msg) {
            errorBanner.style.display = 'none';
        } else {
            errorBanner.textContent = msg;
            errorBanner.style.display = 'block';
        }
    };

    const showState = (hideEl, showEl) => {
        showError(null); // Clear errors on tab change
        hideEl.style.display = 'none';
        showEl.style.display = 'flex';
    };

    // Navigation
    container.querySelector('#btn-goto-signup').addEventListener('click', () => showState(sLogin, sSign1));
    container.querySelector('#btn-cancel-signup').addEventListener('click', () => showState(sSign1, sLogin));
    container.querySelector('#btn-signup-next').addEventListener('click', () => showState(sSign1, sSign2));
    container.querySelector('#btn-back-signup').addEventListener('click', () => showState(sSign2, sSign1));

    // Logic
    container.querySelector('#btn-do-login').addEventListener('click', async (e) => {
        showError(null);
        const btn = e.target;
        const email = container.querySelector('#login-email').value.trim();
        const pass = container.querySelector('#login-password').value.trim();
        
        if (!email || !pass) {
            return showError('Please fill in both email and password.');
        }
        
        btn.textContent = 'Verifying...';
        btn.disabled = true;

        try {
            const res = await window.AriaAPI.login(email, pass);
            sessionStorage.setItem('aria_context', JSON.stringify({
                email: res.user.email,
                context: res.user.context
            }));
            window.navigate('/dashboard');
        } catch (err) {
            showError(err.message || 'Login failed');
            btn.textContent = 'Sign In';
            btn.disabled = false;
        }
    });

    container.querySelector('#btn-do-register').addEventListener('click', async (e) => {
        showError(null);
        const btn = e.target;
        const data = {
            workday: container.querySelector('#reg-workday').value,
            senders: container.querySelector('#reg-senders').value,
            focus: 'Execution',
            email: container.querySelector('#reg-email').value.trim(),
            password: container.querySelector('#reg-password').value.trim(),
            imapPassword: container.querySelector('#reg-imap').value.trim().replace(/\s+/g, '') // remove spaces just in case
        };

        if (!data.email || !data.password || !data.imapPassword) {
            return showError('Email, Master Password, and App Password are required.');
        }

        btn.textContent = 'Provisioning Core...';
        btn.disabled = true;

        try {
            const payload = {
                email: data.email,
                password: data.password,
                imapPassword: data.imapPassword,
                workday: data.workday,
                senders: data.senders,
                focus: data.focus
            };
            const res = await window.AriaAPI.register(payload);
            sessionStorage.setItem('aria_context', JSON.stringify({
                email: res.user.email,
                context: res.user.context
            }));
            window.navigate('/dashboard');
        } catch (err) {
            showError(err.message || 'Registration failed');
            btn.textContent = 'Create Account';
            btn.disabled = false;
        }
    });

    return container;
};
