/**
 * Section aspects sociaux et culturels (groupes, tontines)
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
  FormControlLabel,
  Checkbox,
  Chip,
  Box,
  OutlinedInput,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Group as GroupIcon } from '@mui/icons-material';

const SocialSection = ({ formData, handleFormChange }) => {
  const typeGroupeOptions = [
    { value: 1, label: 'Coopérative agricole' },
    { value: 2, label: 'Groupement informel' },
    { value: 3, label: 'Association' },
  ];

  const typeTontineOptions = [
    { value: 1, label: 'Financière' },
    { value: 2, label: 'En nature' },
  ];

  const bienNatureTontineOptions = [
    { value: 1, label: 'Vivre' },
    { value: 2, label: 'Non vivre' },
  ];

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Aspects sociaux et culturels
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Groupes et associations */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasAppartenanceGroupe || false}
                  onChange={(e) => handleFormChange('HasAppartenanceGroupe', e.target.checked)}
                />
              }
              label="Appartenance à une organisation de producteurs"
            />
          </Grid>

          {formData.HasAppartenanceGroupe && (
            <>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>À quel type d'organisation appartenez-vous ? </InputLabel>
                  <Select
                    value={formData.TypeGroupe || ''}
                    onChange={(e) => handleFormChange('TypeGroupe', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                    {typeGroupeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quelle est la spécialisation de l'organisation ?"
                  value={formData.SpecialiteGroupe || ''}
                  onChange={(e) => handleFormChange('SpecialiteGroupe', e.target.value)}
                  placeholder="Ex: Production d'anacarde, Maraîchage, etc."
                />
              </Grid>
            </>
          )}

          {/* Tontines */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasAppartenanceTontine || false}
                  onChange={(e) => handleFormChange('HasAppartenanceTontine', e.target.checked)}
                />
              }
              label="Appartenez-vous à une tontine ?"
            />
          </Grid>

          {formData.HasAppartenanceTontine && (
            <>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Quel est le type de tontine ?</InputLabel>
                  <Select
                    multiple
                    value={formData.TypeTontine || []}
                    onChange={(e) => handleFormChange('TypeTontine', e.target.value)}
                    input={<OutlinedInput label="Type de tontine (choix multiple)" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={typeTontineOptions.find(o => o.value === value)?.label}
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {typeTontineOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {formData.TypeTontine?.includes(1) && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quel est le montant de votre tontine ? (FCFA)"
                    value={formData.MontantTontine || 0}
                    onChange={(e) => handleFormChange('MontantTontine', Number.parseInt(e.target.value) || 0)}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              )}

              {formData.TypeTontine?.includes(2) && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Quels sont les éléments en nature de votre tontine ?(Question à Choix multiples) </InputLabel>
                    <Select
                      multiple
                      value={formData.BienNatureTontine || []}
                      onChange={(e) => handleFormChange('BienNatureTontine', e.target.value)}
                      input={<OutlinedInput label="Bien en nature versé (choix multiple)" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={bienNatureTontineOptions.find(o => o.value === value)?.label}
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {bienNatureTontineOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default SocialSection;
