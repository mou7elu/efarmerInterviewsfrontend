/**
 * Village Detail Page
 * Afficher le détail d'un village (Lib_village, Coordonnee, Pays)
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
  Divider
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import { villagesAPI, paysAPI } from '../../../services/api';

const VillageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [village, setVillage] = useState(null);
  const [pays, setPays] = useState([]);



  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [villageResponse, paysResponse] = await Promise.all([
          villagesAPI.getById(id),
          paysAPI.getAll()
        ]);
        
        setVillage(villageResponse.data || villageResponse);
        setPays(paysResponse.data || paysResponse);
      } catch (error) {
        console.error('Erreur lors du chargement du village:', error);
        // En cas d'erreur, on peut afficher un message ou rediriger
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  const getPaysName = (paysId) => {
    console.log('getPaysName:', { paysId, pays, village }); // Debug temporaire
    
    if (!paysId) {
      return '— non renseigné —';
    }
    
    const paysItem = pays.find((p) => p._id === paysId);
    return paysItem ? (paysItem.libPays?._value || paysItem.Lib_pays || 'Pays sans nom') : 'Pays introuvable';
  };

  const parseCoordinates = (coordonneeStr) => {
    if (!coordonneeStr) return null;
    try {
      const coord = JSON.parse(coordonneeStr);
      if (coord.type === 'Point' && Array.isArray(coord.coordinates) && coord.coordinates.length === 2) {
        return {
          longitude: coord.coordinates[0],
          latitude: coord.coordinates[1],
          valid: true
        };
      }
    } catch (e) {
      // Format invalide
    }
    return { valid: false };
  };

  if (isLoading) return <Container sx={{ mt: 6 }}><Typography>Chargement...</Typography></Container>;

  if (!village) return <Container sx={{ mt: 6 }}><Typography>Village introuvable</Typography></Container>;

  const coordinates = parseCoordinates(village.Coordonnee);

  return (
    <Container maxWidth="md">
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Détail du village</Typography>
          <Typography variant="subtitle2" color="text.secondary">{village.Lib_village}</Typography>
        </Box>
        <Box>
          <Button startIcon={<EditIcon />} variant="contained" onClick={() => navigate(`/villages/${id}/edit`)} sx={{ mr: 1 }}>
            Modifier
          </Button>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate('/villages')}>
            Retour
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Informations générales</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Libellé du village</Typography>
            <Typography variant="h6">{village.Lib_village}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Pays</Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <PublicIcon color="primary" fontSize="small" />
              <Typography>{getPaysName(village.PaysId)}</Typography>
            </Box>
          </Grid>

          {/* Coordonnées géographiques */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6">Localisation</Typography>
            </Divider>
          </Grid>

          {coordinates && coordinates.valid ? (
            <>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Longitude</Typography>
                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <LocationIcon color="secondary" fontSize="small" />
                  <Typography>{coordinates.longitude}°</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Latitude</Typography>
                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <LocationIcon color="secondary" fontSize="small" />
                  <Typography>{coordinates.latitude}°</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2">Coordonnées GeoJSON</Typography>
                <Paper 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50', 
                    mt: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                >
                  {village.Coordonnee}
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
                  Aucune coordonnée géographique renseignée pour ce village.
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
            <Typography>{new Date(village.createdAt).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default VillageDetailPage;