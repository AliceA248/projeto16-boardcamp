import { Router } from "express"
import { createCustomer, getCustomers, updateCustomer} from "../controllers/customers.controllers.js"
import validateSchemaMiddleware from "../middlewares/middleware.js"
import { customerSchema } from "../schemas/schema.js"



const customerRouter = Router()

customerRouter.get("/customers", getCustomers)
customerRouter.get("/customers/:id", getCustomers)
customerRouter.post("/customers", validateSchemaMiddleware(customerSchema), createCustomer)
customerRouter.put("/customers/:id", validateSchemaMiddleware(customerSchema), updateCustomer)

export default customerRouter;