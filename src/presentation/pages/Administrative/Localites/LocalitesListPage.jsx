/**
 * Localités List Page
 * Page de gestion des localités (CRUD)
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Map as MapIcon,
  Home as HomeIcon,
  Group as GroupIcon,
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { localitesAPI, villagesAPI, handleApiError } from '../../../../services/api.js';

const LocalitesListPage = () => {
  // États locaux
  const [localites, setLocalites] = useState([]);
  const [filteredLocalites, setFilteredLocalites] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  
  // États pour les modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLocalite, setSelectedLocalite] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    Lib_localite: '',
    Cod_localite: '',
    VillageId: '',
  });

  useEffect(() => {
    loadData();
    loadVillages();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    if (!searchTerm && !villageFilter) {
      setFilteredLocalites(localites);
    } else {
      const filtered = localites.filter(l => {
        const Lib_localite = l.Lib_localite || '';
        const Cod_localite = l.Cod_localite || '';
        
        // Comparer les IDs correctement (string ou objet)
        const localiteVillageId = typeof l.VillageId === 'object' ? (l.VillageId._id || l.VillageId.id) : l.VillageId;
        const villageMatch = !villageFilter || localiteVillageId === villageFilter;
        
        const searchMatch = !searchTerm || 
          Lib_localite.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Cod_localite.toLowerCase().includes(searchTerm.toLowerCase());
        
        return searchMatch && villageMatch;
      });
      setFilteredLocalites(filtered);
    }
    setPage(0);
  }, [localites, searchTerm, villageFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await localitesAPI.getAll({ limit: 2000 });
      const data = response.data || response;
      const localitesData = data.items || data || [];
      
      setLocalites(localitesData);
      setFilteredLocalites(localitesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadVillages = async () => {
    try {
      const response = await villagesAPI.getAll({ limit: 2000 });
      const data = response.data || response;
      const villagesData = data.items || data || [];
      setVillages(villagesData);
    } catch (error) {
      console.error('Erreur lors du chargement des villages:', error);
    }
  };

  // Calcul des statistiques
  const stats = {
    total: localites.length,
    villages: new Set(localites.map(l => {
      const id = typeof l.VillageId === 'object' ? (l.VillageId._id || l.VillageId.id) : l.VillageId;
      return id;
    }).filter(Boolean)).size
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
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
      Lib_localite: '',
      Cod_localite: '',
      VillageId: '',
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (localite) => {
    setSelectedLocalite(localite);
    setFormData({
      Lib_localite: localite.Lib_localite || '',
      Cod_localite: localite.Cod_localite || '',
      VillageId: typeof localite.VillageId === 'object' ? (localite.VillageId._id || localite.VillageId.id) : localite.VillageId,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (localite) => {
    setSelectedLocalite(localite);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      await localitesAPI.create(formData);
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
      const localiteId = selectedLocalite.id || selectedLocalite._id;
      await localitesAPI.update(localiteId, formData);
      setEditDialogOpen(false);
      setSelectedLocalite(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const localiteId = selectedLocalite.id || selectedLocalite._id;
      await localitesAPI.delete(localiteId);
      setDeleteDialogOpen(false);
      setSelectedLocalite(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getVillageName = (villageId) => {
    if (!villageId) return '—';
    
    // Si villageId est un objet avec _id ou id
    const searchId = typeof villageId === 'object' ? (villageId._id || villageId.id) : villageId;
    
    const village = villages.find(v => (v._id || v.id) === searchId);
    return village ? (village.Lib_village || '—') : '—';
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des quartiers..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Quartiers
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nouveau quartier
          </Button>
        </Box>
        
        {/* Statistiques */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total quartiers
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>

      {/* Barre de recherche */}
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom ou code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par localité</InputLabel>
              <Select
                value={villageFilter}
                onChange={(e) => setVillageFilter(e.target.value)}
                label="Filtrer par localité"
              >
                <MenuItem value="">Toutes les localités</MenuItem>
                {villages.map((v) => (
                  <MenuItem key={v._id || v.id} value={v._id || v.id}>
                    {v.Lib_village || '—'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
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
                <TableCell>Nom</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Localité</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLocalites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      {searchTerm || villageFilter ? 'Aucun quartier trouvé' : 'Aucune donnée'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLocalites
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((localite) => (
                    <TableRow key={localite._id || localite.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1" fontWeight="medium">
                            {localite.Lib_localite || '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={localite.Cod_localite || '—'} size="small" />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <HomeIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                          {getVillageName(localite.VillageId)}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => handleEdit(localite)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton size="small" color="error" onClick={() => handleDelete(localite)}>
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
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredLocalites.length}
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
        <DialogTitle>Nouveau quartier</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom du quartier"
                value={formData.Lib_localite}
                onChange={(e) => handleFormChange('Lib_localite', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code du quartier"
                value={formData.Cod_localite}
                onChange={(e) => handleFormChange('Cod_localite', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Localité</InputLabel>
                <Select
                  value={formData.VillageId}
                  onChange={(e) => handleFormChange('VillageId', e.target.value)}
                  label="Localité"
                >
                  {villages.map((v) => (
                    <MenuItem key={v._id || v.id} value={v._id || v.id}>
                      {v.Lib_village || '—'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleSubmitCreate} 
            variant="contained"
            disabled={!formData.Lib_localite || !formData.Cod_localite || !formData.VillageId}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier le quartier</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom du quartier"
                value={formData.Lib_localite}
                onChange={(e) => handleFormChange('Lib_localite', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code du quartier"
                value={formData.Cod_localite}
                onChange={(e) => handleFormChange('Cod_localite', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Localité</InputLabel>
                <Select
                  value={formData.VillageId}
                  onChange={(e) => handleFormChange('VillageId', e.target.value)}
                  label="Localité"
                >
                  {villages.map((v) => (
                    <MenuItem key={v._id || v.id} value={v._id || v.id}>
                      {v.Lib_village || '—'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleSubmitEdit} 
            variant="contained"
            disabled={!formData.Lib_localite || !formData.Cod_localite || !formData.VillageId}
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
            Êtes-vous sûr de vouloir supprimer "{selectedLocalite?.Lib_localite}" ?
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

export default LocalitesListPage;
