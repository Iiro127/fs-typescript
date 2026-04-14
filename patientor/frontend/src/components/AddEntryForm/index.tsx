import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  MenuItem,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import { EntryWithoutId, HealthCheckRating, Diagnosis } from "../../types";
import patientService from "../../services/patients";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (entry: EntryWithoutId) => Promise<void>;
}

const AddEntryForm = ({ open, onClose, onSubmit }: Props) => {
  const [entryType, setEntryType] = useState<'HealthCheck' | 'Hospital' | 'OccupationalHealthcare'>('HealthCheck');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [description, setDescription] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const data = await patientService.getDiagnoses();
        setDiagnoses(data);
      } catch (e) {
        console.error('Failed to fetch diagnoses:', e);
      }
    };

    if (open) {
      void fetchDiagnoses();
    }
  }, [open]);

  const handleAddDiagnosis = (code: string) => {
    if (!diagnosisCodes.includes(code)) {
      setDiagnosisCodes([...diagnosisCodes, code]);
    }
  };

  const handleRemoveDiagnosis = (code: string) => {
    setDiagnosisCodes(diagnosisCodes.filter(d => d !== code));
  };

  const handleSubmit = async () => {
    setError(undefined);
    setIsSubmitting(true);

    try {
      const baseEntry = {
        date,
        specialist,
        description,
        diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
      };

      let entryData: EntryWithoutId;

      switch (entryType) {
        case 'HealthCheck':
          entryData = {
            ...baseEntry,
            type: 'HealthCheck',
            healthCheckRating: Number(healthCheckRating),
          };
          break;
        case 'Hospital':
          entryData = {
            ...baseEntry,
            type: 'Hospital',
            discharge: {
              date: dischargeDate,
              criteria: dischargeCriteria,
            },
          };
          break;
        case 'OccupationalHealthcare':
          entryData = {
            ...baseEntry,
            type: 'OccupationalHealthcare',
            employerName,
            ...(sickLeaveStart && sickLeaveEnd && {
              sickLeave: {
                startDate: sickLeaveStart,
                endDate: sickLeaveEnd,
              },
            }),
          };
          break;
        default:
          return;
      }

      await onSubmit(entryData);
      resetForm();
      onClose();
    } catch (err) {
      let errorMessage = 'Failed to add entry';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('Error submitting entry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEntryType('HealthCheck');
    setDate('');
    setSpecialist('');
    setDescription('');
    setDiagnosisCodes([]);
    setHealthCheckRating(HealthCheckRating.Healthy);
    setEmployerName('');
    setSickLeaveStart('');
    setSickLeaveEnd('');
    setDischargeDate('');
    setDischargeCriteria('');
    setError(undefined);
  };

  const handleDialogClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Entry</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(undefined)}>
              {error}
            </Alert>
          )}

          <TextField
            select
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as typeof entryType)}
            label="Entry Type"
            fullWidth
          >
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
          </TextField>

          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            label="Date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <TextField
            value={specialist}
            onChange={(e) => setSpecialist(e.target.value)}
            label="Specialist"
            fullWidth
            required
          />

          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="Description"
            multiline
            rows={3}
            fullWidth
            required
          />

          <Box>
            <TextField
              select
              label="Add Diagnosis"
              fullWidth
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  handleAddDiagnosis(e.target.value);
                  e.target.value = '';
                }
              }}
            >
              <MenuItem value="">-- Select Diagnosis --</MenuItem>
              {diagnoses.map(diagnosis => (
                <MenuItem key={diagnosis.code} value={diagnosis.code} disabled={diagnosisCodes.includes(diagnosis.code)}>
                  {diagnosis.code} - {diagnosis.name}
                </MenuItem>
              ))}
            </TextField>
            {diagnosisCodes.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ marginTop: 1, flexWrap: 'wrap' }}>
                {diagnosisCodes.map(code => {
                  const diagnosis = diagnoses.find(d => d.code === code);
                  return (
                    <Chip
                      key={code}
                      label={`${code}${diagnosis ? ` - ${diagnosis.name}` : ''}`}
                      onDelete={() => handleRemoveDiagnosis(code)}
                    />
                  );
                })}
              </Stack>
            )}
          </Box>

          {entryType === 'HealthCheck' && (
            <TextField
              select
              value={healthCheckRating}
              onChange={(e) => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}
              label="Health Rating"
              fullWidth
            >
              <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
              <MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
              <MenuItem value={HealthCheckRating.HighRisk}>High Risk</MenuItem>
              <MenuItem value={HealthCheckRating.CriticalRisk}>Critical Risk</MenuItem>
            </TextField>
          )}

          {entryType === 'Hospital' && (
            <>
              <TextField
                type="date"
                value={dischargeDate}
                onChange={(e) => setDischargeDate(e.target.value)}
                label="Discharge Date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
              <TextField
                value={dischargeCriteria}
                onChange={(e) => setDischargeCriteria(e.target.value)}
                label="Discharge Criteria"
                fullWidth
                required
              />
            </>
          )}

          {entryType === 'OccupationalHealthcare' && (
            <>
              <TextField
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                label="Employer Name"
                fullWidth
                required
              />
              <TextField
                type="date"
                value={sickLeaveStart}
                onChange={(e) => setSickLeaveStart(e.target.value)}
                label="Sick Leave Start"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                type="date"
                value={sickLeaveEnd}
                onChange={(e) => setSickLeaveEnd(e.target.value)}
                label="Sick Leave End"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} disabled={isSubmitting}>Cancel</Button>
        <Button
          onClick={() => void handleSubmit()}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEntryForm;