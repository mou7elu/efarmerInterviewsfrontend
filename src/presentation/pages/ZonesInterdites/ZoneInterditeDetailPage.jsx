/**
 * Zone Interdite Detail Page
 * Afficher le détail d'une zone interdite (Lib_zi, Coordonnee, Sommeil, Pays)
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Button, 
  Chip,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Public as PublicIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Block as BlockIcon
} from '@mui/icons-material';

import { zonesInterditesAPI, paysAPI, handleApiError } from '../../../services/api.js';

const ZoneInterditeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [zone, setZone] = useState(null);
  const [pays, setPays] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Charger les données en parallèle - utiliser getById pour la zone spécifique
        const [zoneResponse, paysResponse] = await Promise.all([
          zonesInterditesAPI.getById(id),
          paysAPI.getAll()
        ]);
        
        // Récupérer les données
        const zoneData = zoneResponse.data || zoneResponse;
        const paysData = paysResponse.data || paysResponse;
        
        if (!zoneData) {
          setError('Zone interdite non trouvée');
        } else {
          setZone(zoneData);
        }
        
        setPays(paysData);
        
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        if (error.response?.status === 404) {
          setError('Zone interdite non trouvée');
        } else {
          setError(handleApiError(error));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const getPaysName = (paysId) => {
    if (!paysId) return '— non renseigné —';
    const paysItem = pays.find((p) => p._id === paysId || p.id === paysId);
    return paysItem ? (paysItem.libPays?._value || paysItem.libPays || paysItem._id || paysItem.id) : '— non renseigné —';
  };

  const parseCoordinates = (coordonneeStr) => {
    if (!coordonneeStr) return null;
    try {
      const coord = JSON.parse(coordonneeStr);
      
      // Format Polygon direct
      if (coord.type === 'Polygon' && Array.isArray(coord.coordinates) && coord.coordinates.length > 0) {
        const firstRing = coord.coordinates[0];
        if (Array.isArray(firstRing) && firstRing.length > 0) {
          return {
            type: 'Polygon',
            rings: coord.coordinates.length,
            points: firstRing.length,
            valid: true
          };
        }
      }
      
      // Format FeatureCollection
      if (coord.type === 'FeatureCollection' && Array.isArray(coord.features) && coord.features.length > 0) {
        const firstFeature = coord.features[0];
        if (firstFeature.geometry && firstFeature.geometry.type === 'Polygon' && 
            Array.isArray(firstFeature.geometry.coordinates) && firstFeature.geometry.coordinates.length > 0) {
          const firstRing = firstFeature.geometry.coordinates[0];
          if (Array.isArray(firstRing) && firstRing.length > 0) {
            return {
              type: 'FeatureCollection (Polygon)',
              rings: firstFeature.geometry.coordinates.length,
              points: firstRing.length,
              features: coord.features.length,
              valid: true
            };
          }
        }
      }
    } catch (e) {
      // Format invalide
    }
    return { valid: false };
  };

  // Gestion des états de loading et d'erreur
  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate('/zones-interdites')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  if (!zone) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mb: 2 }}>
          Zone interdite non trouvée
        </Alert>
        <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate('/zones-interdites')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  const coordinates = parseCoordinates(zone.Coordonnee);

  return (
    <Container maxWidth="md">
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Détail de la zone interdite</Typography>
          <Typography variant="subtitle2" color="text.secondary">{zone.Lib_zi}</Typography>
        </Box>
        <Box>
          <Button startIcon={<EditIcon />} variant="contained" onClick={() => navigate(`/zones-interdites/${id}/edit`)} sx={{ mr: 1 }}>
            Modifier
          </Button>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate('/zones-interdites')}>
            Retour
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <BlockIcon color="error" fontSize="large" />
              <Typography variant="h6">Informations générales</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2">Libellé de la zone interdite</Typography>
            <Typography variant="h6">{zone.Lib_zi}</Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2">Statut</Typography>
            <Box mt={1}>
              {zone.Sommeil ? (
                <Chip
                  icon={<InactiveIcon />}
                  label="En sommeil (inactive)"
                  color="warning"
                  variant="filled"
                />
              ) : (
                <Chip
                  icon={<ActiveIcon />}
                  label="Active"
                  color="error"
                  variant="filled"
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Pays</Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <PublicIcon color="primary" fontSize="small" />
              <Typography>{getPaysName(zone.Pays?.id)}</Typography>
            </Box>
          </Grid>

          {/* Délimitation géographique */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6">Délimitation géographique</Typography>
            </Divider>
          </Grid>

          {coordinates && coordinates.valid ? (
            <>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Type de géométrie</Typography>
                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <LocationIcon color="secondary" fontSize="small" />
                  <Typography>{coordinates.type}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2">Nombre d'anneaux</Typography>
                <Typography>{coordinates.rings}</Typography>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2">Points de délimitation</Typography>
                <Typography>{coordinates.points}</Typography>
              </Grid>

              {coordinates.features && (
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2">Nombre de features</Typography>
                  <Typography>{coordinates.features}</Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle2">Coordonnées GeoJSON</Typography>
                <Paper 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50', 
                    mt: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    maxHeight: 200,
                    overflow: 'auto'
                  }}
                >
                  {zone.Coordonnee}
                </Paper>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'info.light', 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'info.main'
                }}
              >
                <Typography variant="body2" color="info.contrastText">
                  <LocationIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Aucune délimitation géographique renseignée pour cette zone interdite.
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Avertissements et informations */}
          {!zone.Sommeil && (
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'error.light', 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'error.main'
                }}
              >
                <Typography variant="body2" color="error.contrastText">
                  <BlockIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  <strong>Zone interdite active :</strong> Cette zone fait l'objet de restrictions d'accès ou d'exploitation. 
                  Les activités dans cette zone sont soumises à des contrôles stricts.
                </Typography>
              </Box>
            </Grid>
          )}

          {zone.Sommeil && (
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'warning.light', 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'warning.main'
                }}
              >
                <Typography variant="body2" color="warning.contrastText">
                  <strong>Attention :</strong> Cette zone interdite est marquée comme étant en sommeil. 
                  Elle n'est pas prise en compte dans les contrôles actifs.
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Métadonnées */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6">Métadonnées</Typography>
            </Divider>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2">Créé le</Typography>
            <Typography>{new Date(zone.createdAt).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ZoneInterditeDetailPage;