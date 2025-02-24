export const logPerformance = (req, res, next) => {
    const startTime = process.hrtime();
    const requestStart = new Date();
    const originalEnd = res.end;

    res.end = function (...args) {
        const [diffSeconds, diffNanoseconds] = process.hrtime(startTime);
        const durationMs = (diffSeconds * 1000) + (diffNanoseconds / 1e6);
        const egyptTime = requestStart.toLocaleString('en-US', {
            timeZone: 'Africa/Cairo',
            day: 'numeric',      
            month: 'numeric',    
            year: 'numeric',     
            hour: 'numeric',     
            minute: '2-digit',   
            second: '2-digit',    
            hour12: false         
        });

        const logDetails = {
            timestamp: egyptTime,  // e.g., "2/24/2025 10:10:00"
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${durationMs.toFixed(2)}ms`,
            ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
        };
        console.log('Request Performance:', JSON.stringify(logDetails));
        originalEnd.apply(res, args);
    };
    next();
};