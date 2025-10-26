/**
 * Niveaux Scolaires List Page
 * Page de gestion des niveaux scolaires (CRUD)
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Button,
  Box,
  TextField,
  Alert,
  Tooltip as MuiTooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Fab,
  Tooltip,
  Chip,
  LinearProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { niveauxScolairesAPI, handleApiError } from '@/services/api.js';

const NiveauxScolairesListPage = () => {
  // État local
  const navigate = useNavigate();
  const location = useLocation();
  
  const [niveaux, setNiveaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // États pour la suppression uniquement
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNiveau, setSelectedNiveau] = useState(null);

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, searchTerm]);

  // Gérer le message de succès depuis la navigation
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Nettoyer le state pour éviter que le message persiste
      window.history.replaceState({}, document.title);
      
      // Masquer le message après 5 secondes
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await niveauxScolairesAPI.getAll({
        search: searchTerm,
        page: page + 1,
        limit: rowsPerPage
      });
      
      const data = response.data || response;
      setNiveaux(Array.isArray(data) ? data : data.items || []);
      setTotalCount(data.total || data.length || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des niveaux scolaires:', error);
      // Fallback en cas d'erreur API
      setNiveaux([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreate = () => {
    navigate('/niveaux-scolaires/new');
  };

  const handleView = (niveau) => {
    navigate(`/niveaux-scolaires/${niveau.id}`);
  };

  const handleEdit = (niveau) => {
    navigate(`/niveaux-scolaires/${niveau.id}/edit`);
  };

  const handleDelete = (niveau) => {
    setSelectedNiveau(niveau);
    setDeleteDialogOpen(true);
  };

  const handleSubmitDelete = async () => {
    try {
      await niveauxScolairesAPI.delete(selectedNiveau.id);
      setDeleteDialogOpen(false);
      setSelectedNiveau(null);
      await loadData();
      setSuccessMessage('Niveau scolaire supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getNiveauColor = (niveau) => {
    const colors = {
      0: '#f44336', // Rouge pour aucun niveau
      1: '#ff9800', // Orange pour primaire/alphabétisation
      2: '#2196f3', // Bleu pour secondaire 1er cycle/professionnel
      3: '#4caf50', // Vert pour secondaire 2nd cycle
      4: '#9c27b0'  // Violet pour supérieur
    };
    return colors[niveau] || '#757575';
  };

  const getNiveauLabel = (niveau) => {
    const labels = {
      0: 'Aucun',
      1: 'Base',
      2: 'Moyen',
      3: 'Avancé',
      4: 'Supérieur'
    };
    return labels[niveau] || 'Non défini';
  };

  const getCategoryStats = () => {
    const stats = {};
    for (let i = 0; i <= 4; i++) {
      stats[i] = niveaux.filter(n => n.niveau === i).length;
    }
    return stats;
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des niveaux scolaires..." />;
  }

  const categoryStats = getCategoryStats();

  return (
    <Container maxWidth="xl">
      {/* En-tête avec breadcrumbs */}
      <Box mb={4}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} mb={2}>
          <Link color="inherit" href="/pays">
            Données de référence
          </Link>
          <Typography color="text.primary">Niveaux scolaires</Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Niveaux scolaires
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nouveau niveau
          </Button>
        </Box>
        
        {/* Statistiques rapides */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">
                  {niveaux.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total niveaux
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>

      {/* Message de succès */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Barre de recherche */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom, code ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Tableau des niveaux scolaires */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Niveau scolaire</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Date de création</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {niveaux
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((niveau) => (
                <TableRow key={niveau.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <SchoolIcon sx={{ mr: 1, color: getNiveauColor(0) }} />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {niveau.Lib_NiveauScolaire}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {niveau.id ? niveau.id.slice(-8) : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(niveau.createdAt).toLocaleDateString('fr-FR')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <MuiTooltip title="Voir les détails">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(niveau)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </MuiTooltip>
                    <MuiTooltip title="Modifier">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(niveau)}
                      >
                        <EditIcon />
                      </IconButton>
                    </MuiTooltip>
                    <MuiTooltip title="Supprimer">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(niveau)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </MuiTooltip>
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
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} sur ${count}`
          }
        />
      </Paper>

      {/* FAB pour création rapide */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreate}
      >
        <AddIcon />
      </Fab>



      {/* Dialog de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le niveau scolaire "{selectedNiveau?.nom}" ?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Cette action peut affecter les producteurs ayant ce niveau scolaire.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmitDelete} 
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NiveauxScolairesListPage;