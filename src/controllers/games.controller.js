import { db } from "../database/database.connection.js";

export async function createGame (req, res) {
    const { name,image,stockTotal,pricePerDay } = req.body;

    const game = await db.query(`INSERT INTO games (name,image,"stockTotal","pricePerDay") VALUES ($1,$2,$3,$4);`, [name,image,stockTotal,pricePerDay])
    if ( game.rowCount ) {
    return res.sendStatus(201)  
    }
    res.sendStatus(400)
}


export async function getGames (req, res) {
    const games = await db.query(`SELECT * FROM games;`)
    res.send(games.rows)
}
