const BASE_URL = import.meta.env.VITE_API_URL

export const URL = BASE_URL;

// ========== Funciones para JSON ==========
export function fetchDataSimple(endpoint) {
    return fetch(`${BASE_URL}${endpoint}`)
        .then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
        });
}

export function postDataSimple(endpoint, body) {
    return fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw data;
        return data;
    });
}

export function putDataSimple(endpoint, body = null) {
    const config = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body !== null) {
        config.body = JSON.stringify(body);
    }

    return fetch(`${BASE_URL}${endpoint}`, config)
        .then(async (res) => {
            if (res.status === 204) return null;
            const data = await res.json();
            if (!res.ok) throw data;
            return data;
        });
}

export function deleteDataSimple(endpoint) {
    return fetch(`${BASE_URL}${endpoint}`, {
        method: "DELETE"
    }).then(async (res) => {
        if (!res.ok) {
            const error = await res.json();
            throw error;
        }
        return true;
    });
}

// ========== Funciones para FormData ==========
export function postDataForm(endpoint, formData) {
    return fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        body: formData, // No pongas Content-Type, fetch lo hace automáticamente
    }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw data;
        return data;
    });
}

export function putDataForm(endpoint, formData) {
    return fetch(`${BASE_URL}${endpoint}`, {
        method: "PUT",
        body: formData,
    }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw data;
        return data;
    });
}