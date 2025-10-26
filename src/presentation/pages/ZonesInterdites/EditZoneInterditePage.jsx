/**
 * Edit Zone Interdite Page
 * Modifier une zone interdite existante (Lib_zi, Coordonnee, Sommeil, PaysId)
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
  Alert,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

import { zonesInterditesAPI, paysAPI, handleApiError } from '../../../services/api.js';

const EditZoneInterditePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Lib_zi: '',
    Coordonnee: '',
    Sommeil: false,
    PaysId: ''
  });

  const [pays, setPays] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Charger pays et zones en parallèle
        const [zonesResponse, paysResponse] = await Promise.all([
          zonesInterditesAPI.getAll(),
          paysAPI.getAll()
        ]);
        
        // Récupérer les données
        const zones = zonesResponse.data || zonesResponse;
        const paysData = paysResponse.data || paysResponse;
        
        // Trouver la zone à éditer
        const zone = zones.find(z => z._id === id || z.id === id);
        
        if (!zone) {
          setError('Zone interdite non trouvée');
          return;
        }

        // Initialiser le formulaire avec les données de la zone
        setFormData({
          Lib_zi: zone.Lib_zi || '',
          Coordonnee: zone.Coordonnee || '',
          Sommeil: zone.Sommeil || false,
          PaysId: zone.Pays?.id || ''
        });

        setPays(paysData);
        
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError(handleApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const validate = () => {
    if (!formData.Lib_zi.trim()) return 'Le libellé de la zone interdite est requis';
    if (!formData.PaysId) return 'Le pays est requis';
    
    // Validation optionnelle des coordonnées GeoJSON Polygon si renseignées
    if (formData.Coordonnee.trim()) {
      try {
        const coord = JSON.parse(formData.Coordonnee);
        if (coord.type !== 'Polygon' && coord.type !== 'FeatureCollection' || 
            (coord.type === 'Polygon' && !Array.isArray(coord.coordinates)) ||
            (coord.type === 'FeatureCollection' && !Array.isArray(coord.features))) {
          return 'Les coordonnées doivent être un polygone GeoJSON valide (ex: {"type":"Polygon","coordinates":[[[lng,lat],[lng,lat],...]]}) ou une FeatureCollection';
        }
      } catch (e) {
        return 'Format de coordonnées invalide. Utilisez le format GeoJSON Polygon ou FeatureCollection';
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

      // Appeler l'API pour mettre à jour
      await zonesInterditesAPI.update(id, {
        Lib_zi: formData.Lib_zi.trim(),
        Coordonnee: formData.Coordonnee.trim(),
        Sommeil: formData.Sommeil,
        PaysId: formData.PaysId
      });

      navigate('/zones-interdites', { 
        state: { message: 'Zone interdite modifiée avec succès' } 
      });
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mb={4}>
        <Typography variant="h4">Modifier la zone interdite</Typography>
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
                label="Libellé de la zone interdite"
                value={formData.Lib_zi}
                onChange={(e) => setFormData(p => ({ ...p, Lib_zi: e.target.value }))}
                disabled={isLoading}
                helperText="Nom ou description de la zone interdite"
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
                {pays.map(paysItem => (
                  <MenuItem key={paysItem._id} value={paysItem._id}>
                    {paysItem.libPays?._value || paysItem.libPays || paysItem._id}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coordonnées (GeoJSON Polygon)"
                multiline
                rows={4}
                value={formData.Coordonnee}
                onChange={(e) => setFormData(p => ({ ...p, Coordonnee: e.target.value }))}
                disabled={isLoading}
                placeholder='{"type":"Polygon","coordinates":[[[lng,lat],[lng,lat],[lng,lat],[lng,lat]]]}'
                helperText="Format GeoJSON Polygon optionnel. Définit les limites de la zone interdite"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.Sommeil}
                    onChange={(e) => setFormData(p => ({ ...p, Sommeil: e.target.checked }))}
                    disabled={isLoading}
                  />
                }
                label="Zone en sommeil (inactive)"
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                Une zone en sommeil n'est pas prise en compte dans les contrôles actifs
              </Typography>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button 
                variant="outlined" 
                startIcon={<CancelIcon />} 
                onClick={() => navigate('/zones-interdites')} 
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

export default EditZoneInterditePage;