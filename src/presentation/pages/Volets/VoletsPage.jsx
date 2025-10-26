/**
 * Volets Page
 * Page de liste des volets (utilisant le modèle Volet)
 */

import React, { useEffect, useState } from 'react';
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
  Assignment as AssignmentIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { voletsAPI, questionnairesAPI, handleApiError } from '@/services/api.js';

const VoletsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [volets, setVolets] = useState([]);
  const [filteredVolets, setFilteredVolets] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [questionnaireFilter, setQuestionnaireFilter] = useState('');
  
  // État pour les questionnaires
  const [questionnaires, setQuestionnaires] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [volets, searchTerm, questionnaireFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les volets et questionnaires en parallèle
      const [voletsResponse, questionnairesResponse] = await Promise.all([
        voletsAPI.getAll(),
        questionnairesAPI.getAll()
      ]);
      
      setVolets(voletsResponse.data || voletsResponse);
      setQuestionnaires(questionnairesResponse.data || questionnairesResponse);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...volets];

    // Filtre par recherche (titre du volet)
    if (searchTerm) {
      filtered = filtered.filter(volet => 
        volet.titre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par questionnaire
    if (questionnaireFilter) {
      filtered = filtered.filter(volet => {
        const voletQuestionnaireId = typeof volet.questionnaireId === 'object' && volet.questionnaireId !== null 
          ? volet.questionnaireId._id 
          : volet.questionnaireId;
        return voletQuestionnaireId === questionnaireFilter;
      });
    }

    // Tri par questionnaire puis par ordre
    filtered.sort((a, b) => {
      // Extraire les IDs des objets populés
      const questionnaireIdA = typeof a.questionnaireId === 'object' && a.questionnaireId !== null 
        ? a.questionnaireId._id 
        : a.questionnaireId;
      const questionnaireIdB = typeof b.questionnaireId === 'object' && b.questionnaireId !== null 
        ? b.questionnaireId._id 
        : b.questionnaireId;
        
      if (questionnaireIdA !== questionnaireIdB) {
        return questionnaireIdA.localeCompare(questionnaireIdB);
      }
      return a.ordre - b.ordre;
    });

    setFilteredVolets(filtered);
    setPage(0); // Reset pagination
  };

  const getQuestionnaireInfo = (questionnaireData) => {
    // Si questionnaireData est déjà un objet populé par le backend
    if (typeof questionnaireData === 'object' && questionnaireData !== null && questionnaireData._id) {
      return questionnaireData;
    }
    // Sinon, chercher dans la liste des questionnaires
    return questionnaires.find(q => q._id === questionnaireData);
  };

  const handleDelete = async (id) => {
    if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer ce volet ?')) {
      try {
        await voletsAPI.delete(id);
        setVolets(prev => prev.filter(v => v._id !== id));
        setSuccessMessage('Volet supprimé avec succès');
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
    return <LoadingSpinner size={60} message="Chargement des volets..." />;
  }

  // Pagination des données
  const paginatedVolets = filteredVolets.slice(
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
          <Typography color="text.primary">Volets</Typography>
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
            <AssignmentIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              Volets
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestion des volets des questionnaires
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/volets/new')}
          size="large"
        >
          Nouveau volet
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            placeholder="Rechercher un volet..."
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
          
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <InputLabel>Questionnaire</InputLabel>
            <Select
              value={questionnaires.find(q => q._id === questionnaireFilter) ? questionnaireFilter : ''}
              onChange={(e) => setQuestionnaireFilter(e.target.value)}
              label="Questionnaire"
            >
              <MenuItem value="">Tous les questionnaires</MenuItem>
              {questionnaires.map((questionnaire) => (
                <MenuItem key={questionnaire._id} value={questionnaire._id}>
                  {questionnaire.titre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box display="flex" alignItems="center" gap={1} ml="auto">
            <FilterIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {filteredVolets.length} volet{filteredVolets.length > 1 ? 's' : ''} trouvé{filteredVolets.length > 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tableau des volets */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ordre</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Questionnaire</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Dernière modification</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedVolets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucun volet trouvé
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commencez par créer un nouveau volet
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/volets/new')}
                    >
                      Créer un volet
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedVolets.map((volet) => {
                const questionnaire = getQuestionnaireInfo(volet.questionnaireId);
                
                return (
                  <TableRow key={volet._id} hover>
                    <TableCell>
                      <Chip 
                        label={volet.ordre}
                        color="primary"
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                          <AssignmentIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" fontWeight="bold">
                          {volet.titre}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                          <QuizIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          {questionnaire ? (
                            <>
                              <Typography variant="body2" fontWeight="bold">
                                {questionnaire.titre}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Version: {questionnaire.version}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" color="error">
                              Questionnaire introuvable
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(volet.createdAt), 'dd/MM/yyyy', { locale: fr })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(volet.createdAt), 'HH:mm', { locale: fr })}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(volet.updatedAt), 'dd/MM/yyyy', { locale: fr })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(volet.updatedAt), 'HH:mm', { locale: fr })}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/volets/${volet._id}`)}
                          title="Voir les détails"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => navigate(`/volets/${volet._id}/edit`)}
                          title="Modifier"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(volet._id)}
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
        {filteredVolets.length > 0 && (
          <TablePagination
            component="div"
            count={filteredVolets.length}
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

export default VoletsPage;