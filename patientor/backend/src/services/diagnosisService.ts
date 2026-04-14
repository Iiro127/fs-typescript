import diagnoses from '../data/diagnoses.ts';

import { Diagnosis } from '../types.ts';

const getAllDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

export default {
  getAllDiagnoses,
};