/**
 * Niveaux Scolaires List Page
 * Page de gestion des niveaux scolaires (CRUD)
 * Harmonisée avec le design pattern établi
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
  Button,
  Box,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  School as SchoolIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { niveauxScolairesAPI, handleApiError } from '@/services/api.js';


const NiveauxScolairesListPage = () => {
  // États pour les données
  const [niveaux, setNiveaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // États pour la pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // États pour la recherche
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNiveau, setSelectedNiveau] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    Lib_NiveauScolaire: ''
  });

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await niveauxScolairesAPI.getAll({
        limit: 2000
      });
      
      const data = response.data || response;
      const items = Array.isArray(data) ? data : data.items || [];
      
      setNiveaux(items);
      setTotalCount(data.total || items.length);
    } catch (error) {
      console.error('Erreur lors du chargement des niveaux scolaires:', error);
      setError(handleApiError(error));
      setNiveaux([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      Lib_NiveauScolaire: ''
    });
  };

  const handleCreateClick = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEditClick = (niveau) => {
    setSelectedNiveau(niveau);
    setFormData({
      Lib_NiveauScolaire: niveau.Lib_NiveauScolaire || ''
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (niveau) => {
    setSelectedNiveau(niveau);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    if (!formData.Lib_NiveauScolaire || formData.Lib_NiveauScolaire.trim() === '') {
      setError('Le libellé du niveau scolaire est requis');
      return;
    }

    try {
      await niveauxScolairesAPI.create(formData);
      setCreateDialogOpen(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitEdit = async () => {
    if (!formData.Lib_NiveauScolaire || formData.Lib_NiveauScolaire.trim() === '') {
      setError('Le libellé du niveau scolaire est requis');
      return;
    }

    try {
      const niveauId = selectedNiveau.id || selectedNiveau._id;
      await niveauxScolairesAPI.update(niveauId, formData);
      setEditDialogOpen(false);
      setSelectedNiveau(null);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const niveauId = selectedNiveau.id || selectedNiveau._id;
      await niveauxScolairesAPI.delete(niveauId);
      setDeleteDialogOpen(false);
      setSelectedNiveau(null);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const filteredNiveaux = niveaux.filter(niveau =>
    niveau.Lib_NiveauScolaire?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des niveaux scolaires..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Niveaux scolaires
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Nouveau niveau scolaire
        </Button>
      </Box>

      {/* Affichage erreur */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Statistique */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {totalCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total niveaux scolaires
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barre de recherche */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Rechercher un niveau scolaire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Box>

      {/* Tableau */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Niveau scolaire</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNiveaux
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((niveau) => (
                  <TableRow key={niveau.id || niveau._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">
                          {niveau.Lib_NiveauScolaire}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(niveau)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(niveau)}
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
          count={filteredNiveaux.length}
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

      {/* FAB pour création rapide */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateClick}
      >
        <AddIcon />
      </Fab>

      {/* Dialog de création */}
      <Dialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          resetForm();
          setError('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nouveau niveau scolaire</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Libellé du niveau scolaire"
              value={formData.Lib_NiveauScolaire}
              onChange={(e) => handleFormChange('Lib_NiveauScolaire', e.target.value)}
              required
              placeholder="Ex: Primaire, Secondaire, Universitaire..."
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateDialogOpen(false);
            resetForm();
            setError('');
          }}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmitCreate} 
            variant="contained"
            disabled={!formData.Lib_NiveauScolaire || formData.Lib_NiveauScolaire.trim() === ''}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedNiveau(null);
          resetForm();
          setError('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modifier le niveau scolaire</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Libellé du niveau scolaire"
              value={formData.Lib_NiveauScolaire}
              onChange={(e) => handleFormChange('Lib_NiveauScolaire', e.target.value)}
              required
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditDialogOpen(false);
            setSelectedNiveau(null);
            resetForm();
            setError('');
          }}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmitEdit} 
            variant="contained"
            disabled={!formData.Lib_NiveauScolaire || formData.Lib_NiveauScolaire.trim() === ''}
          >
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedNiveau(null);
        }}
        maxWidth="sm"
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le niveau scolaire <strong>"{selectedNiveau?.Lib_NiveauScolaire}"</strong> ?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Cette action est irréversible et peut affecter les producteurs ayant ce niveau scolaire.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDeleteDialogOpen(false);
            setSelectedNiveau(null);
          }}>
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