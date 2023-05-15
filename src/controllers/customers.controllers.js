import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
  const customers = await db.query('SELECT * FROM customers');

  return res.send(customers.rows);
}


export async function createCustomer (req, res) {
    const { name,phone,cpf,birthday } = req.body;

    const customer = await db.query(`INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4);`, [name,phone,cpf,birthday])
    if ( customer.rowCount ) {
    return res.sendStatus(201)  
    }
    res.sendStatus(500)
}

  