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
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Language as LanguageIcon,
  Flag as FlagIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, questionnairesAPI, interviewsAPI, usersAPI, villagesAPI, zonesInterditesAPI, profilesAPI, paysAPI, regionsAPI, departementsAPI, sousprefsAPI, parcellesAPI, handleApiError } from '../../../services/api.js';

const PaysListPage = () => {
  // État local
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
    Indicatif: '',
    Coordonnee: '',
    Sommeil: false
  });

  // Fonction utilitaire pour extraire la valeur d'un champ
  const getValue = (field) => {
    if (typeof field === 'object' && field !== null) {
      // Pour les objets avec _value
      if (field._value !== undefined) {
        return field._value;
      }
      // Pour les objets avec _text (comme libPays)
      if (field._text !== undefined) {
        return field._text;
      }
      // Si c'est un objet simple, essayer de prendre la première propriété string
      const keys = Object.keys(field);
      for (const key of keys) {
        if (typeof field[key] === 'string' && field[key].trim()) {
          return field[key];
        }
      }
    }
    return field || '';
  };

  // Fonction utilitaire pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      return '—';
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Chargement des pays...');
      // Récupérer tous les pays avec la limite maximale autorisée
      const response = await paysAPI.getAll({ limit: 100 }); // Limite maximale autorisée par le backend
      console.log('📡 Réponse API pays:', response);
      console.log('📡 Type de response:', typeof response);
      console.log('📡 Clés de response:', Object.keys(response || {}));
      
      // Vérifier la pagination
      if (response.pagination) {
        console.log('📄 Info pagination:', response.pagination);
        console.log('📄 Total items:', response.pagination.total);
        console.log('📄 Page actuelle:', response.pagination.page);
        console.log('📄 Limit par page:', response.pagination.limit);
      }
      
      const data = response.data || response;
      console.log('📊 Data extraite:', data);
      console.log('📊 Type de data:', typeof data);
      console.log('📊 Est un array?', Array.isArray(data));
      
      // Extraire les items si c'est un objet avec items, sinon utiliser directement data
      const paysData = data.items || data || [];
      console.log('🌍 Pays data final:', paysData);
      console.log('🌍 Nombre de pays récupérés:', paysData.length);
      
      if (response.pagination && response.pagination.total) {
        console.log(`🌍 Total en BDD: ${response.pagination.total}, Récupérés: ${paysData.length}`);
      }
      
      if (paysData.length > 0) {
        console.log('🌍 Premier pays:', paysData[0]);
        console.log('🌍 Dernier pays:', paysData[paysData.length - 1]);
      }
      
      setPays(paysData);
      setFilteredPays(paysData);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      console.error('❌ Stack trace:', error.stack);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Appliquer le filtre de recherche
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPays(pays);
    } else {
      const filtered = pays.filter(p => {
        const nomPays = getValue(p.libPays) || getValue(p.Lib_pays) || '';
        const indicatif = getValue(p.indicatif) || getValue(p.Indicatif) || '';
        return nomPays.toLowerCase().includes(searchTerm.toLowerCase()) ||
               indicatif.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredPays(filtered);
    }
    setPage(0); // Reset pagination lors du filtrage
  }, [pays, searchTerm]);

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
      Indicatif: '',
      Coordonnee: '',
      Sommeil: false
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (paysItem) => {
    setSelectedPays(paysItem);
    setFormData({
      Lib_pays: getValue(paysItem.libPays) || getValue(paysItem.Lib_pays),
      Indicatif: getValue(paysItem.indicatif) || getValue(paysItem.Indicatif),
      Coordonnee: getValue(paysItem.coordonnee) || getValue(paysItem.Coordonnee),
      Sommeil: paysItem.sommeil || paysItem.Sommeil || false
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (paysItem) => {
    setSelectedPays(paysItem);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      // Transformer les données pour le backend (camelCase)
      const backendData = {
        libPays: formData.Lib_pays,
        indicatif: formData.Indicatif,
        coordonnee: formData.Coordonnee,
        sommeil: formData.Sommeil
      };
      
      console.log('📤 Données envoyées au backend:', backendData);
      await paysAPI.create(backendData);
      
      // Fermer le modal et recharger les données
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
      // Transformer les données pour le backend (camelCase)
      const backendData = {
        libPays: formData.Lib_pays,
        indicatif: formData.Indicatif,
        coordonnee: formData.Coordonnee,
        sommeil: formData.Sommeil
      };
      
      console.log('📤 Données de modification envoyées:', backendData);
      await paysAPI.update(selectedPays._id, backendData);
      
      // Fermer le modal et recharger les données
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
      await paysAPI.delete(selectedPays._id);
      
      // Fermer le modal et recharger les données
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
        
        {/* Statistiques rapides */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="success.main">
                  {pays.filter(p => !(p.sommeil || p.Sommeil)).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Pays actifs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="warning.main">
                  {pays.filter(p => getValue(p.indicatif) || getValue(p.Indicatif)).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Avec indicatif
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
          placeholder="Rechercher par nom de pays ou indicatif..."
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

      {/* Tableau des pays */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pays</TableCell>
                <TableCell>Indicatif</TableCell>
                <TableCell>Coordonnées</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Date création</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPays.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      {searchTerm ? 'Aucun pays trouvé pour cette recherche' : 'Aucun pays trouvé'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPays
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((paysItem) => (
                <TableRow key={paysItem._id || paysItem.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <FlagIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1" fontWeight="medium">
                        {getValue(paysItem.libPays) || getValue(paysItem.Lib_pays) || '—'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {getValue(paysItem.indicatif) || getValue(paysItem.Indicatif) || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getValue(paysItem.coordonnee) || getValue(paysItem.Coordonnee) || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {paysItem.sommeil || paysItem.Sommeil ? '🔴 Inactif' : '🟢 Actif'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(paysItem._createdAt || paysItem.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Modifier">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(paysItem)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(paysItem)}
                      >
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredPays.length}
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nouveau pays</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Coordonnées"
                value={formData.Coordonnee}
                onChange={(e) => handleFormChange('Coordonnee', e.target.value)}
                placeholder="Coordonnées GPS"
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
            disabled={!formData.Lib_pays}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modifier le pays</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Coordonnées"
                value={formData.Coordonnee}
                onChange={(e) => handleFormChange('Coordonnee', e.target.value)}
                placeholder="Coordonnées GPS"
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
            disabled={!formData.Lib_pays}
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
            Êtes-vous sûr de vouloir supprimer le pays "{getValue(selectedPays?.libPays) || getValue(selectedPays?.Lib_pays)}" ?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Cette action est irréversible.
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

export default PaysListPage;