/**
 * Create Producteur Page
 * Page de création d'un nouveau producteur
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
  Person as PersonIcon,
  Home as HomeIcon,
  Agriculture as AgricultureIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, handleApiError } from '../../../services/api.js';

const CreateProducteurPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});

  // Aucune donnée de référence externe nécessaire pour le modèle actuel

  // Données du formulaire basées sur le vrai modèle Producteur
  const [formData, setFormData] = useState({
    // Champs du modèle Producteur (noms attendus par l'API backend)
    code: '',              // Code du producteur
    telephone1: '',        // Téléphone 1 du producteur
    telephone2: '',        // Téléphone 2 du producteur
    nom: '',              // Nom du producteur
    prenom: '',           // Prénom du producteur
    dateNaissance: '',    // Date de naissance
    lieunais: '',         // Lieu de naissance
    photo: null,          // Photo du producteur (Buffer)
    signature: null,      // Signature du producteur (Buffer)
    genre: '',            // Genre du producteur (Number)
    sommeil: false        // Statut sommeil (Boolean)
  });

  const steps = ['Informations personnelles', 'Contact & Localisation', 'Photo & Signature'];

  // Options pour le genre
  const genres = [
    { value: 1, label: 'Homme' },
    { value: 2, label: 'Femme' }
  ];

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      // Charger les données de référence depuis l'API si nécessaire
      // Par exemple : pays, régions, etc.
      // const pays = await paysAPI.getAll();
      // const regions = await regionsAPI.getAll();
      console.log('Chargement des données de référence...');
    } catch (error) {
      console.error('Erreur lors du chargement des données de référence:', error);
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
        if (!formData.code.trim()) newErrors.code = 'Le code producteur est requis';
        if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
        if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
        if (!formData.genre) newErrors.genre = 'Le genre est requis';
        break;
      
      case 1: // Contact & Localisation
        if (!formData.telephone1.trim()) newErrors.telephone1 = 'Au moins un téléphone est requis';
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

    setLoading(true);
    try {
      // Debug: Afficher les données envoyées
      console.log('Données envoyées à l\'API:', formData);
      
      // Créer le producteur via l'API
      const response = await producteursAPI.create(formData);
      console.log('Producteur créé avec succès:', response);
      
      navigate('/producteurs', { 
        state: { message: 'Producteur créé avec succès!' }
      });
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setErrors({ submit: handleApiError(error) });
    } finally {
      setLoading(false);
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
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                error={!!errors.code}
                helperText={errors.code}
                placeholder="Ex: PROD001"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.genre}>
                <InputLabel>Genre *</InputLabel>
                <Select
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
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
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                error={!!errors.nom}
                helperText={errors.nom}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Prénom *"
                value={formData.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                error={!!errors.prenom}
                helperText={errors.prenom}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date de naissance"
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lieu de naissance"
                value={formData.lieunais}
                onChange={(e) => handleInputChange('lieunais', e.target.value)}
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
                value={formData.telephone1}
                onChange={(e) => handleInputChange('telephone1', e.target.value)}
                error={!!errors.telephone1}
                helperText={errors.telephone1}
                placeholder="Ex: +225 07 12 34 56 78"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone 2"
                value={formData.telephone2}
                onChange={(e) => handleInputChange('telephone2', e.target.value)}
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
                          handleInputChange('photo', event.target.result);
                        };
                        reader.readAsArrayBuffer(file);
                      }
                    }}
                  />
                  <label htmlFor="photo-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      {formData.photo ? 'Changer la photo' : 'Sélectionner une photo'}
                    </Button>
                  </label>
                  {formData.photo && (
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
                          handleInputChange('signature', event.target.result);
                        };
                        reader.readAsArrayBuffer(file);
                      }
                    }}
                  />
                  <label htmlFor="signature-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      {formData.signature ? 'Changer la signature' : 'Sélectionner une signature'}
                    </Button>
                  </label>
                  {formData.signature && (
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
    return <LoadingSpinner size={60} message="Création du producteur..." />;
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
          <Typography color="text.primary">Nouveau producteur</Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Créer un nouveau producteur
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/producteurs')}
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
              disabled={loading}
            >
              Créer le producteur
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

export default CreateProducteurPage;