import { Router } from 'express';
import { createRental, deleteRental, finalizeRental, getRentals } from '../controllers/rentals.controllers.js';


const rentalsRouter = Router();

rentalsRouter.post('/rentals', createRental);
rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals/:id/return', finalizeRental);
rentalsRouter.delete('/rentals/:id', deleteRental);



export default rentalsRouter;
