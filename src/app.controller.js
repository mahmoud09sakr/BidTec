import DbConnection from "./database/connection.js"
import authRouter from './modules/auth/auth.controller.js'
import setupSwagger from "./utilts/swagger.js";
import { globalErrorHandling } from "./errorHandling/globalErrorHandling.js";
import categoryRoutes from './modules/category/category.controller.js'
import subCategoriesRouter from './modules/subCategory/subcategory.controller.js'
import { AppError } from "./errorHandling/AppError.js";

export const bootstrap = (express, app) => {
    app.use(express.json())
    DbConnection()
    app.use('/auth', authRouter)
    app.use('/categories', categoryRoutes)
    app.use('/subcategories', subCategoriesRouter)
    setupSwagger(app)
    app.use(globalErrorHandling)
    app.use('*', (req, res, next) => {
        throw new AppError('Invalid Path', 404)
    })
}