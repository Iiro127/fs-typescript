import { Request, Response, NextFunction } from 'express';
import { NewPatientSchema } from '../util/schema.ts';

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Body:  ', req.body);
  console.log('---');
  next();
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error: Error, _req: Request, res: Response, next: NextFunction) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'ZodError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

const errorMiddleware = errorHandler;

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  // Basic validation - you can expand this
  next();
};

export {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  errorMiddleware,
  newPatientParser,
  newEntryParser,
};