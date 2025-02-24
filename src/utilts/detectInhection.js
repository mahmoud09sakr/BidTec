

const detectInjection = (value, helpers) => {
    if (typeof value !== "string") return value; // Skip non-string values

    const suspiciousPatterns = [
        /\$ne/i, /\$eq/i, /\$gt/i, /\$lt/i, /\$regex/i, // NoSQL injections
        /--/, /;/, /DROP/i, /UNION/i, /SELECT/i, /INSERT/i, /UPDATE/i, /DELETE/i // SQL injections
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(value))) {
        return helpers.error("string.injection", { value });
    }

    return value;
};

export default detectInjection