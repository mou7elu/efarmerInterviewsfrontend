/**
 * Create Questionnaire Page
 * Page de création d'un nouveau questionnaire
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
  Quiz as QuizIcon,
  Description as DescriptionIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import { questionnairesAPI, handleApiError } from '../../../services/api.js';

const CreateQuestionnairePage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Données du formulaire basées sur le vrai modèle Questionnaire
  const [formData, setFormData] = useState({
    // Champs du modèle Questionnaire
    titre: '',           // String, required - Titre du questionnaire
    version: '1.0',      // String, default '1.0' - Version du questionnaire
    description: ''      // String, default '' - Description du questionnaire
  });

  const steps = [
    {
      label: 'Informations de base',
      description: 'Définir le titre et la version du questionnaire'
    },
    {
      label: 'Description',
      description: 'Ajouter une description détaillée'
    },
    {
      label: 'Validation',
      description: 'Vérifier et enregistrer le questionnaire'
    }
  ];

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
      case 0:
        if (!formData.titre.trim()) {
          newErrors.titre = 'Le titre est requis';
        } else if (formData.titre.length < 3) {
          newErrors.titre = 'Le titre doit contenir au moins 3 caractères';
        }
        if (!formData.version.trim()) {
          newErrors.version = 'La version est requise';
        }
        break;
      case 1:
        // La description est optionnelle, pas de validation requise
        break;
      case 2:
        // Validation finale
        if (!formData.titre.trim()) newErrors.titre = 'Le titre est requis';
        if (!formData.version.trim()) newErrors.version = 'La version est requise';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setSaving(true);
    try {
      // Créer le questionnaire via l'API
      const response = await questionnairesAPI.create(formData);
      console.log('Questionnaire créé avec succès:', response);
      
      navigate('/questionnaires', { 
        state: { message: 'Questionnaire créé avec succès!' }
      });
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setErrors({ submit: handleApiError(error) });
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre du questionnaire *"
                value={formData.titre}
                onChange={(e) => handleInputChange('titre', e.target.value)}
                error={!!errors.titre}
                helperText={errors.titre || "Nom du questionnaire (ex: Enquête Producteurs 2025)"}
                placeholder="Ex: Enquête de suivi des producteurs de café"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Version *"
                value={formData.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                error={!!errors.version}
                helperText={errors.version || "Version du questionnaire (ex: 1.0, 1.1, 2.0)"}
                placeholder="Ex: 1.0"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Description du questionnaire"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                helperText="Description détaillée du questionnaire et de ses objectifs (optionnel)"
                placeholder="Décrivez l'objectif de ce questionnaire, le public cible, les thématiques abordées..."
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Récapitulatif du questionnaire
              </Typography>
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Titre
                </Typography>
                <Typography variant="body1">
                  {formData.titre}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Version
                </Typography>
                <Typography variant="body1">
                  {formData.version}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {formData.description || 'Aucune description fournie'}
                </Typography>
              </Box>

              {errors.submit && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errors.submit}
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      {/* En-tête avec breadcrumbs */}
      <Box mb={4}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} mb={2}>
          <Link color="inherit" href="/dashboard">
            Agriculture
          </Link>
          <Link color="inherit" href="/questionnaires">
            Questionnaires
          </Link>
          <Typography color="text.primary">Nouveau questionnaire</Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Créer un nouveau questionnaire
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/questionnaires')}
          >
            Retour à la liste
          </Button>
        </Box>
      </Box>

      {/* Contenu principal */}
      <Paper sx={{ p: 3 }}>
        {/* Stepper */}
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ mt: 2, mb: 2 }}>
                  {renderStepContent(index)}
                </Box>
                
                {/* Boutons de navigation */}
                <Box sx={{ mb: 2 }}>
                  <div>
                    {index === steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={saving}
                        startIcon={<SaveIcon />}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {saving ? 'Création...' : 'Créer le questionnaire'}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Continuer
                      </Button>
                    )}
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Précédent
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {/* Message de succès final */}
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>
              Questionnaire créé avec succès ! Vous allez être redirigé vers la liste.
            </Typography>
          </Paper>
        )}
      </Paper>

      {/* Informations complémentaires */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <InfoIcon sx={{ mr: 1, color: 'info.main' }} />
            <Typography variant="h6">Informations utiles</Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            • Le <strong>titre</strong> est obligatoire et doit être descriptif
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • La <strong>version</strong> permet de suivre les évolutions du questionnaire
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • La <strong>description</strong> est optionnelle mais recommandée pour clarifier l'objectif
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Après création, vous pourrez ajouter des sections et des questions au questionnaire
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateQuestionnairePage;