import joi from 'joi'

export const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().required().min(1),
    categoryId: joi.number().required(),
    pricePerDay: joi.number().required().min(1)
})

const now = Date.now()
const maxDate = new Date(now - (1000 * 60 * 60 * 24 * 365 * 18))

export const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().pattern(/[0-9]/).min(10).max(11).required(),
    cpf: joi.string().pattern(/[0-9]/).min(11).max(11).required(),
    birthday: joi.date().max(maxDate).required()
})

export const rentalSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().min(1).required()
})