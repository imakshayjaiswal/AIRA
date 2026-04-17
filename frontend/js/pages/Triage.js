window.Page_Triage = async function () {
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
        <header class="triage-header" style="grid-area:header;display:flex;justify-content:space-between;align-items:center;padding:0 2rem;border-bottom:1px solid var(--glass-border);background:rgba(0,0,0,0.15);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);">
            <h2 style="font-family:'Outfit',sans-serif;font-size:1.4rem;font-weight:600;">Email Triage</h2>
            <div style="display:flex;gap:1rem;align-items:center;">
                <div id="triage-mode-toggle" class="glass-button" style="padding:8px 20px;font-size:0.85rem;cursor:pointer;display:flex;gap:8px;align-items:center;">
                    <span id="mode-label">Single</span>
                    <span style="color:var(--text-secondary);font-size:0.75rem;">▼</span>
                </div>
                <button id="triage-settings-btn" style="background:transparent;border:1px solid var(--glass-border);border-radius:50%;width:40px;height:40px;color:var(--text-secondary);cursor:pointer;display:flex;justify-content:center;align-items:center;transition:all 0.2s;font-size:1rem;" title="AI Settings">⚙</button>
            </div>
        </header>

        <!-- Sidebar -->
        <aside class="triage-sidebar" style="grid-area:sidebar;border-right:1px solid var(--glass-border);background:rgba(0,0,0,0.25);backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);display:flex;flex-direction:column;padding:2rem 1.5rem;">
            <div class="logo-text" style="font-size:2rem;font-weight:800;letter-spacing:0.2rem;margin-bottom:2.5rem;background:linear-gradient(135deg,#ffffff,rgba(255,255,255,0.35));-webkit-background-clip:text;-webkit-text-fill-color:transparent;cursor:pointer;" id="sidebar-logo">
                ARIA
            </div>

            <nav style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:2rem;">
                <a href="#/dashboard" class="sidebar-link glass-button" style="padding:12px 15px;border-radius:10px;text-align:left;background:transparent;border-color:transparent;text-decoration:none;color:var(--text-primary);">
                    📊 Focus Digest
                </a>
                <a href="#/triage" class="sidebar-link glass-button" style="padding:12px 15px;border-radius:10px;text-align:left;background:var(--glass-highlight);text-decoration:none;color:var(--text-primary);">
                    ✉️ Manual Triage
                </a>
                <a href="#/insights" class="sidebar-link glass-button" style="padding:12px 15px;border-radius:10px;text-align:left;background:transparent;border-color:transparent;text-decoration:none;color:var(--text-primary);">
                    📈 Insights
                </a>
                <a href="#/feedback" class="sidebar-link glass-button" style="padding:12px 15px;border-radius:10px;text-align:left;background:transparent;border-color:transparent;text-decoration:none;color:var(--text-primary);">
                    💬 Feedback
                </a>
            </nav>



            <!-- Health Indicator -->
            <div id="health-indicator" style="margin-bottom:2rem;">
                <h3 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15rem;color:var(--text-secondary);margin-bottom:0.8rem;font-weight:600;">API Status</h3>
                <div class="glass-panel" style="padding:1rem;border-radius:12px;font-size:0.85rem;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                        <div id="health-dot" style="width:8px;height:8px;border-radius:50%;background:#555;transition:background 0.3s;"></div>
                        <span id="health-status" style="color:var(--text-secondary);">Checking…</span>
                    </div>
                    <div id="health-details" style="color:var(--text-secondary);font-size:0.75rem;line-height:1.6;"></div>
                </div>
            </div>

            <!-- Schema Viewer Toggle -->
            <button id="schema-toggle-btn" class="glass-button" style="padding:10px 15px;border-radius:10px;font-size:0.85rem;width:100%;margin-bottom:1.5rem;">
                📄 View API Docs
            </button>

            <div style="margin-top:auto;padding-top:2rem;border-top:1px solid var(--glass-border);font-size:0.8rem;color:var(--text-secondary);text-align:center;">
                ARIA v1.0.4
            </div>
        </aside>

        <!-- Main Content -->
        <main style="grid-area:main;overflow-y:auto;padding:2rem 2.5rem;position:relative;">
            <!-- Settings Panel (hidden by default) -->
            <div id="settings-panel" class="glass-panel" style="display:none;padding:1.5rem;margin-bottom:1.5rem;border-radius:16px;">
                <h3 style="font-size:0.9rem;margin-bottom:1rem;color:var(--text-secondary);font-weight:600;">AI Configuration</h3>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                    <div class="form-group" style="margin-bottom:0;">
                        <label for="ai-model" style="font-size:0.8rem;">Model Override</label>
                        <input type="text" id="ai-model" class="glass-input" placeholder="Leave blank for default" style="padding:10px;font-size:0.85rem;" />
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label for="ai-temp" style="font-size:0.8rem;">Temperature <span id="temp-value" style="color:var(--text-primary);">0.1</span></label>
                        <input type="range" id="ai-temp" min="0" max="2" step="0.1" value="0.1" style="width:100%;accent-color:#fff;margin-top:8px;" />
                    </div>
                </div>
            </div>

            <!-- Schema Modal (hidden by default) -->
            <div id="schema-modal" class="glass-panel" style="display:none;padding:2rem;margin-bottom:1.5rem;border-radius:16px;max-height:400px;overflow-y:auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
                    <h3 style="font-size:1rem;font-weight:600;">API Schema</h3>
                    <button id="schema-close" style="background:transparent;border:none;color:var(--text-secondary);font-size:1.2rem;cursor:pointer;">✕</button>
                </div>
                <pre id="schema-content" style="background:rgba(0,0,0,0.3);padding:1rem;border-radius:8px;font-size:0.78rem;line-height:1.6;overflow-x:auto;color:#ccc;white-space:pre-wrap;word-break:break-word;"></pre>
            </div>

            <!-- Single Email Form -->
            <div id="single-form">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
                    <div class="form-group" style="margin-bottom:0;">
                        <label for="email-subject">Subject *</label>
                        <input type="text" id="email-subject" class="glass-input" placeholder="e.g. Urgent: Q4 Budget Approval" />
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label for="email-from">From (email) *</label>
                        <input type="email" id="email-from" class="glass-input" placeholder="sender@company.com" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="email-body">Email Body *</label>
                    <textarea id="email-body" class="glass-input" rows="6" placeholder="Paste the email content here..." style="resize:vertical;line-height:1.6;font-family:'Inter',sans-serif;"></textarea>
                </div>

                <!-- Optional Fields (collapsible) -->
                <details style="margin-bottom:1.5rem;">
                    <summary style="cursor:pointer;color:var(--text-secondary);font-size:0.85rem;margin-bottom:1rem;user-select:none;">▸ Optional Fields (sender name, user email, CC, etc.)</summary>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem;">
                        <div class="form-group" style="margin-bottom:0;">
                            <label for="email-sender-name">Sender Name</label>
                            <input type="text" id="email-sender-name" class="glass-input" placeholder="John Smith" style="padding:10px;" />
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <label for="email-to">To</label>
                            <input type="email" id="email-to" class="glass-input" placeholder="you@company.com" style="padding:10px;" />
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <label for="email-user">Your Email</label>
                            <input type="email" id="email-user" class="glass-input" placeholder="you@company.com" style="padding:10px;" />
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <label for="email-cc">CC (comma-separated)</label>
                            <input type="text" id="email-cc" class="glass-input" placeholder="a@co.com, b@co.com" style="padding:10px;" />
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <label for="email-is-reply">Is Reply?</label>
                            <select id="email-is-reply" class="glass-input" style="padding:10px;appearance:none;cursor:pointer;">
                                <option style="background:#111;color:#fff;" value="">—</option>
                                <option style="background:#111;color:#fff;" value="true">Yes</option>
                                <option style="background:#111;color:#fff;" value="false">No</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <label for="email-thread-len">Thread Length</label>
                            <input type="number" id="email-thread-len" class="glass-input" placeholder="1" min="1" style="padding:10px;" />
                        </div>
                    </div>
                </details>

                <button class="glass-button" id="triage-submit-btn" style="width:100%;padding:16px;font-size:1.05rem;display:flex;justify-content:center;align-items:center;gap:10px;">
                    <span>✦</span> Analyze Email
                </button>
            </div>

            <!-- Batch Form (hidden by default) -->
            <div id="batch-form" style="display:none;">
                <div class="form-group">
                    <label for="batch-json">Paste Emails JSON Array (max 50)</label>
                    <textarea id="batch-json" class="glass-input" rows="10" placeholder='[
  { "subject": "...", "from": "...", "body": "..." },
  { "subject": "...", "from": "...", "body": "..." }
]' style="resize:vertical;line-height:1.6;font-family:'Inter',sans-serif;font-size:0.85rem;"></textarea>
                </div>
                <button class="glass-button" id="batch-submit-btn" style="width:100%;padding:16px;font-size:1.05rem;display:flex;justify-content:center;align-items:center;gap:10px;">
                    <span>✦</span> Analyze Batch
                </button>
            </div>

            <!-- Loading State -->
            <div id="triage-loading" style="display:none;text-align:center;padding:3rem;">
                <div class="triage-spinner"></div>
                <p style="color:var(--text-secondary);margin-top:1.5rem;font-size:1rem;">ARIA is analyzing…</p>
            </div>

            <!-- Error State -->
            <div id="triage-error" class="glass-panel" style="display:none;padding:1.5rem;margin-top:1.5rem;border-radius:16px;border-left:4px solid #ff4444;">
                <p style="color:#ff6666;font-weight:500;" id="error-message"></p>
                <p style="color:var(--text-secondary);font-size:0.8rem;margin-top:0.5rem;" id="error-details"></p>
            </div>

            <!-- Single Result -->
            <div id="triage-result" style="display:none;margin-top:2rem;"></div>

            <!-- Batch Results -->
            <div id="batch-results" style="display:none;margin-top:2rem;"></div>
        </main>
    `;

    // ─── DOM References ────────────────────
    const modeToggle = container.querySelector('#triage-mode-toggle');
    const modeLabel = container.querySelector('#mode-label');
    const singleForm = container.querySelector('#single-form');
    const batchForm = container.querySelector('#batch-form');
    const settingsBtn = container.querySelector('#triage-settings-btn');
    const settingsPanel = container.querySelector('#settings-panel');
    const tempSlider = container.querySelector('#ai-temp');
    const tempValue = container.querySelector('#temp-value');
    const schemaToggle = container.querySelector('#schema-toggle-btn');
    const schemaModal = container.querySelector('#schema-modal');
    const schemaClose = container.querySelector('#schema-close');
    const schemaContent = container.querySelector('#schema-content');
    const triageSubmit = container.querySelector('#triage-submit-btn');
    const batchSubmit = container.querySelector('#batch-submit-btn');
    const loadingEl = container.querySelector('#triage-loading');
    const errorEl = container.querySelector('#triage-error');
    const resultEl = container.querySelector('#triage-result');
    const batchResultsEl = container.querySelector('#batch-results');
    const sidebarLogo = container.querySelector('#sidebar-logo');

    let isBatchMode = false;

    // ─── Mode Toggle ────────────────────
    modeToggle.addEventListener('click', () => {
        isBatchMode = !isBatchMode;
        modeLabel.textContent = isBatchMode ? 'Batch' : 'Single';
        singleForm.style.display = isBatchMode ? 'none' : 'block';
        batchForm.style.display = isBatchMode ? 'block' : 'none';
        hideResults();
    });

    // ─── Settings Toggle ────────────────
    settingsBtn.addEventListener('click', () => {
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });
    settingsBtn.addEventListener('mouseenter', () => { settingsBtn.style.background = 'rgba(255,255,255,0.1)'; settingsBtn.style.color = '#fff'; });
    settingsBtn.addEventListener('mouseleave', () => { settingsBtn.style.background = 'transparent'; settingsBtn.style.color = 'var(--text-secondary)'; });

    tempSlider.addEventListener('input', () => { tempValue.textContent = tempSlider.value; });

    // ─── Schema Viewer ──────────────────
    schemaToggle.addEventListener('click', async () => {
        if (schemaModal.style.display === 'none') {
            try {
                const res = await window.AriaAPI.getSchema();
                schemaContent.textContent = JSON.stringify(res.data, null, 2);
                schemaModal.style.display = 'block';
            } catch (e) {
                schemaContent.textContent = 'Failed to load schema: ' + e.message;
                schemaModal.style.display = 'block';
            }
        } else {
            schemaModal.style.display = 'none';
        }
    });
    schemaClose.addEventListener('click', () => { schemaModal.style.display = 'none'; });

    sidebarLogo.addEventListener('click', () => { window.navigate('/dashboard'); });

    // ─── Health Check ───────────────────
    async function checkHealth() {
        const dot = container.querySelector('#health-dot');
        const status = container.querySelector('#health-status');
        const details = container.querySelector('#health-details');
        try {
            const res = await window.AriaAPI.getHealth();
            const d = res.data;
            dot.style.background = '#00ff88';
            dot.style.boxShadow = '0 0 8px #00ff88';
            status.textContent = 'Online';
            status.style.color = '#00ff88';
            details.innerHTML = `Provider: ${d.aiProvider}<br>Uptime: ${d.uptime}s<br>Memory: ${d.memoryUsage?.heapUsed || '—'}`;
        } catch (e) {
            dot.style.background = '#ff4444';
            dot.style.boxShadow = '0 0 8px #ff4444';
            status.textContent = 'Offline';
            status.style.color = '#ff4444';
            details.innerHTML = 'Cannot reach backend';
        }
    }
    checkHealth();

    // ─── Helpers ─────────────────────────
    function getAIOptions() {
        const opts = {};
        const model = container.querySelector('#ai-model').value.trim();
        if (model) opts.model = model;
        const temp = parseFloat(tempSlider.value);
        if (temp !== 0.1) opts.temperature = temp;
        return opts;
    }

    function showLoading() {
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';
        resultEl.style.display = 'none';
        batchResultsEl.style.display = 'none';
        triageSubmit.disabled = true;
        batchSubmit.disabled = true;
    }

    function hideLoading() {
        loadingEl.style.display = 'none';
        triageSubmit.disabled = false;
        batchSubmit.disabled = false;
    }

    function hideResults() {
        errorEl.style.display = 'none';
        resultEl.style.display = 'none';
        batchResultsEl.style.display = 'none';
    }

    function showError(msg, details) {
        hideLoading();
        errorEl.style.display = 'block';
        container.querySelector('#error-message').textContent = msg;
        container.querySelector('#error-details').textContent = details || '';
    }

    // ─── Priority Ring Color ────────────
    function getPriorityColor(score) {
        if (score >= 90) return '#ff3b3b';
        if (score >= 70) return '#ff9500';
        if (score >= 50) return '#ffcc00';
        if (score >= 30) return '#34c759';
        return '#888888';
    }

    function getCategoryStyle(cat) {
        const map = {
            urgent_action: { bg: 'rgba(255,59,59,0.15)', color: '#ff6b6b', label: 'Urgent Action' },
            needs_reply:   { bg: 'rgba(255,149,0,0.15)', color: '#ffaa33', label: 'Needs Reply' },
            fyi:           { bg: 'rgba(52,199,89,0.15)', color: '#34c759', label: 'FYI' },
            promotional:   { bg: 'rgba(136,136,136,0.15)', color: '#aaa', label: 'Promotional' },
            noise:         { bg: 'rgba(80,80,80,0.15)', color: '#666', label: 'Noise' },
        };
        return map[cat] || map.noise;
    }

    function getUrgencyStyle(level) {
        const map = {
            critical: '#ff3b3b',
            high: '#ff9500',
            medium: '#ffcc00',
            low: '#34c759',
            none: '#666',
        };
        return map[level] || '#666';
    }

    // ─── Render Single Result ────────────
    function renderResult(data) {
        hideLoading();
        resultEl.style.display = 'block';
        const d = data;
        const pColor = getPriorityColor(d.priority_score);
        const catStyle = getCategoryStyle(d.category);
        const urgColor = getUrgencyStyle(d.urgency_level);

        // Save to session for Dashboard
        const history = JSON.parse(sessionStorage.getItem('ariaTriageHistory') || '[]');
        history.unshift(d);
        if (history.length > 20) history.pop();
        sessionStorage.setItem('ariaTriageHistory', JSON.stringify(history));

        resultEl.innerHTML = `
            <div class="glass-panel triage-result-card" style="padding:2.5rem;border-radius:20px;animation:slideUp 0.5s ease forwards;">
                <!-- Top Row: Priority + Category + Urgency -->
                <div style="display:flex;align-items:center;gap:2rem;margin-bottom:2rem;flex-wrap:wrap;">
                    <!-- Priority Ring -->
                    <div style="position:relative;width:90px;height:90px;flex-shrink:0;">
                        <svg width="90" height="90" viewBox="0 0 90 90">
                            <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="6" />
                            <circle cx="45" cy="45" r="38" fill="none" stroke="${pColor}" stroke-width="6" stroke-linecap="round"
                                stroke-dasharray="${(d.priority_score / 100) * 239} 239"
                                transform="rotate(-90 45 45)"
                                style="transition:stroke-dasharray 1s ease;filter:drop-shadow(0 0 6px ${pColor});" />
                        </svg>
                        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
                            <div style="font-family:'Outfit',sans-serif;font-size:1.6rem;font-weight:800;color:${pColor};">${d.priority_score}</div>
                        </div>
                    </div>
                    <div style="flex:1;min-width:200px;">
                        <div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-bottom:0.8rem;">
                            <span style="background:${catStyle.bg};color:${catStyle.color};padding:4px 14px;border-radius:20px;font-size:0.8rem;font-weight:600;">${catStyle.label}</span>
                            <span style="background:rgba(255,255,255,0.06);color:${urgColor};padding:4px 14px;border-radius:20px;font-size:0.8rem;font-weight:600;border:1px solid ${urgColor}33;">${d.urgency_level.toUpperCase()}</span>
                            <span style="background:rgba(255,255,255,0.06);color:var(--text-secondary);padding:4px 14px;border-radius:20px;font-size:0.8rem;">Action: <strong style="color:var(--text-primary);">${d.action}</strong></span>
                        </div>
                        <p style="color:var(--text-primary);font-size:1.1rem;font-weight:500;line-height:1.5;">${d.reason}</p>
                    </div>
                </div>

                <!-- Detail Grid -->
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-bottom:1.5rem;">
                    <div class="glass-panel" style="padding:1rem;border-radius:12px;">
                        <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1rem;color:var(--text-secondary);margin-bottom:4px;">Key Info</div>
                        <div style="font-size:0.9rem;line-height:1.5;">${d.key_info}</div>
                    </div>
                    <div class="glass-panel" style="padding:1rem;border-radius:12px;">
                        <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1rem;color:var(--text-secondary);margin-bottom:4px;">Sender Type</div>
                        <div style="font-size:0.95rem;font-weight:500;">${d.sender_type}</div>
                    </div>
                    <div class="glass-panel" style="padding:1rem;border-radius:12px;">
                        <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1rem;color:var(--text-secondary);margin-bottom:4px;">Est. Time</div>
                        <div style="font-size:0.95rem;font-weight:500;">${d.estimated_time}</div>
                    </div>
                    <div class="glass-panel" style="padding:1rem;border-radius:12px;">
                        <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1rem;color:var(--text-secondary);margin-bottom:4px;">Needs Response</div>
                        <div style="font-size:0.95rem;font-weight:500;">${d.requires_response ? '✓ Yes' : '✗ No'}</div>
                    </div>
                    ${d.deadline ? `
                    <div class="glass-panel" style="padding:1rem;border-radius:12px;">
                        <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1rem;color:var(--text-secondary);margin-bottom:4px;">Deadline</div>
                        <div style="font-size:0.95rem;font-weight:500;color:#ff9500;">${d.deadline}</div>
                    </div>` : ''}
                </div>

                ${d.red_flags && d.red_flags.length > 0 ? `
                <div style="margin-top:1rem;padding:1rem;border-radius:12px;background:rgba(255,59,59,0.08);border:1px solid rgba(255,59,59,0.15);">
                    <div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1rem;color:#ff6b6b;margin-bottom:8px;font-weight:600;">⚠ Red Flags</div>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;">
                        ${d.red_flags.map(f => `<span style="background:rgba(255,59,59,0.12);color:#ff8888;padding:3px 10px;border-radius:8px;font-size:0.8rem;">${f}</span>`).join('')}
                    </div>
                </div>` : ''}

                <!-- Metadata -->
                <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--glass-border);display:flex;flex-wrap:wrap;gap:1.5rem;font-size:0.75rem;color:var(--text-secondary);">
                    <span>ID: ${d.triageId?.substring(0, 8) || '—'}…</span>
                    <span>Provider: ${d.metadata?.aiProvider || '—'}</span>
                    <span>Model: ${d.metadata?.model || 'default'}</span>
                    <span>Time: ${d.metadata?.processingTimeMs || '—'}ms</span>
                </div>
            </div>
        `;
    }

    // ─── Render Batch Results ────────────
    function renderBatchResults(data) {
        hideLoading();
        batchResultsEl.style.display = 'block';
        const s = data.summary;

        let summaryHTML = `
            <div class="glass-panel" style="padding:2rem;border-radius:20px;margin-bottom:2rem;animation:slideUp 0.5s ease forwards;">
                <h3 style="font-size:1.3rem;margin-bottom:1.5rem;font-weight:600;">Batch Summary</h3>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1rem;margin-bottom:1.5rem;">
                    <div class="glass-panel" style="padding:1rem;border-radius:12px;text-align:center;">
                        <div style="font-size:2rem;font-weight:800;font-family:'Outfit',sans-serif;">${s.processed}</div>
                        <div style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;">Processed</div>
                    </div>
                    <div class="glass-panel" style="padding:1rem;border-radius:12px;text-align:center;">
                        <div style="font-size:2rem;font-weight:800;font-family:'Outfit',sans-serif;color:${s.failed > 0 ? '#ff4444' : '#34c759'};">${s.failed}</div>
                        <div style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;">Failed</div>
                    </div>
                    <div class="glass-panel" style="padding:1rem;border-radius:12px;text-align:center;">
                        <div style="font-size:2rem;font-weight:800;font-family:'Outfit',sans-serif;">${(s.totalTimeMs / 1000).toFixed(1)}s</div>
                        <div style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;">Total Time</div>
                    </div>
                    <div class="glass-panel" style="padding:1rem;border-radius:12px;text-align:center;">
                        <div style="font-size:2rem;font-weight:800;font-family:'Outfit',sans-serif;">${s.avgTimeMs}ms</div>
                        <div style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;">Avg/Email</div>
                    </div>
                </div>

                <!-- Urgency Breakdown -->
                <h4 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1rem;color:var(--text-secondary);margin-bottom:0.8rem;">Urgency Breakdown</h4>
                <div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-bottom:1rem;">
                    ${Object.entries(s.breakdown).map(([k, v]) => `<span style="background:rgba(255,255,255,0.06);padding:6px 14px;border-radius:10px;font-size:0.8rem;color:${getUrgencyStyle(k === 'noise' ? 'none' : k)};">${k}: <strong>${v}</strong></span>`).join('')}
                </div>

                <!-- Category Breakdown -->
                <h4 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1rem;color:var(--text-secondary);margin-bottom:0.8rem;">Categories</h4>
                <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
                    ${Object.entries(s.categories).map(([k, v]) => { const cs = getCategoryStyle(k); return `<span style="background:${cs.bg};color:${cs.color};padding:6px 14px;border-radius:10px;font-size:0.8rem;">${cs.label}: <strong>${v}</strong></span>`; }).join('')}
                </div>
            </div>
        `;

        // Individual results
        const resultsArr = data.results || [];
        summaryHTML += `<h3 style="font-size:1.1rem;margin-bottom:1rem;color:var(--text-secondary);font-weight:500;">Individual Results</h3>`;
        summaryHTML += `<div style="display:flex;flex-direction:column;gap:1rem;">`;
        resultsArr.forEach((item, i) => {
            if (item.success) {
                const r = item.result;
                const pColor = getPriorityColor(r.priority_score);
                const catStyle = getCategoryStyle(r.category);
                summaryHTML += `
                    <div class="glass-panel" style="padding:1.2rem 1.5rem;border-radius:14px;border-left:4px solid ${pColor};display:flex;align-items:center;gap:1.2rem;animation:slideUp 0.4s ease ${i * 0.08}s both;">
                        <div style="font-family:'Outfit',sans-serif;font-size:1.5rem;font-weight:800;color:${pColor};min-width:45px;text-align:center;">${r.priority_score}</div>
                        <div style="flex:1;min-width:0;">
                            <div style="font-weight:500;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.metadata?.emailSubject || 'Email ' + (i + 1)}</div>
                            <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.4;">${r.reason}</div>
                        </div>
                        <div style="display:flex;gap:0.5rem;flex-shrink:0;flex-wrap:wrap;">
                            <span style="background:${catStyle.bg};color:${catStyle.color};padding:3px 10px;border-radius:8px;font-size:0.75rem;">${catStyle.label}</span>
                            <span style="font-size:0.75rem;color:var(--text-secondary);">${r.action}</span>
                        </div>
                    </div>`;
            } else {
                summaryHTML += `
                    <div class="glass-panel" style="padding:1rem 1.5rem;border-radius:14px;border-left:4px solid #ff4444;">
                        <span style="color:#ff6666;font-size:0.85rem;">Email ${item.index + 1} failed: ${item.error}</span>
                    </div>`;
            }
        });
        summaryHTML += `</div>`;

        batchResultsEl.innerHTML = summaryHTML;
    }

    // ─── Single Submit ──────────────────
    triageSubmit.addEventListener('click', async () => {
        const subject = container.querySelector('#email-subject').value.trim();
        const from = container.querySelector('#email-from').value.trim();
        const body = container.querySelector('#email-body').value.trim();
        if (!subject || !from || !body) {
            showError('Please fill in all required fields (Subject, From, Body).');
            return;
        }

        const email = { subject, from, body };
        const senderName = container.querySelector('#email-sender-name').value.trim();
        const to = container.querySelector('#email-to').value.trim();
        const userEmail = container.querySelector('#email-user').value.trim();
        const cc = container.querySelector('#email-cc').value.trim();
        const isReply = container.querySelector('#email-is-reply').value;
        const threadLength = container.querySelector('#email-thread-len').value;

        if (senderName) email.senderName = senderName;
        if (to) email.to = to;
        if (userEmail) email.userEmail = userEmail;
        if (cc) email.cc = cc.split(',').map(s => s.trim()).filter(Boolean);
        if (isReply !== '') email.isReply = isReply === 'true';
        if (threadLength) email.threadLength = parseInt(threadLength, 10);

        showLoading();
        try {
            const res = await window.AriaAPI.triageEmail(email, getAIOptions());
            renderResult(res.data);
        } catch (e) {
            showError(e.message, e.details ? JSON.stringify(e.details) : '');
        }
    });

    // ─── Batch Submit ───────────────────
    batchSubmit.addEventListener('click', async () => {
        const raw = container.querySelector('#batch-json').value.trim();
        let emails;
        try {
            emails = JSON.parse(raw);
            if (!Array.isArray(emails) || emails.length === 0) throw new Error();
        } catch {
            showError('Invalid JSON. Paste an array of email objects: [{ "subject": "...", "from": "...", "body": "..." }, ...]');
            return;
        }

        showLoading();
        try {
            const res = await window.AriaAPI.triageBatch(emails, getAIOptions());
            renderBatchResults(res.data);
        } catch (e) {
            showError(e.message, e.details ? JSON.stringify(e.details) : '');
        }
    });

    return container;
};
