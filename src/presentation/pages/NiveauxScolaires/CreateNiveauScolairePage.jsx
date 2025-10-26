/**
 * Create NiveauScolaire Page
 * Créer un nouveau niveau scolaire
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
  School as SchoolIcon
} from '@mui/icons-material';
import { niveauxScolairesAPI, handleApiError } from '@/services/api.js';

const CreateNiveauScolairePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Lib_NiveauScolaire: ''
  });

  const validate = () => {
    if (!formData.Lib_NiveauScolaire.trim()) return 'Le libellé du niveau scolaire est requis';
    if (formData.Lib_NiveauScolaire.length < 2) return 'Le libellé doit contenir au moins 2 caractères';
    
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
      
      await niveauxScolairesAPI.create(formData);
      navigate('/niveaux-scolaires', { 
        state: { successMessage: 'Niveau scolaire créé avec succès' } 
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
          Créer un nouveau niveau scolaire
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ajouter un niveau scolaire dans le système de référence
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
                    <SchoolIcon color="primary" />
                    <Typography variant="h6" color="primary">
                      Informations du niveau scolaire
                    </Typography>
                  </Box>
                  
                  <TextField
                    required
                    fullWidth
                    label="Libellé du niveau scolaire"
                    value={formData.Lib_NiveauScolaire}
                    onChange={(e) => setFormData(prev => ({ ...prev, Lib_NiveauScolaire: e.target.value }))}
                    disabled={isLoading}
                    helperText="Ex: Aucun niveau, Primaire, Secondaire, Supérieur, CEP, BEPC, BAC..."
                    placeholder="Primaire"
                    autoFocus
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button 
                variant="outlined" 
                startIcon={<CancelIcon />} 
                onClick={() => navigate('/niveaux-scolaires')} 
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
                {isLoading ? 'Création...' : 'Créer le niveau scolaire'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateNiveauScolairePage;