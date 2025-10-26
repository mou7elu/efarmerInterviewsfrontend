/**
 * Create Piece Page
 * Formulaire de création d'une pièce (Nom_piece)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const CreatePiecePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Nom_piece: ''
  });

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
      setError('');
      
      await piecesAPI.create(formData);
      navigate('/pieces', { 
        state: { successMessage: 'Pièce créée avec succès' } 
      });
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mb={4}>
        <Typography variant="h4">Créer une nouvelle pièce</Typography>
        <Typography variant="body2" color="text.secondary">
          Ajouter un nouveau type de pièce d'identité
        </Typography>
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
                {isLoading ? 'Enregistrement...' : 'Créer la pièce'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePiecePage;