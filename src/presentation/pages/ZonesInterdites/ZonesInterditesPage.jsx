/**
 * Zones Interdites Page
 * Page de liste des zones interdites (utilisant le modèle Zone_interdit)
 */

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Block as BlockIcon,
  Public as PublicIcon,
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import GeoJSONInput from '@presentation/components/Common/GeoJSONInput.jsx';
import { zonesInterditesAPI, paysAPI, handleApiError } from '../../../services/api.js';

const ZonesInterditesPage = () => {
  // États locaux
  const [zonesInterdites, setZonesInterdites] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [pays, setPays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [paysFilter, setPaysFilter] = useState('');
  const [sommeilFilter, setSommeilFilter] = useState('');
  
  // États pour les modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    Lib_zi: '',
    Coordonnee: null,
    Sommeil: false,
    PaysId: '',
  });

  useEffect(() => {
    loadData();
    loadPays();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    if (!searchTerm && !paysFilter && !sommeilFilter) {
      setFilteredZones(zonesInterdites);
    } else {
      const filtered = zonesInterdites.filter(z => {
        const Lib_zi = z.Lib_zi || '';
        
        // Comparer les IDs correctement (string ou objet)
        const zonePaysId = typeof z.PaysId === 'object' ? (z.PaysId._id || z.PaysId.id) : z.PaysId;
        const paysMatch = !paysFilter || zonePaysId === paysFilter;
        
        const sommeilMatch = !sommeilFilter || z.Sommeil.toString() === sommeilFilter;
        
        const searchMatch = !searchTerm || 
          Lib_zi.toLowerCase().includes(searchTerm.toLowerCase());
        
        return searchMatch && paysMatch && sommeilMatch;
      });
      setFilteredZones(filtered);
    }
    setPage(0);
  }, [zonesInterdites, searchTerm, paysFilter, sommeilFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await zonesInterditesAPI.getAll({ limit: 2000 });
      const data = response.data || response;
      const zonesData = data.items || data || [];
      
      setZonesInterdites(zonesData);
      setFilteredZones(zonesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadPays = async () => {
    try {
      const response = await paysAPI.getAll({ limit: 2000 });
      const data = response.data || response;
      const paysData = data.items || data || [];
      setPays(paysData);
    } catch (error) {
      console.error('Erreur lors du chargement des pays:', error);
    }
  };

  // Calcul des statistiques
  const stats = {
    total: zonesInterdites.length,
    actives: zonesInterdites.filter(z => !z.Sommeil).length,
    sommeil: zonesInterdites.filter(z => z.Sommeil).length,
    pays: new Set(zonesInterdites.map(z => {
      const id = typeof z.PaysId === 'object' ? (z.PaysId._id || z.PaysId.id) : z.PaysId;
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
      Lib_zi: '',
      Coordonnee: null,
      Sommeil: false,
      PaysId: '',
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (zone) => {
    setSelectedZone(zone);
    setFormData({
      Lib_zi: zone.Lib_zi || '',
      Coordonnee: zone.Coordonnee || null,
      Sommeil: zone.Sommeil || false,
      PaysId: typeof zone.PaysId === 'object' ? (zone.PaysId._id || zone.PaysId.id) : zone.PaysId,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (zone) => {
    setSelectedZone(zone);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      await zonesInterditesAPI.create(formData);
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
      const zoneId = selectedZone.id || selectedZone._id;
      await zonesInterditesAPI.update(zoneId, formData);
      setEditDialogOpen(false);
      setSelectedZone(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const zoneId = selectedZone.id || selectedZone._id;
      await zonesInterditesAPI.delete(zoneId);
      setDeleteDialogOpen(false);
      setSelectedZone(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getPaysName = (paysId) => {
    if (!paysId) return '—';
    
    // Si paysId est un objet avec _id ou id
    const searchId = typeof paysId === 'object' ? (paysId._id || paysId.id) : paysId;
    
    const paysItem = pays.find(p => (p._id || p.id) === searchId);
    return paysItem ? (paysItem.Lib_pays || '—') : '—';
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des zones interdites..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Zones interdites
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nouvelle zone interdite
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
                  Total zones
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="success.main">
                  {stats.actives}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Zones actives
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="warning.main">
                  {stats.sommeil}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  En sommeil
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="info.main">
                  {stats.pays}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Pays
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Barre de recherche */}
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Rechercher une zone interdite..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par pays</InputLabel>
              <Select
                value={paysFilter}
                onChange={(e) => setPaysFilter(e.target.value)}
                label="Filtrer par pays"
              >
                <MenuItem value="">Tous les pays</MenuItem>
                {pays.map((p) => (
                  <MenuItem key={p._id || p.id} value={p._id || p.id}>
                    {p.Lib_pays || '—'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par statut</InputLabel>
              <Select
                value={sommeilFilter}
                onChange={(e) => setSommeilFilter(e.target.value)}
                label="Filtrer par statut"
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="false">Actif</MenuItem>
                <MenuItem value="true">En sommeil</MenuItem>
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
                <TableCell>Zone interdite</TableCell>
                <TableCell>Pays</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredZones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      {searchTerm || paysFilter || sommeilFilter ? 'Aucune zone interdite trouvée' : 'Aucune donnée'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredZones
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((zone) => (
                    <TableRow key={zone._id || zone.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <BlockIcon sx={{ mr: 1, color: 'error.main' }} />
                          <Typography variant="body1" fontWeight="medium">
                            {zone.Lib_zi || '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <PublicIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                          {getPaysName(zone.PaysId)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={zone.Sommeil ? 'En sommeil' : 'Actif'}
                          color={zone.Sommeil ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => handleEdit(zone)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton size="small" color="error" onClick={() => handleDelete(zone)}>
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
          count={filteredZones.length}
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
        <DialogTitle>Nouvelle zone interdite</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de la zone interdite"
                value={formData.Lib_zi}
                onChange={(e) => handleFormChange('Lib_zi', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Pays</InputLabel>
                <Select
                  value={formData.PaysId}
                  onChange={(e) => handleFormChange('PaysId', e.target.value)}
                  label="Pays"
                >
                  {pays.map((p) => (
                    <MenuItem key={p._id || p.id} value={p._id || p.id}>
                      {p.Lib_pays || '—'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={formData.Sommeil}
                  onChange={(e) => handleFormChange('Sommeil', e.target.value)}
                  label="Statut"
                >
                  <MenuItem value={false}>Actif</MenuItem>
                  <MenuItem value={true}>En sommeil</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <GeoJSONInput
                value={formData.Coordonnee}
                onChange={(value) => handleFormChange('Coordonnee', value)}
                geometryType="Polygon"
                label="Coordonnées (Polygon GeoJSON, optionnel)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleSubmitCreate} 
            variant="contained"
            disabled={!formData.Lib_zi || !formData.PaysId}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier la zone interdite</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de la zone interdite"
                value={formData.Lib_zi}
                onChange={(e) => handleFormChange('Lib_zi', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Pays</InputLabel>
                <Select
                  value={formData.PaysId}
                  onChange={(e) => handleFormChange('PaysId', e.target.value)}
                  label="Pays"
                >
                  {pays.map((p) => (
                    <MenuItem key={p._id || p.id} value={p._id || p.id}>
                      {p.Lib_pays || '—'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={formData.Sommeil}
                  onChange={(e) => handleFormChange('Sommeil', e.target.value)}
                  label="Statut"
                >
                  <MenuItem value={false}>Actif</MenuItem>
                  <MenuItem value={true}>En sommeil</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <GeoJSONInput
                value={formData.Coordonnee}
                onChange={(value) => handleFormChange('Coordonnee', value)}
                geometryType="Polygon"
                label="Coordonnées (Polygon GeoJSON, optionnel)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleSubmitEdit} 
            variant="contained"
            disabled={!formData.Lib_zi || !formData.PaysId}
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
            Êtes-vous sûr de vouloir supprimer "{selectedZone?.Lib_zi}" ?
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

export default ZonesInterditesPage;