import { Box, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import { Entry, HealthCheckRating } from "../../types";

interface Props {
  entries: Entry[];
}

const EntryDetails = ({ entries }: Props) => {
  const EntryCard = ({ entry }: { entry: Entry }) => {
    return (
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h6">
            {entry.date} - {entry.specialist}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
            {entry.description}
          </Typography>

          {entry.type === 'HealthCheck' && (
            <Typography variant="body2">
              Health Rating: {Object.keys(HealthCheckRating).find(key => HealthCheckRating[key as keyof typeof HealthCheckRating] === entry.healthCheckRating)}
            </Typography>
          )}

          {entry.type === 'Hospital' && (
            <Box sx={{ marginTop: 1 }}>
              <Typography variant="body2" fontWeight="bold">Discharge:</Typography>
              <Typography variant="body2">
                {entry.discharge.date} - {entry.discharge.criteria}
              </Typography>
            </Box>
          )}

          {entry.type === 'OccupationalHealthcare' && (
            <Box sx={{ marginTop: 1 }}>
              <Typography variant="body2">Employer: {entry.employerName}</Typography>
              {entry.sickLeave && (
                <Typography variant="body2">
                  Sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
                </Typography>
              )}
            </Box>
          )}

          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
              {entry.diagnosisCodes.map(code => (
                <Chip key={code} label={code} size="small" />
              ))}
            </Stack>
          )}

          <Chip
            label={entry.type}
            size="small"
            sx={{ marginTop: 1 }}
            color="primary"
            variant="outlined"
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ marginY: 2 }}>
        Entries
      </Typography>
      {entries.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No entries recorded yet.
        </Typography>
      ) : (
        entries.map((entry: Entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))
      )}
    </Box>
  );
};

export default EntryDetails;