/**
 * Departements List Page
 * Page de gestion des départements (CRUD)
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
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocationCity as LocationCityIcon,
  Public as PublicIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, questionnairesAPI, interviewsAPI, usersAPI, villagesAPI, zonesInterditesAPI, profilesAPI, regionsAPI, departementsAPI, sousprefsAPI, parcellesAPI, handleApiError } from '../../../services/api.js';
import { getValue, getSafeId, getLibelle, extractDataFromApiResponse } from '../../../shared/utils/entityHelpers.js';

const DepartementsListPage = () => {
  // État local
  const [departements, setDepartements] = useState([]);
  const [filteredDepartements, setFilteredDepartements] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  
  // États pour les modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    libDepartement: '',
    regionId: '',
    sommeil: false
  });

  // Fonction utilitaire pour extraire la valeur d'un champ
  const getValue = (field) => {
    if (typeof field === 'object' && field !== null) {
      // Pour les objets avec _value
      if (field._value !== undefined) {
        return field._value;
      }
      // Pour les objets avec _text (comme libDepartement)
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

  useEffect(() => {
    loadData();
    loadRegions();
  }, []);

  // Appliquer le filtre de recherche
  useEffect(() => {
    if (!searchTerm && !regionFilter) {
      setFilteredDepartements(departements);
    } else {
      const filtered = departements.filter(d => {
        const nomDepartement = getValue(d.Lib_Departement) || getValue(d.libDepartement) || getValue(d.nom) || '';
        const regionMatch = !regionFilter || (d.RegionId && d.RegionId._id === regionFilter) || d.RegionId === regionFilter;
        
        const searchMatch = !searchTerm || 
          nomDepartement.toLowerCase().includes(searchTerm.toLowerCase());
        
        return searchMatch && regionMatch;
      });
      setFilteredDepartements(filtered);
    }
    setPage(0); // Reset pagination lors du filtrage
  }, [departements, searchTerm, regionFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Chargement des départements...');
      // Récupérer tous les départements avec la limite maximale autorisée
      const response = await departementsAPI.getAll({ limit: 100 });
      console.log('📡 Réponse API départements:', response);
      
      const data = response.data || response;
      const departementsData = data.items || data || [];
      console.log('🏛️ Départements data final:', departementsData);
      console.log('🏛️ Nombre de départements récupérés:', departementsData.length);
      
      if (departementsData.length > 0) {
        console.log('🏛️ Premier département:', departementsData[0]);
        console.log('🏛️ Dernier département:', departementsData[departementsData.length - 1]);
      }
      
      setDepartements(departementsData);
      setFilteredDepartements(departementsData);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      console.error('❌ Stack trace:', error.stack);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadRegions = async () => {
    try {
      console.log('🔍 Chargement des régions pour le filtre...');
      const response = await regionsAPI.getAll({ limit: 100 });
      const data = response.data || response;
      const regionsData = data.items || data || [];
      console.log('🌍 Régions chargées pour filtre:', regionsData.length);
      setRegions(regionsData);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des régions:', error);
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
      libDepartement: '',
      regionId: '',
      sommeil: false
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (departement) => {
    setSelectedDepartement(departement);
    setFormData({
      libDepartement: getValue(departement.Lib_Departement) || getValue(departement.libDepartement) || getValue(departement.nom),
      regionId: typeof departement.RegionId === 'object' ? departement.RegionId._id : departement.RegionId,
      sommeil: departement.sommeil || departement.Sommeil || false
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (departement) => {
    setSelectedDepartement(departement);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      // Transformer les données pour le backend
      const backendData = {
        libDepartement: formData.libDepartement,
        regionId: formData.regionId,
        sommeil: formData.sommeil
      };
      
      console.log('📤 Données département envoyées au backend:', backendData);
      await departementsAPI.create(backendData);
      
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
      // Transformer les données pour le backend
      const backendData = {
        libDepartement: formData.libDepartement,
        regionId: formData.regionId,
        sommeil: formData.sommeil
      };
      
      console.log('📤 Données de modification département envoyées:', backendData);
      await departementsAPI.update(selectedDepartement._id, backendData);
      
      // Fermer le modal et recharger les données
      setEditDialogOpen(false);
      setSelectedDepartement(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      await departementsAPI.delete(selectedDepartement._id);
      
      // Fermer le modal et recharger les données
      setDeleteDialogOpen(false);
      setSelectedDepartement(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des départements..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Départements
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nouveau département
          </Button>
        </Box>
        
        {/* Statistiques rapides */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">
                  {departements.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total départements
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="success.main">
                  {departements.filter(d => !(d.sommeil || d.Sommeil)).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Départements actifs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="warning.main">
                  {new Set(departements.map(d => typeof d.RegionId === 'object' ? d.RegionId._id : d.RegionId).filter(Boolean)).size}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Régions couvertes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Barre de recherche et filtres */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom de département..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par région</InputLabel>
              <Select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                label="Filtrer par région"
              >
                <MenuItem value="">Toutes les régions</MenuItem>
                {regions.map((r) => (
                  <MenuItem key={r._id || r.id} value={r._id || r.id}>
                    {r.Lib_region || r.libRegion || r.nom || getValue(r.Lib_region) || getValue(r.nom) || '—'}
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

      {/* Tableau des départements */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Département</TableCell>
                <TableCell>Région</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDepartements.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      {searchTerm || regionFilter ? 'Aucun département trouvé pour cette recherche' : 'Aucun département trouvé'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDepartements
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((departement) => (
                <TableRow key={departement._id || departement.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <LocationCityIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1" fontWeight="medium">
                        {getValue(departement.Lib_Departement) || getValue(departement.libDepartement) || getValue(departement.nom) || '—'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <LocationIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {departement.RegionId && typeof departement.RegionId === 'object' ? 
                          getValue(departement.RegionId.Lib_region) || getValue(departement.RegionId.nom) : 
                          departement.RegionId || '—'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={departement.Sommeil ? 'error' : 'success.main'}>
                      {departement.Sommeil ? 'Inactif' : 'Actif'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Modifier">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(departement)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(departement)}
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
          count={filteredDepartements.length}
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
        <DialogTitle>Nouveau département</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom du département"
                value={formData.libDepartement}
                onChange={(e) => handleFormChange('libDepartement', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Région</InputLabel>
                <Select
                  value={formData.regionId}
                  onChange={(e) => handleFormChange('regionId', e.target.value)}
                  label="Région"
                >
                  {regions.map((r) => (
                    <MenuItem key={r._id || r.id} value={r._id || r.id}>
                      {r.Lib_region || r.libRegion || r.nom || getValue(r.Lib_region) || getValue(r.nom) || '—'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            disabled={!formData.libDepartement || !formData.regionId}
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
        <DialogTitle>Modifier le département</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom du département"
                value={formData.libDepartement}
                onChange={(e) => handleFormChange('libDepartement', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Région</InputLabel>
                <Select
                  value={formData.regionId}
                  onChange={(e) => handleFormChange('regionId', e.target.value)}
                  label="Région"
                >
                  {regions.map((r) => (
                    <MenuItem key={r._id || r.id} value={r._id || r.id}>
                      {r.Lib_region || r.libRegion || r.nom || getValue(r.Lib_region) || getValue(r.nom) || '—'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            disabled={!formData.libDepartement || !formData.regionId}
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
            Êtes-vous sûr de vouloir supprimer le département "{getValue(selectedDepartement?.Lib_Departement) || getValue(selectedDepartement?.libDepartement) || getValue(selectedDepartement?.nom)}" ?
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

export default DepartementsListPage;