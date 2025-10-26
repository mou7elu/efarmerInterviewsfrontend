/**
 * District Detail Page
 * Afficher le détail d'un district (Lib_district, Sommeil, Pays)
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { districtAPI } from '../../../services/api';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Button, 
  Chip,
  Alert
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';

const DistrictDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [district, setDistrict] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        setError('');
        
        // Charger seulement le district (qui contient déjà le pays dans PaysId)
        const response = await districtAPI.getById(id);
        const districtData = response.data || response;
        console.log('🏛️ District chargé:', districtData);
        
        setDistrict(districtData);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const getPaysName = (paysObj) => {
    return paysObj && paysObj.Lib_pays ? paysObj.Lib_pays : '— non renseigné —';
  };

  if (isLoading) return <Container sx={{ mt: 6 }}><Typography>Chargement...</Typography></Container>;

  if (error) return <Container sx={{ mt: 6 }}><Alert severity="error">{error}</Alert></Container>;

  if (!district) return <Container sx={{ mt: 6 }}><Typography>District introuvable</Typography></Container>;

  return (
    <Container maxWidth="md">
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Détail du district</Typography>
          <Typography variant="subtitle2" color="text.secondary">{district.Lib_district}</Typography>
        </Box>
        <Box>
          <Button startIcon={<EditIcon />} variant="contained" onClick={() => navigate(`/districts/${id}/edit`)} sx={{ mr: 1 }}>
            Modifier
          </Button>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate('/districts')}>
            Retour
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Libellé du district</Typography>
            <Typography variant="h6">{district.Lib_district}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Pays</Typography>
            <Typography>{getPaysName(district.PaysId)}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Statut</Typography>
            <Box mt={1}>
              {district.Sommeil ? (
                <Chip
                  icon={<InactiveIcon />}
                  label="En sommeil (inactif)"
                  color="warning"
                  variant="filled"
                />
              ) : (
                <Chip
                  icon={<ActiveIcon />}
                  label="Actif"
                  color="success"
                  variant="filled"
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Créé le</Typography>
            <Typography>{district.createdAt ? new Date(district.createdAt).toLocaleString() : 'N/A'}</Typography>
          </Grid>

          {district.Sommeil && (
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
                  <strong>Attention :</strong> Ce district est marqué comme étant en sommeil. 
                  Il n'apparaîtra pas dans les sélections par défaut des formulaires.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default DistrictDetailPage;