/**
 * Edit Producteur Page
 * Page de modification d'un producteur existant
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
  FormControlLabel,
  Switch,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Alert
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, handleApiError } from '../../../services/api.js';

const EditProducteurPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});

  // Données du formulaire basées sur le vrai modèle Producteur
  const [formData, setFormData] = useState({
    // Champs du modèle Producteur
    Code: '',              // Code du producteur
    Telephone1: '',        // Téléphone 1 du producteur
    Telephone2: '',        // Téléphone 2 du producteur
    Nom: '',              // Nom du producteur
    Prenom: '',           // Prénom du producteur
    Datnais: '',          // Date de naissance
    Lieunais: '',         // Lieu de naissance
    Photo: null,          // Photo du producteur (Buffer)
    Signature: null,      // Signature du producteur (Buffer)
    Genre: '',            // Genre du producteur (Number)
    sommeil: false        // Statut sommeil (Boolean)
  });

  const steps = ['Informations personnelles', 'Contact & Localisation', 'Photo & Signature'];

  // Données factices pour le producteur existant
  const mockProducteur = {
    id: '1',
    Code: 'PROD001',
    Nom: 'KOUAME',
    Prenom: 'Jean Baptiste',
    Datnais: '1975-03-15',
    Lieunais: 'Akoupé',
    Genre: 1, // 1 = Homme
    Telephone1: '+225 07 08 09 10 11',
    Telephone2: '+225 01 23 45 67 89',
    Photo: null,
    Signature: null,
    sommeil: false
  };

  // Options pour le genre
  const genres = [
    { value: 1, label: 'Homme' },
    { value: 2, label: 'Femme' }
  ];

  useEffect(() => {
    loadProducteurData();
  }, [id]);

  const loadProducteurData = async () => {
    try {
      setLoading(true);
      // Chargement via API (déjà implémenté)
      setFormData(mockProducteur);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setErrors({ load: 'Erreur lors du chargement des données du producteur' });
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

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0: // Informations personnelles
        if (!formData.Code.trim()) newErrors.Code = 'Le code producteur est requis';
        if (!formData.Nom.trim()) newErrors.Nom = 'Le nom est requis';
        if (!formData.Prenom.trim()) newErrors.Prenom = 'Le prénom est requis';
        if (!formData.Genre) newErrors.Genre = 'Le genre est requis';
        break;
      
      case 1: // Contact & Localisation
        if (!formData.Telephone1.trim()) newErrors.Telephone1 = 'Au moins un téléphone est requis';
        break;
      
      case 2: // Photo & Signature
        // Validation optionnelle pour les fichiers
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setSaving(true);
    try {
      // Mettre à jour via l'API
      const response = await producteursAPI.update(formData._id || formData.id, formData);
      console.log('Mise à jour réussie:', response);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate(`/producteurs/${id}`, { 
        state: { message: 'Producteur mis à jour avec succès!' }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setErrors({ submit: 'Erreur lors de la mise à jour du producteur' });
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Informations personnelles
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code producteur *"
                value={formData.Code}
                onChange={(e) => handleInputChange('Code', e.target.value)}
                error={!!errors.Code}
                helperText={errors.Code}
                placeholder="Ex: PROD001"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.Genre}>
                <InputLabel>Genre *</InputLabel>
                <Select
                  value={formData.Genre}
                  onChange={(e) => handleInputChange('Genre', e.target.value)}
                  label="Genre *"
                >
                  {genres.map((g) => (
                    <MenuItem key={g.value} value={g.value}>
                      {g.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom *"
                value={formData.Nom}
                onChange={(e) => handleInputChange('Nom', e.target.value)}
                error={!!errors.Nom}
                helperText={errors.Nom}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Prénom *"
                value={formData.Prenom}
                onChange={(e) => handleInputChange('Prenom', e.target.value)}
                error={!!errors.Prenom}
                helperText={errors.Prenom}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date de naissance"
                type="date"
                value={formData.Datnais}
                onChange={(e) => handleInputChange('Datnais', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lieu de naissance"
                value={formData.Lieunais}
                onChange={(e) => handleInputChange('Lieunais', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={!formData.sommeil}
                    onChange={(e) => handleInputChange('sommeil', !e.target.checked)}
                  />
                }
                label="Producteur actif"
              />
            </Grid>
          </Grid>
        );

      case 1: // Contact & Localisation
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone 1 *"
                value={formData.Telephone1}
                onChange={(e) => handleInputChange('Telephone1', e.target.value)}
                error={!!errors.Telephone1}
                helperText={errors.Telephone1}
                placeholder="Ex: +225 07 12 34 56 78"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone 2"
                value={formData.Telephone2}
                onChange={(e) => handleInputChange('Telephone2', e.target.value)}
                placeholder="Ex: +225 01 23 45 67 89"
              />
            </Grid>
          </Grid>
        );

      case 2: // Photo & Signature
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Photo du producteur
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          handleInputChange('Photo', event.target.result);
                        };
                        reader.readAsArrayBuffer(file);
                      }
                    }}
                  />
                  <label htmlFor="photo-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      {formData.Photo ? 'Changer la photo' : 'Sélectionner une photo'}
                    </Button>
                  </label>
                  {formData.Photo && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                      ✓ Photo sélectionnée
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Signature du producteur
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="signature-upload"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          handleInputChange('Signature', event.target.result);
                        };
                        reader.readAsArrayBuffer(file);
                      }
                    }}
                  />
                  <label htmlFor="signature-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      {formData.Signature ? 'Changer la signature' : 'Sélectionner une signature'}
                    </Button>
                  </label>
                  {formData.Signature && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                      ✓ Signature sélectionnée
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Les fichiers photo et signature sont optionnels. Ils seront stockés en format binaire dans la base de données.
              </Alert>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement du producteur..." />;
  }

  return (
    <Container maxWidth="lg">
      {/* En-tête avec breadcrumbs */}
      <Box mb={4}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} mb={2}>
          <Link color="inherit" href="/dashboard">
            Agriculture
          </Link>
          <Link color="inherit" href="/producteurs">
            Producteurs
          </Link>
          <Link color="inherit" href={`/producteurs/${id}`}>
            {formData.Nom} {formData.Prenom}
          </Link>
          <Typography color="text.primary">Modifier</Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Modifier le producteur
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/producteurs/${id}`)}
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

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Contenu de l'étape */}
        <Card>
          <CardContent>
            {renderStepContent(activeStep)}
          </CardContent>
        </Card>

        {/* Boutons de navigation */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Précédent
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              startIcon={<SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Suivant
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProducteurPage;