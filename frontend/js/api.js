/**
 * ARIA API Client
 * Central service layer for all backend communication.
 * Auto-detects base URL (same origin when backend serves frontend).
 */
window.AriaAPI = (function () {
    'use strict';

    const BASE_URL = window.location.origin;

    /**
     * Internal fetch wrapper with error handling.
     * Throws an Error with the backend's error message on failure.
     */
    async function request(method, path, body = null) {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(`${BASE_URL}${path}`, options);
        const json = await res.json();

        if (!res.ok || !json.success) {
            const err = new Error(json.error || json.message || 'Request failed');
            err.status = res.status;
            throw err;
        }
        return json;
    }

    // ─── Auth ──────────────────────────────

    async function register(data) {
        return request('POST', '/api/auth/register', data);
    }

    async function login(email, password) {
        return request('POST', '/api/auth/login', { email, password });
    }

    // ─── Email Triage ──────────────────────

    async function triageEmail(email, options = {}) {
        return request('POST', '/api/triage', { ...email, options });
    }

    async function triageBatch(emails, options = {}) {
        return request('POST', '/api/triage/batch', { emails, options });
    }

    // ─── Gmail / IMAP ──────────────────────

    async function fetchAndTriage(email, password = null) {
        const body = password ? { email, password } : { email };
        return request('POST', '/api/gmail/fetch-triage', body);
    }

    async function demoTriage() {
        return request('POST', '/api/gmail/demo-triage', {});
    }

    // ─── Health ────────────────────────────

    async function getHealth() {
        return request('GET', '/api/health');
    }

    async function getSchema() {
        return request('GET', '/api/schema');
    }

    return { register, login, triageEmail, triageBatch, fetchAndTriage, demoTriage, getHealth, getSchema };
})();
