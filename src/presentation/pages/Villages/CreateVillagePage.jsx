/**
 * Create Village Page
 * Formulaire de création d'un village (Lib_village, Coordonnee, PaysId)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { villagesAPI, paysAPI } from '../../../services/api';
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

const CreateVillagePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Lib_village: '',
    Coordonnee: '',
    PaysId: ''
  });

  const [pays, setPays] = useState([]);

  useEffect(() => {
    const loadPays = async () => {
      try {
        setError('');
        const response = await paysAPI.getAll();
        setPays(response.data || response);
      } catch (err) {
        console.error('Erreur lors du chargement des pays:', err);
        setError('Erreur lors du chargement des pays');
      }
    };

    loadPays();
  }, []);

  const validate = () => {
    if (!formData.Lib_village.trim()) return 'Le libellé du village est requis';
    if (!formData.PaysId) return 'Le pays est requis';
    
    // Validation optionnelle des coordonnées GeoJSON si renseignées
    if (formData.Coordonnee.trim()) {
      try {
        const coord = JSON.parse(formData.Coordonnee);
        if (coord.type !== 'Point' || !Array.isArray(coord.coordinates) || coord.coordinates.length !== 2) {
          return 'Les coordonnées doivent être un point GeoJSON valide (ex: {"type":"Point","coordinates":[longitude,latitude]})';
        }
      } catch (e) {
        return 'Format de coordonnées invalide. Utilisez le format GeoJSON Point';
      }
    }
    
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
      await villagesAPI.create(formData);

      navigate('/villages', { state: { message: 'Village créé avec succès' } });
    } catch (err) {
      setError('Erreur lors de la création du village');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mb={4}>
        <Typography variant="h4">Créer un nouveau village</Typography>
        <Typography variant="body2" color="text.secondary">
          Libellé, coordonnées et pays de référence
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
                label="Libellé du village"
                value={formData.Lib_village}
                onChange={(e) => setFormData(p => ({ ...p, Lib_village: e.target.value }))}
                disabled={isLoading}
                helperText="Nom officiel du village"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                required
                fullWidth
                label="Pays"
                value={formData.PaysId}
                onChange={(e) => setFormData(p => ({ ...p, PaysId: e.target.value }))}
                disabled={isLoading}
              >
                <MenuItem value="">-- Sélectionner un pays --</MenuItem>
                {Array.isArray(pays) && pays.map(paysItem => (
                  <MenuItem key={paysItem._id} value={paysItem._id}>
                    {paysItem.libPays?._value || paysItem.Lib_pays || 'Pays sans nom'}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coordonnées (GeoJSON Point)"
                multiline
                rows={3}
                value={formData.Coordonnee}
                onChange={(e) => setFormData(p => ({ ...p, Coordonnee: e.target.value }))}
                disabled={isLoading}
                placeholder='{"type":"Point","coordinates":[-4.0235,5.3598]}'
                helperText="Format GeoJSON Point optionnel. Exemple: longitude, latitude"
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button 
                variant="outlined" 
                startIcon={<CancelIcon />} 
                onClick={() => navigate('/villages')} 
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
                {isLoading ? 'Enregistrement...' : 'Créer le village'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateVillagePage;