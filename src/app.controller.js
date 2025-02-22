import DbConnection from "./database/connection.js"
import authRouter from './modules/auth/auth.controller.js'
import setupSwagger from "./utilts/swagger.js";
import { globalErrorHandling } from "./errorHandling/globalErrorHandling.js";
import categoryRoutes from './modules/category/category.controller.js'
import subCategoriesRouter from './modules/subCategory/subcategory.controller.js'
import { AppError } from "./errorHandling/AppError.js";

export const bootstrap = async (express, app) => {
    console.log("Bootstrapping app...");
    app.use(express.json());
    DbConnection();
    console.log("Database connected");

    app.get("/", (req, res) => {
        console.log("Root route hit");
        res.send("Server is running...");
    });
    app.use('/auth', authRouter);
    console.log("Auth routes mounted");
    app.use('/categories', categoryRoutes);
    console.log("Category routes mounted");
    app.use('/subcategories', subCategoriesRouter);
    console.log("Subcategory routes mounted");
    setupSwagger(app)
    app.use((req, res, next) => {
        req.setTimeout(8000, () => {
            res.status(504).json({ error: "Request timed out" });
        });
        next();
    });
    app.use(globalErrorHandling)
    app.use('*', (req, res, next) => {
        throw new AppError('Invalid Path', 404)
    })

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}