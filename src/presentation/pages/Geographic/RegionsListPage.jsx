/**
 * Regions List Page
 * Page de gestion des régions (CRUD)
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
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Public as PublicIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, questionnairesAPI, interviewsAPI, usersAPI, villagesAPI, zonesInterditesAPI, profilesAPI, regionsAPI, districtAPI, departementsAPI, sousprefsAPI, parcellesAPI, handleApiError } from '../../../services/api.js';
import { getValue, getSafeId, getLibelle, extractDataFromApiResponse } from '../../../shared/utils/entityHelpers.js';

const RegionsListPage = () => {
  // État local
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  
  // États pour les modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    libRegion: '',
    coordonnee: '',
    districtId: '',
    sommeil: false
  });

  // Fonction utilitaire pour extraire la valeur d'un champ
  const getValue = (field) => {
    if (typeof field === 'object' && field !== null) {
      // Pour les objets avec _value
      if (field._value !== undefined) {
        return field._value;
      }
      // Pour les objets avec _text (comme libRegion)
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
    loadDistricts();
  }, []);

  // Appliquer le filtre de recherche
  useEffect(() => {
    if (!searchTerm && !districtFilter) {
      setFilteredRegions(regions);
    } else {
      const filtered = regions.filter(r => {
        const nomRegion = getValue(r.Lib_region) || getValue(r.libRegion) || getValue(r.nom) || '';
        const codeRegion = getValue(r.codeRegion) || getValue(r.code) || '';
        const chefLieu = getValue(r.chefLieu) || '';
        const districtMatch = !districtFilter || (r.DistrictId && r.DistrictId._id === districtFilter) || r.DistrictId === districtFilter;
        
        const searchMatch = !searchTerm || 
          nomRegion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          codeRegion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chefLieu.toLowerCase().includes(searchTerm.toLowerCase());
        
        return searchMatch && districtMatch;
      });
      setFilteredRegions(filtered);
    }
    setPage(0); // Reset pagination lors du filtrage
  }, [regions, searchTerm, districtFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Chargement des régions...');
      // Récupérer toutes les régions avec la limite maximale autorisée
      const response = await regionsAPI.getAll({ limit: 100 });
      console.log('📡 Réponse API régions:', response);
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
      const regionsData = data.items || data || [];
      console.log('🌍 Régions data final:', regionsData);
      console.log('🌍 Nombre de régions récupérées:', regionsData.length);
      
      if (response.pagination && response.pagination.total) {
        console.log(`🌍 Total en BDD: ${response.pagination.total}, Récupérées: ${regionsData.length}`);
      }
      
      if (regionsData.length > 0) {
        console.log('🌍 Première région:', regionsData[0]);
        console.log('🌍 Dernière région:', regionsData[regionsData.length - 1]);
      }
      
      setRegions(regionsData);
      setFilteredRegions(regionsData);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      console.error('❌ Stack trace:', error.stack);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadDistricts = async () => {
    try {
      console.log('🔍 Chargement des districts pour le filtre...');
      const response = await districtAPI.getAll({ limit: 100 });
      const data = response.data || response;
      const districtsData = data.items || data || [];
      console.log('🌍 Districts chargés pour filtre:', districtsData.length);
      setDistricts(districtsData);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des districts:', error);
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
      libRegion: '',
      coordonnee: '',
      districtId: '',
      sommeil: false
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (region) => {
    setSelectedRegion(region);
    setFormData({
      libRegion: getValue(region.Lib_region) || getValue(region.libRegion) || getValue(region.nom),
      coordonnee: getValue(region.Coordonnee) || '',
      districtId: typeof region.DistrictId === 'object' ? region.DistrictId._id : region.DistrictId,
      sommeil: region.sommeil || region.Sommeil || false
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (region) => {
    setSelectedRegion(region);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      // Transformer les données pour le backend
      const backendData = {
        libRegion: formData.libRegion,
        coordonnee: formData.coordonnee || '',
        districtId: formData.districtId,
        sommeil: formData.sommeil
      };
      
      console.log('📤 Données région envoyées au backend:', backendData);
      await regionsAPI.create(backendData);
      
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
        libRegion: formData.libRegion,
        coordonnee: formData.coordonnee || '',
        districtId: formData.districtId,
        sommeil: formData.sommeil
      };
      
      console.log('📤 Données de modification région envoyées:', backendData);
      await regionsAPI.update(selectedRegion._id, backendData);
      
      // Fermer le modal et recharger les données
      setEditDialogOpen(false);
      setSelectedRegion(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      await regionsAPI.delete(selectedRegion._id);
      
      // Fermer le modal et recharger les données
      setDeleteDialogOpen(false);
      setSelectedRegion(null);
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
    return <LoadingSpinner size={60} message="Chargement des régions..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Régions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nouvelle région
          </Button>
        </Box>
        
        {/* Statistiques rapides */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">
                  {regions.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total régions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="success.main">
                  {regions.filter(r => !(r.sommeil || r.Sommeil)).length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Régions actives
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="warning.main">
                  {new Set(regions.map(r => typeof r.DistrictId === 'object' ? r.DistrictId._id : r.DistrictId).filter(Boolean)).size}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Districts couverts
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
              placeholder="Rechercher par nom, code ou chef-lieu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par district</InputLabel>
              <Select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                label="Filtrer par district"
              >
                <MenuItem value="">Tous les districts</MenuItem>
                {districts.map((d) => (
                  <MenuItem key={d._id || d.id} value={d._id || d.id}>
                    {d.Lib_district || d.libDistrict || d.nom || getValue(d.Lib_district) || getValue(d.nom) || '—'}
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

      {/* Tableau des régions */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Région</TableCell>
                <TableCell>Coordonnées</TableCell>
                <TableCell>District</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRegions.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      {searchTerm || districtFilter ? 'Aucune région trouvée pour cette recherche' : 'Aucune région trouvée'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((region) => (
                <TableRow key={region._id || region.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1" fontWeight="medium">
                        {getValue(region.Lib_region) || getValue(region.libRegion) || getValue(region.nom) || '—'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontSize="0.8rem">
                      {getValue(region.Coordonnee) ? 
                        (getValue(region.Coordonnee).length > 50 ? 
                          getValue(region.Coordonnee).substring(0, 50) + '...' : 
                          getValue(region.Coordonnee)) 
                        : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <PublicIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {region.DistrictId && typeof region.DistrictId === 'object' ? 
                          getValue(region.DistrictId.Lib_district) || getValue(region.DistrictId.nom) : 
                          region.DistrictId || '—'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={region.Sommeil ? 'error' : 'success.main'}>
                      {region.Sommeil ? 'Inactif' : 'Actif'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Modifier">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(region)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(region)}
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
          count={filteredRegions.length}
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
        <DialogTitle>Nouvelle région</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de la région"
                value={formData.libRegion}
                onChange={(e) => handleFormChange('libRegion', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>District</InputLabel>
                <Select
                  value={formData.districtId}
                  onChange={(e) => handleFormChange('districtId', e.target.value)}
                  label="District"
                >
                  {districts.map((d) => (
                    <MenuItem key={d._id || d.id} value={d._id || d.id}>
                      {d.Lib_district || d.libDistrict || d.nom || getValue(d.Lib_district) || getValue(d.nom) || '—'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coordonnées (GeoJSON ou autre format)"
                multiline
                rows={4}
                value={formData.coordonnee}
                onChange={(e) => handleFormChange('coordonnee', e.target.value)}
                placeholder="Entrez les coordonnées géographiques de la région"
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
            disabled={!formData.libRegion || !formData.districtId}
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
        <DialogTitle>Modifier la région</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de la région"
                value={formData.libRegion}
                onChange={(e) => handleFormChange('libRegion', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>District</InputLabel>
                <Select
                  value={formData.districtId}
                  onChange={(e) => handleFormChange('districtId', e.target.value)}
                  label="District"
                >
                  {districts.map((d) => (
                    <MenuItem key={d._id || d.id} value={d._id || d.id}>
                      {d.Lib_district || d.libDistrict || d.nom || getValue(d.Lib_district) || getValue(d.nom) || '—'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coordonnées (GeoJSON ou autre format)"
                multiline
                rows={4}
                value={formData.coordonnee}
                onChange={(e) => handleFormChange('coordonnee', e.target.value)}
                placeholder="Entrez les coordonnées géographiques de la région"
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
            disabled={!formData.libRegion || !formData.districtId}
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
            Êtes-vous sûr de vouloir supprimer la région "{getValue(selectedRegion?.Lib_region) || getValue(selectedRegion?.libRegion) || getValue(selectedRegion?.nom)}" ?
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

export default RegionsListPage;