/**
 * ARIA — Client-Side Router
 * Hash-based SPA routing with smooth page transitions.
 */
const routes = {
    '/':          window.Page_Landing,
    '/auth':      window.Page_Auth,
    '/dashboard': window.Page_Dashboard,
    '/triage':    window.Page_Triage,
    '/feedback':  window.Page_Feedback,
    '/insights':  window.Page_Insights,
};

// Pages that use the full-viewport dashboard-style layout
const DASHBOARD_ROUTES = ['/dashboard', '/triage', '/insights'];

async function handleRoute() {
    const path = window.location.hash.slice(1) || '/';
    const app = document.getElementById('app');
    if (!app) return;

    // Smooth fade-out
    app.style.opacity = '0';

    setTimeout(async () => {
        app.innerHTML = '';

        // Toggle dashboard layout class
        if (DASHBOARD_ROUTES.includes(path)) {
            app.classList.add('dashboard-layout');
        } else {
            app.classList.remove('dashboard-layout');
        }

        const pageRenderer = routes[path] || routes['/'];

        if (typeof pageRenderer === 'function') {
            try {
                const pageElement = await pageRenderer();
                app.appendChild(pageElement);
            } catch (err) {
                console.error('ARIA: Page render error for', path, err);
                app.innerHTML = '<div style="text-align:center;padding:3rem;color:#888;">Something went wrong. Please refresh.</div>';
            }
        }

        // Trigger reflow before fade-in
        void app.offsetWidth;
        app.style.opacity = '1';
    }, 400);
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);

window.navigate = function (path) {
    window.location.hash = path;
};
