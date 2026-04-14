import express from 'express';
import type { Request, Response } from 'express';
const app = express();

import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './excerciseCalculator.ts';

app.use(express.json());

app.get('/bmi', (req: Request, res: Response) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!req.query.height || !req.query.weight) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const bmi = calculateBmi(height, weight);

  return res.status(200).json({ weight, height, bmi });
});

app.get('/hello', (_req: Request, res: Response) => {
  return res.status(200).send('Hello Full Stack!');
});

app.post('/exercises', (req: Request, res: Response) => {
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || target === undefined) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  if (
    isNaN(Number(target)) ||
    !Array.isArray(daily_exercises) ||
    daily_exercises.some((h: unknown) => isNaN(Number(h)))
  ) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  try {
    const result = calculateExercises(daily_exercises.map(Number), Number(target));
    return res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    return res.status(400).json({ error: errorMessage });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});