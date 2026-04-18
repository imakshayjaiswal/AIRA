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
        <header style="grid-area:header;display:flex;justify-content:space-between;align-items:center;padding:0 2rem;border-bottom:1px solid transparent;border-image:linear-gradient(to right, rgba(255,255,255,0.08), transparent) 1;">
            <h2 style="font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:600;">Focus Digest</h2>
            <div style="display:flex;gap:1rem;align-items:center;">
                <span id="user-badge" style="font-size:0.8rem;color:var(--text-secondary);"></span>
                <button id="logout-btn" style="background:transparent;border:1px solid var(--glass-border);border-radius:8px;padding:6px 16px;color:var(--text-secondary);cursor:pointer;font-size:0.8rem;">Sign Out</button>
            </div>
        </header>

        <!-- Sidebar -->
        <aside style="grid-area:sidebar;border-right:1px solid transparent;border-image:linear-gradient(to bottom, rgba(255,255,255,0.08), transparent) 1;display:flex;flex-direction:column;overflow-y:auto;">
            <div style="height:70px;padding:0 2rem;display:flex;align-items:center;">
                <div class="logo-text" style="font-size:1.6rem;font-weight:800;letter-spacing:0.15rem;background:linear-gradient(135deg,#ffffff,rgba(255,255,255,0.4));-webkit-background-clip:text;-webkit-text-fill-color:transparent;">ARIA</div>
            </div>
            <div style="padding:2rem 1.5rem;display:flex;flex-direction:column;flex:1;">
                <div style="flex:1;"></div>
                <nav style="display:flex;flex-direction:column;gap:0.5rem;">
                <a href="#/dashboard" class="sidebar-link glass-button" style="padding:12px 15px;border-radius:10px;text-align:left;background:var(--glass-highlight);text-decoration:none;color:var(--text-primary);">📊 Focus Digest</a>
                <a href="#/triage"   class="sidebar-link glass-button" style="padding:12px 15px;border-radius:10px;text-align:left;background:transparent;border-color:transparent;text-decoration:none;color:var(--text-primary);">✉️ Manual Triage</a>
                <a href="#/insights" class="sidebar-link glass-button" style="padding:12px 15px;border-radius:10px;text-align:left;background:transparent;border-color:transparent;text-decoration:none;color:var(--text-primary);">📈 Insights</a>
                <a href="#/feedback" class="sidebar-link glass-button" style="padding:12px 15px;border-radius:10px;text-align:left;background:transparent;border-color:transparent;text-decoration:none;color:var(--text-primary);">💬 Feedback</a>
            </nav>
            <div style="flex:1;"></div>
            <div style="padding-top:1.5rem;border-top:1px solid transparent;border-image:linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent) 1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                <div style="display:flex;align-items:center;gap:6px;">
                    <div style="width:5px;height:5px;border-radius:50%;background:#00ff88;box-shadow:0 0 6px rgba(0,255,136,0.5);"></div>
                    <span style="color:var(--text-secondary);font-weight:500;font-size:0.7rem;">AI Engine Active</span>
                </div>
                <div style="color:var(--text-secondary);font-size:0.65rem;opacity:0.6;">NVIDIA NIM · IMAP Sync · v1.0.4</div>
            </div>
        </aside>

        <!-- Main -->
        <main style="grid-area:main;overflow-y:auto;padding:2.5rem;">

            <!-- Setup Card -->
            <div id="setup-card" class="glass-panel" style="background: rgba(35, 35, 35, 0.9); padding:2.5rem;border-radius:20px;margin-bottom:2rem;border: 1px solid rgba(255,255,255,0.08);">

                <h3 style="font-family:'Outfit',sans-serif;font-size:1.5rem;margin-bottom:0.4rem;">Sync Your Gmail</h3>
                <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:0;">ARIA fetches your emails, removes noise, and surfaces what actually needs your attention.</p>

                <style>
                    .tooltip-container:hover .cloud-tooltip { display: block !important; animation: popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                    @keyframes popUp { from { opacity:0; transform:translateX(-50%) translateY(15px) scale(0.95); } to { opacity:1; transform:translateX(-50%) translateY(0) scale(1); } }
                </style>

                <!-- Credential Input -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:1rem;margin-bottom:1.5rem;">
                    <div>
                        <label style="font-size:0.85rem;font-weight:500;color:var(--text-secondary);display:block;margin-bottom:8px;">Your Gmail Address</label>
                        <input type="email" id="sync-email" class="glass-input" placeholder="name@gmail.com" style="background: rgba(15, 15, 15, 0.9); width:100%;padding:12px;font-size:0.95rem;border-radius:10px;border: 1px solid rgba(255,255,255,0.05);" />
                    </div>
                    <div>
                        <label style="font-size:0.85rem;font-weight:500;color:var(--text-secondary);display:flex;align-items:center;gap:6px;margin-bottom:8px;position:relative;">
                            App Password (Optional)
                            <div class="tooltip-container" style="position:relative;cursor:pointer;display:inline-flex;">
                                <div style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.1);border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:bold;color:var(--text-primary);transition:all 0.2s;">i</div>
                                <div class="cloud-tooltip" style="display:none;position:absolute;bottom:calc(100% + 15px);left:50%;transform:translateX(-50%);width:340px;background:rgba(20,20,20,0.98);backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,0.15);border-radius:18px;padding:1.5rem;box-shadow:0 20px 50px rgba(0,0,0,0.6);z-index:999;color:var(--text-primary);font-size:0.85rem;line-height:1.6;cursor:default;">
                                    <h4 style="margin:0 0 10px 0;font-size:0.95rem;color:#ffaa33;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:10px;">⚠️ Setup Instructions</h4>
                                    <p style="margin:0 0 15px 0;opacity:0.8;">Do NOT use your normal Gmail password. You need a 16-character App Password.</p>
                                    
                                    <div style="font-weight:600;color:#fff;">① Enable Gmail IMAP</div>
                                    <div style="opacity:0.6;margin-bottom:10px;font-size:0.75rem;">Gmail Settings ⚙️ → See All Settings → Forwarding and POP/IMAP → Enable IMAP → Save.</div>
                                    
                                    <div style="font-weight:600;color:#fff;">② Create App Password</div>
                                    <div style="opacity:0.6;margin-bottom:10px;font-size:0.75rem;">myaccount.google.com/apppasswords → Select app: Mail → Windows PC → Generate.</div>
                                    
                                    <div style="font-weight:600;color:#fff;">③ Paste & Sync</div>
                                    <div style="opacity:0.6;font-size:0.75rem;">Copy that 16-character code and paste it below.</div>
                                    
                                    <!-- Tooltip arrow -->
                                    <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid rgba(255,255,255,0.15);"></div>
                                    <div style="position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid rgba(20,20,20,0.98);"></div>
                                </div>
                            </div>
                        </label>
                        <input type="text" id="sync-pass" class="glass-input" placeholder="16-character code" style="background: rgba(15, 15, 15, 0.9); width:100%;padding:12px;font-size:0.95rem;border-radius:10px;letter-spacing:0.05em;border: 1px solid rgba(255,255,255,0.05);" />
                    </div>
                </div>

                <div style="display:flex;gap:1rem;">
                    <button id="fetch-inbox-btn" class="glass-button" style="flex:1;padding:16px;font-size:1rem;font-weight:600;background:rgba(85,85,85,0.85);border-radius:12px;letter-spacing:0.04em;">
                        ✦ &nbsp;Fetch &amp; Analyze Inbox
                    </button>
                    <button id="demo-mode-btn" class="glass-button" style="padding:16px 24px;font-size:1rem;font-weight:600;background:#1a4325;color:#34c759;border-color:rgba(52,199,89,0.3);border-radius:12px;">
                        🚀 Run Hackathon Demo
                    </button>
                </div>

                <div id="sync-error" style="display:none;margin-top:1rem;color:#ff6b6b;font-size:0.85rem;padding:12px 16px;background:rgba(255,59,59,0.08);border-radius:10px;border:1px solid rgba(255,59,59,0.2);line-height:1.6;"></div>
                <div id="sync-loading" style="display:none;margin-top:1rem;">
                    <div class="skeleton-card"><div class="skeleton-box" style="height:20px;width:30%;margin-bottom:15px;"></div><div class="skeleton-box" style="height:15px;width:100%;margin-bottom:10px;"></div><div class="skeleton-box" style="height:15px;width:80%;"></div></div>
                    <div class="skeleton-card"><div class="skeleton-box" style="height:20px;width:40%;margin-bottom:15px;"></div><div class="skeleton-box" style="height:15px;width:95%;margin-bottom:10px;"></div><div class="skeleton-box" style="height:15px;width:60%;"></div></div>
                </div>
            </div>

            <!-- Results area -->
            <div id="digest-stat-line" style="font-size:1rem;color:var(--text-secondary);margin-bottom:1.5rem;display:none;padding:1rem 1.5rem;background:rgba(255,255,255,0.04);border-radius:12px;"></div>
            <div id="top-priority-list" style="display:flex;flex-direction:column;gap:1.2rem;"></div>
            <div id="noise-reduced-notice" style="display:none;margin-top:3rem;text-align:center;padding:2rem;border:1px dashed var(--glass-border);border-radius:20px;opacity:0.5;font-size:0.9rem;color:var(--text-secondary);"></div>

            <!-- Email Modal -->
            <div id="email-reader-modal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <div>
                            <h3 id="modal-subject" style="font-family:'Outfit',sans-serif;font-weight:600;font-size:1.4rem;margin-bottom:0.2rem;"></h3>
                            <div id="modal-sender" style="color:var(--text-secondary);font-size:0.85rem;"></div>
                        </div>
                        <button class="modal-close-btn" id="close-modal-btn">✖</button>
                    </div>
                    <div class="modal-body">
                        <div id="modal-summary-box" style="margin-bottom:2rem;padding-left:1.2rem;background:transparent;border-left:3px solid transparent;border-image:linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0)) 1;border-radius:0;">
                             <div style="font-family:'Inter',sans-serif;font-weight:500;color:var(--text-secondary);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Context Match</div>
                             <div id="modal-summary-content" style="color:var(--text-primary);font-size:0.95rem;line-height:1.6;"></div>
                        </div>
                        <div style="font-family:'Inter',sans-serif;font-weight:500;color:var(--text-secondary);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">Raw Message</div>
                        <div id="modal-email-text" style="white-space: pre-wrap; font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);"></div>
                    </div>
                </div>
            </div>

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

    const modalEl = container.querySelector('#email-reader-modal');
    container.querySelector('#close-modal-btn').addEventListener('click', () => {
        modalEl.style.display = 'none';
    });
    modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) modalEl.style.display = 'none';
    });

    // ─── Render results ────────────────────────────────────────

    function renderDigest(emails) {
        if (!emails || !Array.isArray(emails)) {
            console.error('renderDigest: Expected array but got:', emails);
            listEl.innerHTML = '<div class="glass-panel" style="padding:2rem;text-align:center;color:#ff6b6b;">⚠ AI returned invalid data format. Please try again.</div>';
            return;
        }
        listEl.innerHTML = '';
        const important = emails.filter(r => r.category !== 'noise' && (r.priority_score || 0) >= 20);
        const noise = emails.filter(r => r.category === 'noise' || (r.priority_score || 0) < 20);

        const sorted = [...important].sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));

        sorted.forEach((r, i) => {
            const pColor = getPriorityColor(r.priority_score || 0);
            const catStyle = getCategoryStyle(r.category);
            const card = document.createElement('div');
            card.className = 'glass-panel email-card-hover';
            card.style.cssText = `padding:1.6rem 2rem;border-radius:16px;border-left:5px solid ${pColor};animation:slideUp 0.4s ease ${i * 0.08}s both;`;
            card.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1.5rem;">
                    <div style="flex:1;min-width:0;">
                        <div style="display:flex;gap:0.5rem;margin-bottom:0.7rem;flex-wrap:wrap;align-items:center;">
                            <span style="background:${catStyle.bg};color:${catStyle.color};padding:3px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;">${catStyle.label}</span>
                            <span style="font-size:0.75rem;color:var(--text-secondary);padding:3px 0;">Action: <strong style="color:var(--text-primary);">${r.action || '—'}</strong></span>
                            <div class="action-reveal-container" style="margin-left:auto;">
                                <button class="action-btn action-btn-read">View</button>
                                <button class="action-btn action-btn-resolve">Resolve</button>
                                <button class="action-btn action-btn-snooze">Snooze</button>
                                <button class="action-btn action-btn-archive">Archive</button>
                            </div>
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

            const readBtn = card.querySelector('.action-btn-read');
            if (readBtn) {
                readBtn.addEventListener('click', () => {
                    container.querySelector('#modal-subject').textContent = r.metadata?.emailSubject || r.subject || 'No Subject';
                    container.querySelector('#modal-sender').textContent = `From: ${r.metadata?.emailFrom || r.from || 'Unknown Sender'}`;

                    container.querySelector('#modal-summary-content').innerHTML = `
                        <div style="margin-bottom:6px;"><strong style="color:rgba(255,255,255,0.9);font-weight:500;">Reasoning:</strong> <span style="opacity:0.8;">${r.reason || 'N/A'}</span></div>
                        <div><strong style="color:rgba(255,255,255,0.9);font-weight:500;">TL;DR:</strong> <span style="opacity:0.8;">${r.key_info || 'N/A'}</span></div>
                    `;

                    container.querySelector('#modal-email-text').textContent = r.metadata?.emailBody || 'No email body available.';
                    modalEl.style.display = 'flex';
                });
            }

            const attachRemoveAnimation = (selector) => {
                const btn = card.querySelector(selector);
                if (btn) {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        card.classList.add('slide-out-right');
                        setTimeout(() => card.remove(), 300);
                    });
                }
            };

            attachRemoveAnimation('.action-btn-resolve');
            attachRemoveAnimation('.action-btn-snooze');
            attachRemoveAnimation('.action-btn-archive');
        });

        // Generate Chart.js Stats
        const stats = { critical: 0, high: 0, medium: 0, low: 0, noise: noise.length };
        important.forEach(r => {
            const score = r.priority_score || 0;
            if (score >= 85) stats.critical++;
            else if (score >= 65) stats.high++;
            else if (score >= 45) stats.medium++;
            else stats.low++;
        });

        const timeline = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 4; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            timeline[label] = 0;
        }

        emails.forEach(e => {
            if (e.metadata && e.metadata.emailDate) {
                const d = new Date(e.metadata.emailDate);
                d.setHours(0, 0, 0, 0);
                const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (timeline[label] !== undefined) timeline[label]++;
            } else {
                const label = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (timeline[label] !== undefined) timeline[label]++;
            }
        });

        const graphHtml = `
            <div class="glass-panel holographic-analytics" style="margin-top: 1rem; padding: 1.5rem; border-radius: 16px; animation: slideUp 0.5s ease 0.5s both; background: rgba(0,0,0,0.3); box-shadow: inset 0 0 20px rgba(0,255,136,0.05); border: 1px solid rgba(0,255,136,0.15);">
                <h4 style="margin: 0 0 1.2rem 0; font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 500; color: #00ff88; text-transform:uppercase; letter-spacing: 0.1em; display:flex; align-items:center; gap:8px;">
                    <div style="width:8px; height:8px; border-radius:50%; background:#00ff88; box-shadow:0 0 10px #00ff88;"></div>
                    Holographic Analytics
                </h4>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; align-items: center;">
                    <div style="position: relative; height: 160px; display:flex; justify-content:center; align-items:center;">
                        <canvas id="circularChart"></canvas>
                        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); text-align:center;">
                            <div style="font-size:1.8rem; font-weight:800; font-family:'Outfit',sans-serif; color:var(--text-primary); line-height:1;">${important.length}</div>
                            <div style="font-size:0.65rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; margin-top:2px;">Important</div>
                        </div>
                    </div>
                    <div style="position: relative; height: 160px;">
                        <canvas id="hologramChart"></canvas>
                    </div>
                </div>
            </div>
        `;

        const gDiv = document.createElement('div');
        gDiv.innerHTML = graphHtml;
        listEl.appendChild(gDiv);

        setTimeout(() => {
            const ctxC = document.getElementById('circularChart');
            if (ctxC && window.Chart) {
                new Chart(ctxC, {
                    type: 'doughnut',
                    data: {
                        labels: ['Critical', 'High', 'Medium', 'Low', 'Noise'],
                        datasets: [{
                            data: [stats.critical, stats.high, stats.medium, stats.low, stats.noise],
                            backgroundColor: ['#ff3b3b', '#ff9500', '#ffcc00', '#34c759', '#333333'],
                            borderWidth: 0,
                            cutout: '80%'
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#fff', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }, legend: { display: false } } }
                });
            }
            const ctxH = document.getElementById('hologramChart');
            if (ctxH && window.Chart) {
                const ctx = ctxH.getContext('2d');
                const grad = ctx.createLinearGradient(0, 0, 0, 160);
                grad.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
                grad.addColorStop(1, 'rgba(0, 255, 136, 0)');
                new Chart(ctxH, {
                    type: 'line',
                    data: {
                        labels: Object.keys(timeline),
                        datasets: [{
                            data: Object.values(timeline),
                            borderColor: '#00ff88',
                            backgroundColor: grad,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointBackgroundColor: '#00ff88'
                        }]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        scales: {
                            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } } },
                            x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } } }
                        },
                        plugins: { tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#fff', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }, legend: { display: false } }
                    }
                });
            }
        }, 100);

        const notice = container.querySelector('#noise-reduced-notice');
        if (noise.length > 0) {
            notice.style.display = 'block';
            notice.style.opacity = '1';
            notice.innerHTML = `
                <div style="font-weight:600; font-family:'Outfit',sans-serif; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.05rem; margin-bottom:1rem; display:flex; align-items:center; gap:8px;">
                    <span style="font-size:1.2rem;">🔇</span> Unimportant Box 
                    <span style="background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:12px; font-size:0.75rem;">${noise.length} bundled items</span>
                </div>
                <div style="text-align:left; font-size:0.85rem; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                    ${noise.map(n => `
                        <div style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-secondary); display: flex; justify-content: space-between;">
                            <span>&bull; ${n.key_info || n.reason || n.subject}</span>
                            <span style="opacity: 0.5;">Score: ${n.priority_score || 0}</span>
                        </div>
                    `).join('')}
                    <div style="padding-top: 10px; font-size: 0.8rem; color: #555; text-align: center; font-style: italic;">Cleaned by ARIA Engine. Requires no action.</div>
                </div>
            `;
        } else {
            notice.style.display = 'none';
        }
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
            const statLine = container.querySelector('#digest-stat-line');
            statLine.style.display = 'block';
            statLine.innerHTML = `
                <div style="margin-bottom:8px;">
                    <strong>${res.results.length}</strong> items need your attention. 
                    <span style="color:var(--text-secondary); margin-left:8px;">${res.noise_count || 0} noise items suppressed.</span>
                </div>
                ${res.summary ? `
                <div style="margin-top: 15px; padding: 15px; background: rgba(52, 199, 89, 0.08); border-radius: 12px; border: 1px solid rgba(52, 199, 89, 0.2);">
                    <div style="font-weight: 600; color: #34c759; margin-bottom: 8px; font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase;">✦ Executive Summary</div>
                    <div style="color: var(--text-primary); font-size: 0.95rem; line-height: 1.6;">
                        ${res.summary.split('\n').filter(l => l.trim()).map(line => `<div style="margin-bottom:4px;">${line}</div>`).join('')}
                    </div>
                </div>
                ` : ''}
            `;
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

            statLine.innerHTML = `
                <div style="margin-bottom:8px;">
                    <strong style="color:var(--text-primary);">✦ Sync Complete.</strong> ${res.count} emails analyzed.
                </div>
                ${res.summary ? `
                <div style="margin-top: 15px; padding: 15px; background: rgba(52, 199, 89, 0.08); border-radius: 12px; border: 1px solid rgba(52, 199, 89, 0.2);">
                    <div style="font-weight: 600; color: #34c759; margin-bottom: 8px; font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase;">✦ Executive Summary</div>
                    <div style="color: var(--text-primary); font-size: 0.95rem; line-height: 1.6;">
                        ${res.summary.split('\n').filter(l => l.trim()).map(line => `<div style="margin-bottom:4px;">${line}</div>`).join('')}
                    </div>
                </div>
                ` : ''}
            `;
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

            // Do NOT overwrite the tooltip! Check if the icon button exists.
            const infoBtn = container.querySelector('.tooltip-container');
            if (infoBtn) {
                // Tooltip is present, don't touch the label content.
            } else {
                const passLabel = container.querySelector('#sync-pass').previousElementSibling;
                if (passLabel) {
                    passLabel.innerHTML = 'App Password <em style="font-style:normal;opacity:0.5;">(Optional — leave blank)</em>';
                }
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
