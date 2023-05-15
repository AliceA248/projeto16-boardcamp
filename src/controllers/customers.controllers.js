import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
  const { id } = req.params;

  if (id) {
    const customer = await db.query('SELECT * FROM customers WHERE id = $1', [id]);

    if (customer.rowCount === 0) {
      return res.sendStatus(404);
    }

    return res.send(customer.rows[0]);
  } else {
    const customers = await db.query('SELECT * FROM customers');

    return res.send(customers.rows);
  }
}



export async function createCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  if (!name || !phone || !cpf || !birthday) {
    return res.sendStatus(400);
  }

  const existingCustomer = await db.query(
    'SELECT * FROM customers WHERE cpf = $1',
    [cpf]
  );
  if (existingCustomer.rowCount > 0) {
    return res.sendStatus(409);
  }
  try {
    const insertQuery = `
      INSERT INTO customers (name, phone, cpf, birthday)
      VALUES ($1, $2, $3, $4);
    `;
    await db.query(insertQuery, [name, phone, cpf, birthday]);
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}


export async function updateCustomer(req, res) {
  const customerId = Number(req.params.id);
  if (isNaN(customerId) || customerId < 1 || !Number.isInteger(customerId)) {
    return res.sendStatus(400);
  }
  try {
    const result = await db.query('SELECT * FROM customers WHERE id = $1', [
      customerId,
    ]);
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }
    const { name, phone, cpf, birthday } = req.body;
    const existingCpf = await db.query(
      'SELECT * FROM customers WHERE cpf = $1 AND id != $2',
      [cpf, customerId]
    );
    if (existingCpf.rowCount > 0) {
      return res.sendStatus(409);
    }
    await db.query(
      'UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5',
      [name, phone, cpf, birthday, customerId]
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}


  