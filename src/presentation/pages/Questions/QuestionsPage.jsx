/**
 * Questions Page
 * Page de liste des questions (utilisant le modèle Question)
 */

import React, { useEffect, useState } from 'react';
import { questionsAPI, sectionsAPI, voletsAPI } from '../../../services/api';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  Avatar,
  Breadcrumbs,
  Link,
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Add as AddIcon, 
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  NavigateNext as NavigateNextIcon,
  Quiz as QuizIcon,
  List as ListIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';

const QuestionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');

  const [sections, setSections] = useState([]);
  const [volets, setVolets] = useState([]);

  const typeOptions = [
    { value: 'text', label: 'Texte' },
    { value: 'number', label: 'Nombre' },
    { value: 'date', label: 'Date' },
    { value: 'single_choice', label: 'Choix unique' },
    { value: 'multi_choice', label: 'Choix multiple' },
    { value: 'boolean', label: 'Oui/Non' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, searchTerm, typeFilter, sectionFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Charger questions, sections et volets en parallèle
      const [questionsData, sectionsData, voletsData] = await Promise.all([
        questionsAPI.getAll(),
        sectionsAPI.getAll(),
        voletsAPI.getAll()
      ]);
      
      setQuestions(questionsData);
      setSections(sectionsData);
      setVolets(voletsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur lors du chargement des questions');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...questions];

    // Filtre par recherche (code ou texte)
    if (searchTerm) {
      filtered = filtered.filter(question => 
        question.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.texte.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par type
    if (typeFilter) {
      filtered = filtered.filter(question => question.type === typeFilter);
    }

    // Filtre par section
    if (sectionFilter) {
      filtered = filtered.filter(question => {
        const questionSectionId = typeof question.sectionId === 'object' && question.sectionId !== null 
          ? question.sectionId._id 
          : question.sectionId;
        return questionSectionId === sectionFilter;
      });
    }

    setFilteredQuestions(filtered);
    setPage(0); // Reset pagination
  };

  const getSectionInfo = (sectionId) => {
    // Si sectionId est déjà un objet populé par le backend
    if (typeof sectionId === 'object' && sectionId !== null && sectionId._id) {
      return sectionId;
    }
    // Sinon, chercher dans la liste des sections
    return sections.find(s => s._id === sectionId);
  };

  const getTypeLabel = (type) => {
    const typeOption = typeOptions.find(t => t.value === type);
    return typeOption ? typeOption.label : type;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'text':
        return 'primary';
      case 'number':
        return 'info';
      case 'date':
        return 'warning';
      case 'single_choice':
      case 'multi_choice':
        return 'success';
      case 'boolean':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleDelete = async (id) => {
    if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      try {
        // Supprimer via l'API
        await questionsAPI.delete(id);
        console.log('Question supprimée avec succès:', id);
        // Recharger les données après suppression
        loadData();
        setSuccessMessage('Question supprimée avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError(handleApiError(error));
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des questions..." />;
  }

  // Pagination des données
  const paginatedQuestions = filteredQuestions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="lg">
      {/* Breadcrumbs */}
      <Box mb={3}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link color="inherit" href="/dashboard">
            Agriculture
          </Link>
          <Typography color="text.primary">Questions</Typography>
        </Breadcrumbs>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* En-tête avec actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            <QuizIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              Questions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestion des questions des questionnaires
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/questions/new')}
          size="large"
        >
          Nouvelle question
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            placeholder="Rechercher par code ou texte..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Type"
            >
              <MenuItem value="">Tous les types</MenuItem>
              {typeOptions.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Section</InputLabel>
            <Select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              label="Section"
            >
              <MenuItem value="">Toutes les sections</MenuItem>
              {sections.map((section) => (
                <MenuItem key={section._id} value={section._id}>
                  {section.titre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box display="flex" alignItems="center" gap={1} ml="auto">
            <FilterIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {filteredQuestions.length} question{filteredQuestions.length > 1 ? 's' : ''} trouvée{filteredQuestions.length > 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tableau des questions */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Obligatoire</TableCell>
              <TableCell>Référence</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedQuestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <QuizIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucune question trouvée
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commencez par créer une nouvelle question
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/questions/new')}
                    >
                      Créer une question
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedQuestions.map((question) => {
                const section = getSectionInfo(question.sectionId);
                
                return (
                  <TableRow key={question._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {question.code}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300 }}>
                        {question.texte}
                      </Typography>
                      {question.unite && (
                        <Typography variant="caption" color="text.secondary">
                          Unité: {question.unite}
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={getTypeLabel(question.type)}
                        color={getTypeColor(question.type)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    
                    <TableCell>
                      {section ? (
                        <Typography variant="body2">
                          {section.titre}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="error">
                          Section introuvable
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={question.obligatoire ? 'Oui' : 'Non'}
                        color={question.obligatoire ? 'error' : 'default'}
                        size="small"
                        variant={question.obligatoire ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    
                    <TableCell>
                      {question.referenceTable ? (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {question.referenceTable}
                          </Typography>
                          {question.referenceField && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {question.referenceField}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Aucune
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/questions/${question._id}`)}
                          title="Voir les détails"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => navigate(`/questions/${question._id}/edit`)}
                          title="Modifier"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(question._id)}
                          title="Supprimer"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        {filteredQuestions.length > 0 && (
          <TablePagination
            component="div"
            count={filteredQuestions.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Lignes par page:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        )}
      </TableContainer>
    </Container>
  );
};

export default QuestionsPage;