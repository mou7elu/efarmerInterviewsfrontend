/**
 * Section des caractéristiques techniques de la parcelle
 */
import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Agriculture as AgricultureIcon } from '@mui/icons-material';

const TechnicalSection = ({ formData, handleFormChange }) => {
  const faitValoirOptions = [
    { value: 1, label: 'Propriétaire' },
    { value: 2, label: 'Fermage' },
    { value: 3, label: 'Métayage' },
    { value: 4, label: 'Planter-Partager' },
    { value: 5, label: 'Autre' },
  ];

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <AgricultureIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Caractéristiques techniques
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              type="number"
              label="Quelle est l'année de mise en place de la plantation ?  "
              value={formData.yearofcreationParcelle || ''}
              onChange={(e) => handleFormChange('yearofcreationParcelle', Number.parseInt(e.target.value) || 0)}
              inputProps={{ min: 1900, max: new Date().getFullYear() }}
              helperText="Année de mise en place de la parcelle"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              type="number"
              label=" Quelle est l'année d'entrée en production de la plantation ?"
              value={formData.yearofProductionStart || ''}
              onChange={(e) => handleFormChange('yearofProductionStart', Number.parseInt(e.target.value) || 0)}
              inputProps={{ min: 1900, max: new Date().getFullYear() }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Quelle est la superficie en production ? (ha)"
              value={formData.SuperficieProductive || 0}
              onChange={(e) => handleFormChange('SuperficieProductive', Number.parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Quelle est la superficie non en production ? (ha)"
              value={formData.SuperficieNonProductive || 0}
              onChange={(e) => handleFormChange('SuperficieNonProductive', Number.parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Quel est le mode de faire valoir de votre exploitation ?</InputLabel>
              <Select
                value={formData.TypeFaitValoirParcelle || ''}
                onChange={(e) => handleFormChange('TypeFaitValoirParcelle', e.target.value)}
                label="Quel est le mode de faire valoir de votre exploitation ?"
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {faitValoirOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label=" Combien de fois entretenez-vous votre exploitation par campagne ?"
              value={formData.NombreEntretien || 0}
              onChange={(e) => handleFormChange('NombreEntretien', Number.parseInt(e.target.value) || 0)}
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default TechnicalSection;
