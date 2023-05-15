import { Router } from "express"
import { createCustomer, getCustomer, getCustomers} from "../controllers/customers.controllers.js"


const customerRouter = Router()

customerRouter.get("/customers", getCustomers)
customerRouter.get("/customers/:id", getCustomer)
customerRouter.post("/customers", createCustomer)
customerRouter.put("/customers/:id")

export default customerRouter;