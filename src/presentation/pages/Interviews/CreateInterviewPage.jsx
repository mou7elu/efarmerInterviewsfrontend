/**
 * Create Interview Page
 * Page de création d'un nouvel entretien
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
  MenuItem,
  CircularProgress
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { interviewsAPI, producteursAPI, questionnairesAPI, questionsAPI, handleApiError } from '../../../services/api.js';

const CreateInterviewPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [producteurs, setProducteurs] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [questions, setQuestions] = useState([]);
  
  // Données du formulaire basées sur le vrai modèle Reponses
  const [formData, setFormData] = useState({
    // Champs du modèle Reponses
    exploitantId: '',        // ObjectId, ref 'Producteur', required
    questionnaireId: '',     // ObjectId, ref 'Questionnaire', required
    reponses: []            // Array de {questionId: ObjectId, valeur: Mixed}
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger producteurs et questionnaires en parallèle
      const [producteursResponse, questionnairesResponse] = await Promise.all([
        producteursAPI.getAll(),
        questionnairesAPI.getAll()
      ]);
      
      // Extraire les données selon la structure de réponse de l'API
      const producteursData = producteursResponse.data?.items || producteursResponse.data || producteursResponse || [];
      const questionnairesData = questionnairesResponse.value || questionnairesResponse.data || questionnairesResponse || [];
      
      setProducteurs(Array.isArray(producteursData) ? producteursData : []);
      setQuestionnaires(Array.isArray(questionnairesData) ? questionnairesData : []);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setErrors({ load: handleApiError(error) });
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

  const handleQuestionnaireChange = async (questionnaireId) => {
    try {
      // Charger les questions du questionnaire sélectionné
      const questionsResponse = await questionsAPI.getAll({ questionnaireId });
      const questionsData = questionsResponse.value || questionsResponse.data || questionsResponse || [];
      
      // Vérifier que questionsData est un tableau
      const questionsArray = Array.isArray(questionsData) ? questionsData : [];
      setQuestions(questionsArray);
      
      setFormData(prev => ({
        ...prev,
        questionnaireId,
        reponses: questionsArray.map(q => ({
          questionId: q._id,
          valeur: ''
        }))
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des questions:', error);
      setErrors({ questions: handleApiError(error) });
    }
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
      // Debug log du payload envoyé
      console.log('Payload envoyé à l\'API interviews:', formData);
      // Créer la réponse d'interview via l'API
      await interviewsAPI.create(formData);
      navigate('/interviews', {
        state: { message: "Réponses d'interview enregistrées avec succès!" }
      });
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setErrors({ submit: handleApiError(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/interviews');
  };

  return (
    <Container maxWidth="md">
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nouveau questionnaire de réponses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Créer une nouvelle session de réponses pour un producteur
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4 }}>
        {errors.submit && (
          <Box sx={{ mb: 3 }}>
            <Typography color="error" variant="body2">
              {errors.submit}
            </Typography>
          </Box>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Sélection du producteur */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations de base
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                name="exploitantId"
                label="Producteur (Exploitant)"
                value={formData.exploitantId}
                onChange={(e) => setFormData(prev => ({ ...prev, exploitantId: e.target.value }))}
                error={!!errors.exploitantId}
                helperText={errors.exploitantId || "Sélectionnez le producteur à interviewer"}
                disabled={isLoading}
              >
                {producteurs.map((producteur) => (
                  <MenuItem key={producteur._id} value={producteur._id}>
                    {producteur.nom?._value || producteur.nom || producteur.Nom} {producteur.prenom?._value || producteur.prenom || producteur.Prenom} ({producteur.code || producteur.Code})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                name="questionnaireId"
                label="Questionnaire"
                value={formData.questionnaireId}
                onChange={(e) => handleQuestionnaireChange(e.target.value)}
                error={!!errors.questionnaireId}
                helperText={errors.questionnaireId || "Choisissez le questionnaire à utiliser"}
                disabled={isLoading}
              >
                {questionnaires.map((questionnaire) => (
                  <MenuItem key={questionnaire._id} value={questionnaire._id}>
                    {questionnaire.titre} (v{questionnaire.version})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Section des réponses */}
            {formData.questionnaireId && formData.reponses.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Réponses au questionnaire
                  </Typography>
                </Grid>
                
                {formData.reponses.map((reponse, index) => {
                  const question = questions.find(q => q._id === reponse.questionId);
                  if (!question) return null;
                  
                  return (
                    <Grid item xs={12} key={question._id}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Question {index + 1}: {question.texte || question.titre}
                        </Typography>
                        
                        {question.type === 'single_choice' && question.options && question.options.length > 0 ? (
                          <TextField
                            fullWidth
                            select
                            value={reponse.valeur}
                            onChange={(e) => handleReponseChange(question._id, e.target.value)}
                            disabled={isLoading}
                            size="small"
                          >
                            <MenuItem value="">-- Sélectionner --</MenuItem>
                            {question.options.map((option) => (
                              <MenuItem key={option.valeur} value={option.valeur}>
                                {option.libelle}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : question.type === 'multi_choice' && question.options && question.options.length > 0 ? (
                          <TextField
                            fullWidth
                            select
                            SelectProps={{ multiple: true }}
                            value={Array.isArray(reponse.valeur) ? reponse.valeur : []}
                            onChange={(e) => handleReponseChange(question._id, e.target.value)}
                            disabled={isLoading}
                            size="small"
                          >
                            {question.options.map((option) => (
                              <MenuItem key={option.valeur} value={option.valeur}>
                                {option.libelle}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : question.type === 'number' ? (
                          <TextField
                            fullWidth
                            type="number"
                            value={reponse.valeur}
                            onChange={(e) => handleReponseChange(question._id, e.target.value)}
                            disabled={isLoading}
                            size="small"
                            placeholder="Entrez un nombre"
                          />
                        ) : question.type === 'date' ? (
                          <TextField
                            fullWidth
                            type="date"
                            value={reponse.valeur}
                            onChange={(e) => handleReponseChange(question._id, e.target.value)}
                            disabled={isLoading}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        ) : (
                          <TextField
                            fullWidth
                            value={reponse.valeur}
                            onChange={(e) => handleReponseChange(question._id, e.target.value)}
                            disabled={isLoading}
                            size="small"
                            placeholder="Entrez votre réponse"
                            multiline={question.type === 'text'}
                            rows={question.type === 'text' ? 2 : 1}
                          />
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </>
            )}
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
              {isLoading ? 'Enregistrement...' : 'Enregistrer les réponses'}
            </Button>
          </Box>
        </Box>
      </Paper>
        </>
      )}
    </Container>
  );
};

export default CreateInterviewPage;