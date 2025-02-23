import DbConnection from "./database/connection.js";
import authRouter from './modules/auth/auth.controller.js';
import setupSwagger from "./utilts/swagger.js";
import { globalErrorHandling } from "./errorHandling/globalErrorHandling.js";
import brandRouter from './modules/brand/brand.controller.js';
import categoryRoutes from './modules/category/category.controller.js';
import subCategoriesRouter from './modules/subCategory/subcategory.controller.js';
import reviewsRouter from './modules/reviews/reviews.controller.js';
import productRouter from './modules/product/product.controller.js'
import userRouter from './modules/user/user.controller.js'
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
    app.use('/reviews', reviewsRouter);
    app.use('/brands', brandRouter);
    app.use('/products', productRouter);
    app.use('/users', userRouter);
    setupSwagger(app);
    app.use(globalErrorHandling);
    app.use('*', (req, res, next) => {
        throw new AppError('you tried to access a route that does not exist', 404);
    });
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};