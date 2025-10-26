/**
 * Questionnaires List Page
 * Page de liste des questionnaires agricoles
 */

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Button,
  Box,
  TextField,
  Avatar,
  Grid,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Quiz as QuizIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, questionnairesAPI, interviewsAPI, usersAPI, villagesAPI, zonesInterditesAPI, profilesAPI, paysAPI, regionsAPI, departementsAPI, sousprefsAPI, parcellesAPI, handleApiError } from '../../../services/api.js';
import { getValue, getSafeId, getLibelle, extractDataFromApiResponse } from '../../../shared/utils/entityHelpers.js';

const QuestionnairesListPage = () => {
  const navigate = useNavigate();
  
  // État local
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filtres simplifiés pour le modèle de base
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadQuestionnaires();
  }, []);

  const loadQuestionnaires = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Chargement des questionnaires...');
      const response = await questionnairesAPI.getAll();
      console.log('Réponse API questionnaires:', response);
      
      const data = extractDataFromApiResponse(response);
      console.log('Questionnaires extraits:', data);
      
      setQuestionnaires(data);
      setTotalCount(Array.isArray(data) ? data.length : 0);
      
    } catch (error) {
      console.error('Erreur lors du chargement des questionnaires:', error);
      setError(handleApiError(error, 'Erreur lors du chargement des questionnaires'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des questionnaires..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Questionnaires Agricoles
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/questionnaires/create')}
          >
            Nouveau questionnaire
          </Button>
        </Box>
        
        {/* Statistiques rapides */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">
                  {questionnaires.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total questionnaires
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="success.main">
                  {questionnaires.filter(q => q.version).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Avec version
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="info.main">
                  {questionnaires.filter(q => q.description).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Avec description
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Barre de recherche */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Rechercher par titre ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              {questionnaires.length} questionnaire{questionnaires.length > 1 ? 's' : ''} trouvé{questionnaires.length > 1 ? 's' : ''}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Tableau des questionnaires */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Questionnaire</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questionnaires
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((questionnaire) => (
                <TableRow key={questionnaire.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar 
                        sx={{ mr: 2, bgcolor: 'primary.main' }}
                      >
                        <QuizIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {questionnaire.titre}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {questionnaire._id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={questionnaire.version}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300 }}>
                      {questionnaire.description || 'Aucune description'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={0.5} justifyContent="center">
                      <Tooltip title="Voir les détails">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/questionnaires/${questionnaire._id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/questionnaires/${questionnaire._id}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} sur ${count}`
          }
        />
      </Paper>
    </Container>
  );
};

export default QuestionnairesListPage;