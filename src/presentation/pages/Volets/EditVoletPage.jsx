/**
 * Edit Volet Page
 * Modifier un volet existant (titre, ordre, questionnaireId)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { voletsAPI, questionnairesAPI, handleApiError } from '@/services/api.js';

const EditVoletPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    titre: '',
    ordre: 1,
    questionnaireId: ''
  });

  const [questionnaires, setQuestionnaires] = useState([]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Charger le volet et les questionnaires en parallèle
      const [voletResponse, questionnairesResponse] = await Promise.all([
        voletsAPI.getById(id),
        questionnairesAPI.getAll()
      ]);
      
      const volet = voletResponse.data || voletResponse;
      const questionnairesData = questionnairesResponse.data || questionnairesResponse;
      
      setFormData({
        titre: volet.titre,
        ordre: volet.ordre,
        questionnaireId: typeof volet.questionnaireId === 'object' ? volet.questionnaireId._id : volet.questionnaireId
      });
      setQuestionnaires(questionnairesData);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const validate = () => {
    if (!formData.titre) return 'Le titre est requis';
    if (!Number.isFinite(Number(formData.ordre))) return 'L\'ordre doit être un nombre';
    if (!formData.questionnaireId) return 'Le questionnaire est requis';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await voletsAPI.update(id, formData);
      navigate('/volets', { state: { message: 'Volet modifié avec succès' } });
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Container sx={{ mt: 6 }}><Typography>Chargement...</Typography></Container>;

  return (
    <Container maxWidth="sm">
      <Box mb={4}>
        <Typography variant="h4">Modifier le volet</Typography>
        <Typography variant="body2" color="text.secondary">ID: {id}</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Titre"
                value={formData.titre}
                onChange={(e) => setFormData((p) => ({ ...p, titre: e.target.value }))}
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Ordre"
                type="number"
                value={formData.ordre}
                onChange={(e) => setFormData((p) => ({ ...p, ordre: Number(e.target.value) }))}
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                select
                required
                fullWidth
                label="Questionnaire"
                value={formData.questionnaireId || ''}
                onChange={(e) => setFormData((p) => ({ ...p, questionnaireId: e.target.value }))}
                disabled={isLoading}
              >
                <MenuItem value="">-- Sélectionner --</MenuItem>
                {questionnaires.map((q) => (
                  <MenuItem key={q._id} value={q._id}>{q.titre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => navigate('/volets')} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" variant="contained" startIcon={isLoading ? <CircularProgress size={18} /> : <SaveIcon />}>
                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditVoletPage;
