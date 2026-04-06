export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        next(err);
        return;
    }
    const status = err.statusCode || err.status || 500;
    const message =
        status === 500 && process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message || "Internal server error";
    res.status(status).json({ message });
}
