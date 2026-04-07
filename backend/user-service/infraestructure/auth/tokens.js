import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "dev-only-change-JWT_SECRET-in-production";

export function signAccessToken(userId) {
    return jwt.sign({ sub: userId }, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    });
}

export function signRefreshToken(userId) {
    return jwt.sign({ sub: userId, typ: "refresh" }, secret, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    });
}

export function verifyRefreshToken(token) {
    const payload = jwt.verify(token, secret);
    if (payload.typ !== "refresh") {
        const err = new Error("Invalid refresh token");
        err.status = 401;
        throw err;
    }
    return payload.sub;
}

/** Access token (login/register), no refresh. */
export function verifyAccessToken(token) {
    const payload = jwt.verify(token, secret);
    if (payload.typ === "refresh") {
        const err = new Error("Access token required, not refresh token");
        err.status = 401;
        throw err;
    }
    return payload.sub;
}
