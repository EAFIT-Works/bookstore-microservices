import { api } from "./api";

export const booksApi = {
    list: () => api.get("/api/books/"),
    getById: (id) => api.get(`/api/books/${id}`),
    create: (payload) => api.post("/api/books/", payload),
    update: (id, payload) => api.put(`/api/books/${id}`, payload),
    remove: (id) => api.delete(`/api/books/${id}`),
};
