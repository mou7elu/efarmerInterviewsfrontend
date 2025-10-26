/**
 * Edit Question Page
 * Modifier une question existante avec tous les champs du modèle
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { questionsAPI, sectionsAPI, voletsAPI } from '../../../services/api';
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
  FormControlLabel,
  Switch,
  Chip,
  Divider
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const QUESTION_TYPES = [
  { value: 'text', label: 'Texte' },
  { value: 'number', label: 'Nombre' },
  { value: 'date', label: 'Date' },
  { value: 'single_choice', label: 'Choix unique' },
  { value: 'multi_choice', label: 'Choix multiple' },
  { value: 'boolean', label: 'Oui/Non' }
];

const REFERENCE_TABLES = [
  { value: '', label: '-- Aucune --' },
  { value: 'District', label: 'District' },
  { value: 'Region', label: 'Région' },
  { value: 'Departement', label: 'Département' },
  { value: 'Souspref', label: 'Sous-préfecture' },
  { value: 'Village', label: 'Village' },
  { value: 'Pays', label: 'Pays' },
  { value: 'Nationalite', label: 'Nationalité' },
  { value: 'NiveauScolaire', label: 'Niveau scolaire' },
  { value: 'Piece', label: 'Pièce' },
  { value: 'Producteur', label: 'Producteur' },
  { value: 'Parcelle', label: 'Parcelle' }
];

const EditQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    texte: '',
    type: 'text',
    obligatoire: false,
    unite: '',
    automatique: false,
    options: [],
    sectionId: '',
    voletId: '',
    referenceTable: '',
    referenceField: ''
  });

  const [sections, setSections] = useState([]);
  const [volets, setVolets] = useState([]);
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Charger la question, sections et volets en parallèle
        const [questionData, sectionsData, voletsData] = await Promise.all([
          questionsAPI.getById(id),
          sectionsAPI.getAll(),
          voletsAPI.getAll()
        ]);
        
        // S'assurer que les IDs sont des chaînes et non des objets
        const formattedData = {
          ...questionData,
          sectionId: typeof questionData.sectionId === 'object' ? questionData.sectionId?._id || '' : questionData.sectionId || '',
          voletId: typeof questionData.voletId === 'object' ? questionData.voletId?._id || '' : questionData.voletId || '',
          unite: questionData.unite || '',
          referenceTable: questionData.referenceTable || '',
          referenceField: questionData.referenceField || '',
          options: questionData.options || []
        };
        
        setFormData(formattedData);
        setSections(sectionsData);
        setVolets(voletsData);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger la question');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const validate = () => {
    if (!formData.code) return 'Le code est requis';
    if (!formData.texte) return 'Le texte de la question est requis';
    if (!formData.type) return 'Le type est requis';
    if (!formData.sectionId) return 'La section est requise';
    if (!formData.voletId) return 'Le volet est requis';
    if (['single_choice', 'multi_choice'].includes(formData.type) && formData.options.length === 0) {
      return 'Au moins une option est requise pour ce type de question';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await questionsAPI.update(id, formData);
      navigate('/questions', { state: { message: 'Question modifiée avec succès' } });
    } catch (err) {
      console.error('Erreur lors de la modification de la question:', err);
      setError('Erreur lors de la modification de la question');
    } finally {
      setIsLoading(false);
    }
  };

  const addOption = () => {
    if (newOption.trim()) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, { texte: newOption.trim(), valeur: newOption.trim() }]
      }));
      setNewOption('');
    }
  };

  const removeOption = (index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const filteredSections = sections.filter(s => {
    if (!formData.voletId) return true;
    // Gérer le cas où voletId est un objet populé ou un string
    const sectionVoletId = typeof s.voletId === 'object' && s.voletId !== null 
      ? s.voletId._id 
      : s.voletId;
    return sectionVoletId === formData.voletId;
  });

  if (isLoading) return <Container sx={{ mt: 6 }}><Typography>Chargement...</Typography></Container>;

  return (
    <Container maxWidth="md">
      <Box mb={4}>
        <Typography variant="h4">Modifier la question</Typography>
        <Typography variant="body2" color="text.secondary">ID: {id}</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Code et texte */}
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Code"
                placeholder="Q27"
                value={formData.code}
                onChange={(e) => setFormData(p => ({ ...p, code: e.target.value }))}
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                required
                fullWidth
                label="Texte de la question"
                multiline
                rows={2}
                value={formData.texte}
                onChange={(e) => setFormData(p => ({ ...p, texte: e.target.value }))}
                disabled={isLoading}
              />
            </Grid>

            {/* Type et paramètres */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                label="Type de question"
                value={formData.type}
                onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}
                disabled={isLoading}
              >
                {QUESTION_TYPES.map(type => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Unité"
                placeholder="FCFA, personnes, etc."
                value={formData.unite}
                onChange={(e) => setFormData(p => ({ ...p, unite: e.target.value }))}
                disabled={isLoading}
              />
            </Grid>

            {/* Switches */}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.obligatoire}
                    onChange={(e) => setFormData(p => ({ ...p, obligatoire: e.target.checked }))}
                    disabled={isLoading}
                  />
                }
                label="Question obligatoire"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.automatique}
                    onChange={(e) => setFormData(p => ({ ...p, automatique: e.target.checked }))}
                    disabled={isLoading}
                  />
                }
                label="Remplissage automatique"
              />
            </Grid>

            {/* Volet et Section */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                label="Volet"
                value={volets.find(v => v._id === formData.voletId) ? formData.voletId : ''}
                onChange={(e) => setFormData(p => ({ ...p, voletId: e.target.value, sectionId: '' }))}
                disabled={isLoading}
              >
                <MenuItem value="">-- Sélectionner --</MenuItem>
                {volets.map(v => (
                  <MenuItem key={v._id} value={v._id}>{v.titre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                label="Section"
                value={filteredSections.find(s => s._id === formData.sectionId) ? formData.sectionId : ''}
                onChange={(e) => setFormData(p => ({ ...p, sectionId: e.target.value }))}
                disabled={isLoading || !formData.voletId}
              >
                <MenuItem value="">-- Sélectionner --</MenuItem>
                {filteredSections.map(s => (
                  <MenuItem key={s._id} value={s._id}>{s.titre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Tables de référence */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Table de référence (optionnel)
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Table de référence"
                value={formData.referenceTable}
                onChange={(e) => setFormData(p => ({ ...p, referenceTable: e.target.value }))}
                disabled={isLoading}
              >
                {REFERENCE_TABLES.map(table => (
                  <MenuItem key={table.value} value={table.value}>{table.label}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Champ de référence"
                placeholder="nom, titre, etc."
                value={formData.referenceField}
                onChange={(e) => setFormData(p => ({ ...p, referenceField: e.target.value }))}
                disabled={isLoading || !formData.referenceTable}
              />
            </Grid>

            {/* Options pour choix multiple/unique */}
            {['single_choice', 'multi_choice'].includes(formData.type) && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Options de réponse
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" gap={1} mb={2}>
                    <TextField
                      fullWidth
                      label="Nouvelle option"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                      disabled={isLoading}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addOption}
                      disabled={isLoading || !newOption.trim()}
                    >
                      Ajouter
                    </Button>
                  </Box>

                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {formData.options.map((option, index) => (
                      <Chip
                        key={index}
                        label={option.texte}
                        onDelete={() => removeOption(index)}
                        deleteIcon={<DeleteIcon />}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              </>
            )}

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button 
                variant="outlined" 
                startIcon={<CancelIcon />} 
                onClick={() => navigate('/questions')} 
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={isLoading ? <CircularProgress size={18} /> : <SaveIcon />}
                disabled={isLoading}
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditQuestionPage;