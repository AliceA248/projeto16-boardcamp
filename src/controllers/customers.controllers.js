import { db } from "../database/database.connection.js";


export async function getCustomer(req, res) {
  const id = req.params.id;
  const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);

  if (customer.rowCount === 0) {
    return res.sendStatus(404);
  }

  return res.send(customer.rows);
}


export async function createCustomer (req, res) {
    const { name,phone,cpf,birthday } = req.body;

    const customer = await db.query(`INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4);`, [name,phone,cpf,birthday])
    if ( customer.rowCount ) {
    return res.sendStatus(201)  
    }
    res.sendStatus(500)
}

  