import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Button, Alert } from '@mui/material';
import axios from 'axios';

import { Patient, EntryWithoutId } from "../../types";
import patientService from "../../services/patients";
import EntryDetails from "../EntryDetails";
import AddEntryForm from "../AddEntryForm";

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          const patientData = await patientService.getById(id);
          setPatient(patientData);
        } catch (e: unknown) {
          if (axios.isAxiosError(e)) {
            setError(e.response?.data?.error || 'Failed to fetch patient');
          } else {
            setError('Unknown error');
          }
        }
      }
    };
    void fetchPatient();
  }, [id]);

  const handleAddEntry = async (entry: EntryWithoutId) => {
    if (!id || !patient) return;

    setError(undefined);

    try {
      const updatedPatient = await patientService.addEntry(id, entry);
      setPatient(updatedPatient);
      setModalOpen(false);
    } catch (e: unknown) {
      let errorMessage = 'Failed to add entry';
      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.error || e.message || errorMessage;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }
      console.error('Error adding entry:', e);
      setError(errorMessage);
      throw e;
    }
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  if (!patient) {
    return (
      <Box>
        {error ? (
          <Alert severity="error" onClose={() => setError(undefined)}>
            {error}
          </Alert>
        ) : (
          <Typography variant="h6">Loading...</Typography>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" onClose={() => setError(undefined)} sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h4">{patient.name}</Typography>
      <Typography variant="body1">Gender: {patient.gender}</Typography>
      <Typography variant="body1">Occupation: {patient.occupation}</Typography>
      <Typography variant="body1">Date of Birth: {patient.dateOfBirth}</Typography>
      {patient.ssn && <Typography variant="body1">SSN: {patient.ssn}</Typography>}

      <Box sx={{ marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Add New Entry
        </Button>
      </Box>

      <EntryDetails entries={patient.entries} />

      <AddEntryForm
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleAddEntry}
      />
    </Box>
  );
};

export default PatientDetailPage;