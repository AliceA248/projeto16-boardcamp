import { Router } from 'express';
import { createRental, deleteRental, finalizeRental, getRentals } from '../controllers/rentals.controllers.js';
import validateSchemaMiddleware from '../middlewares/validation.middleware.js';
import { rentalSchema } from '../schemas/schema.js';


const rentalsRouter = Router();

rentalsRouter.post('/rentals',validateSchemaMiddleware(rentalSchema), createRental);
rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals/:id/return', finalizeRental);
rentalsRouter.delete('/rentals/:id', deleteRental);



export default rentalsRouter;
