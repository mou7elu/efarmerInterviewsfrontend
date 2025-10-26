/**
 * Interview Detail Page
 * Page de détail d'une session de réponses
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,

  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  Divider,
  Breadcrumbs,
  Link,
  IconButton,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
  Person as PersonIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { interviewsAPI, producteursAPI, questionnairesAPI, questionsAPI } from '../../../services/api.js';

const InterviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [reponse, setReponse] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage] = useState(location.state?.message || '');
  const [producteurs, setProducteurs] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Charger la réponse, les producteurs et les questionnaires
      const [reponseData, producteursData, questionnairesData] = await Promise.all([
        interviewsAPI.getById(id),
        producteursAPI.getAll(),
        questionnairesAPI.getAll()
      ]);
      setReponse(reponseData);
      setProducteurs(producteursData.data?.items || producteursData.data || producteursData || []);
      setQuestionnaires(questionnairesData.data || questionnairesData || []);

      // Charger les questions du questionnaire associé à la réponse
      if (reponseData.questionnaireId) {
        try {
          const questionsData = await questionnairesAPI.getById(reponseData.questionnaireId);
          if (questionsData.questions) {
            setQuestions(questionsData.questions);
          } else {
            const allQuestions = await questionsAPI.getAll({ questionnaireId: reponseData.questionnaireId });
            setQuestions(allQuestions.data || allQuestions || []);
          }
        } catch (err) {
          console.error('Erreur chargement questions:', err);
          setQuestions([]);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer cette session de réponses ?')) {
      try {
        // Supprimer via l'API
        await interviewsAPI.delete(id);
        console.log('Suppression réussie:', id);
        navigate('/interviews', {
          state: { message: 'Session de réponses supprimée avec succès' }
        });
      } catch (error) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const getProducteurInfo = (producteurId) => {
    if (!Array.isArray(producteurs)) return null;
    return producteurs.find(p => p._id === producteurId);
  };

  const getQuestionnaireInfo = (questionnaireId) => {
    if (!Array.isArray(questionnaires)) return null;
    return questionnaires.find(q => q._id === questionnaireId);
  };

  const getQuestionInfo = (questionId) => {
    return questions.find(q => q._id === questionId || q.id === questionId);
  };

  const formatReponseValue = (valeur, type) => {
    if (!valeur) return 'Non renseigné';
    
    switch (type) {
      case 'oui_non':
        return valeur === 'oui' ? 'Oui' : 'Non';
      case 'nombre':
        return `${valeur}`;
      default:
        return valeur;
    }
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des détails..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!reponse) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning" sx={{ mt: 4 }}>
          Session de réponses non trouvée.
        </Alert>
      </Container>
    );
  }

  const producteur = getProducteurInfo(reponse.exploitantId);
  const questionnaire = getQuestionnaireInfo(reponse.questionnaireId);

  return (
    <Container maxWidth="lg">
      {/* En-tête avec breadcrumbs */}
      <Box mb={4}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} mb={2}>
          <Link color="inherit" href="/dashboard">
            Agriculture
          </Link>
          <Link color="inherit" href="/interviews">
            Interviews
          </Link>
          <Typography color="text.primary">
            Réponse {id}
          </Typography>
        </Breadcrumbs>
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Détails de la session de réponses
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/interviews')}
              sx={{ mr: 2 }}
            >
              Retour à la liste
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/interviews/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Modifier
            </Button>
            <IconButton
              color="error"
              onClick={handleDelete}
              aria-label="Supprimer"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Informations du producteur */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6">Producteur</Typography>
              </Box>
              
              {producteur ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {producteur.Nom} {producteur.Prenom}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Code: {producteur.code ? producteur.code : 'Non renseigné'}
                  </Typography>
                  {producteur.Telephone1 && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Téléphone:</strong> {producteur.Telephone1}
                    </Typography>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/producteurs/${producteur._id}`)}
                    sx={{ mt: 1 }}
                  >
                    Voir le profil complet
                  </Button>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Producteur non trouvé (ID: {reponse.exploitantId})
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Informations du questionnaire */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2, bgcolor: 'success.main' }}>
                  <QuizIcon />
                </Avatar>
                <Typography variant="h6">Questionnaire</Typography>
              </Box>
              
              {questionnaire ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {questionnaire.titre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Version: {questionnaire.version}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {questionnaire.description}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/questionnaires/${questionnaire._id}`)}
                    sx={{ mt: 1 }}
                  >
                    Voir le questionnaire
                  </Button>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Questionnaire non trouvé (ID: {reponse.questionnaireId})
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Réponses détaillées */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ mr: 2, bgcolor: 'info.main' }}>
                  <AssignmentIcon />
                </Avatar>
                <Typography variant="h6">Réponses ({reponse.reponses.length})</Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {reponse.reponses.map((rep, index) => {
                const question = getQuestionInfo(rep.questionId);
                if (!question) return null;
                
                return (
                  <Box key={rep.questionId} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>Question {index + 1}:</strong> {question.texte}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Chip 
                        label={question.type} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Typography variant="body1">
                        <strong>Réponse:</strong> {formatReponseValue(rep.valeur, question.type)}
                      </Typography>
                    </Box>
                    {index < reponse.reponses.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        {/* Métadonnées */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Informations de session</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    ID de session
                  </Typography>
                  <Typography variant="body1">{reponse._id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date de création
                  </Typography>
                  <Typography variant="body1">
                    {new Date(reponse.createdAt).toLocaleString('fr-FR')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Dernière modification
                  </Typography>
                  <Typography variant="body1">
                    {new Date(reponse.updatedAt).toLocaleString('fr-FR')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Statut
                  </Typography>
                  <Chip 
                    label="Complète" 
                    color="success" 
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InterviewDetailPage;