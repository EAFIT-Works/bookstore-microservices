import { api } from "./api";

export const ordersApi = {
    my: () => api.get("/api/orders/my"),
    checkout: (payload) => api.post("/api/orders/checkout", payload),
};
