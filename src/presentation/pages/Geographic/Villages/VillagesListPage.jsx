/**
 * Villages List Page - Page de gestion des villages (CRUD)
 */
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Card, CardContent, Fab, Tooltip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Home as HomeIcon, Domain as DomainIcon } from '@mui/icons-material';
import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import GeoJSONInput from '@presentation/components/Common/GeoJSONInput.jsx';
import { villagesAPI, zonesdenombreAPI, handleApiError } from '../../../../services/api.js';

const VillagesListPage = () => {
  const [villages, setVillages] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [formData, setFormData] = useState({ Lib_village: '', Coordonnee: null, ZonedenombreId: '' });

  useEffect(() => { loadData(); loadZones(); }, []);
  useEffect(() => {
    if (!searchTerm && !zoneFilter) {
      setFilteredVillages(villages);
    } else {
      const filtered = villages.filter(v => {
        const Lib_village = v.Lib_village || '';
        
        // Comparer les IDs correctement (string ou objet)
        const villageZoneId = typeof v.ZonedenombreId === 'object' ? (v.ZonedenombreId._id || v.ZonedenombreId.id) : v.ZonedenombreId;
        const zoneMatch = !zoneFilter || villageZoneId === zoneFilter;
        
        const searchMatch = !searchTerm || Lib_village.toLowerCase().includes(searchTerm.toLowerCase());
        return searchMatch && zoneMatch;
      });
      setFilteredVillages(filtered);
    }
    setPage(0);
  }, [villages, searchTerm, zoneFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await villagesAPI.getAll({ limit: 2000 });
      const data = response.data || response;
      const villagesData = data.items || data || [];
      setVillages(villagesData);
      setFilteredVillages(villagesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadZones = async () => {
    try {
      const response = await zonesdenombreAPI.getAll({ limit: 2000 });
      const data = response.data || response;
      setZones(data.items || data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des zones de dénombrement:', error);
    }
  };

  const stats = { 
    total: villages.length, 
    zones: new Set(villages.map(v => {
      const id = typeof v.ZonedenombreId === 'object' ? (v.ZonedenombreId._id || v.ZonedenombreId.id) : v.ZonedenombreId;
      return id;
    }).filter(Boolean)).size 
  };
  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => { setRowsPerPage(Number.parseInt(event.target.value, 10)); setPage(0); };
  const handleFormChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const resetForm = () => setFormData({ Lib_village: '', Coordonnee: null, ZonedenombreId: '' });

  const handleCreate = () => { resetForm(); setCreateDialogOpen(true); };
  const handleEdit = (village) => {
    setSelectedVillage(village);
    setFormData({
      Lib_village: village.Lib_village || '',
      Coordonnee: village.Coordonnee || null,
      ZonedenombreId: typeof village.ZonedenombreId === 'object' ? (village.ZonedenombreId._id || village.ZonedenombreId.id) : village.ZonedenombreId,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (village) => { setSelectedVillage(village); setDeleteDialogOpen(true); };
  const handleSubmitCreate = async () => {
    try {
      await villagesAPI.create(formData);
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
      const villageId = selectedVillage.id || selectedVillage._id;
      await villagesAPI.update(villageId, formData);
      setEditDialogOpen(false);
      setSelectedVillage(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const villageId = selectedVillage.id || selectedVillage._id;
      await villagesAPI.delete(villageId);
      setDeleteDialogOpen(false);
      setSelectedVillage(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getZoneName = (zoneId) => {
    if (!zoneId) return '—';
    
    // Si zoneId est un objet avec _id ou id
    const searchId = typeof zoneId === 'object' ? (zoneId._id || zoneId.id) : zoneId;
    
    const zone = zones.find(z => (z._id || z.id) === searchId);
    return zone ? (zone.Lib_ZD || '—') : '—';
  };

  if (loading) return <LoadingSpinner size={60} message="Chargement des villages..." />;

  return (
    <Container maxWidth="xl">
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">Localités</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>Nouvelle localité</Button>
        </Box>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}><Card><CardContent sx={{ textAlign: 'center', py: 2 }}><Typography variant="h4" color="primary">{stats.total}</Typography><Typography variant="body2" color="textSecondary">Total localités</Typography></CardContent></Card></Grid>
        </Grid>
      </Box>

      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><TextField fullWidth placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth><InputLabel>Filtrer par zone de dénombrement</InputLabel>
              <Select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} label="Filtrer par zone de dénombrement">
                <MenuItem value="">Toutes les zones</MenuItem>
                {zones.map((z) => <MenuItem key={z._id || z.id} value={z._id || z.id}>{z.Lib_ZD || '—'}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && <Box mb={2}><Typography variant="body1" color="error">Erreur : {error}</Typography></Box>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead><TableRow><TableCell>Nom</TableCell><TableCell>Zone de dénombrement</TableCell><TableCell align="center">Actions</TableCell></TableRow></TableHead>
            <TableBody>
              {filteredVillages.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center"><Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>{searchTerm || zoneFilter ? 'Aucun village trouvé' : 'Aucune donnée'}</Typography></TableCell></TableRow>
              ) : (
                filteredVillages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((village) => (
                  <TableRow key={village._id || village.id} hover>
                    <TableCell><Box display="flex" alignItems="center"><HomeIcon sx={{ mr: 1, color: 'primary.main' }} /><Typography variant="body1" fontWeight="medium">{village.Lib_village || '—'}</Typography></Box></TableCell>
                    <TableCell><Box display="flex" alignItems="center"><DomainIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />{getZoneName(village.ZonedenombreId)}</Box></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEdit(village)}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton size="small" color="error" onClick={() => handleDelete(village)}><DeleteIcon /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[10, 25, 50, 100]} component="div" count={filteredVillages.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} labelRowsPerPage="Lignes par page:" />
      </Paper>

      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleCreate}><AddIcon /></Fab>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouvelle localité</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Nom de la localité" value={formData.Lib_village} onChange={(e) => handleFormChange('Lib_village', e.target.value)} required /></Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required><InputLabel>Zone de dénombrement</InputLabel>
                <Select value={formData.ZonedenombreId} onChange={(e) => handleFormChange('ZonedenombreId', e.target.value)} label="Zone de dénombrement">
                  {zones.map((z) => <MenuItem key={z._id || z.id} value={z._id || z.id}>{z.Lib_ZD || '—'}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><GeoJSONInput value={formData.Coordonnee} onChange={(value) => handleFormChange('Coordonnee', value)} geometryType="Point" label="Coordonnées (Point GeoJSON, optionnel)" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitCreate} variant="contained" disabled={!formData.Lib_village || !formData.ZonedenombreId}>Créer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier la localité</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Nom de la localité" value={formData.Lib_village} onChange={(e) => handleFormChange('Lib_village', e.target.value)} required /></Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required><InputLabel>Zone de dénombrement</InputLabel>
                <Select value={formData.ZonedenombreId} onChange={(e) => handleFormChange('ZonedenombreId', e.target.value)} label="Zone de dénombrement">
                  {zones.map((z) => <MenuItem key={z._id || z.id} value={z._id || z.id}>{z.Lib_ZD || '—'}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><GeoJSONInput value={formData.Coordonnee} onChange={(value) => handleFormChange('Coordonnee', value)} geometryType="Point" label="Coordonnées (Point GeoJSON, optionnel)" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitEdit} variant="contained" disabled={!formData.Lib_village || !formData.ZonedenombreId}>Modifier</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer "{selectedVillage?.Lib_village}" ?</Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>Cette action est irréversible.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitDelete} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VillagesListPage;
