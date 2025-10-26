/**
 * Edit District Page
 * Modifier un district existant (Lib_district, Sommeil, PaysId)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { districtAPI, paysAPI } from '../../../services/api';
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

const EditDistrictPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Lib_district: '',
    Sommeil: false,
    PaysId: ''
  });

  const [pays, setPays] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Charger le district et les pays en parallèle
        const [districtResponse, paysResponse] = await Promise.all([
          districtAPI.getById(id),
          paysAPI.getAll()
        ]);
        
        const districtData = districtResponse.data || districtResponse;
        const paysData = paysResponse.data || paysResponse;
        const paysList = paysData.items || paysData || [];
        console.log(paysList);
        // Extraire l'ID du pays si c'est un objet
        const paysId = districtData.PaysId && typeof districtData.PaysId === 'object' 
          ? districtData.PaysId._id 
          : districtData.PaysId;
        
        setFormData({
          ...districtData,
          PaysId: paysId || ''
        });
        setPays(paysList);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger le district');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const validate = () => {
    if (!formData.Lib_district.trim()) return 'Le libellé du district est requis';
    if (!formData.PaysId) return 'Le pays est requis';
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
      
      await districtAPI.update(id, formData);
      navigate('/districts', { state: { message: 'District modifié avec succès' } });
    } catch (err) {
      console.error('Erreur lors de la modification du district:', err);
      setError('Erreur lors de la modification du district');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Container sx={{ mt: 6 }}><Typography>Chargement...</Typography></Container>;

  return (
    <Container maxWidth="sm">
      <Box mb={4}>
        <Typography variant="h4">Modifier le district</Typography>
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
                label="Libellé du district"
                value={formData.Lib_district}
                onChange={(e) => setFormData(p => ({ ...p, Lib_district: e.target.value }))}
                disabled={isLoading}
                helperText="Nom officiel du district"
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
                    {paysItem.libPays?._value || 'Pays inconnu'}
                  </MenuItem>
                ))}
              </TextField>
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
                label="District en sommeil (inactif)"
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                Un district en sommeil n'apparaîtra pas dans les sélections par défaut
              </Typography>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button 
                variant="outlined" 
                startIcon={<CancelIcon />} 
                onClick={() => navigate('/districts')} 
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

export default EditDistrictPage;