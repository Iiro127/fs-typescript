import express, { Request, Response } from 'express';
import diagnosesService from '../services/diagnosisService.ts';
import type { Diagnosis } from '../types.ts';

const router = express.Router();

router.get('/', (_req: Request, res: Response): void => {
  const diagnoses: Diagnosis[] = diagnosesService.getAllDiagnoses();
  res.json(diagnoses);
});

export default router;