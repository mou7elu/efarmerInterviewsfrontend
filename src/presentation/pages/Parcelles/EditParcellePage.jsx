/**
 * Edit Parcelle Page
 * Page d'édition d'une parcelle existante
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Alert
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
  Terrain as TerrainIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, questionnairesAPI, interviewsAPI, usersAPI, villagesAPI, zonesInterditesAPI, profilesAPI, paysAPI, regionsAPI, departementsAPI, sousprefsAPI, parcellesAPI, handleApiError } from '../../../services/api.js';
import { getValue, getSafeId, getProducteurNomComplet, getProducteurCode, extractDataFromApiResponse, transformParcelleDataForAPI } from '../../../shared/utils/entityHelpers.js';

const EditParcellePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Données de référence
  const [producteurs, setProducteurs] = useState([]);

  // Données du formulaire basées sur le vrai modèle Parcelle
  const [formData, setFormData] = useState({
    // Champs du modèle Parcelle
    Superficie: '',           // Superficie selon les coordonnées GPS (Number, required)
    ProducteurId: '',         // Identifiant du producteur (ObjectId, required)
    Code: ''                  // Code de la parcelle (String, optional)
  });

  // Données factices
  const mockParcelle = {
    _id: id,
    Code: 'PARC001',
    Superficie: 2.5,
    ProducteurId: '1'
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les données en parallèle
      const [parcelleData, producteursData] = await Promise.all([
        parcellesAPI.getById(id),
        producteursAPI.getAll()
      ]);
      
      // Extraire les données
      const producteursArray = extractDataFromApiResponse(producteursData);
      let parcelle = extractDataFromApiResponse(parcelleData);
      console.log('ParcelleData brut:', parcelleData);
      console.log('Parcelle extraite:', parcelle);
      console.log('Producteurs chargés:', producteursArray);

      setProducteurs(producteursArray);

      // Si parcelle est un tableau, prendre le premier élément non vide
      if (Array.isArray(parcelle)) {
        parcelle = parcelle.find(p => p && p.Superficie !== undefined && p.Code !== undefined && p.ProducteurId !== undefined);
      }

      // Adapter les données de la parcelle pour le formulaire
      if (parcelle) {
        setFormData({
          Superficie: parcelle.Superficie || parcelle.superficie || '',
          ProducteurId: parcelle.ProducteurId?.$oid || parcelle.producteurId || getValue(parcelle.ProducteurId) || '',
          Code: parcelle.Code || parcelle.code || ''
        });
      } else {
        console.warn('Aucune parcelle trouvée pour l’édition.');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setErrors({ load: 'Erreur lors du chargement des données' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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

    setSaving(true);
    try {
      // Adapter les données pour l'API backend
      const apiData = transformParcelleDataForAPI(formData, producteurs);
      
      console.log('Données envoyées à l\'API pour mise à jour:', apiData);
      
      // Mettre à jour via l'API
      const response = await parcellesAPI.update(id, apiData);
      console.log('Mise à jour réussie:', response);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate(`/parcelles/${id}`, { 
        state: { message: 'Parcelle mise à jour avec succès!' }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setErrors({ submit: 'Erreur lors de la mise à jour de la parcelle' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement de la parcelle..." />;
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
          <Link color="inherit" href={`/parcelles/${id}`}>
            {formData.Code || `Parcelle ${id}`}
          </Link>
          <Typography color="text.primary">Modifier</Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Modifier la parcelle
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/parcelles/${id}`)}
          >
            Retour au détail
          </Button>
        </Box>
      </Box>

      {/* Affichage des erreurs */}
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
        </Alert>
      )}

      {errors.load && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.load}
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
              onClick={() => navigate(`/parcelles/${id}`)}
            >
              Annuler
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditParcellePage;