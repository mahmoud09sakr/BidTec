export const logPerformance = (req, res, next) => {
    const startTime = process.hrtime(); 
    const requestStart = new Date();
    const originalEnd = res.end;
    res.end = function (...args) {
        const [diffSeconds, diffNanoseconds] = process.hrtime(startTime);
        const durationMs = (diffSeconds * 1000) + (diffNanoseconds / 1e6); 

        const logDetails = {
            timestamp: requestStart.toISOString(),
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