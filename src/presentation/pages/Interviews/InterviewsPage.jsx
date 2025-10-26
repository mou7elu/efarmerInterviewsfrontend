/**
 * Interviews Page
 * Page de liste des sessions de réponses (utilisant le modèle Reponses)
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
  Person as PersonIcon,
  Quiz as QuizIcon,
  PictureAsPdf as PictureAsPdfIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { interviewsAPI, producteursAPI, questionnairesAPI, handleApiError } from '../../../services/api.js';

const InterviewsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [reponses, setReponses] = useState([]);
  const [filteredReponses, setFilteredReponses] = useState([]);
  const [producteurs, setProducteurs] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [questionnaireFilter, setQuestionnaireFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reponses, searchTerm, questionnaireFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les données en parallèle
      const [reponsesResponse, producteursResponse, questionnairesResponse] = await Promise.all([
        interviewsAPI.getAll(),
        producteursAPI.getAll(),
        questionnairesAPI.getAll()
      ]);
      
      // Extraire les données de la réponse de l'API
      setReponses(reponsesResponse.interviews || reponsesResponse.data || reponsesResponse || []);
      setProducteurs(producteursResponse.data?.items || producteursResponse.data || producteursResponse || []);
      setQuestionnaires(questionnairesResponse.data || questionnairesResponse || []);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    // Vérifier que reponses est un tableau avant de l'utiliser
    if (!Array.isArray(reponses)) {
      console.warn('reponses is not an array:', reponses);
      setFilteredReponses([]);
      return;
    }

    let filtered = [...reponses];

    // Filtre par recherche (nom/prénom du producteur)
    if (searchTerm) {
      filtered = filtered.filter(reponse => {
        const producteur = getProducteurInfo(reponse.exploitantId);
        if (!producteur) return false;
        
        const fullName = `${producteur.Nom} ${producteur.Prenom}`.toLowerCase();
        const code = producteur.Code.toLowerCase();
        const search = searchTerm.toLowerCase();
        
        return fullName.includes(search) || code.includes(search);
      });
    }

    // Filtre par questionnaire
    if (questionnaireFilter) {
      filtered = filtered.filter(reponse => reponse.questionnaireId === questionnaireFilter);
    }

    setFilteredReponses(filtered);
    setPage(0); // Reset pagination
  };

  const getProducteurInfo = (producteurId) => {
    if (!Array.isArray(producteurs)) return null;
    return producteurs.find(p => p._id === producteurId);
  };

  const getQuestionnaireInfo = (questionnaireId) => {
    if (!Array.isArray(questionnaires)) return null;
    return questionnaires.find(q => q._id === questionnaireId);
  };

  const handleDelete = async (id) => {
    if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer cette session de réponses ?')) {
      try {
        // Supprimer via l'API
        await interviewsAPI.delete(id);
        console.log('Suppression réussie:', id);
        // Recharger les données après suppression
        loadData();
        setSuccessMessage('Session de réponses supprimée avec succès');
      } catch (error) {
        setError('Erreur lors de la suppression');
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
    return <LoadingSpinner size={60} message="Chargement des sessions de réponses..." />;
  }

  // Pagination des données
  const paginatedReponses = filteredReponses.slice(
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
          <Typography color="text.primary">Sessions de réponses</Typography>
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
              Sessions de réponses
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestion des réponses collectées auprès des producteurs
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/interviews/new')}
          size="large"
        >
          Nouvelle session
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            placeholder="Rechercher par producteur..."
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
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Questionnaire</InputLabel>
            <Select
              value={questionnaireFilter}
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
              {filteredReponses.length} session{filteredReponses.length > 1 ? 's' : ''} trouvée{filteredReponses.length > 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tableau des sessions */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producteur</TableCell>
              <TableCell>Questionnaire</TableCell>
              <TableCell>Réponses</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Dernière modification</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReponses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucune session de réponses trouvée
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commencez par créer une nouvelle session de collecte de données
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/interviews/new')}
                    >
                      Créer une session
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedReponses.map((reponse) => {
                const producteur = getProducteurInfo(reponse.exploitantId);
                const questionnaire = getQuestionnaireInfo(reponse.questionnaireId);
                
                return (
                  <TableRow key={reponse.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          {producteur ? (
                            <>
                              <Typography variant="body2" fontWeight="bold">
                                {producteur.Nom} {producteur.Prenom}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Code: {producteur.code ? producteur.code : 'Non renseigné'}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" color="error">
                              Producteur introuvable
                            </Typography>
                          )}
                        </Box>
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
                                Version {questionnaire.version}
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
                      <Chip 
                        label={`${reponse.reponses.length} réponse${reponse.reponses.length > 1 ? 's' : ''}`}
                        color="info"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(reponse.createdAt), 'dd/MM/yyyy', { locale: fr })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(reponse.createdAt), 'HH:mm', { locale: fr })}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(reponse.updatedAt), 'dd/MM/yyyy', { locale: fr })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(reponse.updatedAt), 'HH:mm', { locale: fr })}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/interviews/${reponse.id}`)}
                          title="Voir les détails"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => navigate(`/interviews/${reponse.id}/edit`)}
                          title="Modifier"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(reponse.id)}
                          title="Supprimer"
                        >
                          <DeleteIcon />
                        </IconButton>
                        {/* <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => {
                            window.open(`/api/interviews/${reponse.id}/pdf`, '_blank');
                          }}
                          title="Exporter en PDF"
                        >
                          <PictureAsPdfIcon />
                        </IconButton>  */}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        {filteredReponses.length > 0 && (
          <TablePagination
            component="div"
            count={filteredReponses.length}
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

export default InterviewsPage;