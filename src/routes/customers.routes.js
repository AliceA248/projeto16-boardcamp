import { Router } from "express"
import { createCustomer, getCustomer} from "../controllers/customers.controllers.js"


const customerRouter = Router()

customerRouter.get("/customers", getCustomer)
customerRouter.get("/customers/:id")
customerRouter.post("/customers", createCustomer)
customerRouter.put("/customers/:id")

export default customerRouter;