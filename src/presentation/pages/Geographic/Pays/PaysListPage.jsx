/**
 * Pays List Page
 * Page de gestion des pays (CRUD)
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Fab,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Public as PublicIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import GeoJSONInput from '@presentation/components/Common/GeoJSONInput.jsx';
import { paysAPI, handleApiError } from '../../../../services/api.js';

const PaysListPage = () => {
  // États locaux
  const [pays, setPays] = useState([]);
  const [filteredPays, setFilteredPays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPays, setSelectedPays] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    Lib_pays: '',
    Coordonnee: null,
    Indicatif: '',
    Sommeil: false,
    Islocal: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  // Appliquer le filtre de recherche
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPays(pays);
    } else {
      const filtered = pays.filter(p => {
        const nom = p.Lib_pays || '';
        const indicatif = p.Indicatif || '';
        
        return nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
               indicatif.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredPays(filtered);
    }
    setPage(0);
  }, [pays, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await paysAPI.getAll({ limit: 1000 });
      const data = response.data || response;
      const paysData = data.items || data || [];
      console.log('Pays chargés:', paysData);
      setPays(paysData);
      setFilteredPays(paysData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
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
      Lib_pays: '',
      Coordonnee: null,
      Indicatif: '',
      Sommeil: false,
      Islocal: false,
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (pays) => {
    setSelectedPays(pays);
    
    // Parser Coordonnee si c'est une chaîne JSON
    let coordonnee = pays.Coordonnee;
    if (coordonnee && typeof coordonnee === 'string') {
      try {
        coordonnee = JSON.parse(coordonnee);
      } catch (e) {
        // Si le parsing échoue, garder la valeur originale
        console.warn('Impossible de parser Coordonnee:', e);
      }
    }
    
    setFormData({
      Lib_pays: pays.Lib_pays || '',
      Coordonnee: coordonnee || null,
      Indicatif: pays.Indicatif || '',
      Sommeil: pays.Sommeil || false,
      Islocal: pays.Islocal || false,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (pays) => {
    setSelectedPays(pays);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      // Convertir Coordonnee en string si c'est un objet
      const dataToSend = {
        ...formData,
        Coordonnee: formData.Coordonnee && typeof formData.Coordonnee === 'object'
          ? JSON.stringify(formData.Coordonnee)
          : formData.Coordonnee
      };
      
      await paysAPI.create(dataToSend);
      setCreateDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitEdit = async () => {
    try {
      // Convertir Coordonnee en string si c'est un objet
      const dataToSend = {
        ...formData,
        Coordonnee: formData.Coordonnee && typeof formData.Coordonnee === 'object'
          ? JSON.stringify(formData.Coordonnee)
          : formData.Coordonnee
      };
      
      await paysAPI.update(selectedPays._id || selectedPays.id, dataToSend);
      setEditDialogOpen(false);
      setSelectedPays(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      await paysAPI.delete(selectedPays._id || selectedPays.id);
      setDeleteDialogOpen(false);
      setSelectedPays(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des pays..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Pays
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nouveau pays
          </Button>
        </Box>
        
        {/* Statistiques */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">
                  {pays.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total pays
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Barre de recherche */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Rechercher par nom ou indicatif..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Box>

      {/* Messages d'erreur */}
      {error && (
        <Box mb={2}>
          <Typography variant="body1" color="error">
            Erreur : {error}
          </Typography>
        </Box>
      )}

      {/* Tableau */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom du pays</TableCell>
                <TableCell>Indicatif</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPays.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      {searchTerm ? 'Aucun pays trouvé' : 'Aucune donnée'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPays
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((p) => (
                    <TableRow key={p._id || p.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {p.Islocal ? (
                            <Tooltip title="Pays local">
                              <HomeIcon sx={{ mr: 1, color: 'success.main' }} />
                            </Tooltip>
                          ) : (
                            <PublicIcon sx={{ mr: 1, color: 'primary.main' }} />
                          )}
                          <Typography variant="body1" fontWeight="medium">
                            {p.Lib_pays || '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{p.Indicatif || '—'}</TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          color={p.Sommeil ? 'error' : 'success'}
                          fontWeight="medium"
                        >
                          {p.Sommeil ? 'Inactif' : 'Actif'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => handleEdit(p)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton size="small" color="error" onClick={() => handleDelete(p)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPays.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Lignes par page:"
        />
      </Paper>

      {/* FAB */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreate}
      >
        <AddIcon />
      </Fab>

      {/* Dialog de création */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouveau pays</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom du pays"
                value={formData.Lib_pays}
                onChange={(e) => handleFormChange('Lib_pays', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Indicatif téléphonique"
                value={formData.Indicatif}
                onChange={(e) => handleFormChange('Indicatif', e.target.value)}
                placeholder="+226"
              />
            </Grid>
            <Grid item xs={12}>
              <GeoJSONInput
                value={formData.Coordonnee}
                onChange={(value) => handleFormChange('Coordonnee', value)}
                geometryType="Point"
                label="Coordonnées (Point GeoJSON)"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.Islocal}
                    onChange={(e) => handleFormChange('Islocal', e.target.checked)}
                  />
                }
                label="Pays local (pays de l'enquête)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleSubmitCreate} 
            variant="contained"
            disabled={!formData.Lib_pays}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier le pays</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom du pays"
                value={formData.Lib_pays}
                onChange={(e) => handleFormChange('Lib_pays', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Indicatif téléphonique"
                value={formData.Indicatif}
                onChange={(e) => handleFormChange('Indicatif', e.target.value)}
                placeholder="+225"
              />
            </Grid>
            <Grid item xs={12}>
              <GeoJSONInput
                value={formData.Coordonnee}
                onChange={(value) => handleFormChange('Coordonnee', value)}
                geometryType="Point"
                label="Coordonnées (Point GeoJSON)"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.Islocal}
                    onChange={(e) => handleFormChange('Islocal', e.target.checked)}
                  />
                }
                label="Pays local (pays de l'enquête)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleSubmitEdit} 
            variant="contained"
            disabled={!formData.Lib_pays}
          >
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer "{selectedPays?.Lib_pays}" ?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaysListPage;
