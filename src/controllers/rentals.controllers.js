import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function createRental(req, res) {
  const rental = req.body;

  if (rental.daysRented <= 0) {
    return res.status(400).send("O número de dias alugados deve ser maior que 0");
  }

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
export async function finalizeRental(req, res) {
  const { id } = req.params;

  try {
    // Verificar se o aluguel existe
    const rental = await db.query('SELECT * FROM rentals WHERE id = $1', [id]);
    if (rental.rowCount === 0) {
      return res.sendStatus(404);
    }

    // Verificar se o aluguel já está finalizado
    if (rental.rows[0].returnDate) {
      return res.sendStatus(400);
    }

    const rentDate = dayjs(rental.rows[0].rentDate);
    const daysRented = rental.rows[0].daysRented;
    const pricePerDay = rental.rows[0].originalPrice / daysRented; 

    const isDelay = dayjs().diff(rentDate, 'day');
    const delayFee = isDelay > daysRented ? (isDelay - daysRented) * pricePerDay : 0;

    await db.query('UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3', [
      dayjs().format('YYYY-MM-DD'),
      delayFee,
      id,
    ]);

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query('SELECT * FROM rentals WHERE id = $1', [id]);
    if (rental.rowCount === 0) {
      return res.sendStatus(404);
    }

    console.log(rental.rows[0].returnDate)
    if (!rental.rows[0].returnDate) {
      return res.status(400).send('O aluguel já foi finalizado e portanto não pode ser excluído!');
    }

    await db.query('DELETE FROM rentals WHERE id = $1', [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}








