/**
 * Section infrastructure et équipement agricole
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
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Engineering as EngineeringIcon } from '@mui/icons-material';

const InfrastructureSection = ({ formData, handleFormChange }) => {
  const machineAgricoleOptions = [
    { value: 1, label: 'Tracteur' },
    { value: 2, label: 'Pulvérisateur / Atomiseur' },
    { value: 3, label: 'Épandeur d\'engrais' },
    { value: 4, label: 'Désherbeur mécanique / Débroussailleuse' },
    { value: 5, label: 'Équipement de traitement post récolte' },
    { value: 6, label: 'Autre à préciser' },
  ];

  const equipementSechageOptions = [
    { value: 1, label: 'Claie de séchage' },
    { value: 2, label: 'Bâches' },
    { value: 3, label: 'Autres (précisez)' },
  ];

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <EngineeringIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Infrastructure et équipement agricole
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasStockageBatimentAgricole || false}
                  onChange={(e) => handleFormChange('HasStockageBatimentAgricole', e.target.checked)}
                />
              }
              label="Q.65 Avez-vous un bâtiment de stockage de produits agricoles ? "
            />
          </Grid>

          {formData.HasStockageBatimentAgricole && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Q.66 Quelle est la capacité du bâtiment de stockage ? (tonne)"
                value={formData.CapaciteStockageKg || 0}
                onChange={(e) => handleFormChange('CapaciteStockageKg', parseInt(e.target.value) || 0)}
                inputProps={{ min: 0 }}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasMachineAgricole || false}
                  onChange={(e) => handleFormChange('HasMachineAgricole', e.target.checked)}
                />
              }
              label="Q.67 Utilisez-vous des machines agricoles ? (Pour son exploitation)"
            />
          </Grid>

          {formData.HasMachineAgricole && (
            <>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Q.68 Quelles sont les machines agricoles utilisez-vous ?</InputLabel>
                  <Select
                    multiple
                    value={Array.isArray(formData.MachineAgricole) ? formData.MachineAgricole : []}
                    onChange={(e) => handleFormChange('MachineAgricole', e.target.value)}
                    displayEmpty
                  >
                    {machineAgricoleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {Array.isArray(formData.MachineAgricole) && formData.MachineAgricole.includes(6) && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Préciser le type de machine"
                    value={formData.PreciserMachineAgricole || ''}
                    onChange={(e) => handleFormChange('PreciserMachineAgricole', e.target.value)}
                  />
                </Grid>
              )}
            </>
          )}

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Q.69 Quels équipements de séchage utilisez-vous ?*</InputLabel>
              <Select
                value={formData.EquipementSechageAgricole || ''}
                onChange={(e) => handleFormChange('EquipementSechageAgricole', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {equipementSechageOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formData.EquipementSechageAgricole === 3 && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Préciser l'équipement de séchage"
                value={formData.PreciserEquipementSechage || ''}
                onChange={(e) => handleFormChange('PreciserEquipementSechage', e.target.value)}
              />
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default InfrastructureSection;
