/**
 * Section des informations de base du producteur
 */
import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Person as PersonIcon } from '@mui/icons-material';

const BasicInfoSection = ({ formData, handleFormChange, menages, defaultExpanded = true }) => {
  return (
    <Accordion defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Informations de base
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Ménage</InputLabel>
              <Select
                value={formData.MenageId || ''}
                onChange={(e) => handleFormChange('MenageId', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {menages.map(m => (
                  <MenuItem key={m.id || m._id} value={m.id || m._id}>
                    {m.Cod_menage} - {m.NomChefMenage || 'Sans nom'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.IsExploitant}
                  onChange={(e) => handleFormChange('IsExploitant', e.target.checked)}
                />
              }
              label="Êtes-vous l'exploitant ? "
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default BasicInfoSection;
