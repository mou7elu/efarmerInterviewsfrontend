/**
 * Create Nationalite Page
 * Créer une nouvelle nationalité
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
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { nationalitesAPI, handleApiError } from '@/services/api.js';

const CreateNationalitePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Lib_Nation: ''
  });

  const validate = () => {
    if (!formData.Lib_Nation.trim()) return 'Le libellé de la nationalité est requis';
    if (formData.Lib_Nation.length < 2) return 'Le libellé doit contenir au moins 2 caractères';
    
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
      
      await nationalitesAPI.create(formData);
      navigate('/nationalites', { 
        state: { successMessage: 'Nationalité créée avec succès' } 
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
        <Typography variant="h4" gutterBottom>
          Créer une nouvelle nationalité
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ajouter une nationalité dans le système de référence
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <FlagIcon color="primary" />
                    <Typography variant="h6" color="primary">
                      Informations de la nationalité
                    </Typography>
                  </Box>
                  
                  <TextField
                    required
                    fullWidth
                    label="Libellé de la nationalité"
                    value={formData.Lib_Nation}
                    onChange={(e) => setFormData(prev => ({ ...prev, Lib_Nation: e.target.value }))}
                    disabled={isLoading}
                    helperText="Ex: Ivoirienne, Française, Sénégalaise, Malienne..."
                    placeholder="Ivoirienne"
                    autoFocus
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button 
                variant="outlined" 
                startIcon={<CancelIcon />} 
                onClick={() => navigate('/nationalites')} 
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
                {isLoading ? 'Création...' : 'Créer la nationalité'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateNationalitePage;