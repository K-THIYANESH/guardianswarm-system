class APIClient {
    static get token() {
        return localStorage.getItem('gs_jwt') || '';
    }

    static getHeaders(extra = {}, includeContentType = true) {
        const h = includeContentType ? { 'Content-Type': 'application/json', ...extra } : { ...extra };
        const tok = this.token;
        if (tok) h['Authorization'] = `Bearer ${tok}`;
        return h;
    }

    static async get(path) {
        const res = await fetch(path, { headers: this.getHeaders({}, false) });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || err.message || `${res.status} ${res.statusText}`);
        }
        return res.json();
    }

    static async post(path, body = {}) {
        const res = await fetch(path, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || err.message || `POST ${path} failed (${res.status})`);
        }
        return res.json();
    }

    static async put(path, body = {}) {
        const res = await fetch(path, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || err.message || `PUT ${path} failed (${res.status})`);
        }
        return res.json();
    }

    static async delete(path) {
        const res = await fetch(path, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || err.message || `DELETE ${path} failed (${res.status})`);
        }
        return res.json();
    }

    // Helper Endpoints
    static login(user_id, password) { return this.post('/api/auth/login', { user_id, password }); }
    static me() { return this.get('/api/auth/me'); }
    static budgetStatus() { return this.get('/api/budget/status'); }
    static systemMetrics() { return this.get('/api/system/metrics'); }
    static systemGates() { return this.get('/api/system/gates'); }
    static getConversations() { return this.get('/api/conversations'); }
    static createConversation(id, title, category) { return this.post('/api/conversations', { id, title, category }); }
    static getMessages(convId) { return this.get(`/api/conversations/${convId}/messages`); }
    static saveMessage(convId, role, content, tokens_used = 0) {
        return this.post(`/api/conversations/${convId}/messages`, { role, content, tokens_used });
    }
    static submitTask(payload) { return this.post('/api/tasks/submit', payload); }
    static getLedger() { return this.get('/api/ledger'); }
    static getEscalations() { return this.get('/api/escalations'); }
    static resolveEscalation(id, decision) { return this.post(`/api/escalations/${id}/resolve`, { decision }); }
    static getUsers() { return this.get('/api/admin/users'); }
    static getModels() { return this.get('/api/admin/models'); }
    static getApiKeys() { return this.get('/api/admin/apikeys'); }
    static getGroups() { return this.get('/api/admin/groups'); }
    static getRoles() { return this.get('/api/admin/roles'); }
    static getBudget() { return this.get('/api/admin/budget'); }
    static getHealth() { return this.get('/api/admin/health'); }
    static updateUser(data) { return this.post('/api/admin/users', data); }
    static getTraces() { return this.get('/api/traces'); }
}

window.API = APIClient;

