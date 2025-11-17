/**
 * Section de localisation de la parcelle
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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import GeoJSONInput from '@presentation/components/Common/GeoJSONInput.jsx';

const LocationSection = ({ 
  formData, 
  handleFormChange, 
  regions, 
  departements, 
  sousprefectures,
  secteursAdministratifs,
  zonedenombres,
  localites 
}) => {
  const milieuOptions = [
    { value: 0, label: 'Non défini' },
    { value: 1, label: 'Urbain' },
    { value: 2, label: 'Semi-urbain' },
    { value: 3, label: 'Rural' },
  ];

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Localisation
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.IsSameLocalitethanExploitant || false}
                  onChange={(e) => handleFormChange('IsSameLocalitethanExploitant', e.target.checked)}
                />
              }
              label="Votre exploitation se trouve-t-elle dans votre localité de résidence ?"
            />
          </Grid>

          {!formData.IsSameLocalitethanExploitant && (
            <>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Région</InputLabel>
                  <Select
                    value={formData.RegionId || ''}
                    onChange={(e) => handleFormChange('RegionId', e.target.value)}
                    label="Région"
                  >
                    <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                    {regions.map((region) => (
                      <MenuItem key={region.id || region._id} value={region.id || region._id}>
                        {region.Lib_reg || region.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Département</InputLabel>
                  <Select
                    value={formData.DepartementId || ''}
                    onChange={(e) => handleFormChange('DepartementId', e.target.value)}
                    label="Département"
                  >
                    <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                    {departements.map((dept) => (
                      <MenuItem key={dept.id || dept._id} value={dept.id || dept._id}>
                        {dept.Lib_dep || dept.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Sous-préfecture</InputLabel>
                  <Select
                    value={formData.SousprefId || ''}
                    onChange={(e) => handleFormChange('SousprefId', e.target.value)}
                    label="Sous-préfecture"
                  >
                    <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                    {sousprefectures.map((sp) => (
                      <MenuItem key={sp.id || sp._id} value={sp.id || sp._id}>
                        {sp.Lib_souspref || sp.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Secteur administratif</InputLabel>
                  <Select
                    value={formData.SecteurAdministratifId || ''}
                    onChange={(e) => handleFormChange('SecteurAdministratifId', e.target.value)}
                    label="Secteur administratif"
                  >
                    <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                    {secteursAdministratifs.map((sa) => (
                      <MenuItem key={sa.id || sa._id} value={sa.id || sa._id}>
                        {sa.Lib_secteur || sa.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Zone de dénombrement</InputLabel>
                  <Select
                    value={formData.ZonedenombreId || ''}
                    onChange={(e) => handleFormChange('ZonedenombreId', e.target.value)}
                    label="Zone de dénombrement"
                  >
                    <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                    {zonedenombres.map((zd) => (
                      <MenuItem key={zd.id || zd._id} value={zd.id || zd._id}>
                        {zd.Lib_zd || zd.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Localité</InputLabel>
                  <Select
                    value={formData.LocaliteId || ''}
                    onChange={(e) => handleFormChange('LocaliteId', e.target.value)}
                    label="Localité"
                  >
                    <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                    {localites.map((loc) => (
                      <MenuItem key={loc.id || loc._id} value={loc.id || loc._id}>
                        {loc.Lib_loc || loc.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Milieu de résidence</InputLabel>
                  <Select
                    value={formData.MilieuResidence || 0}
                    onChange={(e) => handleFormChange('MilieuResidence', e.target.value)}
                    label="Milieu de résidence"
                  >
                    {milieuOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Coordonnées GPS (GeoJSON Polygon)
            </Typography>
            <GeoJSONInput
              value={formData.Coordonnee}
              onChange={(value) => handleFormChange('Coordonnee', value)}
              geometryType="Polygon"
              label="Coordonnées de la parcelle"
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default LocationSection;
