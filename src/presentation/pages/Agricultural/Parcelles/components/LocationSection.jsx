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
  districts = [],
  regions = [], 
  departements = [], 
  sousprefectures = [],
  secteursAdministratifs = [],
  zonedenombres = [],
  villages = [],
  localites = [] 
}) => {
  const milieuOptions = [
    { value: 0, label: 'Non défini' },
    { value: 1, label: 'Urbain' },
    { value: 2, label: 'Semi-urbain' },
    { value: 3, label: 'Rural' },
  ];

  const safeSelectValue = (list, value) => {
    if (!value) return '';
    return list.some((item) => (item._id || item.id) === value) ? value : '';
  };

  // Fonctions de filtrage en cascade
  const getRefId = (ref) => {
    if (!ref) return null;
    return typeof ref === 'string' ? ref : (ref._id || ref.id);
  };

  const getFilteredRegions = () => {
    console.log('=== getFilteredRegions ===');
    console.log('DistrictId:', formData.DistrictId);
    console.log('Total regions loaded:', regions?.length || 0);
    if (regions && regions.length > 0) {
      console.log('First region structure:', regions[0]);
    }
    if (!formData.DistrictId) {
      console.log('No DistrictId selected');
      return [];
    }
    const filtered = regions.filter((r) => {
      const refId = getRefId(r.DistrictId);
      const match = refId === formData.DistrictId;
      if (match) console.log('Region matched:', r.Lib_region, 'DistrictId:', refId);
      return match;
    });
    console.log('Filtered regions count:', filtered.length);
    return filtered;
  };

  const getFilteredDepartements = () => {
    console.log('=== getFilteredDepartements ===');
    console.log('RegionId:', formData.RegionId);
    console.log('Total departements loaded:', departements?.length || 0);
    if (departements && departements.length > 0) {
      console.log('First departement structure:', departements[0]);
    }
    if (!formData.RegionId) {
      console.log('No RegionId selected');
      return [];
    }
    const filtered = departements.filter((d) => {
      const refId = getRefId(d.RegionId);
      const match = refId === formData.RegionId;
      if (match) console.log('Departement matched:', d.Lib_Departement, 'RegionId:', refId);
      return match;
    });
    console.log('Filtered departements count:', filtered.length);
    return filtered;
  };

  const getFilteredSousprefectures = () => {
    console.log('=== getFilteredSousprefectures ===');
    console.log('DepartementId:', formData.DepartementId);
    console.log('Total sousprefectures loaded:', sousprefectures?.length || 0);
    if (sousprefectures && sousprefectures.length > 0) {
      console.log('First souspref structure:', sousprefectures[0]);
    }
    if (!formData.DepartementId) {
      console.log('No DepartementId selected');
      return [];
    }
    const filtered = sousprefectures.filter((sp) => {
      const refId = getRefId(sp.DepartementId);
      const match = refId === formData.DepartementId;
      if (match) console.log('Souspref matched:', sp.Lib_Souspref, 'DepartementId:', refId);
      return match;
    });
    console.log('Filtered sousprefectures count:', filtered.length);
    return filtered;
  };

  const getFilteredSecteursAdministratifs = () => {
    console.log('=== getFilteredSecteursAdministratifs ===');
    console.log('SousprefId:', formData.SousprefId);
    console.log('Total secteursAdministratifs loaded2:', secteursAdministratifs?.length || 0);
    if (secteursAdministratifs && secteursAdministratifs.length > 0) {
      console.log('First secteur structure:', secteursAdministratifs[0]);
    }
    if (!formData.SousprefId) {
      console.log('No SousprefId selected');
      return [];
    }
    const filtered = secteursAdministratifs.filter((sa) => {
      const refId = getRefId(sa.SousprefId);
      const match = refId === formData.SousprefId;
      if (match) console.log('Secteur matched:', sa.Lib_SecteurAdministratif, 'SousprefId:', refId);
      return match;
    });
    console.log('Filtered secteursAdministratifs count:', filtered.length);
    return filtered;
  };

  const getFilteredZonedenombres = () => {
    console.log('=== getFilteredZonedenombres ===');
    console.log('SecteurAdministratifId:', formData.SecteurAdministratifId);
    console.log('Total zonedenombres loaded:', zonedenombres?.length || 0);
    if (zonedenombres && zonedenombres.length > 0) {
      console.log('First zone structure:', zonedenombres[0]);
    }
    if (!formData.SecteurAdministratifId) {
      console.log('No SecteurAdministratifId selected');
      return [];
    }
    const filtered = zonedenombres.filter((zd) => {
      const refId = getRefId(zd.SecteurAdministratifId);
      const match = refId === formData.SecteurAdministratifId;
      if (match) console.log('Zone matched:', zd.Lib_ZD, 'SecteurAdministratifId:', refId);
      return match;
    });
    console.log('Filtered zonedenombres count:', filtered.length);
    return filtered;
  };

  const getFilteredVillages = () => {
    console.log('=== getFilteredVillages ===');
    console.log('ZonedenombreId:', formData.ZonedenombreId);
    console.log('Total villages loaded:', villages?.length || 0);
    if (villages && villages.length > 0) {
      console.log('First village structure:', villages[0]);
    }
    if (!formData.ZonedenombreId) {
      console.log('No ZonedenombreId selected');
      return [];
    }
    const filtered = villages.filter((v) => {
      const refId = getRefId(v.ZonedenombreId);
      const match = refId === formData.ZonedenombreId;
      if (match) console.log('Village matched:', v.Lib_village, 'ZonedenombreId:', refId);
      return match;
    });
    console.log('Filtered villages count:', filtered.length);
    return filtered;
  };

  const getFilteredLocalites = () => {
    console.log('=== getFilteredLocalites ===');
    console.log('VillageId:', formData.VillageId);
    console.log('Total localites loaded:', localites?.length || 0);
    if (localites && localites.length > 0) {
      console.log('First localite structure:', localites[0]);
    }
    if (!formData.VillageId) {
      console.log('No VillageId selected');
      return [];
    }
    const filtered = localites.filter((l) => {
      const refId = getRefId(l.VillageId);
      const match = refId === formData.VillageId;
      if (match) console.log('Localite matched:', l.Lib_localite, 'VillageId:', refId);
      return match;
    });
    console.log('Filtered localites count:', filtered.length);
    return filtered;
  };

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
              label="Q.108 Votre exploitation se trouve-t-elle dans votre localité de résidence ?"
            />
          </Grid>

          {!formData.IsSameLocalitethanExploitant && (
            <>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Q.109 District</InputLabel>
                  <Select
                    value={safeSelectValue(districts, formData.DistrictId)}
                    onChange={(e) => {
                      handleFormChange('DistrictId', e.target.value);
                      // Réinitialiser les champs dépendants
                      handleFormChange('RegionId', '');
                      handleFormChange('DepartementId', '');
                      handleFormChange('SousprefId', '');
                      handleFormChange('SecteurAdministratifId', '');
                      handleFormChange('ZonedenombreId', '');
                      handleFormChange('VillageId', '');
                      handleFormChange('LocaliteId', '');
                    }}
                    label="Q.109 District"
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

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Q.110 Région</InputLabel>
                  <Select
                    value={safeSelectValue(getFilteredRegions(), formData.RegionId)}
                    onChange={(e) => {
                      handleFormChange('RegionId', e.target.value);
                      // Réinitialiser les champs dépendants
                      handleFormChange('DepartementId', '');
                      handleFormChange('SousprefId', '');
                      handleFormChange('SecteurAdministratifId', '');
                      handleFormChange('ZonedenombreId', '');
                      handleFormChange('VillageId', '');
                      handleFormChange('LocaliteId', '');
                    }}
                    label="Q.110 Région"
                    disabled={!formData.DistrictId}
                  >
                    <MenuItem value="">
                      <em>Sélectionner...</em>
                    </MenuItem>
                    {getFilteredRegions().map((region) => (
                      <MenuItem key={region.id || region._id} value={region.id || region._id}>
                        {region.Lib_region || region.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Q.111 Département</InputLabel>
                  <Select
                    value={safeSelectValue(getFilteredDepartements(), formData.DepartementId)}
                    onChange={(e) => {
                      handleFormChange('DepartementId', e.target.value);
                      // Réinitialiser les champs dépendants
                      handleFormChange('SousprefId', '');
                      handleFormChange('SecteurAdministratifId', '');
                      handleFormChange('ZonedenombreId', '');
                      handleFormChange('VillageId', '');
                      handleFormChange('LocaliteId', '');
                    }}
                    label="Q.111 Département"
                    disabled={!formData.RegionId}
                  >
                    <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                    {getFilteredDepartements().map((dept) => (
                      <MenuItem key={dept.id || dept._id} value={dept.id || dept._id}>
                        {dept.Lib_Departement || dept.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Q.112 Sous-préfecture</InputLabel>
                  <Select
                    value={safeSelectValue(getFilteredSousprefectures(), formData.SousprefId)}
                    onChange={(e) => {
                      handleFormChange('SousprefId', e.target.value);
                      // Réinitialiser les champs dépendants
                      handleFormChange('SecteurAdministratifId', '');
                      handleFormChange('ZonedenombreId', '');
                      handleFormChange('VillageId', '');
                      handleFormChange('LocaliteId', '');
                    }}
                    label="Q.112 Sous-préfecture"
                    disabled={!formData.DepartementId}
                  >
                    <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                    {getFilteredSousprefectures().map((sp) => (
                      <MenuItem key={sp.id || sp._id} value={sp.id || sp._id}>
                        {sp.Lib_Souspref || sp.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Q.113 Secteur administratif</InputLabel>
                  <Select
                    value={safeSelectValue(getFilteredSecteursAdministratifs(), formData.SecteurAdministratifId)}
                    onChange={(e) => {
                      handleFormChange('SecteurAdministratifId', e.target.value);
                      // Réinitialiser les champs dépendants
                      handleFormChange('ZonedenombreId', '');
                      handleFormChange('VillageId', '');
                      handleFormChange('LocaliteId', '');
                    }}
                    label="Q.113 Secteur administratif"
                    disabled={!formData.SousprefId}
                  >
                    <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                    {getFilteredSecteursAdministratifs().map((sa) => (
                      <MenuItem key={sa.id || sa._id} value={sa.id || sa._id}>
                        {sa.Lib_SecteurAdministratif || sa.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Q.114 Numéro ZD</InputLabel>
                  <Select
                    value={safeSelectValue(getFilteredZonedenombres(), formData.ZonedenombreId)}
                    onChange={(e) => {
                      handleFormChange('ZonedenombreId', e.target.value);
                      // Réinitialiser les champs dépendants
                      handleFormChange('VillageId', '');
                      handleFormChange('LocaliteId', '');
                    }}
                    label="Q.114 Numéro ZD"
                    disabled={!formData.SecteurAdministratifId}
                  >
                    <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                    {getFilteredZonedenombres().map((zd) => (
                      <MenuItem key={zd.id || zd._id} value={zd.id || zd._id}>
                        {zd.Lib_ZD || zd.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Village (Localité) */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Q.115 Localité</InputLabel>
                  <Select
                    value={safeSelectValue(getFilteredVillages(), formData.VillageId)}
                    onChange={(e) => {
                      handleFormChange('VillageId', e.target.value);
                      // Réinitialiser le champ dépendant
                      handleFormChange('LocaliteId', '');
                    }}
                    label="Q.115 Localité"
                    disabled={!formData.ZonedenombreId}
                  >
                    <MenuItem value="">
                      <em>Sélectionner une localité</em>
                    </MenuItem>
                    {getFilteredVillages().map((v) => (
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
                  <InputLabel>Q.116 Quartier / Campement</InputLabel>
                  <Select
                    value={safeSelectValue(getFilteredLocalites(), formData.LocaliteId)}
                    onChange={(e) => handleFormChange('LocaliteId', e.target.value)}
                    label="Q.116 Quartier / Campement"
                    disabled={!formData.VillageId}
                  >
                    <MenuItem value="">
                      <em>Sélectionner un quartier/campement</em>
                    </MenuItem>
                    {getFilteredLocalites().map((l) => (
                      <MenuItem key={l._id || l.id} value={l._id || l.id}>
                        {l.Lib_localite || l.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Q.117 Milieu de résidence</InputLabel>
                  <Select
                    value={formData.MilieuResidence || 0}
                    onChange={(e) => handleFormChange('MilieuResidence', e.target.value)}
                    label="Q.117 Milieu de résidence"
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
