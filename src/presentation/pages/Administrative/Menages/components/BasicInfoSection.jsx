/**
 * Section d'informations de base du ménage
 */
import React from 'react';
import {
  Grid,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Home as HomeIcon } from '@mui/icons-material';

const BasicInfoSection = ({ formData, handleFormChange }) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Informations de base du ménage
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Code ménage - Auto-généré */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Q13. Numéro ménage "
              value={formData.Cod_menage || ''}
              disabled
              helperText="Auto-généré lors de la création"
            />
          </Grid>
{/* A un producteur anacarde */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasanacProducteur || false}
                  onChange={(e) => handleFormChange('HasanacProducteur', e.target.checked)}
                />
              }
              label="Q.14 Y-a-t'il des exploitants d'anacarde dans le ménage ? "
            />
          </Grid>
         

          {/* Nom chef de ménage */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Q.15 Nom du chef de ménage"
              value={formData.NomChefMenage || ''}
              onChange={(e) => handleFormChange('NomChefMenage', e.target.value)}
               disabled={!formData.HasanacProducteur}
            />
          </Grid>

          {/* Prénom chef de ménage */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Q.16 Prénom du chef de ménage"
              value={formData.PrenomChefMenage || ''}
              onChange={(e) => handleFormChange('PrenomChefMenage', e.target.value)}
              disabled={!formData.HasanacProducteur}
            />
          </Grid>

          {/* Contact chef de ménage */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Q.17 Contact du chef de ménage"
              value={formData.ContactChefMenage || ''}
              onChange={(e) => handleFormChange('ContactChefMenage', e.target.value)}
              placeholder="+225 XX XX XX XX XX"
               disabled={!formData.HasanacProducteur}
            />
          </Grid>

           {/* Nombre d'exploitants */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Q.18 Nombre d'exploitants d'anacardes"
              value={formData.NombreExploitants || 0}
              onChange={(e) => handleFormChange('NombreExploitants', Number.parseInt(e.target.value, 10) || 0)}
              inputProps={{ min: 0 }}
              disabled={!formData.HasanacProducteur}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default BasicInfoSection;
