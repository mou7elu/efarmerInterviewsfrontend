/**
 * Edit Village Page
 * Modifier un village existant (Lib_village, Coordonnee, PaysId)
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
import { villagesAPI, paysAPI } from '../../../services/api';

const EditVillagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Lib_village: '',
    Coordonnee: '',
    PaysId: ''
  });

  const [pays, setMockPays] = useState([]);



  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Charger les données en parallèle
        const [villageResponse, paysResponse] = await Promise.all([
          villagesAPI.getById(id),
          paysAPI.getAll()
        ]);
        
        const village = villageResponse.data || villageResponse;
        const paysData = paysResponse.data || paysResponse;
        
        setMockPays(paysData);
        setFormData({
          Lib_village: village.Lib_village || '',
          Coordonnee: village.Coordonnee || '',
          PaysId: village.PaysId || ''
        });
        
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Impossible de charger les données du village');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

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
      
      await villagesAPI.update(id, formData);
      navigate('/villages', { state: { message: 'Village modifié avec succès' } });
      
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setError('Erreur lors de la modification du village');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Container sx={{ mt: 6 }}><Typography>Chargement...</Typography></Container>;

  return (
    <Container maxWidth="sm">
      <Box mb={4}>
        <Typography variant="h4">Modifier le village</Typography>
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
                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditVillagePage;