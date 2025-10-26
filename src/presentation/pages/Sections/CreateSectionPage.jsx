/**
 * Create Section Page
 * Formulaire de création d'une section (titre, ordre, voletId)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sectionsAPI, voletsAPI } from '../../../services/api';
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

const CreateSectionPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    titre: '',
    ordre: 1,
    voletId: ''
  });

  const [volets, setVolets] = useState([]);

  useEffect(() => {
    const loadVolets = async () => {
      try {
        const data = await voletsAPI.getAll();
        setVolets(data);
      } catch (err) {
        console.error('Erreur lors du chargement des volets:', err);
        setError('Erreur lors du chargement des volets');
      }
    };

    loadVolets();
  }, []);

  const validate = () => {
    if (!formData.titre) return 'Le titre est requis';
    if (!Number.isFinite(Number(formData.ordre))) return 'L\'ordre doit être un nombre';
    if (!formData.voletId) return 'Le volet est requis';
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
      
      const dataToSubmit = {
        ...formData,
        ordre: Number(formData.ordre)
      };
      
      await sectionsAPI.create(dataToSubmit);
      navigate('/sections', { state: { message: 'Section créée avec succès' } });
    } catch (err) {
      console.error('Erreur lors de la création de la section:', err);
      setError('Erreur lors de la création de la section');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mb={4}>
        <Typography variant="h4">Créer une nouvelle section</Typography>
        <Typography variant="body2" color="text.secondary">Titre, ordre et volet</Typography>
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
                label="Volet"
                value={volets.find(v => v._id === formData.voletId) ? formData.voletId : ''}
                onChange={(e) => setFormData((p) => ({ ...p, voletId: e.target.value }))}
                disabled={isLoading}
              >
                <MenuItem value="">-- Sélectionner --</MenuItem>
                {volets.map((v) => (
                  <MenuItem key={v._id} value={v._id}>{v.titre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => navigate('/sections')} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" variant="contained" startIcon={isLoading ? <CircularProgress size={18} /> : <SaveIcon />}>
                {isLoading ? 'Enregistrement...' : 'Créer la section'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateSectionPage;