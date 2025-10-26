/**
 * Edit Interview Page
 * Page d'édition d'une session de réponses existante
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
  MenuItem,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  NavigateNext as NavigateNextIcon 
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, questionnairesAPI, interviewsAPI, questionsAPI } from '../../../services/api.js';

const EditInterviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Données du formulaire basées sur le vrai modèle Reponses
  const [formData, setFormData] = useState({
    // Champs du modèle Reponses
    exploitantId: '',        // ObjectId, ref 'Producteur', required
    questionnaireId: '',     // ObjectId, ref 'Questionnaire', required
    reponses: []            // Array de {questionId: ObjectId, valeur: Mixed}
  });

  // State pour stocker les questions du questionnaire
  const [questions, setQuestions] = useState([]);

  const [errors, setErrors] = useState({});
  const [producteurs, setProducteurs] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);

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
      setFormData(reponseData);
      setProducteurs(producteursData.data?.items || producteursData.data || producteursData || []);
      setQuestionnaires(questionnairesData.data || questionnairesData || []);

      // Charger les questions du questionnaire associé à la réponse
      if (reponseData.questionnaireId) {
        try {
          const questionsData = await questionnairesAPI.getById(reponseData.questionnaireId);
          // Si le questionnaire contient un tableau de questions
          if (questionsData.questions) {
            setQuestions(questionsData.questions);
          } else {
            // Sinon, charger toutes les questions via questionsAPI avec le param questionnaireId
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
      setErrors({ load: 'Erreur lors du chargement des données' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.exploitantId) {
      newErrors.exploitantId = 'Le producteur est requis';
    }
    
    if (!formData.questionnaireId) {
      newErrors.questionnaireId = 'Le questionnaire est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReponseChange = (questionId, valeur) => {
    setFormData(prev => ({
      ...prev,
      reponses: prev.reponses.map(r => 
        r.questionId === questionId 
          ? { ...r, valeur }
          : r
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Mettre à jour via l'API
      const response = await interviewsAPI.update(formData._id || formData.id, formData);
      console.log('Mise à jour réussie:', response);
      
      // Simulation d'attente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate(`/interviews/${id}`, { 
        state: { message: 'Réponses mises à jour avec succès!' }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setErrors({ submit: 'Erreur lors de la mise à jour des réponses' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/interviews/${id}`);
  };

  const getProducteurInfo = (producteurId) => {
    if (!Array.isArray(producteurs)) return null;
    return producteurs.find(p => p._id === producteurId);
  };

  const getQuestionnaireInfo = (questionnaireId) => {
    if (!Array.isArray(questionnaires)) return null;
    return questionnaires.find(q => q._id === questionnaireId);
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des données..." />;
  }

  return (
    <Container maxWidth="md">
      {/* En-tête avec breadcrumbs */}
      <Box mb={4}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} mb={2}>
          <Link color="inherit" href="/dashboard">
            Agriculture
          </Link>
          <Link color="inherit" href="/interviews">
            Interviews
          </Link>
          <Link color="inherit" href={`/interviews/${id}`}>
            Réponse {id}
          </Link>
          <Typography color="text.primary">Modifier</Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Modifier les réponses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Mettre à jour la session de réponses du producteur
        </Typography>
      </Box>

      {errors.load && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.load}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 4 }}>
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Informations de base (lecture seule) */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations de base
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Producteur (Exploitant)"
                value={(() => {
                  const producteur = getProducteurInfo(formData.exploitantId);
                  if (!producteur) return 'Non trouvé';
                  const nom = producteur.nom?._value || producteur.nom || '';
                  const prenom = producteur.prenom?._value || producteur.prenom || '';
                  const code = producteur.code ? producteur.code : 'Non renseigné';
                  return `${nom} ${prenom} (${code})`;
                })()}
                disabled
                helperText="Le producteur ne peut pas être modifié"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Questionnaire"
                value={(() => {
                  const questionnaire = getQuestionnaireInfo(formData.questionnaireId);
                  return questionnaire ? `${questionnaire.titre} (v${questionnaire.version})` : 'Non trouvé';
                })()}
                disabled
                helperText="Le questionnaire ne peut pas être modifié"
              />
            </Grid>

            {/* Section des réponses */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Réponses au questionnaire
              </Typography>
            </Grid>
            
            {formData.reponses.map((reponse, index) => {
              const question = questions.find(q => q._id === reponse.questionId || q.id === reponse.questionId);
              if (!question) return null;
              
              return (
                <Grid item xs={12} key={question._id}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Question {index + 1}: {question.titre || question.texte || 'Sans libellé'}
                    </Typography>
                    
                    {question.type === 'oui_non' ? (
                      <TextField
                        fullWidth
                        select
                        value={reponse.valeur}
                        onChange={(e) => handleReponseChange(question._id, e.target.value)}
                        disabled={isLoading}
                        size="small"
                      >
                        <MenuItem value="">-- Sélectionner --</MenuItem>
                        <MenuItem value="oui">Oui</MenuItem>
                        <MenuItem value="non">Non</MenuItem>
                      </TextField>
                    ) : question.type === 'nombre' ? (
                      <TextField
                        fullWidth
                        type="number"
                        value={reponse.valeur}
                        onChange={(e) => handleReponseChange(question._id, e.target.value)}
                        disabled={isLoading}
                        size="small"
                        placeholder="Entrez un nombre"
                      />
                    ) : (
                      <TextField
                        fullWidth
                        value={reponse.valeur}
                        onChange={(e) => handleReponseChange(question._id, e.target.value)}
                        disabled={isLoading}
                        size="small"
                        placeholder="Entrez votre réponse"
                        multiline={question.type === 'texte'}
                        rows={question.type === 'texte' ? 2 : 1}
                      />
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* Actions */}
          <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={isLoading}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditInterviewPage;