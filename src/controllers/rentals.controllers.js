import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function createRental(req, res) {
  const rental = req.body;

  try {
    const customer = await db.query("SELECT * FROM customers WHERE id = $1", [
      rental.customerId,
    ]);
    if (customer.rowCount === 0) {
      return res.status(400).send("Cliente não encontrado");
    }

    const game = await db.query("SELECT * FROM games WHERE id = $1", [
      rental.gameId,
    ]);
    if (game.rowCount === 0) {
      return res.status(400).send("Jogo não encontrado");
    }

    const rentedGames = await db.query(
      'SELECT * FROM rentals WHERE "gameId" = $1',
      [rental.gameId]
    );

    if (game.rows[0].stockTotal === rentedGames.rowCount) {
      return res.status(400).send("Jogo esgotado");
    }

    const rentDate = dayjs().format("YYYY-MM-DD");
    const originalPrice = rental.daysRented * game.rows[0].pricePerDay;

    const rentalData = {
      customerId: rental.customerId,
      gameId: rental.gameId,
      rentDate,
      daysRented: rental.daysRented,
      returnDate: null,
      originalPrice,
      delayFee: null,
    };

    await db.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      Object.values(rentalData)
    );

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getRentals(req, res) {
  const rentals = await db.query(`SELECT * FROM rentals;`)
    res.send(rentals.rows)

}
