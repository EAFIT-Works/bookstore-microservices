import { api } from "./api";

export const usersApi = {
    list: () => api.get("/api/users/"),
    getById: (id) => api.get(`/api/users/${id}`),
    create: (payload) => api.post("/api/users/", payload),
    update: (id, payload) => api.put(`/api/users/${id}`, payload),
    remove: (id) => api.delete(`/api/users/${id}`),
    register: (payload) => api.post("/api/users/auth/register", payload),
    login: (payload) => api.post("/api/users/auth/login", payload),
    refresh: (refreshToken) =>
        api.post("/api/users/auth/refresh", { refreshToken }),
};
