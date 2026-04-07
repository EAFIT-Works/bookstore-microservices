export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        next(err);
        return;
    }
    let status = err.statusCode || err.status || 500;
    let message =
        status === 500 && process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message || "Internal server error";

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        status = 401;
        message =
            err.name === "TokenExpiredError"
                ? "Token expired"
                : "Invalid token";
    }

    res.status(status).json({ message });
}
