/**
 * Questionnaire Detail Page
 * Page de détail d'un questionnaire avec questions et logique
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  Chip,
  Button,
  Alert,
  Divider,
  Breadcrumbs,
  Link,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { questionnairesAPI, handleApiError } from '../../../services/api.js';
import { getValue, getSafeId, extractDataFromApiResponse } from '../../../shared/utils/entityHelpers.js';

// Composant pour un onglet
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const QuestionnaireDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  useEffect(() => {
    loadQuestionnaireData();
  }, [id]);

  const loadQuestionnaireData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Chargement du questionnaire ID:', id);
      const response = await questionnairesAPI.getById(id);
      console.log('Réponse API questionnaire:', response);
      
      const questionnaireData = extractDataFromApiResponse(response);
      console.log('Questionnaire extrait:', questionnaireData);
      
      if (!questionnaireData) {
        setError('Questionnaire non trouvé');
        return;
      }
      
      setQuestionnaire(questionnaireData);
    } catch (error) {
      console.error('Erreur lors du chargement du questionnaire:', error);
      setError(handleApiError(error, 'Erreur lors du chargement du questionnaire'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement du questionnaire..." />;
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!questionnaire) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 4 }}>
          Questionnaire non trouvé
        </Alert>
      </Container>
    );
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
          <Typography color="text.primary">{getValue(questionnaire?.titre)}</Typography>
        </Breadcrumbs>
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
      </Box>

      {/* En-tête du questionnaire */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <QuizIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h4" component="h1">
                  {getValue(questionnaire?.titre)}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Version {getValue(questionnaire?.version)}
                </Typography>
              </Box>
            </Box>
            
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <Chip
                label="Questionnaire"
                color="primary"
                variant="filled"
              />
            </Box>
          </Box>
          
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/questionnaires')}
            >
              Retour
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/questionnaires/${getSafeId(questionnaire)}/edit`)}
              sx={{ ml: 1 }}
            >
              Modifier
            </Button>
            <IconButton
              color="error"
              onClick={() => {
                if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer ce questionnaire ?')) {
                  navigate('/questionnaires', {
                    state: { message: 'Questionnaire supprimé avec succès' }
                  });
                }
              }}
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Statistiques rapides */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Titre</Typography>
                <Typography variant="h4" sx={{ fontSize: '1.2rem' }}>
                  {getValue(questionnaire?.titre)}
                </Typography>
                <Typography variant="body2">du questionnaire</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Version</Typography>
                <Typography variant="h4">{getValue(questionnaire?.version)}</Typography>
                <Typography variant="body2">actuelle</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Description</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {getValue(questionnaire?.description) || 'Aucune description'}
                </Typography>
                <Typography variant="body2">fournie</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Onglets de détails */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<AssignmentIcon />} label="Informations générales" />
          <Tab icon={<SettingsIcon />} label="Détails du modèle" />
        </Tabs>

        {/* Informations générales */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Informations du questionnaire
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" justifyContent="space-between" py={1}>
                        <Typography><strong>Titre :</strong></Typography>
                        <Typography>{getValue(questionnaire?.titre)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" py={1}>
                        <Typography><strong>Version :</strong></Typography>
                        <Typography>{getValue(questionnaire?.version)}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        <strong>Description :</strong>
                      </Typography>
                      <Typography paragraph>
                        {getValue(questionnaire?.description) || 'Aucune description fournie'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Détails du modèle */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Structure du modèle Questionnaire
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Ce questionnaire utilise le modèle de base avec les champs suivants :
                  </Typography>
                  
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" paragraph>
                      • <strong>titre</strong> : String (obligatoire) - Titre du questionnaire
                    </Typography>
                    <Typography variant="body2" paragraph>
                      • <strong>version</strong> : String (défaut: "1.0") - Version du questionnaire
                    </Typography>
                    <Typography variant="body2">
                      • <strong>description</strong> : String (défaut: "") - Description du questionnaire
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    Valeurs actuelles de ce questionnaire :
                  </Typography>
                  
                  <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1, mt: 1 }}>
                    <Typography variant="body2" paragraph>
                      <strong>Titre :</strong> "{getValue(questionnaire?.titre)}"
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Version :</strong> "{getValue(questionnaire?.version)}"
                    </Typography>
                    <Typography variant="body2">
                      <strong>Description :</strong> "{getValue(questionnaire?.description) || '(vide)'}"
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default QuestionnaireDetailPage;