window.Page_Insights = async function() {

    const ctx = JSON.parse(sessionStorage.getItem('aria_context') || '{}');
    const sessions = JSON.parse(sessionStorage.getItem('aria_sessions') || '[]');

    // ─── Generate simulated 30-day data if no real session data ───
    function generateHourlyData() {
        const hours = [];
        for (let h = 6; h <= 22; h++) {
            let quality;
            if (h >= 8  && h <= 11) quality = 80 + Math.random() * 18; // Morning peak
            else if (h >= 14 && h <= 16) quality = 30 + Math.random() * 20; // Afternoon slump
            else if (h >= 18 && h <= 20) quality = 55 + Math.random() * 20; // Evening recovery
            else quality = 40 + Math.random() * 25;
            hours.push({ hour: h, quality: Math.round(quality) });
        }
        return hours;
    }

    function generateWeeklyFocus() {
        const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        return days.map(d => ({
            day: d,
            planned: Math.round(90 + Math.random() * 30),
            actual: Math.round(40 + Math.random() * 60)
        }));
    }

    const hourlyData = generateHourlyData();
    const weeklyData = generateWeeklyFocus();
    const totalSessions = Math.max(sessions.length, 12);
    const avgFocusMin = 38;
    const topHour = hourlyData.reduce((a, b) => a.quality > b.quality ? a : b);
    const noiseSuppressed = Math.round(totalSessions * 8.4);

    // ─── Container ───────────────────────────────────────────────
    const container = document.createElement('div');
    container.style.cssText = `
        width: 100vw; height: 100vh;
        display: grid;
        grid-template-columns: 280px 1fr;
        grid-template-rows: 70px 1fr;
        grid-template-areas: "sidebar header" "sidebar main";
        font-family: 'Inter', sans-serif;
        color: var(--text-primary);
    `;

    container.innerHTML = `
        <!-- Header -->
        <header style="grid-area:header; display:flex; justify-content:space-between; align-items:center; padding:0 2.5rem; border-bottom:1px solid var(--glass-border); background:rgba(0,0,0,0.15); backdrop-filter:blur(8px);">
            <h2 style="font-family:'Outfit',sans-serif; font-size:1.4rem; font-weight:600;">Attention Intelligence</h2>
            <span style="font-size:0.8rem; color:var(--text-secondary);">Last 30 days · Simulated baseline</span>
        </header>

        <!-- Sidebar -->
        <aside style="grid-area:sidebar; border-right:1px solid var(--glass-border); background:rgba(0,0,0,0.25); backdrop-filter:blur(15px); display:flex; flex-direction:column; padding:2rem 1.5rem;">
            <div class="logo-text" style="font-size:2rem; font-weight:800; letter-spacing:0.2rem; margin-bottom:2.5rem; background:linear-gradient(135deg,#ffffff,rgba(255,255,255,0.35)); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">ARIA</div>
            <nav style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:2rem;">
                <a href="#/dashboard" class="sidebar-link glass-button" style="padding:12px 15px; border-radius:10px; text-align:left; background:transparent; border-color:transparent; text-decoration:none; color:var(--text-primary);">📊 Focus Digest</a>
                <a href="#/triage"    class="sidebar-link glass-button" style="padding:12px 15px; border-radius:10px; text-align:left; background:transparent; border-color:transparent; text-decoration:none; color:var(--text-primary);">✉️ Manual Triage</a>
                <a href="#/insights"  class="sidebar-link glass-button" style="padding:12px 15px; border-radius:10px; text-align:left; background:var(--glass-highlight); text-decoration:none; color:var(--text-primary);">📈 Insights</a>
                <a href="#/feedback"  class="sidebar-link glass-button" style="padding:12px 15px; border-radius:10px; text-align:left; background:transparent; border-color:transparent; text-decoration:none; color:var(--text-primary);">💬 Feedback</a>
            </nav>
        </aside>

        <!-- Main -->
        <main style="grid-area:main; overflow-y:auto; padding:2.5rem;">

            <!-- Top KPI Cards -->
            <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; margin-bottom:2.5rem;">
                <div class="glass-panel" style="padding:1.5rem; border-radius:18px; border-top:3px solid rgba(255,255,255,0.15);">
                    <div style="font-size:2.2rem; font-weight:800; font-family:'Outfit',sans-serif;">${totalSessions}</div>
                    <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05rem; margin-top:4px;">Focus Sessions</div>
                    <div style="font-size:0.8rem; color:#34c759; margin-top:8px;">↑ 40% vs last week</div>
                </div>
                <div class="glass-panel" style="padding:1.5rem; border-radius:18px; border-top:3px solid rgba(255,255,255,0.15);">
                    <div style="font-size:2.2rem; font-weight:800; font-family:'Outfit',sans-serif;">${avgFocusMin}<span style="font-size:1rem; font-weight:400;">min</span></div>
                    <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05rem; margin-top:4px;">Avg Focus Block</div>
                    <div style="font-size:0.8rem; color:#ff9500; margin-top:8px;">Target: 90 min</div>
                </div>
                <div class="glass-panel" style="padding:1.5rem; border-radius:18px; border-top:3px solid rgba(255,255,255,0.15);">
                    <div style="font-size:2.2rem; font-weight:800; font-family:'Outfit',sans-serif;">${noiseSuppressed}</div>
                    <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05rem; margin-top:4px;">Noise Suppressed</div>
                    <div style="font-size:0.8rem; color:#34c759; margin-top:8px;">Managed for you</div>
                </div>
                <div class="glass-panel" style="padding:1.5rem; border-radius:18px; border-top:3px solid rgba(255,255,255,0.15);">
                    <div style="font-size:2.2rem; font-weight:800; font-family:'Outfit',sans-serif;">${topHour.hour}:00</div>
                    <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05rem; margin-top:4px;">Peak Focus Hour</div>
                    <div style="font-size:0.8rem; color:#34c759; margin-top:8px;">Quality: ${topHour.quality}%</div>
                </div>
            </div>

            <!-- Charts Row -->
            <div style="display:grid; grid-template-columns:1.4fr 1fr; gap:1.5rem; margin-bottom:2.5rem;">

                <!-- Hourly Focus Quality Chart -->
                <div class="glass-panel" style="padding:2rem; border-radius:18px;">
                    <h3 style="font-family:'Outfit',sans-serif; font-size:1rem; font-weight:600; margin-bottom:0.4rem;">Focus Quality by Hour</h3>
                    <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:1.5rem;">Your best work happens before noon.</p>
                    <div id="hourly-chart" style="display:flex; align-items:flex-end; gap:4px; height:120px;"></div>
                    <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:0.7rem; color:var(--text-secondary);">
                        <span>6am</span><span>10am</span><span>2pm</span><span>6pm</span><span>10pm</span>
                    </div>
                </div>

                <!-- Context Switching Cost -->
                <div class="glass-panel" style="padding:2rem; border-radius:18px;">
                    <h3 style="font-family:'Outfit',sans-serif; font-size:1rem; font-weight:600; margin-bottom:0.4rem;">Interruption Cost</h3>
                    <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:1.5rem;">Time lost to context-switching.</p>
                    <div style="display:flex; flex-direction:column; gap:1rem;">
                        ${[
                            { label: 'Email interruptions', cost: 72, color: '#ff6b6b' },
                            { label: 'Slack / Chat',        cost: 45, color: '#ff9500' },
                            { label: 'VIP breakthroughs',  cost: 12, color: '#34c759' },
                            { label: 'Noise (held by AI)', cost: 0,  color: '#555'    },
                        ].map(item => `
                            <div>
                                <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:5px;">
                                    <span>${item.label}</span>
                                    <span style="color:${item.color};">${item.cost > 0 ? item.cost + ' min/day lost' : 'Blocked ✓'}</span>
                                </div>
                                <div style="height:5px; background:rgba(255,255,255,0.06); border-radius:5px; overflow:hidden;">
                                    <div style="height:100%; width:${(item.cost/80)*100}%; background:${item.color}; border-radius:5px; transition:width 1s ease;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Planning vs Reality Chart -->
            <div class="glass-panel" style="padding:2rem; border-radius:18px;">
                <h3 style="font-family:'Outfit',sans-serif; font-size:1rem; font-weight:600; margin-bottom:0.4rem;">Planning vs Reality</h3>
                <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:1.5rem;">You planned 90-min blocks but achieved 44-min averages. ARIA recommends 50-min sessions with 10-min breaks.</p>
                <div id="weekly-chart" style="display:flex; align-items:flex-end; gap:16px; height:100px;"></div>
                <div style="display:flex; gap:1.5rem; margin-top:1rem;">
                    <div style="display:flex; align-items:center; gap:6px; font-size:0.8rem; color:var(--text-secondary);">
                        <div style="width:12px; height:12px; border-radius:2px; background:rgba(255,255,255,0.3);"></div> Planned
                    </div>
                    <div style="display:flex; align-items:center; gap:6px; font-size:0.8rem; color:var(--text-secondary);">
                        <div style="width:12px; height:12px; border-radius:2px; background:rgba(255,255,255,0.7);"></div> Actual
                    </div>
                </div>
            </div>

        </main>
    `;

    // ─── Render Hourly Bar Chart ──────────────────────────────
    const hourlyChart = container.querySelector('#hourly-chart');
    const maxQ = Math.max(...hourlyData.map(h => h.quality));
    hourlyData.forEach(h => {
        const bar = document.createElement('div');
        const heightPct = (h.quality / maxQ) * 100;
        const color = h.quality > 75 ? 'rgba(255,255,255,0.75)'
                    : h.quality > 50 ? 'rgba(255,255,255,0.4)'
                    : 'rgba(255,255,255,0.15)';
        bar.style.cssText = `
            flex: 1;
            height: ${heightPct}%;
            background: ${color};
            border-radius: 4px 4px 0 0;
            transition: height 0.8s ease;
            cursor: pointer;
            position: relative;
        `;
        bar.title = `${h.hour}:00 — Quality: ${h.quality}%`;
        bar.addEventListener('mouseenter', () => { bar.style.background = 'rgba(255,255,255,0.9)'; });
        bar.addEventListener('mouseleave', () => { bar.style.background = color; });
        hourlyChart.appendChild(bar);
    });

    // ─── Render Weekly Bar Chart ──────────────────────────────
    const weeklyChart = container.querySelector('#weekly-chart');
    const maxW = Math.max(...weeklyData.map(d => d.planned));
    weeklyData.forEach(d => {
        const col = document.createElement('div');
        col.style.cssText = `display:flex; flex-direction:column; align-items:center; gap:4px; flex:1;`;
        col.innerHTML = `
            <div style="width:100%; display:flex; align-items:flex-end; gap:3px; height:80px;">
                <div style="flex:1; height:${(d.planned/maxW)*100}%; background:rgba(255,255,255,0.25); border-radius:4px 4px 0 0;"></div>
                <div style="flex:1; height:${(d.actual/maxW)*100}%; background:rgba(255,255,255,0.7); border-radius:4px 4px 0 0;"></div>
            </div>
            <div style="font-size:0.7rem; color:var(--text-secondary);">${d.day}</div>
        `;
        weeklyChart.appendChild(col);
    });

    return container;
};
