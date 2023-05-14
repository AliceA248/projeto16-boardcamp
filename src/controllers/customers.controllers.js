import { db } from "../database/database.connection.js";
import Joi from "joi"


export async function getCustomers (req, res) {

    const customers = await db.query(`SELECT * FROM customers;`)
    return res.send(customers.rows)
    

}
export async function getCustomer (req, res) {
    const id = req.params.id
    const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id])
    return res.send(customer.rows)

}

export async function createCustomer (req, res) {
    const { name,phone,cpf,birthday } = req.body;

    const customer = await db.query(`INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4);`, [name,phone,cpf,birthday])
    if ( customer.rowCount ) {
    return res.sendStatus(201)  
    }
    res.sendStatus(500)
}

function isValidCPF(cpf) {
  const schema = Joi.string().length(11).pattern(/^\d+$/);
  const { error } = schema.validate(cpf);
  return !error;
}

function isValidPhone(phone) {
  const schema = Joi.string().length(10, 11).pattern(/^\d+$/);
  const { error } = schema.validate(phone);
  return !error;
}

function isValidDate(date) {
  const schema = Joi.date().iso();
  const { error } = schema.validate(date);
  return !error;
}
  
  export async function updateCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;
  
    if (!isValidCPF(cpf)) {
      return res.status(400).send('CPF inválido');
    }
  
    if (!isValidPhone(phone)) {
      return res.status(400).send('Telefone inválido');
    }
  
    if (!name || name.trim() === '') {
      return res.status(400).send('Nome inválido');
    }
  
    if (!isValidDate(birthday)) {
      return res.status(400).send('Data de aniversário inválida');
    }
  
    const existingCustomer = await db.query('SELECT id FROM customers WHERE cpf = $1;', [cpf]);
    if (existingCustomer.rows.length > 0 && existingCustomer.rows[0].id !== id) {
      return res.status(409).send('CPF já pertence a outro cliente');
    }
  
    const updatedCustomer = await db.query(
      'UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;',
      [name, phone, cpf, birthday, id]
    );
  
    if (updatedCustomer.rowCount === 1) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(500);
    }
  }
  