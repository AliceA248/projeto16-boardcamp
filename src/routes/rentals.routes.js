import { Router } from 'express'
import { createRental } from '../controllers/rentals.controllers.js'

const rentalsRouter = Router()

rentalsRouter.post("/rentals", createRental)
export default rentalsRouter