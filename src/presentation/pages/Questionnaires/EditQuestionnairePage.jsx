/**
 * Edit Questionnaire Page
 * Page d'édition d'un questionnaire existant
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
  Quiz as QuizIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { questionnairesAPI, handleApiError } from '../../../services/api.js';
import { getValue, getSafeId, extractDataFromApiResponse } from '../../../shared/utils/entityHelpers.js';

const EditQuestionnairePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Données du formulaire basées sur le vrai modèle Questionnaire
  const [formData, setFormData] = useState({
    // Champs du modèle Questionnaire
    titre: '',           // String, required - Titre du questionnaire
    version: '1.0',      // String, default '1.0' - Version du questionnaire  
    description: ''      // String, default '' - Description du questionnaire
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setErrors({});
      
      console.log('Chargement du questionnaire pour édition, ID:', id);
      const response = await questionnairesAPI.getById(id);
      console.log('Réponse API questionnaire:', response);
      
      const questionnaireData = extractDataFromApiResponse(response);
      console.log('Questionnaire extrait:', questionnaireData);
      
      if (!questionnaireData) {
        setErrors({ load: 'Questionnaire non trouvé' });
        return;
      }
      
      // Remplir le formulaire avec les données réelles, en utilisant getValue pour gérer les objets Libelle
      setFormData({
        _id: getSafeId(questionnaireData),
        titre: getValue(questionnaireData.titre) || '',
        version: getValue(questionnaireData.version) || '1.0',
        description: getValue(questionnaireData.description) || ''
      });
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setErrors({ load: handleApiError(error, 'Erreur lors du chargement du questionnaire') });
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

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    } else if (formData.titre.length < 3) {
      newErrors.titre = 'Le titre doit contenir au moins 3 caractères';
    }
    if (!formData.version.trim()) newErrors.version = 'La version est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    try {
      console.log('Données à envoyer:', formData);
      
      // Préparer les données pour l'API (exclure l'_id des données envoyées)
      const updateData = {
        titre: formData.titre,
        version: formData.version,
        description: formData.description
      };
      
      const response = await questionnairesAPI.update(formData._id, updateData);
      console.log('Mise à jour réussie:', response);
      
      navigate(`/questionnaires/${id}`, { 
        state: { message: 'Questionnaire mis à jour avec succès!' }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setErrors({ submit: handleApiError(error, 'Erreur lors de la mise à jour du questionnaire') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement du questionnaire..." />;
  }

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
          <Link color="inherit" href={`/questionnaires/${id}`}>
            {formData.titre || 'Questionnaire'}
          </Link>
          <Typography color="text.primary">Modifier</Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Modifier le questionnaire
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/questionnaires/${id}`)}
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

      <form onSubmit={handleSubmit}>
        {/* Informations générales */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <QuizIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Informations générales</Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Titre du questionnaire *"
                  value={formData.titre}
                  onChange={(e) => handleInputChange('titre', e.target.value)}
                  error={!!errors.titre}
                  helperText={errors.titre || "Nom du questionnaire"}
                  placeholder="Ex: Enquête Agricole - Cacao 2024"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Version *"
                  value={formData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  error={!!errors.version}
                  helperText={errors.version || "Version du questionnaire"}
                  placeholder="Ex: 1.0, 2.1"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  helperText="Description du questionnaire (optionnel)"
                  placeholder="Description du questionnaire et de ses objectifs..."
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Divider sx={{ my: 3 }} />

        {/* Informations complémentaires */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <InfoIcon sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="h6">Informations sur le modèle</Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Ce questionnaire utilise le modèle de base avec les champs suivants :
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • <strong>Titre</strong> : Nom du questionnaire (obligatoire)
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • <strong>Version</strong> : Version du questionnaire (obligatoire, défaut: 1.0)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Description</strong> : Description du questionnaire (optionnel)
            </Typography>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/questionnaires/${id}`)}
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
    </Container>
  );
};

export default EditQuestionnairePage;