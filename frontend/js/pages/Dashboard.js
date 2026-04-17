window.Page_Dashboard = async function () {
    const container = document.createElement('div');
    container.style.cssText = `
        width: 100vw; height: 100vh;
        display: grid;
        grid-template-columns: 280px 1fr;
        grid-template-rows: 70px 1fr;
        grid-template-areas: "sidebar header" "sidebar main";
    `;

    container.innerHTML = `
        <!-- Header -->
        <header style="grid-area:header;display:flex;justify-content:space-between;align-items:center;padding:0 2rem;border-bottom:1px solid var(--glass-border);background:rgba(0,0,0,0.15);backdrop-filter:blur(5px);">
            <h2 style="font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:600;">Focus Digest</h2>
            <div style="display:flex;gap:1rem;align-items:center;">
                <span id="user-badge" style="font-size:0.8rem;color:var(--text-secondary);"></span>
                <button id="logout-btn" style="background:transparent;border:1px solid var(--glass-border);border-radius:8px;padding:6px 16px;color:var(--text-secondary);cursor:pointer;font-size:0.8rem;">Sign Out</button>
            </div>
        </header>

        <!-- Sidebar -->
        <aside style="grid-area:sidebar;border-right:1px solid var(--glass-border);background:rgba(0,0,0,0.25);backdrop-filter:blur(15px);display:flex;flex-direction:column;padding:2rem 1.5rem;overflow-y:auto;">
            <div class="logo-text" style="font-size:2rem;font-weight:800;letter-spacing:0.2rem;margin-bottom:2.5rem;background:linear-gradient(135deg,#ffffff,rgba(255,255,255,0.35));-webkit-background-clip:text;-webkit-text-fill-color:transparent;">ARIA</div>
            <nav style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:2rem;">
                <a href="#/dashboard" class="sidebar-link glass-button" style="padding:12px 15px;border-radius:10px;text-align:left;background:var(--glass-highlight);text-decoration:none;color:var(--text-primary);">📊 Focus Digest</a>
                <a href="#/triage"   class="sidebar-link glass-button" style="padding:12px 15px;border-radius:10px;text-align:left;background:transparent;border-color:transparent;text-decoration:none;color:var(--text-primary);">✉️ Manual Triage</a>
                <a href="#/insights" class="sidebar-link glass-button" style="padding:12px 15px;border-radius:10px;text-align:left;background:transparent;border-color:transparent;text-decoration:none;color:var(--text-primary);">📈 Insights</a>
                <a href="#/feedback" class="sidebar-link glass-button" style="padding:12px 15px;border-radius:10px;text-align:left;background:transparent;border-color:transparent;text-decoration:none;color:var(--text-primary);">💬 Feedback</a>
            </nav>
            <div class="glass-panel" style="padding:1rem;border-radius:12px;font-size:0.8rem;line-height:1.7;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                    <div style="width:8px;height:8px;border-radius:50%;background:#00ff88;box-shadow:0 0 8px #00ff88;"></div>
                    <span style="color:#00ff88;font-weight:500;">AI Engine Active</span>
                </div>
                <div style="color:var(--text-secondary);">NVIDIA NIM · IMAP Sync</div>
            </div>
            <div style="flex:1;"></div>
            <div style="padding-top:1.5rem;border-top:1px solid var(--glass-border);font-size:0.75rem;color:var(--text-secondary);text-align:center;">ARIA v1.0.4</div>
        </aside>

        <!-- Main -->
        <main style="grid-area:main;overflow-y:auto;padding:2.5rem;">

            <!-- Setup Card -->
            <div id="setup-card" class="glass-panel" style="padding:2.5rem;border-radius:20px;margin-bottom:2rem;">

                <h3 style="font-family:'Outfit',sans-serif;font-size:1.5rem;margin-bottom:0.4rem;">Sync Your Gmail</h3>
                <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:0;">ARIA fetches your emails, removes noise, and surfaces what actually needs your attention.</p>

                <!-- Step indicator -->
                <div style="display:flex;gap:0;margin:1.8rem 0 2rem;border-radius:10px;overflow:hidden;border:1px solid var(--glass-border);">
                    <div style="flex:1;padding:10px;text-align:center;background:rgba(255,255,255,0.08);font-size:0.8rem;font-weight:600;border-right:1px solid var(--glass-border);">Step 1<br><span style="font-weight:400;color:var(--text-secondary);">Enable IMAP</span></div>
                    <div style="flex:1;padding:10px;text-align:center;font-size:0.8rem;font-weight:600;border-right:1px solid var(--glass-border);">Step 2<br><span style="font-weight:400;color:var(--text-secondary);">Create App Password</span></div>
                    <div style="flex:1;padding:10px;text-align:center;font-size:0.8rem;font-weight:600;">Step 3<br><span style="font-weight:400;color:var(--text-secondary);">Paste &amp; Sync</span></div>
                </div>

                <!-- Warning box -->
                <div style="background:rgba(255,149,0,0.08);border:1px solid rgba(255,149,0,0.25);border-radius:12px;padding:1rem 1.2rem;margin-bottom:1.8rem;font-size:0.85rem;line-height:1.7;color:var(--text-secondary);">
                    ⚠️ <strong style="color:#ffaa33;">Do NOT use your normal Gmail password.</strong> Google blocks that by design.
                    You need a special <strong style="color:var(--text-primary);">App Password</strong> — a 16-character code created specifically for ARIA.
                </div>

                <!-- Instructions -->
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:2rem;">
                    <div style="background:rgba(255,255,255,0.04);border:1px solid var(--glass-border);border-radius:14px;padding:1.2rem;">
                        <div style="font-size:1.4rem;margin-bottom:0.6rem;">①</div>
                        <div style="font-weight:600;font-size:0.9rem;margin-bottom:0.4rem;">Enable Gmail IMAP</div>
                        <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.6;">
                            Open Gmail → <strong>Settings ⚙️</strong> → <strong>See All Settings</strong> → <strong>Forwarding and POP/IMAP</strong> tab → Enable IMAP → Save.
                        </div>
                    </div>
                    <div style="background:rgba(255,255,255,0.04);border:1px solid var(--glass-border);border-radius:14px;padding:1.2rem;">
                        <div style="font-size:1.4rem;margin-bottom:0.6rem;">②</div>
                        <div style="font-weight:600;font-size:0.9rem;margin-bottom:0.4rem;">Create App Password</div>
                        <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.6;">
                            Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" style="color:rgba(255,255,255,0.5);">myaccount.google.com/apppasswords</a> → Select app: <strong>Mail</strong> → Select device: <strong>Windows PC</strong> → Click <strong>Generate</strong>.
                        </div>
                    </div>
                    <div style="background:rgba(255,255,255,0.04);border:1px solid var(--glass-border);border-radius:14px;padding:1.2rem;">
                        <div style="font-size:1.4rem;margin-bottom:0.6rem;">③</div>
                        <div style="font-weight:600;font-size:0.9rem;margin-bottom:0.4rem;">Come back &amp; paste</div>
                        <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.6;">
                            Google shows a <strong>16-character code</strong>. Copy it. Come back to this tab. Paste it in the field below. Click Sync.
                        </div>
                    </div>
                </div>

                <!-- Credential Input -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
                    <div>
                        <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:6px;">Your Gmail Address</label>
                        <input type="email" id="sync-email" class="glass-input" placeholder="yourname@gmail.com" style="width:100%;" />
                    </div>
                    <div>
                        <label style="font-size:0.8rem;color:var(--text-secondary);display:block;margin-bottom:6px;">App Password <em style="font-style:normal;opacity:0.5;">(16 chars — paste directly, spaces OK)</em></label>
                        <input type="text" id="sync-pass" class="glass-input" placeholder="abcd efgh ijkl mnop" style="width:100%;letter-spacing:0.05em;" />
                    </div>
                </div>

                <div style="display:flex;gap:1rem;">
                    <button id="fetch-inbox-btn" class="glass-button" style="flex:1;padding:16px;font-size:1rem;font-weight:600;background:rgba(255,255,255,0.12);border-radius:12px;letter-spacing:0.04em;">
                        ✦ &nbsp;Fetch &amp; Analyze Inbox
                    </button>
                    <button id="demo-mode-btn" class="glass-button" style="padding:16px 24px;font-size:1rem;font-weight:600;background:rgba(52,199,89,0.15);color:#34c759;border-color:rgba(52,199,89,0.3);border-radius:12px;">
                        🚀 Run Hackathon Demo
                    </button>
                </div>

                <div id="sync-error" style="display:none;margin-top:1rem;color:#ff6b6b;font-size:0.85rem;padding:12px 16px;background:rgba(255,59,59,0.08);border-radius:10px;border:1px solid rgba(255,59,59,0.2);line-height:1.6;"></div>
                <div id="sync-loading" style="display:none;margin-top:1rem;text-align:center;color:var(--text-secondary);font-size:0.9rem;padding:0.8rem;">
                    <span style="animation:pulse 1.5s infinite;">Connecting to Gmail IMAP and triaging with AI...</span>
                </div>
            </div>

            <!-- Results area -->
            <div id="digest-stat-line" style="font-size:1rem;color:var(--text-secondary);margin-bottom:1.5rem;display:none;padding:1rem 1.5rem;background:rgba(255,255,255,0.04);border-radius:12px;"></div>
            <div id="top-priority-list" style="display:flex;flex-direction:column;gap:1.2rem;"></div>
            <div id="noise-reduced-notice" style="display:none;margin-top:3rem;text-align:center;padding:2rem;border:1px dashed var(--glass-border);border-radius:20px;opacity:0.5;font-size:0.9rem;color:var(--text-secondary);"></div>

        </main>
    `;

    // ─── Helpers ──────────────────────────────────────────────

    function getPriorityColor(score) {
        if (score >= 85) return '#ff3b3b';
        if (score >= 65) return '#ff9500';
        if (score >= 45) return '#ffcc00';
        return '#34c759';
    }

    function getCategoryStyle(cat) {
        const m = {
            urgent_action: { bg: 'rgba(255,59,59,0.15)', color: '#ff6b6b', label: '🔴 Urgent' },
            needs_reply: { bg: 'rgba(255,149,0,0.15)', color: '#ffaa33', label: '🟡 Reply' },
            fyi: { bg: 'rgba(52,199,89,0.15)', color: '#34c759', label: '🟢 FYI' },
            promotional: { bg: 'rgba(136,136,136,0.12)', color: '#888', label: '⚪ Promo' },
            noise: { bg: 'rgba(60,60,60,0.15)', color: '#555', label: '🔇 Noise' },
        };
        return m[cat] || m.noise;
    }

    // ─── DOM refs ──────────────────────────────────────────────

    const fetchBtn = container.querySelector('#fetch-inbox-btn');
    const syncErr = container.querySelector('#sync-error');
    const syncLoading = container.querySelector('#sync-loading');
    const statLine = container.querySelector('#digest-stat-line');
    const listEl = container.querySelector('#top-priority-list');

    // ─── Render results ────────────────────────────────────────

    function renderDigest(emails) {
        if (!emails || !Array.isArray(emails)) {
            console.error('renderDigest: Expected array but got:', emails);
            listEl.innerHTML = '<div class="glass-panel" style="padding:2rem;text-align:center;color:#ff6b6b;">⚠ AI returned invalid data format. Please try again.</div>';
            return;
        }
        listEl.innerHTML = '';
        const sorted = [...emails].sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));

        sorted.forEach((r, i) => {
            const pColor = getPriorityColor(r.priority_score || 0);
            const catStyle = getCategoryStyle(r.category);
            const card = document.createElement('div');
            card.className = 'glass-panel';
            card.style.cssText = `padding:1.6rem 2rem;border-radius:16px;border-left:5px solid ${pColor};animation:slideUp 0.4s ease ${i * 0.08}s both;`;
            card.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1.5rem;">
                    <div style="flex:1;min-width:0;">
                        <div style="display:flex;gap:0.5rem;margin-bottom:0.7rem;flex-wrap:wrap;">
                            <span style="background:${catStyle.bg};color:${catStyle.color};padding:3px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;">${catStyle.label}</span>
                            <span style="font-size:0.75rem;color:var(--text-secondary);padding:3px 0;">Action: <strong style="color:var(--text-primary);">${r.action || '—'}</strong></span>
                        </div>
                        <div style="font-size:1.05rem;font-weight:600;margin-bottom:0.5rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${r.metadata?.emailSubject || ''}">
                            ${r.metadata?.emailSubject || r.subject || 'Email'}
                        </div>
                        <p style="color:var(--text-secondary);font-size:0.88rem;line-height:1.55;margin:0;">${r.reason || ''}</p>
                    </div>
                    <div style="font-family:'Outfit',sans-serif;font-size:2rem;font-weight:800;color:${pColor};flex-shrink:0;min-width:50px;text-align:right;">${r.priority_score || 0}</div>
                </div>
            `;
            listEl.appendChild(card);
        });

        container.querySelector('#noise-reduced-notice').style.display = 'block';
        container.querySelector('#noise-reduced-notice').textContent =
            `${Math.max(0, 20 - sorted.length)} additional emails were automatically managed — promotions, noise and low-priority items removed.`;
    }

    // ─── Sync logic ────────────────────────────────────────────

    container.querySelector('#demo-mode-btn').addEventListener('click', async () => {
        syncErr.style.display = 'none';
        syncLoading.style.display = 'block';
        fetchBtn.disabled = true;
        const demoBtn = container.querySelector('#demo-mode-btn');
        demoBtn.disabled = true;
        demoBtn.textContent = 'Running AI...';

        try {
            const res = await window.AriaAPI.demoTriage();
            syncLoading.style.display = 'none';
            statLine.innerHTML = `<strong style="color:#34c759;">🚀 Demo Mode Complete.</strong> ${res.count} realistic seed emails analyzed by NVIDIA NIM AI.`;
            statLine.style.display = 'block';
            renderDigest(res.results);
            demoBtn.textContent = '🚀 Run Hackathon Demo';
            demoBtn.disabled = false;
            fetchBtn.disabled = false;
        } catch (err) {
            syncLoading.style.display = 'none';
            syncErr.innerHTML = `<strong>Demo failed:</strong> ${err.message}`;
            syncErr.style.display = 'block';
            demoBtn.textContent = '🚀 Run Hackathon Demo';
            demoBtn.disabled = false;
            fetchBtn.disabled = false;
        }
    });

    fetchBtn.addEventListener('click', async () => {
        syncErr.style.display = 'none';
        syncLoading.style.display = 'none';

        const email = container.querySelector('#sync-email').value.trim();
        const pass = container.querySelector('#sync-pass').value.replace(/\s+/g, ''); // strip all spaces

        let isLoggedIn = false;
        try {
            const ctx = JSON.parse(sessionStorage.getItem('aria_context') || '{}');
            if (ctx.email && ctx.email === email) isLoggedIn = true;
        } catch (e) { }

        if (!email) {
            syncErr.textContent = '⚠ Please enter your Gmail address.';
            syncErr.style.display = 'block';
            return;
        }
        if (!email.includes('@')) {
            syncErr.textContent = '⚠ That doesn\'t look like a valid email address.';
            syncErr.style.display = 'block';
            return;
        }

        // If not logged in, pass is explicitly required.
        // If logged in, pass is optional (we fall back to DB). BUT if they provide one, it must be valid.
        if (!isLoggedIn && !pass) {
            syncErr.textContent = '⚠ Please enter your Google App Password (the 16-character code from Step 2).';
            syncErr.style.display = 'block';
            return;
        }
        if (pass && pass.length < 16) {
            syncErr.textContent = `⚠ App Password looks too short (${pass.length} chars). It should be exactly 16 characters. Make sure you didn\'t use your regular Gmail password.`;
            syncErr.style.display = 'block';
            return;
        }

        fetchBtn.disabled = true;
        fetchBtn.textContent = 'Connecting...';
        syncLoading.style.display = 'block';

        try {
            // Priority: If they explicitly typed a password on screen, use it. Otherwise, rely on DB (null).
            const pToUse = pass ? pass : null;
            const res = await window.AriaAPI.fetchAndTriage(email, pToUse);

            syncLoading.style.display = 'none';

            if (!res.results || res.results.length === 0) {
                statLine.textContent = 'Inbox synced successfully but no emails were found.';
                statLine.style.display = 'block';
                fetchBtn.textContent = '✓ Synced — Fetch Again';
                fetchBtn.disabled = false;
                return;
            }

            statLine.innerHTML = `<strong style="color:var(--text-primary);">✦ Sync Complete.</strong> ${res.count} emails analyzed. AI surfaced ${res.results.length} items that need your attention.`;
            statLine.style.display = 'block';
            renderDigest(res.results);
            fetchBtn.textContent = '✓ Inbox Synced — Fetch Again';
            fetchBtn.disabled = false;

        } catch (err) {
            syncLoading.style.display = 'none';
            syncErr.innerHTML = `<strong>Sync failed:</strong> ${err.message}`;
            syncErr.style.display = 'block';
            fetchBtn.textContent = '✦ Fetch & Analyze Inbox';
            fetchBtn.disabled = false;
        }
    });

    // ─── Auto-fill email from session ─────────────────────────

    try {
        const ctx = JSON.parse(sessionStorage.getItem('aria_context') || '{}');
        if (ctx.email) {
            container.querySelector('#sync-email').value = ctx.email;
            container.querySelector('#user-badge').textContent = ctx.email;

            // Do NOT hide the password field. Just explain it's optional.
            const passLabel = container.querySelector('#sync-pass').previousElementSibling;
            if (passLabel) {
                passLabel.innerHTML = 'App Password <em style="font-style:normal;opacity:0.5;">(Optional — leave blank to use saved password)</em>';
            }
        }
    } catch (e) { }

    // ─── Sign out ──────────────────────────────────────────────

    container.querySelector('#logout-btn').addEventListener('click', () => {
        sessionStorage.clear();
        window.navigate('/auth');
    });

    return container;
};
