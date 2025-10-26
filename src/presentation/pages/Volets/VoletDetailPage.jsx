/**
 * Volet Detail Page
 * Afficher le détail d'un volet (titre, ordre, questionnaire)
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, Grid, Button } from '@mui/material';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { voletsAPI, handleApiError } from '@/services/api.js';

const VoletDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [volet, setVolet] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Charger seulement le volet (déjà populé par l'API)
      const voletResponse = await voletsAPI.getById(id);
      
      setVolet(voletResponse.data || voletResponse);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestionnaireTitle = (questionnaireData) => {
    // Si questionnaireData est déjà un objet populé par l'API
    if (typeof questionnaireData === 'object' && questionnaireData !== null && questionnaireData.titre) {
      return questionnaireData.titre;
    }
    // Si on n'a pas d'objet populé, on ne peut pas afficher le titre
    return '— non renseigné —';
  };

  if (isLoading) return <Container sx={{ mt: 6 }}><Typography>Chargement...</Typography></Container>;

  if (!volet) return <Container sx={{ mt: 6 }}><Typography>Volet introuvable</Typography></Container>;

  return (
    <Container maxWidth="md">
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Détail du volet</Typography>
          <Typography variant="subtitle2" color="text.secondary">{volet.titre}</Typography>
        </Box>
        <Box>
          <Button startIcon={<EditIcon />} variant="contained" onClick={() => navigate(`/volets/${id}/edit`)} sx={{ mr: 1 }}>Modifier</Button>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate('/volets')}>Retour</Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Titre</Typography>
            <Typography>{volet.titre}</Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2">Ordre</Typography>
            <Typography>{volet.ordre}</Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2">Questionnaire</Typography>
            <Typography>{getQuestionnaireTitle(volet.questionnaireId)}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2">Créé le</Typography>
            <Typography>{new Date(volet.createdAt).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default VoletDetailPage;
