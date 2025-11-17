/**
 * Zones de Dénombrement List Page
 * Page de gestion des zones de dénombrement (CRUD)
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
  Place as PlaceIcon,
  AccountTree as AccountTreeIcon,
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { zonesdenombreAPI, secteursAdministratifsAPI, handleApiError } from '../../../../services/api.js';

const ZonesListPage = () => {
  // États locaux
  const [zones, setZones] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [secteurFilter, setSecteurFilter] = useState('');
  
  // États pour les modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    Lib_ZD: '',
    Cod_ZD: '',
    SecteurAdministratifId: '',
  });

  useEffect(() => {
    loadData();
    loadSecteurs();
  }, []);

  // Appliquer le filtre de recherche
  useEffect(() => {
    if (!searchTerm && !secteurFilter) {
      setFilteredZones(zones);
    } else {
      const filtered = zones.filter(z => {
        const Lib_ZD = z.Lib_ZD || '';
        const Cod_ZD = z.Cod_ZD || '';
        
        // Comparer les IDs correctement (string ou objet)
        const zoneSecteurId = typeof z.SecteurAdministratifId === 'object' ? (z.SecteurAdministratifId._id || z.SecteurAdministratifId.id) : z.SecteurAdministratifId;
        const secteurMatch = !secteurFilter || zoneSecteurId === secteurFilter;
        
        const searchMatch = !searchTerm || 
          Lib_ZD.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Cod_ZD.toLowerCase().includes(searchTerm.toLowerCase());
        
        return searchMatch && secteurMatch;
      });
      setFilteredZones(filtered);
    }
    setPage(0);
  }, [zones, searchTerm, secteurFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await zonesdenombreAPI.getAll({ limit: 100 });
      const data = response.data || response;
      const zonesData = data.items || data || [];
      
      setZones(zonesData);
      setFilteredZones(zonesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadSecteurs = async () => {
    try {
      const response = await secteursAdministratifsAPI.getAll({ limit: 100 });
      const data = response.data || response;
      const secteursData = data.items || data || [];
      setSecteurs(secteursData);
    } catch (error) {
      console.error('Erreur lors du chargement des secteurs:', error);
    }
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
      Lib_ZD: '',
      Cod_ZD: '',
      SecteurAdministratifId: '',
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (zone) => {
    setSelectedZone(zone);
    setFormData({
      Lib_ZD: zone.Lib_ZD || '',
      Cod_ZD: zone.Cod_ZD || '',
      SecteurAdministratifId: typeof zone.SecteurAdministratifId === 'object' ? (zone.SecteurAdministratifId._id || zone.SecteurAdministratifId.id) : zone.SecteurAdministratifId,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (zone) => {
    setSelectedZone(zone);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      await zonesdenombreAPI.create(formData);
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
      await zonesdenombreAPI.update(zoneId, formData);
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
      await zonesdenombreAPI.delete(zoneId);
      setDeleteDialogOpen(false);
      setSelectedZone(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getSecteurName = (secteurId) => {
    if (!secteurId) return '—';
    
    // Si secteurId est un objet avec _id ou id
    const searchId = typeof secteurId === 'object' ? (secteurId._id || secteurId.id) : secteurId;
    
    const secteur = secteurs.find(s => (s._id || s.id) === searchId);
    return secteur ? (secteur.Lib_SecteurAdministratif || '—') : '—';
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des zones de dénombrement..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Zones de Dénombrement
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nouvelle zone
          </Button>
        </Box>
        
        {/* Statistiques */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">
                  {zones.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total zones
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
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par secteur</InputLabel>
              <Select
                value={secteurFilter}
                onChange={(e) => setSecteurFilter(e.target.value)}
                label="Filtrer par secteur"
              >
                <MenuItem value="">Tous les secteurs</MenuItem>
                {secteurs.map((s) => (
                  <MenuItem key={s._id || s.id} value={s._id || s.id}>
                    {s.Lib_SecteurAdministratif || '—'}
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
                <TableCell>Secteur</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredZones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      {searchTerm || secteurFilter ? 'Aucune zone trouvée' : 'Aucune donnée'}
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
                          <PlaceIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1" fontWeight="medium">
                            {zone.Lib_ZD || '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={zone.Cod_ZD || '—'} size="small" />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <AccountTreeIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                          {getSecteurName(zone.SecteurAdministratifId)}
                        </Box>
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
          rowsPerPageOptions={[5, 10, 25, 50]}
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
        <DialogTitle>Nouvelle zone de dénombrement</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de la zone"
                value={formData.Lib_ZD}
                onChange={(e) => handleFormChange('Lib_ZD', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code de la zone"
                value={formData.Cod_ZD}
                onChange={(e) => handleFormChange('Cod_ZD', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Secteur administratif</InputLabel>
                <Select
                  value={formData.SecteurAdministratifId}
                  onChange={(e) => handleFormChange('SecteurAdministratifId', e.target.value)}
                  label="Secteur administratif"
                >
                  {secteurs.map((s) => (
                    <MenuItem key={s._id || s.id} value={s._id || s.id}>
                      {s.Lib_SecteurAdministratif || '—'}
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
            disabled={!formData.Lib_ZD || !formData.Cod_ZD || !formData.SecteurAdministratifId}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier la zone de dénombrement</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de la zone"
                value={formData.Lib_ZD}
                onChange={(e) => handleFormChange('Lib_ZD', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code de la zone"
                value={formData.Cod_ZD}
                onChange={(e) => handleFormChange('Cod_ZD', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Secteur administratif</InputLabel>
                <Select
                  value={formData.SecteurAdministratifId}
                  onChange={(e) => handleFormChange('SecteurAdministratifId', e.target.value)}
                  label="Secteur administratif"
                >
                  {secteurs.map((s) => (
                    <MenuItem key={s._id || s.id} value={s._id || s.id}>
                      {s.Lib_SecteurAdministratif || '—'}
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
            disabled={!formData.Lib_ZD || !formData.Cod_ZD || !formData.SecteurAdministratifId}
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
            Êtes-vous sûr de vouloir supprimer "{selectedZone?.Lib_ZD}" ?
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

export default ZonesListPage;
