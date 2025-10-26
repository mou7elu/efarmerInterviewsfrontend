/**
 * Nationalités List Page
 * Page de gestion des nationalités (CRUD)
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Fab,
  Chip,
  Avatar,
  Breadcrumbs,
  Link
} from '@mui/material';
import { nationalitesAPI, handleApiError } from '@/services/api.js';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Public as PublicIcon,
  Flag as FlagIcon,
  People as PeopleIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';

const NationalitesListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // État local
  const [nationalites, setNationalites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  // États pour les modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNationalite, setSelectedNationalite] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    nom: '',
    code: '',
    paysOrigine: '',
    actif: true
  });



  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await nationalitesAPI.getAll({
        search: searchTerm,
        page: page + 1,
        limit: rowsPerPage
      });
      
      const data = response.data || response;
      setNationalites(Array.isArray(data) ? data : data.items || []);
      setTotalCount(data.total || data.length || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des nationalités:', error);
      setError(handleApiError(error));
      setNationalites([]);
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

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      code: '',
      paysOrigine: '',
      actif: true
    });
  };

  const handleCreate = () => {
    navigate('/nationalites/new');
  };

  const handleEdit = (nationalite) => {
    navigate(`/nationalites/${nationalite.id}/edit`);
  };

  const handleView = (nationalite) => {
    navigate(`/nationalites/${nationalite.id}`);
  };

  const handleDelete = (nationalite) => {
    setSelectedNationalite(nationalite);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      await nationalitesAPI.create(formData);
      setCreateDialogOpen(false);
      resetForm();
      await loadData();
      setSuccessMessage('Nationalité créée avec succès');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitEdit = async () => {
    try {
      await nationalitesAPI.update(selectedNationalite.id, formData);
      setEditDialogOpen(false);
      setSelectedNationalite(null);
      resetForm();
      await loadData();
      setSuccessMessage('Nationalité modifiée avec succès');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      await nationalitesAPI.delete(selectedNationalite.id);
      setDeleteDialogOpen(false);
      setSelectedNationalite(null);
      await loadData();
      setSuccessMessage('Nationalité supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getRegionStats = () => {
    const regions = {
      'Afrique de l\'Ouest': ['Ivoirienne', 'Ghanéenne', 'Burkinabè', 'Malienne', 'Sénégalaise', 'Guinéenne', 'Libérienne'],
      'Europe': ['Française'],
      'Autres': []
    };

    const stats = {};
    Object.keys(regions).forEach(region => {
      stats[region] = nationalites.filter(n => regions[region].includes(n.nom)).length;
    });

    return stats;
  };

  const getAvatarColor = (libNation) => {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'];
    if (!libNation || typeof libNation !== 'string') {
      return colors[0]; // Couleur par défaut
    }
    return colors[libNation.charCodeAt(0) % colors.length];
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des nationalités..." />;
  }

  const regionStats = getRegionStats();

  return (
    <Container maxWidth="xl">
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      
      {/* En-tête avec breadcrumbs */}
      <Box mb={4}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} mb={2}>
          <Link color="inherit" href="/pays">
            Données de référence
          </Link>
          <Typography color="text.primary">Nationalités</Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Nationalités
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nouvelle nationalité
          </Button>
        </Box>
        
        {/* Statistiques rapides */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">
                  {totalCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total nationalités
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>

      {/* Barre de recherche */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Tableau des nationalités */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nationalité</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Date de création</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nationalites
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((nationalite) => (
                <TableRow key={nationalite.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{ 
                          mr: 2, 
                          bgcolor: getAvatarColor(nationalite.Lib_Nation),
                          width: 32,
                          height: 32,
                          fontSize: '0.875rem'
                        }}
                      >
                        {nationalite.Lib_Nation ? nationalite.Lib_Nation.charAt(0).toUpperCase() : 'N'}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {nationalite.Lib_Nation}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {nationalite.id ? nationalite.id.slice(-8) : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(nationalite.createdAt).toLocaleDateString('fr-FR')}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Voir les détails">
                      <IconButton
                        size="small"
                        onClick={() => handleView(nationalite)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(nationalite)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(nationalite)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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

      {/* Dialog de création */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Nouvelle nationalité</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de la nationalité"
                value={formData.nom}
                onChange={(e) => handleFormChange('nom', e.target.value)}
                required
                placeholder="Ex: Ivoirienne, Française..."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code (ISO)"
                value={formData.code}
                onChange={(e) => handleFormChange('code', e.target.value.toUpperCase())}
                required
                inputProps={{ maxLength: 2 }}
                placeholder="Ex: CI, FR..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pays d'origine"
                value={formData.paysOrigine}
                onChange={(e) => handleFormChange('paysOrigine', e.target.value)}
                required
                placeholder="Ex: Côte d'Ivoire, France..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmitCreate} 
            variant="contained"
            disabled={!formData.nom || !formData.code || !formData.paysOrigine}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Modifier la nationalité</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de la nationalité"
                value={formData.nom}
                onChange={(e) => handleFormChange('nom', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code (ISO)"
                value={formData.code}
                onChange={(e) => handleFormChange('code', e.target.value.toUpperCase())}
                required
                inputProps={{ maxLength: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pays d'origine"
                value={formData.paysOrigine}
                onChange={(e) => handleFormChange('paysOrigine', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmitEdit} 
            variant="contained"
            disabled={!formData.nom || !formData.code || !formData.paysOrigine}
          >
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer la nationalité "{selectedNationalite?.nom}" ?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Cette action peut affecter les producteurs ayant cette nationalité.
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

export default NationalitesListPage;