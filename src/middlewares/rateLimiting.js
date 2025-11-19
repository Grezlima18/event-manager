const { CustomError } = require('./errorHandler');

const requests = {};

const rateLimit = (limit = 100, windowMs = 60 * 1000) => {
    return (req, res, next) => {
        const ip = req.ip;

        if (!requests[ip]) {
            requests[ip] = { count: 1, start: Date.now() };
        } else {
            requests[ip].count++;

            if (Date.now() - requests[ip].start > windowMs) {
                requests[ip] = { count: 1, start: Date.now() };
            }
        }

        if (requests[ip].count > limit) {
            return next(new CustomError('Muitas requisições. Tente novamente mais tarde.', 429));
        }

        next();
    };
};

module.exports = rateLimit;

//teste