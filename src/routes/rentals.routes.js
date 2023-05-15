import { Router } from 'express'
import { createRental, getRentals } from '../controllers/rentals.controllers.js'

const rentalsRouter = Router()

rentalsRouter.post("/rentals", createRental)
rentalsRouter.get("/rentals", getRentals)
export default rentalsRouter