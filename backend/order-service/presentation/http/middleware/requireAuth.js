import { verifyAccessToken } from "../../../infraestructure/auth/tokens.js";

export function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Authorization Bearer header required" });
        return;
    }
    const token = auth.slice(7);
    try {
        req.userId = verifyAccessToken(token);
        req.authHeader = auth;
        next();
    } catch (e) {
        next(e);
    }
}
