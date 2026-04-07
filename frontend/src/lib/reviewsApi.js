import { api } from "./api";

export const reviewsApi = {
    byBook: (bookId) => api.get(`/api/reviews/book/${bookId}`),
    getOne: (bookId, reviewId) =>
        api.get(`/api/reviews/${bookId}/${reviewId}`),
    create: (payload) => api.post("/api/reviews/", payload),
    update: (bookId, reviewId, payload) =>
        api.put(`/api/reviews/${bookId}/${reviewId}`, payload),
    remove: (bookId, reviewId) =>
        api.delete(`/api/reviews/${bookId}/${reviewId}`),
};
