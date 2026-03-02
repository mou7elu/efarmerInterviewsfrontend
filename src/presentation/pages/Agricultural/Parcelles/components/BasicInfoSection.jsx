/**
 * Section des informations de base de la parcelle
 */
import React, { useState, useEffect } from 'react';
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
  const [filteredProducteurs, setFilteredProducteurs] = useState([]);

  // Filtrer les producteurs en fonction du ménage sélectionné
  useEffect(() => {
    if (formData.MenageId) {
      const filtered = producteurs.filter(
        (prod) => prod.MenageId === formData.MenageId || prod.MenageId?._id === formData.MenageId
      );
      setFilteredProducteurs(filtered);
      // Réinitialiser le ProducteurId si le ménage change
      if (!filtered.find((p) => p.id === formData.ProducteurId || p._id === formData.ProducteurId)) {
        handleFormChange('ProducteurId', '');
      }
    } else {
      setFilteredProducteurs([]);
      handleFormChange('ProducteurId', '');
    }
  }, [formData.MenageId, producteurs]);

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
              <InputLabel>Q.118 Ménage</InputLabel>
              <Select
                value={formData.MenageId || ''}
                onChange={(e) => handleFormChange('MenageId', e.target.value)}
                label="Q.118 Ménage"
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
            <FormControl fullWidth required disabled={!formData.MenageId}>
              <InputLabel>Q.119 Exploitant</InputLabel>
              <Select
                value={formData.ProducteurId || ''}
                onChange={(e) => handleFormChange('ProducteurId', e.target.value)}
                label="Q.119 Exploitant"
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {filteredProducteurs.map((prod) => (
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
              label="Q.120 Numéro exploitation (parcelle)"
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
