// Assuming you have a logger configured, if not we'll use console.log as fallback
import logger from './logger.js'; // Optional: replace with your preferred logging library (winston, bunyan, etc.)

const getEgyptTime = () => {
    // Create a date object in Egypt's time zone (EET, UTC+02:00)
    const now = new Date();
    const egyptTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Cairo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(now);

    // Reformat to ISO-like string: YYYY-MM-DDTHH:mm:ss
    const [month, day, year, hour, minute, second] = egyptTime.split(/[/, :]/);
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
};

const detectInjection = (value, helpers) => {
    if (typeof value !== "string") return value; // Skip non-string values

    const suspiciousPatterns = [
        /\$ne/i, /\$eq/i, /\$gt/i, /\$lt/i, /\$regex/i, // NoSQL injections
        /--/, /;/, /DROP/i, /UNION/i, /SELECT/i, /INSERT/i, /UPDATE/i, /DELETE/i // SQL injections
    ];

    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(value));

    if (isSuspicious) {
        // Log the potential injection attempt with Egypt time
        const logMessage = {
            timestamp: getEgyptTime(), // Use Egypt time instead of UTC
            type: 'SECURITY_ALERT',
            potentialInjection: value,
            message: 'Possible injection attempt detected'
        };

        // Use configured logger if available, otherwise use console.log
        if (logger && typeof logger.warn === 'function') {
            logger.warn(logMessage);
        } else {
            console.log('[SECURITY_ALERT]', JSON.stringify(logMessage));
        }

        // Return error to Joi validation
        return helpers.error("string.injection", { value });
    }

    return value;
};

export default detectInjection;