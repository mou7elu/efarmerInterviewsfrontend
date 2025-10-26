/**
 * Create Zone Interdite Page
 * Formulaire de création d'une zone interdite (Lib_zi, Coordonnee, Sommeil, PaysId)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const CreateZoneInterditePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Lib_zi: '',
    Coordonnee: '',
    Sommeil: false,
    PaysId: ''
  });

  const [pays, setMockPays] = useState([]);

  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await zonesInterditesAPI.getAll();
      const data = response.data || response;
      
      setZones-interdites(data);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Charger pays (mock)
    setMockPays([
      { _id: '1', Lib_pays: 'Côte d\'Ivoire' },
      { _id: '2', Lib_pays: 'Ghana' },
      { _id: '3', Lib_pays: 'Burkina Faso' }
    ]);
  }, []);

  const validate = () => {
    if (!formData.Lib_zi.trim()) return 'Le libellé de la zone interdite est requis';
    if (!formData.PaysId) return 'Le pays est requis';
    
    // Validation optionnelle des coordonnées GeoJSON Polygon si renseignées
    if (formData.Coordonnee.trim()) {
      try {
        const coord = JSON.parse(formData.Coordonnee);
        if (coord.type !== 'Polygon' || !Array.isArray(coord.coordinates)) {
          return 'Les coordonnées doivent être un polygone GeoJSON valide (ex: {"type":"Polygon","coordinates":[[[lng,lat],[lng,lat],...]]})';
        }
      } catch (e) {
        return 'Format de coordonnées invalide. Utilisez le format GeoJSON Polygon';
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
      // TODO: appeler l'API pour créer la zone interdite
      await new Promise((r) => setTimeout(r, 700));

      navigate('/zones-interdites', { state: { message: 'Zone interdite créée avec succès' } });
    } catch (err) {
      setError('Erreur lors de la création de la zone interdite');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mb={4}>
        <Typography variant="h4">Créer une nouvelle zone interdite</Typography>
        <Typography variant="body2" color="text.secondary">
          Libellé, coordonnées, statut et pays de référence
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
                {pays.map(pays => (
                  <MenuItem key={pays._id} value={pays._id}>
                    {pays.Lib_pays}
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
                {isLoading ? 'Enregistrement...' : 'Créer la zone interdite'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateZoneInterditePage;