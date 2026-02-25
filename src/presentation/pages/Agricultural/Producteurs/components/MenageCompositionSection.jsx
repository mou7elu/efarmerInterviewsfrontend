/**
 * Section de composition du ménage
 */
import React from 'react';
import {
  Grid,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Home as HomeIcon } from '@mui/icons-material';

const MenageCompositionSection = ({ formData, handleFormChange }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Composition du ménage
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Q.52 Combien de personnes vivent dans le ménage ?"
              value={formData.NombreMembresMenage || 0}
              onChange={(e) => handleFormChange('NombreMembresMenage', parseInt(e.target.value) || 0)}
              inputProps={{ min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Q.53 Combien d’enfants avez-vous ?"
              value={formData.NombreEnfants || 0}
              onChange={(e) => handleFormChange('NombreEnfants', parseInt(e.target.value) || 0)}
              inputProps={{ min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Q.54 Combien d’enfants avez-vous scolarisés cette année ?"
              value={formData.NombreEnfantsScolarisés || 0}
              onChange={(e) => handleFormChange('NombreEnfantsScolarisés', parseInt(e.target.value) || 0)}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Q.55 Combien d’autres personnes avez-vous en charge ? (Hors ménage) "
              value={formData.NombrePersonnesChargeHorMenage || 0}
              onChange={(e) => handleFormChange('NombrePersonnesChargeHorMenage', parseInt(e.target.value) || 0)}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Q.56 Combien de femmes avez-vous ?"
              value={formData.NombreEpouse || 0}
              onChange={(e) => handleFormChange('NombreEpouse', parseInt(e.target.value) || 0)}
              inputProps={{ min: 0 }}
            />
          </Grid>
          
          
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default MenageCompositionSection;
