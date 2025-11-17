/**
 * Section des informations de base de la parcelle
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
  TextField,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Map as MapIcon } from '@mui/icons-material';

const BasicInfoSection = ({ formData, handleFormChange, menages, producteurs, defaultExpanded = true }) => {
  return (
    <Accordion defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <MapIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
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
                label="Ménage"
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {menages.map((menage) => (
                  <MenuItem key={menage.id || menage._id} value={menage.id || menage._id}>
                    {menage.Cod_menage} - {menage.NomChefMenage} {menage.PrenomChefMenage}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Producteur</InputLabel>
              <Select
                value={formData.ProducteurId || ''}
                onChange={(e) => handleFormChange('ProducteurId', e.target.value)}
                label="Producteur"
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {producteurs.map((prod) => (
                  <MenuItem key={prod.id || prod._id} value={prod.id || prod._id}>
                    {prod.Code} - {prod.NomExploitant || prod.NomRepresentant} {prod.PrenomExploitant || prod.PrenomRepresentant}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Superficie (ha)"
              value={formData.Superficie || 0}
              onChange={(e) => handleFormChange('Superficie', Number.parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, step: 0.01 }}
              helperText="Superficie calculée selon les coordonnées GPS"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Code parcelle"
              value={formData.Code || ''}
              onChange={(e) => handleFormChange('Code', e.target.value)}
              helperText="Auto-généré côté serveur si vide"
              disabled
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default BasicInfoSection;
