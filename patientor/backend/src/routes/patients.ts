import express, { Request, Response } from 'express';

import {
  Patient,
  EntryWithoutId,
  NoSsnPatient,
  PatientFormValues,
  Entry,
} from '../types.ts';

import patientsService from '../services/patientService.ts';

import {
  errorMiddleware,
  newEntryParser,
  newPatientParser,
} from '../utils/middleware.ts';

const router = express.Router();

router.get('/', (_req: Request, res: Response<NoSsnPatient[]>): void => {
  res.json(patientsService.getNoSsnPatients());
});

router.get('/no-ssn', (_req: Request, res: Response<NoSsnPatient[]>): void => {
  res.json(patientsService.getNoSsnPatients());
});

router.get(
  '/:id',
  (
    req: Request<{ id: string }, unknown, EntryWithoutId>,
    res: Response<Patient | string>,
  ): void => {
    const patient = patientsService.getPatientById(req.params.id);

    if (patient) {
      res.json(patient);
    } else {
      res.sendStatus(404).send('No found patient');
    }
  },
);

router.post(
  '/',
  newPatientParser,
  (
    req: Request<unknown, unknown, PatientFormValues>,
    res: Response<Patient>,
  ): void => {
    const newPatient = patientsService.addPatient(req.body);

    res.status(200).json(newPatient);
  },
);

router.post(
  '/:id/entries',
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, EntryWithoutId>,
    res: Response<Patient | string>,
  ): void => {
    const patient = patientsService.getPatientById(req.params.id);

    if (patient) {
      const newEntry = patientsService.addEntry(patient, req.body);

      res.status(201).json(patient);
    } else {
      res.sendStatus(404).send('No found patient');
    }
  },
);

router.use(errorMiddleware);

export default router;