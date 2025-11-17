/**
 * Section production et pratiques agricoles
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
  OutlinedInput,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Agriculture as AgricultureIcon } from '@mui/icons-material';
import DepensesArrayManager from './DepensesArrayManager';
import MainOeuvreArrayManager from './MainOeuvreArrayManager';

const ProductionSection = ({ formData, handleFormChange }) => {
  const provenancePlantsOptions = [
    { value: 1, label: 'Tout venant' },
    { value: 2, label: 'CNRA' },
    { value: 3, label: 'ANADER' },
    { value: 4, label: 'Pépiniériste privé' },
    { value: 5, label: 'Je ne sais pas' },
    { value: 6, label: 'Autre à préciser' },
  ];

  const recoursServicesOptions = [
    { value: 1, label: 'Agent ANADER' },
    { value: 2, label: 'Particulier (Agronome)' },
    { value: 3, label: 'Coopérative' },
    { value: 4, label: 'Autre à préciser' },
  ];

  const associationCulturelleOptions = [
    { value: 1, label: 'Maïs' },
    { value: 2, label: 'Igname' },
    { value: 3, label: 'Soja' },
    { value: 4, label: 'Arachide' },
    { value: 5, label: 'Coton' },
    { value: 6, label: 'Roucou' },
    { value: 7, label: 'Cacao' },
    { value: 8, label: 'Café' },
    { value: 9, label: 'Palmier' },
    { value: 10, label: 'Hévéa' },
    { value: 11, label: 'Autre à préciser' },
  ];

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <AgricultureIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Production et pratiques agricoles
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Production */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Production année dernière
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Tonnage récolté (tonnes)"
              value={formData.TonnageLastYear || 0}
              onChange={(e) => handleFormChange('TonnageLastYear', Number.parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Prix de vente/Kg (FCFA)"
              value={formData.PrixVenteLastYear || 0}
              onChange={(e) => handleFormChange('PrixVenteLastYear', Number.parseInt(e.target.value) || 0)}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Provenance et services
            </Typography>
          </Grid>

          {/* Provenance des plants */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Quel est la provenance du matériel végétal utilisé ? (Question à Choix multiple) </InputLabel>
              <Select
                multiple
                value={formData.ProvenanceDesPlants || []}
                onChange={(e) => handleFormChange('ProvenanceDesPlants', e.target.value)}
                input={<OutlinedInput label="Provenance du matériel végétal" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={provenancePlantsOptions.find((o) => o.value === value)?.label}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {provenancePlantsOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Services et certifications */}
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasCertificationProgramme || false}
                  onChange={(e) => handleFormChange('HasCertificationProgramme', e.target.checked)}
                />
              }
              label="Etes-vous dans un programme de certification ? "
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasRecoursServicesConseils || false}
                  onChange={(e) => handleFormChange('HasRecoursServicesConseils', e.target.checked)}
                />
              }
              label="Avez-vous recours aux services de conseils agricoles ?"
            />
          </Grid>

          {formData.HasRecoursServicesConseils && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>A quels services avez-vous recours ?</InputLabel>
                <Select
                  value={formData.RecoursServices || ''}
                  onChange={(e) => handleFormChange('RecoursServices', e.target.value)}
                  label="A quels services avez-vous recours ?"
                >
                  <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                  {recoursServicesOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Réhabilitation */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasParcelleRehabilitee || false}
                  onChange={(e) => handleFormChange('HasParcelleRehabilitee', e.target.checked)}
                />
              }
              label="Votre parcelle a-t-elle été réhabilitée ?"
            />
          </Grid>

          {formData.HasParcelleRehabilitee && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Quelle superficie (ha) est concernée par cette réhabilitation ? "
                value={formData.SuperficieRehabilitee || 0}
                onChange={(e) => handleFormChange('SuperficieRehabilitee', Number.parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Intrants
            </Typography>
          </Grid>

          {/* Intrants */}
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasUseEngrais || false}
                  onChange={(e) => handleFormChange('HasUseEngrais', e.target.checked)}
                />
              }
              label="Avez-vous utilisé de l'engrais ces deux dernières années ? "
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasUsePhytosanitaire || false}
                  onChange={(e) => handleFormChange('HasUsePhytosanitaire', e.target.checked)}
                />
              }
              label="Avez-vous effectué des traitements phytosanitaires sur votre exploitation d'anacarde ces deux dernières années ?"
            />
          </Grid>

          {/* Dépenses */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <DepensesArrayManager
              items={formData.Depenses || []}
              onChange={(value) => handleFormChange('Depenses', value)}
            />
          </Grid>

          {/* Association culturale */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Association culturelle
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasAssociationCulturelle || false}
                  onChange={(e) => handleFormChange('HasAssociationCulturelle', e.target.checked)}
                />
              }
              label="Pratiquez-vous une association culturelle ?"
            />
          </Grid>

          {formData.HasAssociationCulturelle && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Quelle (s) culture (s) associez-vous à l'anacarde ? (Question à Choix multiple)</InputLabel>
                <Select
                  multiple
                  value={formData.AssociationCulturelle || []}
                  onChange={(e) => handleFormChange('AssociationCulturelle', e.target.value)}
                  input={<OutlinedInput label="Types de cultures associées" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={associationCulturelleOptions.find((o) => o.value === value)?.label}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {associationCulturelleOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasAnarcadePrincipaleCulture || false}
                  onChange={(e) => handleFormChange('HasAnarcadePrincipaleCulture', e.target.checked)}
                />
              }
              label="L'anacarde est-elle votre culture principale dans cette association ?"
            />
          </Grid>

          {/* Main d'oeuvre */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <MainOeuvreArrayManager
              items={formData.MainOeuvre || []}
              onChange={(value) => handleFormChange('MainOeuvre', value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Quel salaire payez-vous à la main d'oeuvre permanente de votre exploitation ? (FCFA)"
              value={formData.SalaireMainOeuvre || 0}
              onChange={(e) => handleFormChange('SalaireMainOeuvre', Number.parseInt(e.target.value) || 0)}
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default ProductionSection;
