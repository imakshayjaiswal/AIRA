window.Page_Focus = async function() {

    // ─── State ────────────────────────────────────────────────
    let timerInterval = null;
    let totalSeconds = 25 * 60; // default 25min Pomodoro
    let remainingSeconds = totalSeconds;
    let isRunning = false;
    let sessionGoal = '';
    let heldCount = 0;
    let sessionStarted = false;

    // ─── Container ────────────────────────────────────────────
    const container = document.createElement('div');
    container.style.cssText = `
        width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-columns: 320px 1fr;
        grid-template-rows: 70px 1fr;
        grid-template-areas: "sidebar header" "sidebar main";
        font-family: 'Inter', sans-serif;
        color: var(--text-primary);
    `;

    container.innerHTML = `
        <!-- Header -->
        <header style="grid-area:header; display:flex; justify-content:space-between; align-items:center; padding:0 2.5rem; border-bottom:1px solid var(--glass-border); background:rgba(0,0,0,0.15); backdrop-filter:blur(8px);">
            <div style="font-size:1rem; color:var(--text-secondary);">
                <span style="color:var(--text-primary); font-weight:600;">Focus Chamber</span>
                &nbsp;— Protecting your attention
            </div>
            <button id="exit-focus-btn" onclick="window.navigate('/dashboard')" style="background:transparent; border:1px solid var(--glass-border); color:var(--text-secondary); border-radius:8px; padding:7px 18px; cursor:pointer; font-size:0.85rem; transition:all 0.2s;">
                Exit Chamber
            </button>
        </header>

        <!-- Sidebar: Gatekeeper Panel -->
        <aside style="grid-area:sidebar; border-right:1px solid var(--glass-border); background:rgba(0,0,0,0.3); backdrop-filter:blur(15px); display:flex; flex-direction:column; padding:2rem 1.5rem; overflow-y:auto;">
            <div class="logo-text" style="font-size:2rem; font-weight:800; letter-spacing:0.2rem; margin-bottom:2rem; background:linear-gradient(135deg,#ffffff,rgba(255,255,255,0.3)); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
                ARIA
            </div>

            <h3 style="font-size:0.7rem; text-transform:uppercase; letter-spacing:0.15rem; color:var(--text-secondary); margin-bottom:1.2rem; font-weight:600;">Gatekeeper Status</h3>

            <!-- Held Back Counter -->
            <div class="glass-panel" style="padding:1.2rem; border-radius:14px; margin-bottom:1rem; border-left:4px solid #34c759;">
                <div style="font-size:2rem; font-weight:800; font-family:'Outfit',sans-serif;" id="held-count">0</div>
                <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05rem;">Noise Email Held</div>
                <div style="font-size:0.8rem; color:#34c759; margin-top:4px;">✓ Managed for you</div>
            </div>

            <!-- VIP Bypass -->
            <div class="glass-panel" style="padding:1.2rem; border-radius:14px; margin-bottom:2rem; border-left:4px solid #ff9500;">
                <div style="font-size:2rem; font-weight:800; font-family:'Outfit',sans-serif;" id="vip-count">0</div>
                <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05rem;">VIP Breakthroughs</div>
                <div style="font-size:0.8rem; color:#ff9500; margin-top:4px;">Review after session</div>
            </div>

            <!-- Session Config -->
            <h3 style="font-size:0.7rem; text-transform:uppercase; letter-spacing:0.15rem; color:var(--text-secondary); margin-bottom:1rem; font-weight:600;">Session Length</h3>
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap; margin-bottom:2rem;">
                <button class="duration-btn glass-button" data-mins="25" style="padding:8px 14px; font-size:0.8rem; background:rgba(255,255,255,0.15);">25 min</button>
                <button class="duration-btn glass-button" data-mins="45" style="padding:8px 14px; font-size:0.8rem;">45 min</button>
                <button class="duration-btn glass-button" data-mins="60" style="padding:8px 14px; font-size:0.8rem;">60 min</button>
                <button class="duration-btn glass-button" data-mins="90" style="padding:8px 14px; font-size:0.8rem;">90 min</button>
            </div>

            <div style="flex:1;"></div>

            <!-- Reflection Log -->
            <div id="session-log" style="display:none;">
                <h3 style="font-size:0.7rem; text-transform:uppercase; letter-spacing:0.15rem; color:var(--text-secondary); margin-bottom:0.8rem; font-weight:600;">Session Log</h3>
                <div id="log-entries" style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.8rem; color:var(--text-secondary);"></div>
            </div>
        </aside>

        <!-- Main: Focus Area -->
        <main style="grid-area:main; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem; position:relative; overflow:hidden;">

            <!-- Setup State -->
            <div id="focus-setup" style="display:flex; flex-direction:column; align-items:center; gap:2rem; width:100%; max-width:540px; animation: fadeIn 0.5s ease;">
                <h1 style="font-size:3rem; font-weight:200; text-align:center; line-height:1.2;">
                    What will you<br/><span style="font-weight:700;">focus on?</span>
                </h1>
                <div style="width:100%;">
                    <textarea id="goal-input" class="glass-input" rows="2" placeholder="e.g. Write the technical architecture doc..." style="font-size:1.1rem; resize:none; line-height:1.6; border-radius:14px;"></textarea>
                </div>
                <button id="start-focus-btn" class="glass-button" style="padding:18px 48px; font-size:1.1rem; font-weight:600; background:rgba(255,255,255,0.12); border-radius:50px; width:100%; max-width:300px; letter-spacing:0.05rem; transition: all 0.3s;">
                    Enter Focus Mode
                </button>
            </div>

            <!-- Active Focus State -->
            <div id="focus-active" style="display:none; flex-direction:column; align-items:center; gap:2.5rem; text-align:center;">

                <!-- Breathing ring + Timer -->
                <div style="position:relative; width:280px; height:280px; display:flex; align-items:center; justify-content:center;">
                    <!-- Outer breathing ring -->
                    <div id="breathing-ring" style="
                        position:absolute; width:100%; height:100%;
                        border-radius:50%;
                        border:2px solid rgba(255,255,255,0.1);
                        box-shadow:0 0 40px rgba(255,255,255,0.05);
                        animation:breathe 4s ease-in-out infinite;
                    "></div>
                    <!-- Inner ring -->
                    <div style="
                        position:absolute; width:85%; height:85%;
                        border-radius:50%;
                        border:1px solid rgba(255,255,255,0.06);
                    "></div>
                    <!-- Timer display -->
                    <div style="position:relative; z-index:2; text-align:center;">
                        <div id="timer-display" style="font-family:'Outfit',sans-serif; font-size:4rem; font-weight:800; letter-spacing:-0.02em; line-height:1;">25:00</div>
                        <div id="timer-label" style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.15rem; margin-top:4px;">Remaining</div>
                    </div>
                </div>

                <!-- Goal Display -->
                <div class="glass-panel" style="padding:1.2rem 2rem; border-radius:50px; max-width:500px;">
                    <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.1rem; margin-bottom:4px;">Current Focus</div>
                    <div id="goal-display" style="font-size:1rem; font-weight:500;"></div>
                </div>

                <!-- Controls -->
                <div style="display:flex; gap:1rem; align-items:center;">
                    <button id="pause-resume-btn" class="glass-button" style="padding:14px 36px; font-size:1rem; border-radius:50px;">
                        Pause
                    </button>
                    <button id="end-session-btn" class="glass-button" style="padding:14px 36px; font-size:1rem; border-radius:50px; background:transparent; opacity:0.5;">
                        End Early
                    </button>
                </div>

                <!-- Progress bar -->
                <div style="width:100%; max-width:400px; height:3px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden;">
                    <div id="progress-bar" style="height:100%; background:rgba(255,255,255,0.6); border-radius:3px; transition:width 1s linear; width:100%;"></div>
                </div>
            </div>

            <!-- Session Complete State -->
            <div id="focus-complete" style="display:none; flex-direction:column; align-items:center; gap:2rem; text-align:center; max-width:520px; animation:slideUp 0.5s ease;">
                <div style="font-size:4rem;">✦</div>
                <h2 style="font-family:'Outfit',sans-serif; font-size:2.5rem; font-weight:700;">Session Complete</h2>
                <p style="color:var(--text-secondary); font-size:1rem;">How did it go? Your reflection shapes your attention intelligence.</p>
                
                <div class="glass-panel" style="padding:2rem; border-radius:20px; width:100%; text-align:left; display:flex; flex-direction:column; gap:1.5rem;">
                    <div>
                        <p style="font-size:0.9rem; margin-bottom:0.8rem; font-weight:500;">Did you complete your goal?</p>
                        <div style="display:flex; gap:0.8rem;">
                            <button class="reflect-btn glass-button" data-key="completed" data-val="yes" style="flex:1; padding:12px;">Yes ✓</button>
                            <button class="reflect-btn glass-button" data-key="completed" data-val="partial" style="flex:1; padding:12px;">Partially</button>
                            <button class="reflect-btn glass-button" data-key="completed" data-val="no" style="flex:1; padding:12px;">No ✗</button>
                        </div>
                    </div>
                    <div>
                        <p style="font-size:0.9rem; margin-bottom:0.8rem; font-weight:500;">Energy level during session?</p>
                        <div style="display:flex; gap:0.8rem;">
                            <button class="reflect-btn glass-button" data-key="energy" data-val="high" style="flex:1; padding:12px;">High ⚡</button>
                            <button class="reflect-btn glass-button" data-key="energy" data-val="medium" style="flex:1; padding:12px;">Medium</button>
                            <button class="reflect-btn glass-button" data-key="energy" data-val="low" style="flex:1; padding:12px;">Low 😴</button>
                        </div>
                    </div>
                </div>

                <button id="save-reflect-btn" class="glass-button" style="padding:16px 48px; border-radius:50px; font-size:1rem; font-weight:600; width:100%; background:rgba(255,255,255,0.12);">
                    Save & Return to Dashboard
                </button>
            </div>
        </main>
    `;

    // ─── Logic ─────────────────────────────────────────────────

    const setupEl    = container.querySelector('#focus-setup');
    const activeEl   = container.querySelector('#focus-active');
    const completeEl = container.querySelector('#focus-complete');
    const timerDisplay = container.querySelector('#timer-display');
    const progressBar  = container.querySelector('#progress-bar');
    const heldCountEl  = container.querySelector('#held-count');
    const pauseBtn     = container.querySelector('#pause-resume-btn');
    const endBtn       = container.querySelector('#end-session-btn');
    const goalDisplay  = container.querySelector('#goal-display');

    function formatTime(secs) {
        const m = Math.floor(secs / 60).toString().padStart(2,'0');
        const s = (secs % 60).toString().padStart(2,'0');
        return `${m}:${s}`;
    }

    function updateDisplay() {
        timerDisplay.textContent = formatTime(remainingSeconds);
        const pct = (remainingSeconds / totalSeconds) * 100;
        progressBar.style.width = pct + '%';

        // Color shift as time runs out
        if (remainingSeconds < 300) {
            timerDisplay.style.color = '#ff6b6b';
        } else if (remainingSeconds < 600) {
            timerDisplay.style.color = '#ffaa33';
        } else {
            timerDisplay.style.color = 'var(--text-primary)';
        }
    }

    function tick() {
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            sessionComplete();
            return;
        }
        remainingSeconds--;
        // Simulate noise being held every 30 seconds
        if (remainingSeconds % 30 === 0 && heldCount < 25) {
            heldCount += Math.floor(Math.random() * 2) + 1;
            heldCountEl.textContent = heldCount;
        }
        updateDisplay();
    }

    function startTimer() {
        if (timerInterval) return;
        isRunning = true;
        timerInterval = setInterval(tick, 1000);
        pauseBtn.textContent = 'Pause';
        endBtn.style.opacity = '1';
    }

    function pauseTimer() {
        if (!timerInterval) return;
        isRunning = false;
        clearInterval(timerInterval);
        timerInterval = null;
        pauseBtn.textContent = 'Resume';
    }

    function sessionComplete() {
        activeEl.style.display = 'none';
        completeEl.style.display = 'flex';
        // Save a session log entry
        saveSessionLog();
    }

    function saveSessionLog() {
        const sessions = JSON.parse(sessionStorage.getItem('aria_sessions') || '[]');
        sessions.push({
            goal: sessionGoal,
            duration: Math.floor((totalSeconds - remainingSeconds) / 60),
            heldBack: heldCount,
            timestamp: new Date().toISOString()
        });
        sessionStorage.setItem('aria_sessions', JSON.stringify(sessions));

        // Show log in sidebar
        const logEl = container.querySelector('#session-log');
        const entriesEl = container.querySelector('#log-entries');
        logEl.style.display = 'block';
        sessions.slice(-3).reverse().forEach(s => {
            const entry = document.createElement('div');
            entry.style.cssText = 'padding:8px; border-radius:8px; background:rgba(255,255,255,0.05); border-left:2px solid rgba(255,255,255,0.1);';
            entry.innerHTML = `<div style="color:var(--text-primary); margin-bottom:2px;">${s.goal.substring(0, 30)}...</div><div>${s.duration}min · ${s.heldBack} held</div>`;
            entriesEl.prepend(entry);
        });
    }

    // ─── Event Listeners ───────────────────────────────────────

    // Duration buttons
    container.querySelectorAll('.duration-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (isRunning) return;
            container.querySelectorAll('.duration-btn').forEach(b => b.style.background = 'transparent');
            btn.style.background = 'rgba(255,255,255,0.15)';
            const mins = parseInt(btn.dataset.mins);
            totalSeconds = mins * 60;
            remainingSeconds = totalSeconds;
            updateDisplay();
        });
    });

    // Start session
    container.querySelector('#start-focus-btn').addEventListener('click', () => {
        const goal = container.querySelector('#goal-input').value.trim();
        if (!goal) {
            container.querySelector('#goal-input').style.borderColor = 'rgba(255,59,59,0.5)';
            container.querySelector('#goal-input').placeholder = 'Please set a goal first...';
            return;
        }
        sessionGoal = goal;
        goalDisplay.textContent = goal;
        setupEl.style.display = 'none';
        activeEl.style.display = 'flex';
        updateDisplay();
        startTimer();
    });

    // Pause / Resume
    pauseBtn.addEventListener('click', () => {
        if (isRunning) pauseTimer();
        else startTimer();
    });

    // End early
    endBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        sessionComplete();
    });

    // Reflection buttons
    const reflectData = {};
    container.querySelectorAll('.reflect-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            const val = btn.dataset.val;
            reflectData[key] = val;
            // Highlight selected
            container.querySelectorAll(`.reflect-btn[data-key="${key}"]`).forEach(b => b.style.background = 'transparent');
            btn.style.background = 'rgba(255,255,255,0.2)';
        });
    });

    // Save reflection and go to dashboard
    container.querySelector('#save-reflect-btn').addEventListener('click', () => {
        const sessions = JSON.parse(sessionStorage.getItem('aria_sessions') || '[]');
        if (sessions.length > 0) {
            sessions[sessions.length - 1].reflection = reflectData;
            sessionStorage.setItem('aria_sessions', JSON.stringify(sessions));
        }
        window.navigate('/dashboard');
    });

    return container;
};
