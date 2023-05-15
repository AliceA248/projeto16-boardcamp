import { db } from "../database/database.connection.js";

export async function createGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;
  
    // Verificar se algum campo obrigatório está faltando
    if (!name || !image || !stockTotal || !pricePerDay) {
      return res.sendStatus(400);
    }
  
    try {
      // Verificar se já existe um jogo com o mesmo nome
      const existingGame = await db.query('SELECT * FROM games WHERE name = $1', [name]);
      if (existingGame.rowCount > 0) {
        return res.sendStatus(409);
      }
  
      const game = await db.query(
        'INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);',
        [name, image, stockTotal, pricePerDay]
      );
  
      if (game.rowCount) {
        return res.sendStatus(201);
      }
  
      res.sendStatus(500);
    } catch (err) {
      res.sendStatus(500);
    }
  }
  

export async function getGames (req, res) {
    const games = await db.query(`SELECT * FROM games;`)
    res.send(games.rows)
}
