/**
 * Edit Piece Page
 * Modifier une pièce existante (Nom_piece)
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
  CircularProgress,
  Alert
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { piecesAPI, handleApiError } from '@/services/api.js';

const EditPiecePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Nom_piece: ''
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await piecesAPI.getById(id);
      const piece = response.data || response;
      
      setFormData({
        Nom_piece: piece.Nom_piece
      });
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const validate = () => {
    if (!formData.Nom_piece.trim()) return 'Le nom de la pièce est requis';
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
      // TODO: appeler l'API pour mettre à jour
      await new Promise((r) => setTimeout(r, 700));
      navigate('/pieces', { state: { message: 'Pièce modifiée avec succès' } });
    } catch (err) {
      setError('Erreur lors de la modification');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Container sx={{ mt: 6 }}><Typography>Chargement...</Typography></Container>;

  return (
    <Container maxWidth="sm">
      <Box mb={4}>
        <Typography variant="h4">Modifier la pièce</Typography>
        <Typography variant="body2" color="text.secondary">ID: {id}</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Nom de la pièce"
                value={formData.Nom_piece}
                onChange={(e) => setFormData(p => ({ ...p, Nom_piece: e.target.value }))}
                disabled={isLoading}
                helperText="Ex: Carte Nationale d'Identité, Passeport, Permis de conduire..."
                placeholder="Carte Nationale d'Identité"
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button 
                variant="outlined" 
                startIcon={<CancelIcon />} 
                onClick={() => navigate('/pieces')} 
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={isLoading ? <CircularProgress size={18} /> : <SaveIcon />}
                disabled={isLoading}
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditPiecePage;