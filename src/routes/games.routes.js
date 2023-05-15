import { Router } from "express"
import { createGame, getGames } from "../controllers/games.controller.js";
import validateSchemaMiddleware from "../middlewares/middleware.js";
import { gameSchema } from "../schemas/games.schema.js";

const gamesRouter = Router()

gamesRouter.get("/games", getGames)
gamesRouter.post("/games",validateSchemaMiddleware(gameSchema) ,createGame)

export default gamesRouter;