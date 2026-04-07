import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "dev-only-change-JWT_SECRET-in-production";

export function verifyAccessToken(token) {
    const payload = jwt.verify(token, secret);
    if (payload.typ === "refresh") {
        const err = new Error("Access token required, not refresh token");
        err.status = 401;
        throw err;
    }
    return payload.sub;
}
