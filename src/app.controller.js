import DbConnection from "./database/connection.js";
import authRouter from './modules/auth/auth.controller.js';
import setupSwagger from "./utilts/swagger.js";
import { globalErrorHandling } from "./errorHandling/globalErrorHandling.js";
import brandRouter from './modules/brand/brand.controller.js';
import categoryRoutes from './modules/category/category.controller.js';
import subCategoriesRouter from './modules/subCategory/subcategory.controller.js';
import { AppError } from "./errorHandling/AppError.js";
import { logPerformance } from './logPreformance.js'



export const bootstrap = async (express, app) => {

    app.use(express.json());
    app.use(logPerformance);
    DbConnection();

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