/**
 * Section Detail Page
 * Afficher le détail d'une section (titre, ordre, volet)
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sectionsAPI } from '../../../services/api';
import { Container, Typography, Paper, Box, Grid, Button, Alert } from '@mui/material';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const SectionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [section, setSection] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        setError('');
        
        // Charger seulement la section (déjà populée par l'API)
        const sectionData = await sectionsAPI.getById(id);
        
        setSection(sectionData);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const getVoletTitle = (voletData) => {
    // Si voletData est déjà un objet populé par l'API
    if (typeof voletData === 'object' && voletData !== null && voletData.titre) {
      return voletData.titre;
    }
    return '— non renseigné —';
  };

  if (isLoading) return <Container sx={{ mt: 6 }}><Typography>Chargement...</Typography></Container>;

  if (error) return <Container sx={{ mt: 6 }}><Alert severity="error">{error}</Alert></Container>;

  if (!section) return <Container sx={{ mt: 6 }}><Typography>Section introuvable</Typography></Container>;

  return (
    <Container maxWidth="md">
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Détail de la section</Typography>
          <Typography variant="subtitle2" color="text.secondary">{section.titre}</Typography>
        </Box>
        <Box>
          <Button startIcon={<EditIcon />} variant="contained" onClick={() => navigate(`/sections/${id}/edit`)} sx={{ mr: 1 }}>Modifier</Button>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate('/sections')}>Retour</Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Titre</Typography>
            <Typography>{section.titre}</Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2">Ordre</Typography>
            <Typography>{section.ordre}</Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2">Volet</Typography>
            <Typography>{getVoletTitle(section.voletId)}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2">Créé le</Typography>
            <Typography>{new Date(section.createdAt).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SectionDetailPage;