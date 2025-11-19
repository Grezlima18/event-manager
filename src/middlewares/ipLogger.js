module.exports = function ipLogger(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        let ip =
            req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            req.ip;

        // Remove prefixo IPv6 "::ffff:"
        if (ip && ip.startsWith("::ffff:")) {
            ip = ip.replace("::ffff:", "");
        }

        // Converte IPv6 localhost "::1" para "127.0.0.1"
        if (ip === "::1") {
            ip = "127.0.0.1";
        }

        const log = {
            ip,
            method: req.method,
            route: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        };

        console.log("📘 AUDIT LOG:", log);
    });

    next();
};
