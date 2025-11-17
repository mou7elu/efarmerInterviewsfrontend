/**
 * Nationalités List Page
 * Page de gestion des nationalités (CRUD)
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
import { nationalitesAPI, handleApiError } from '@/services/api.js';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Public as PublicIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';


const NationalitesListPage = () => {
  // États pour les données
  const [nationalites, setNationalites] = useState([]);
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
  const [selectedNationalite, setSelectedNationalite] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    Lib_Nation: ''
  });

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await nationalitesAPI.getAll({
        limit:2000
      });
      
      const data = response.data || response;
      const items = Array.isArray(data) ? data : data.items || [];
      
      setNationalites(items);
      setTotalCount(data.total || items.length);
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
      Lib_Nation: ''
    });
  };

  const handleCreateClick = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEditClick = (nationalite) => {
    setSelectedNationalite(nationalite);
    setFormData({
      Lib_Nation: nationalite.Lib_Nation || ''
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (nationalite) => {
    setSelectedNationalite(nationalite);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    if (!formData.Lib_Nation || formData.Lib_Nation.trim() === '') {
      setError('Le libellé de la nationalité est requis');
      return;
    }

    try {
      await nationalitesAPI.create(formData);
      setCreateDialogOpen(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitEdit = async () => {
    if (!formData.Lib_Nation || formData.Lib_Nation.trim() === '') {
      setError('Le libellé de la nationalité est requis');
      return;
    }

    try {
      const nationaliteId = selectedNationalite.id || selectedNationalite._id;
      await nationalitesAPI.update(nationaliteId, formData);
      setEditDialogOpen(false);
      setSelectedNationalite(null);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const nationaliteId = selectedNationalite.id || selectedNationalite._id;
      await nationalitesAPI.delete(nationaliteId);
      setDeleteDialogOpen(false);
      setSelectedNationalite(null);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const filteredNationalites = nationalites.filter(nationalite =>
    nationalite.Lib_Nation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des nationalités..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          <PublicIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Nationalités
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Nouvelle nationalité
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
                Total nationalités
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barre de recherche */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Rechercher une nationalité..."
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
                <TableCell>Nationalité</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNationalites
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((nationalite) => (
                  <TableRow key={nationalite.id || nationalite._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <PublicIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">
                          {nationalite.Lib_Nation}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(nationalite)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(nationalite)}
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
          count={filteredNationalites.length}
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
        <DialogTitle>Nouvelle nationalité</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Libellé de la nationalité"
              value={formData.Lib_Nation}
              onChange={(e) => handleFormChange('Lib_Nation', e.target.value)}
              required
              placeholder="Ex: Ivoirienne, Française, Malienne..."
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
            disabled={!formData.Lib_Nation || formData.Lib_Nation.trim() === ''}
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
          setSelectedNationalite(null);
          resetForm();
          setError('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modifier la nationalité</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Libellé de la nationalité"
              value={formData.Lib_Nation}
              onChange={(e) => handleFormChange('Lib_Nation', e.target.value)}
              required
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditDialogOpen(false);
            setSelectedNationalite(null);
            resetForm();
            setError('');
          }}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmitEdit} 
            variant="contained"
            disabled={!formData.Lib_Nation || formData.Lib_Nation.trim() === ''}
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
          setSelectedNationalite(null);
        }}
        maxWidth="sm"
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer la nationalité <strong>"{selectedNationalite?.Lib_Nation}"</strong> ?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Cette action est irréversible et peut affecter les producteurs ayant cette nationalité.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDeleteDialogOpen(false);
            setSelectedNationalite(null);
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

export default NationalitesListPage;