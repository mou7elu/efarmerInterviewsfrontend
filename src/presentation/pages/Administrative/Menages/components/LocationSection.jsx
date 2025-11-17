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
          {/* Pays */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Pays</InputLabel>
              <Select
                value={formData.PaysId || ''}
                onChange={(e) => handleFormChange('PaysId', e.target.value)}
                label="Pays"
              >
                <MenuItem value="">
                  <em>Sélectionner un pays</em>
                </MenuItem>
                {pays.map((p) => (
                  <MenuItem key={p._id || p.id} value={p._id || p.id}>
                    {p.Lib_pays || p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* District */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>District</InputLabel>
              <Select
                value={formData.DistrictId || ''}
                onChange={(e) => handleFormChange('DistrictId', e.target.value)}
                label="District"
                disabled={!formData.PaysId}
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
              <InputLabel>Région</InputLabel>
              <Select
                value={formData.RegionId || ''}
                onChange={(e) => handleFormChange('RegionId', e.target.value)}
                label="Région"
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
              <InputLabel>Département</InputLabel>
              <Select
                value={formData.DepartementId || ''}
                onChange={(e) => handleFormChange('DepartementId', e.target.value)}
                label="Département"
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
              <InputLabel>Sous-préfecture</InputLabel>
              <Select
                value={formData.SousprefId || ''}
                onChange={(e) => handleFormChange('SousprefId', e.target.value)}
                label="Sous-préfecture"
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
              <InputLabel>Secteur administratif</InputLabel>
              <Select
                value={formData.SecteurAdministratifId || ''}
                onChange={(e) => handleFormChange('SecteurAdministratifId', e.target.value)}
                label="Secteur administratif"
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
              <InputLabel>Zone de dénombrement</InputLabel>
              <Select
                value={formData.ZonedenombreId || ''}
                onChange={(e) => handleFormChange('ZonedenombreId', e.target.value)}
                label="Zone de dénombrement"
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
              <InputLabel>Village (Localité)</InputLabel>
              <Select
                value={formData.VillageId || ''}
                onChange={(e) => handleFormChange('VillageId', e.target.value)}
                label="Village (Localité)"
                disabled={!formData.ZonedenombreId}
              >
                <MenuItem value="">
                  <em>Sélectionner un village</em>
                </MenuItem>
                {villages.map((v) => (
                  <MenuItem key={v._id || v.id} value={v._id || v.id}>
                    {v.Lib_village || v.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Localité (Quartier/Campement) */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Quartier / Campement</InputLabel>
              <Select
                value={formData.LocaliteId || ''}
                onChange={(e) => handleFormChange('LocaliteId', e.target.value)}
                label="Quartier / Campement"
                disabled={!formData.VillageId}
              >
                <MenuItem value="">
                  <em>Sélectionner un quartier/campement</em>
                </MenuItem>
                {localites.map((l) => (
                  <MenuItem key={l._id || l.id} value={l._id || l.id}>
                    {l.Lib_localite || l.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Milieu de résidence */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Milieu de résidence</InputLabel>
              <Select
                value={formData.MilieuResidence || 0}
                onChange={(e) => handleFormChange('MilieuResidence', Number(e.target.value))}
                label="Milieu de résidence"
              >
                <MenuItem value={0}>
                  <em>Sélectionner le milieu</em>
                </MenuItem>
                <MenuItem value={1}>Urbain</MenuItem>
                <MenuItem value={2}>Semi-urbain</MenuItem>
                <MenuItem value={3}>Rural</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Coordonnées GPS */}
          <Grid item xs={12}>
            <GeoJSONInput
              value={formData.CoordonneesGPS}
              onChange={(value) => handleFormChange('CoordonneesGPS', value)}
              geometryType="Point"
              label="Coordonnées GPS du ménage"
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
