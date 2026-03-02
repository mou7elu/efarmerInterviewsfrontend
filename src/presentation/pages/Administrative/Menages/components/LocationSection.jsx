/**
 * Section de localisation du ménage
 * Cascade complète: Pays > District > Region > Departement > Souspref > Secteur > Zone > Village > Localite
 * Note: Village = Localité, Localite = Quartier/Campement
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
import { ExpandMore as ExpandMoreIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import GeoJSONInput from '@presentation/components/Common/GeoJSONInput.jsx';

const LocationSection = ({ 
  formData, 
  handleFormChange,
  pays,
  districts,
  regions,
  departements,
  sousprefectures,
  secteursAdministratifs,
  zonedenombres,
  villages,
  localites,
}) => {
  console.log('LocationSection - MilieuResidence:', formData.MilieuResidence, 'Type:', typeof formData.MilieuResidence);
  const safeSelectValue = (list, value) => {
    if (!value) return '';
    return list.some((item) => (item._id || item.id) === value) ? value : '';
  };
  
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Situation du ménage
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Pays - Hidden, auto-selected to local country */}
          {/* The PaysId is automatically set to the local country */}
          
          {/* District */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Q.6 District</InputLabel>
              <Select
                value={safeSelectValue(districts, formData.DistrictId)}
                onChange={(e) => handleFormChange('DistrictId', e.target.value)}
                label="Q.6 District"
              >
                <MenuItem value="">
                  <em>Sélectionner un district</em>
                </MenuItem>
                {districts.map((d) => (
                  <MenuItem key={d._id || d.id} value={d._id || d.id}>
                    {d.Lib_district || d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Région */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Q.7 Région</InputLabel>
              <Select
                value={safeSelectValue(regions, formData.RegionId)}
                onChange={(e) => handleFormChange('RegionId', e.target.value)}
                label="Q.7 Région"
                disabled={!formData.DistrictId}
              >
                <MenuItem value="">
                  <em>Sélectionner une région</em>
                </MenuItem>
                {regions.map((r) => (
                  <MenuItem key={r._id || r.id} value={r._id || r.id}>
                    {r.Lib_region || r.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Département */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Q.8 Département</InputLabel>
              <Select
                value={safeSelectValue(departements, formData.DepartementId)}
                onChange={(e) => handleFormChange('DepartementId', e.target.value)}
                label="Q.8 Département"
                disabled={!formData.RegionId}
              >
                <MenuItem value="">
                  <em>Sélectionner un département</em>
                </MenuItem>
                {departements.map((d) => (
                  <MenuItem key={d._id || d.id} value={d._id || d.id}>
                    {d.Lib_Departement || d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sous-préfecture */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Q.9 Sous-préfecture</InputLabel>
              <Select
                value={safeSelectValue(sousprefectures, formData.SousprefId)}
                onChange={(e) => handleFormChange('SousprefId', e.target.value)}
                label="Q.9 Sous-préfecture"
                disabled={!formData.DepartementId}
              >
                <MenuItem value="">
                  <em>Sélectionner une sous-préfecture</em>
                </MenuItem>
                {sousprefectures.map((s) => (
                  <MenuItem key={s._id || s.id} value={s._id || s.id}>
                    {s.Lib_Souspref || s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Secteur administratif */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Q.10 Secteur administratif</InputLabel>
              <Select
                value={safeSelectValue(secteursAdministratifs, formData.SecteurAdministratifId)}
                onChange={(e) => handleFormChange('SecteurAdministratifId', e.target.value)}
                label="Q.10 Secteur administratif"
                disabled={!formData.SousprefId}
              >
                <MenuItem value="">
                  <em>Sélectionner un secteur</em>
                </MenuItem>
                {secteursAdministratifs.map((s) => (
                  <MenuItem key={s._id || s.id} value={s._id || s.id}>
                    {s.Lib_SecteurAdministratif || s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Zone de dénombrement */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Q.11 Zone de dénombrement</InputLabel>
              <Select
                value={safeSelectValue(zonedenombres, formData.ZonedenombreId)}
                onChange={(e) => handleFormChange('ZonedenombreId', e.target.value)}
                label="Q.11 Zone de dénombrement"
                disabled={!formData.SecteurAdministratifId}
              >
                <MenuItem value="">
                  <em>Sélectionner une zone</em>
                </MenuItem>
                {zonedenombres.map((z) => (
                  <MenuItem key={z._id || z.id} value={z._id || z.id}>
                    {z.Lib_ZD || z.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Village (Localité) */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Q.12 Localité</InputLabel>
              <Select
                value={safeSelectValue(villages, formData.VillageId)}
                onChange={(e) => handleFormChange('VillageId', e.target.value)}
                label="Q.12 Localité"
                disabled={!formData.ZonedenombreId}
              >
                <MenuItem value="">
                  <em>Sélectionner une localité</em>
                </MenuItem>
                {villages.map((v) => (
                  <MenuItem key={v._id || v.id} value={v._id || v.id}>
                    {v.Lib_village || v.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          

          {/* Coordonnées GPS */}
          <Grid item xs={12}>
            <GeoJSONInput
              value={formData.CoordonneesGPS}
              onChange={(value) => handleFormChange('CoordonneesGPS', value)}
              geometryType="Point"
              label="Q.4 Coordonnées GPS du ménage"
              disabled
              autoCapture
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default LocationSection;
