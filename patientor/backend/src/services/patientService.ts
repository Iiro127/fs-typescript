import patients from '../data/patients.ts';
import { Patient, NoSsnPatient, PatientFormValues, Entry, EntryWithoutId } from '../types.ts';
import { v1 as uuidv1 } from 'uuid';

const getAllPatient = (): Patient[] => {
  return patients;
};

const getNoSsnPatients = (): NoSsnPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }: Patient) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries,
  }));
};

const getPatientById = (id: string): Patient | undefined => {
  const patient = patients.find((p: Patient) => p.id === id);
  return patient;
};

const addPatient = (data: PatientFormValues): Patient => {
  const newPatient = {
    id: uuidv1(),
    ...data,
    entries: [],
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patient: Patient, entry: EntryWithoutId): Entry => {
  const newEntry = {
    ...entry,
    id: uuidv1(),
  } as Entry;

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getAllPatient,
  getNoSsnPatients,
  getPatientById,
  addPatient,
  addEntry,
};