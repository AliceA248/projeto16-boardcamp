import { Router } from "express"
import { createCustomer, getCustomers, updateCustomer} from "../controllers/customers.controllers.js"
import validateSchemaMiddleware from "../middlewares/validation.middleware.js"
import { customerSchema } from "../schemas/customers.schema.js"


const customerRouter = Router()

customerRouter.get("/customers", getCustomers)
customerRouter.get("/customers/:id", getCustomers)
customerRouter.post("/customers",validateSchemaMiddleware(customerSchema), createCustomer)
customerRouter.put("/customers/:id", updateCustomer)

export default customerRouter;