import DbConnection from "./database/connection.js";
import authRouter from './modules/auth/auth.controller.js';
import setupSwagger from "./utilts/swagger.js";
import { globalErrorHandling } from "./errorHandling/globalErrorHandling.js";
import brandRouter from './modules/brand/brand.controller.js';
import categoryRoutes from './modules/category/category.controller.js';
import subCategoriesRouter from './modules/subCategory/subcategory.controller.js';
import { AppError } from "./errorHandling/AppError.js";

const logPerformance = (req, res, next) => {
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

export const bootstrap = async (express, app) => {
    app.use(express.json());

    // Add performance logging middleware before all routes
    app.use(logPerformance);

    await DbConnection();

    app.get("/", (req, res) => {
        res.send("Server is running...");
    });

    app.use('/auth', authRouter);
    app.use('/categories', categoryRoutes);
    app.use('/subcategories', subCategoriesRouter);
    app.use('/brands', brandRouter);

    setupSwagger(app);

    app.use((req, res, next) => {
        req.setTimeout(8000, () => {
            res.status(504).json({ error: "Request timed out" });
        });
        next();
    });

    app.use(globalErrorHandling);

    app.use('*', (req, res, next) => {
        throw new AppError('Invalid Path', 404);
    });
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};