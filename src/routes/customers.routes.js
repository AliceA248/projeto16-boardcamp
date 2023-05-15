import { Router } from "express"
import { createCustomer, getCustomers, updateCustomer} from "../controllers/customers.controllers.js"


const customerRouter = Router()

customerRouter.get("/customers", getCustomers)
customerRouter.get("/customers/:id", getCustomers)
customerRouter.post("/customers", createCustomer)
customerRouter.put("/customers/:id", updateCustomer)

export default customerRouter;