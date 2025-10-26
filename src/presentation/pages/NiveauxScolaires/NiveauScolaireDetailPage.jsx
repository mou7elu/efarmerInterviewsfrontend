/**
 * NiveauScolaire Detail Page
 * Affichage des détails d'un niveau scolaire
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  Info as InfoIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { niveauxScolairesAPI, handleApiError } from '@/services/api.js';

const NiveauScolaireDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [niveauScolaire, setNiveauScolaire] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await niveauxScolairesAPI.getById(id);
      setNiveauScolaire(response.data || response);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Chargement des détails...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/niveaux-scolaires')}
          sx={{ mt: 2 }}
        >
          Retour à la liste
        </Button>
      </Container>
    );
  }



  return (
    <Container maxWidth="md">
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/niveaux-scolaires')}
          sx={{ mb: 2 }}
        >
          Retour à la liste des niveaux scolaires
        </Button>
        
        <Typography variant="h4" gutterBottom>
          Détails du niveau scolaire
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {niveauScolaire.id}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Informations principales */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {/* En-tête avec niveau scolaire */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <SchoolIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" fontWeight="medium">
                  {niveauScolaire.Lib_NiveauScolaire}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Niveau scolaire de référence
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 3 }} />

            {/* Informations détaillées */}
            <Typography variant="h6" color="primary" gutterBottom>
              <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Informations générales
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Libellé du niveau scolaire"
                  secondary={niveauScolaire.Lib_NiveauScolaire}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Métadonnées */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Métadonnées
            </Typography>
            
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Date de création
              </Typography>
              <Typography variant="body1">
                {format(new Date(niveauScolaire.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </Typography>
            </Box>
            
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Dernière modification
              </Typography>
              <Typography variant="body1">
                {format(new Date(niveauScolaire.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </Typography>
            </Box>

            {/* Statut d'utilisation */}
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Statut
              </Typography>
              <Chip 
                label="Actif" 
                color="success"
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Actions */}
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/niveaux-scolaires/${niveauScolaire.id}/edit`)}
                fullWidth
              >
                Modifier
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/niveaux-scolaires')}
                fullWidth
              >
                Retour à la liste
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Informations d'usage */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Statistiques d'usage
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ce niveau scolaire est disponible dans le système et peut être utilisé pour classifier les producteurs selon leur niveau d'éducation.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NiveauScolaireDetailPage;