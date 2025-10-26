/**
 * Nationalite Detail Page
 * Affichage des détails d'une nationalité
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
  Flag as FlagIcon,
  Info as InfoIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { nationalitesAPI, handleApiError } from '@/services/api.js';

const NationaliteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nationalite, setNationalite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await nationalitesAPI.getById(id);
      setNationalite(response.data || response);
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
          onClick={() => navigate('/nationalites')}
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
          onClick={() => navigate('/nationalites')}
          sx={{ mb: 2 }}
        >
          Retour à la liste des nationalités
        </Button>
        
        <Typography variant="h4" gutterBottom>
          Détails de la nationalité
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {nationalite._id}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Informations principales */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {/* En-tête avec nationalité */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <FlagIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" fontWeight="medium">
                  {nationalite.Lib_Nation}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nationalité de référence
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
                  <FlagIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Libellé de la nationalité"
                  secondary={nationalite.Lib_Nation}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <GroupIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Nombre d'utilisations"
                  secondary={`${nationalite.usageCount} personne(s) avec cette nationalité`}
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
                {format(new Date(nationalite.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </Typography>
            </Box>
            
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Dernière modification
              </Typography>
              <Typography variant="body1">
                {format(new Date(nationalite.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </Typography>
            </Box>

            {/* Statut d'utilisation */}
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Statut
              </Typography>
              <Chip 
                label={nationalite.usageCount > 0 ? "En utilisation" : "Non utilisée"} 
                color={nationalite.usageCount > 0 ? "success" : "warning"}
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Actions */}
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/nationalites/${nationalite._id}/edit`)}
                fullWidth
              >
                Modifier
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/nationalites')}
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
                Informations d'usage
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cette nationalité est actuellement utilisée par <strong>{nationalite.usageCount}</strong> personne(s) dans le système.
                {nationalite.usageCount > 0 && (
                  <Box component="span" sx={{ display: 'block', mt: 1 }}>
                    La suppression de cette nationalité nécessitera la mise à jour des enregistrements associés.
                  </Box>
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NationaliteDetailPage;