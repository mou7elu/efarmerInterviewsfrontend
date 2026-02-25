/**
 * Section enquêteur
 */
import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Badge as BadgeIcon } from '@mui/icons-material';

const EnqueteurSection = ({ formData, handleFormChange, enqueteurs, currentUser }) => {
  console.log('EnqueteurSection - enqueteurs:', enqueteurs, 'length:', enqueteurs?.length);
  console.log('EnqueteurSection - formData.EnqueteurId:', formData.EnqueteurId);
  
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <BadgeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Enquêteur
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Enquêteur - Grisé en création et modification */}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel> Q.5 Enquêteur</InputLabel>
              <Select
                value={formData.EnqueteurId || ''}
                onChange={(e) => handleFormChange('EnqueteurId', e.target.value)}
                label="Q.5 Enquêteur"
                disabled
              >
                <MenuItem value="">
                  <em>Sélectionner un enquêteur</em>
                </MenuItem>
                {enqueteurs.map((enq) => (
                  <MenuItem key={enq._id || enq.id} value={enq._id || enq.id}>
                    {enq.Nom_ut || enq.name || enq.username || enq.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default EnqueteurSection;
