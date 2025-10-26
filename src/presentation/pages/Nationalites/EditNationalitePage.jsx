/**
 * Edit Nationalite Page
 * Modifier une nationalité existante
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

const EditNationalitePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Lib_Nation: ''
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await nationalitesAPI.getById(id);
      const nationalite = response.data || response;
      
      setFormData({
        Lib_Nation: nationalite.Lib_Nation
      });
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

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
      
      await nationalitesAPI.update(id, formData);
      navigate('/nationalites', { 
        state: { successMessage: 'Nationalité modifiée avec succès' } 
      });
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
        <Typography variant="h4" gutterBottom>
          Modifier la nationalité
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {id}
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
                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditNationalitePage;