export default function validateSchemaMiddleware(schema) {
    return (req, res, next) => {
      const validation = schema.validate(req.body);
      if (validation.error) {
        const errorMessage = validation.error.details[0].message;
        return res.status(400).send(errorMessage);
      }
  
      next();
    };
  }
  