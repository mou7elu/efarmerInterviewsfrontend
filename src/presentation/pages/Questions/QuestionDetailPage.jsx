/**
 * Question Detail Page
 * Afficher le détail d'une question avec tous ses champs
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questionsAPI } from '../../../services/api';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Button, 
  Chip, 
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon, 
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const QUESTION_TYPES = {
  'text': 'Texte',
  'number': 'Nombre',
  'date': 'Date',
  'single_choice': 'Choix unique',
  'multi_choice': 'Choix multiple',
  'boolean': 'Oui/Non'
};

const REFERENCE_TABLES = {
  'District': 'District',
  'Region': 'Région',
  'Departement': 'Département',
  'Souspref': 'Sous-préfecture',
  'Village': 'Village',
  'Pays': 'Pays',
  'Nationalite': 'Nationalité',
  'NiveauScolaire': 'Niveau scolaire',
  'Piece': 'Pièce',
  'Producteur': 'Producteur',
  'Parcelle': 'Parcelle'
};

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        setError('');
        
        // Charger seulement la question (déjà populée par l'API)
        const questionData = await questionsAPI.getById(id);
        
        setQuestion(questionData);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const getSectionTitle = (sectionData) => {
    // Si sectionData est déjà un objet populé par l'API
    if (typeof sectionData === 'object' && sectionData !== null && sectionData.titre) {
      return sectionData.titre;
    }
    return '— non renseigné —';
  };

  const getVoletTitle = (voletData) => {
    // Si voletData est déjà un objet populé par l'API
    if (typeof voletData === 'object' && voletData !== null && voletData.titre) {
      return voletData.titre;
    }
    return '— non renseigné —';
  };

  if (isLoading) return <Container sx={{ mt: 6 }}><Typography>Chargement...</Typography></Container>;

  if (error) return <Container sx={{ mt: 6 }}><Alert severity="error">{error}</Alert></Container>;

  if (!question) return <Container sx={{ mt: 6 }}><Typography>Question introuvable</Typography></Container>;

  return (
    <Container maxWidth="md">
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Détail de la question</Typography>
          <Typography variant="subtitle2" color="text.secondary">{question.code} - {question.texte}</Typography>
        </Box>
        <Box>
          <Button startIcon={<EditIcon />} variant="contained" onClick={() => navigate(`/questions/${id}/edit`)} sx={{ mr: 1 }}>
            Modifier
          </Button>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate('/questions')}>
            Retour
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Informations de base</Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2">Code</Typography>
            <Chip label={question.code} color="primary" variant="outlined" />
          </Grid>

          <Grid item xs={12} sm={9}>
            <Typography variant="subtitle2">Texte de la question</Typography>
            <Typography>{question.texte}</Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2">Type</Typography>
            <Chip label={QUESTION_TYPES[question.type]} color="info" />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2">Unité</Typography>
            <Typography>{question.unite || '—'}</Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2">Paramètres</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {question.obligatoire && (
                <Chip
                  icon={<CheckIcon />}
                  label="Obligatoire"
                  size="small"
                  color="warning"
                />
              )}
              {question.automatique && (
                <Chip
                  icon={<CheckIcon />}
                  label="Automatique"
                  size="small"
                  color="success"
                />
              )}
              {!question.obligatoire && !question.automatique && (
                <Typography variant="body2" color="text.secondary">Aucun</Typography>
              )}
            </Box>
          </Grid>

          {/* Structure */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6">Structure</Typography>
            </Divider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Volet</Typography>
            <Typography>{getVoletTitle(question.voletId)}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Section</Typography>
            <Typography>{getSectionTitle(question.sectionId)}</Typography>
          </Grid>

          {/* Table de référence */}
          {question.referenceTable && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="h6">Table de référence</Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Table</Typography>
                <Chip label={REFERENCE_TABLES[question.referenceTable]} color="secondary" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Champ</Typography>
                <Typography>{question.referenceField || '—'}</Typography>
              </Grid>
            </>
          )}

          {/* Options */}
          {question.options && question.options.length > 0 && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="h6">Options de réponse ({question.options.length})</Typography>
                </Divider>
              </Grid>

              <Grid item xs={12}>
                <List dense>
                  {question.options.map((option, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={option.texte}
                        secondary={`Valeur: ${option.valeur}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </>
          )}

          {/* Métadonnées */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6">Métadonnées</Typography>
            </Divider>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2">Créé le</Typography>
            <Typography>{new Date(question.createdAt).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default QuestionDetailPage;