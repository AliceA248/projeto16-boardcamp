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




export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query('SELECT * FROM rentals WHERE id = $1', [id]);
    if (rental.rowCount === 0) {
      return res.sendStatus(404);
    }

    if (rental.rows[0].returnDate) {
      return res.sendStatus(400);
    }

    await db.query('DELETE FROM rentals WHERE id = $1', [id]);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
}

export async function finalizeRental(req, res) {
  const { rentalId } = req.params
  const { pricePerDay, rentDate, daysRented } = res.locals
  let delayFee;

  try {
      const isDelay = dayjs().diff(rentDate, 'day')

      if(isDelay > daysRented) delayFee = isDelay - daysRented
      else delayFee = 0

      await connection.query(updateRentalQuery, [dayjs().format('YYYY-MM-DD'), delayFee * pricePerDay, rentalId])

      res.sendStatus(200)
  } catch (err) {
      console.log(err)
      res.status(500).send(err)
  }
}