/**
 * Create Parcelle Page
 * Page de création d'une nouvelle parcelle
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Alert,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
  Terrain as TerrainIcon,
  LocationOn as LocationIcon,
  Agriculture as AgricultureIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, questionnairesAPI, interviewsAPI, usersAPI, villagesAPI, zonesInterditesAPI, profilesAPI, paysAPI, regionsAPI, departementsAPI, sousprefsAPI, parcellesAPI, handleApiError } from '../../../services/api.js';
import { getValue, getSafeId, getProducteurNomComplet, getProducteurCode, extractDataFromApiResponse, transformParcelleDataForAPI } from '../../../shared/utils/entityHelpers.js';

const CreateParcellePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Données de référence
  const [producteurs, setProducteurs] = useState([]);

  // Données du formulaire basées sur le vrai modèle Parcelle
  const [formData, setFormData] = useState({
    // Champs du modèle Parcelle
  Superficie: '',           // Superficie selon les coordonnées GPS (Number, required)
  ProducteurId: location.state?.producteurId || '',  // Identifiant du producteur (ObjectId, required)
  Code: ''                  // Code de la parcelle (String, optional)
  });

  // Données de référence pour les producteurs (sera chargé depuis l'API)
  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      // Charger les producteurs depuis l'API
      const producteursData = await producteursAPI.getAll();
      const producteursArray = extractDataFromApiResponse(producteursData);
      
      console.log('Producteurs chargés:', producteursArray);
      setProducteurs(producteursArray);
    } catch (error) {
      console.error('Erreur lors du chargement des données de référence:', error);
      setProducteurs([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'ProducteurId' && value?.$oid ? value.$oid : value
    }));
    
    // Effacer l'erreur si le champ est maintenant valide
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Superficie || parseFloat(formData.Superficie) <= 0) {
      newErrors.Superficie = 'La superficie doit être supérieure à 0';
    }
    if (!formData.ProducteurId) newErrors.ProducteurId = 'Le producteur est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Adapter les données pour l'API backend
      const apiData = transformParcelleDataForAPI(formData, producteurs);
      
      console.log('Données envoyées à l\'API:', apiData);
      
      // Créer la parcelle via l'API
      const response = await parcellesAPI.create(apiData);
      console.log('Parcelle créée avec succès:', response);
      
      navigate('/parcelles', { 
        state: { message: 'Parcelle créée avec succès!' }
      });
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setErrors({ submit: handleApiError(error) });
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return <LoadingSpinner size={60} message="Création de la parcelle..." />;
  }

  return (
    <Container maxWidth="lg">
      {/* En-tête avec breadcrumbs */}
      <Box mb={4}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} mb={2}>
          <Link color="inherit" href="/dashboard">
            Agriculture
          </Link>
          <Link color="inherit" href="/parcelles">
            Parcelles
          </Link>
          <Typography color="text.primary">Nouvelle parcelle</Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Créer une nouvelle parcelle
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/parcelles')}
          >
            Retour à la liste
          </Button>
        </Box>
      </Box>

      {/* Affichage des erreurs */}
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
        </Alert>
      )}

      {/* Formulaire */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {/* Informations de la parcelle */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TerrainIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Informations de la parcelle</Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Code de la parcelle"
                    value={formData.Code}
                    onChange={(e) => handleInputChange('Code', e.target.value)}
                    placeholder="Ex: PARC001 (optionnel)"
                    helperText="Code d'identification unique de la parcelle"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Superficie (hectares) *"
                    type="number"
                    value={formData.Superficie}
                    onChange={(e) => handleInputChange('Superficie', e.target.value)}
                    error={!!errors.Superficie}
                    helperText={errors.Superficie || "Superficie selon les coordonnées GPS"}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.ProducteurId}>
                    <InputLabel>Producteur propriétaire *</InputLabel>
                    <Select
                      value={formData.ProducteurId}
                      onChange={(e) => handleInputChange('ProducteurId', e.target.value)}
                      label="Producteur propriétaire *"
                    >
                      {Array.isArray(producteurs) && producteurs.map((p) => (
                        <MenuItem key={getSafeId(p)} value={getSafeId(p)}>
                          <Box display="flex" alignItems="center">
                            <Box>
                              <Typography variant="subtitle2">
                                {getProducteurNomComplet(p)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Code: {getProducteurCode(p)}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.ProducteurId && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors.ProducteurId}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="outlined"
              onClick={() => navigate('/parcelles')}
            >
              Annuler
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer la parcelle'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateParcellePage;