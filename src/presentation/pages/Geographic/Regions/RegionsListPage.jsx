/**
 * Regions List Page
 * Page de gestion des régions (CRUD)
 */

import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, Button, Box, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Card, CardContent, Fab, Tooltip, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Map as MapIcon, Public as PublicIcon } from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import GeoJSONInput from '@presentation/components/Common/GeoJSONInput.jsx';
import { regionsAPI, districtAPI, handleApiError } from '../../../../services/api.js';

const RegionsListPage = () => {
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  
  const [formData, setFormData] = useState({ Lib_region: '', Cod_region: '', DistrictId: '', Coordonnee: null });

  useEffect(() => { loadData(); loadDistricts(); }, []);

  useEffect(() => {
    if (!searchTerm && !districtFilter) {
      setFilteredRegions(regions);
    } else {
      const filtered = regions.filter(r => {
        const Lib_region = r.Lib_region || '';
        const Cod_region = r.Cod_region || '';
        const districtMatch = !districtFilter || r.DistrictId === districtFilter;
        const searchMatch = !searchTerm || Lib_region.toLowerCase().includes(searchTerm.toLowerCase()) || Cod_region.toLowerCase().includes(searchTerm.toLowerCase());
        return searchMatch && districtMatch;
      });
      setFilteredRegions(filtered);
    }
    setPage(0);
  }, [regions, searchTerm, districtFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await regionsAPI.getAll({ limit: 100 });
      const data = response.data || response;
      const regionsData = data.items || data || [];
      console.log('Régions chargées:', regionsData);
      setRegions(regionsData);
      setFilteredRegions(regionsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadDistricts = async () => {
    try {
      const response = await districtAPI.getAll({ limit: 100 });
      const data = response.data || response;
      setDistricts(data.items || data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des districts:', error);
    }
  };

  const stats = { total: regions.length, districts: new Set(regions.map(r => r.DistrictId).filter(Boolean)).size };

  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => { setRowsPerPage(Number.parseInt(event.target.value, 10)); setPage(0); };
  const handleFormChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const resetForm = () => setFormData({ Lib_region: '', Cod_region: '', DistrictId: '', Coordonnee: null });

  const handleCreate = () => { resetForm(); setCreateDialogOpen(true); };
  const handleEdit = (region) => {
    setSelectedRegion(region);
    setFormData({
      Lib_region: region.Lib_region || '',
      Cod_region: region.Cod_region || '',
      DistrictId: typeof region.DistrictId === 'object' ? region.DistrictId._id : region.DistrictId,
      Coordonnee: region.Coordonnee || null,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (region) => { setSelectedRegion(region); setDeleteDialogOpen(true); };

  const handleSubmitCreate = async () => {
    try {
      await regionsAPI.create(formData);
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
      const regionId = selectedRegion.id || selectedRegion._id;
      await regionsAPI.update(regionId, formData);
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
      const regionId = selectedRegion.id || selectedRegion._id;
      await regionsAPI.delete(regionId);
      setDeleteDialogOpen(false);
      setSelectedRegion(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getDistrictName = (districtId) => {
    const d = districts.find(district => district._id === districtId._id || district.id === districtId._id);
    return d ? (d.Lib_district || '—') : '—';
  };

  if (loading) return <LoadingSpinner size={60} message="Chargement des régions..." />;

  return (
    <Container maxWidth="xl">
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">Régions</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>Nouvelle région</Button>
        </Box>
        
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card><CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="primary">{stats.total}</Typography>
              <Typography variant="body2" color="textSecondary">Total régions</Typography>
            </CardContent></Card>
          </Grid>
          
        </Grid>
      </Box>

      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par district</InputLabel>
              <Select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} label="Filtrer par district">
                <MenuItem value="">Tous les districts</MenuItem>
                {districts.map((d) => <MenuItem key={d._id || d.id} value={d._id || d.id}>{d.Lib_district || '—'}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && <Box mb={2}><Typography variant="body1" color="error">Erreur : {error}</Typography></Box>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell><TableCell>Code</TableCell><TableCell>District</TableCell><TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRegions.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center"><Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>{searchTerm || districtFilter ? 'Aucune région trouvée' : 'Aucune donnée'}</Typography></TableCell></TableRow>
              ) : (
                filteredRegions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((region) => (
                  <TableRow key={region._id || region.id} hover>
                    <TableCell><Box display="flex" alignItems="center"><MapIcon sx={{ mr: 1, color: 'primary.main' }} /><Typography variant="body1" fontWeight="medium">{region.Lib_region || '—'}</Typography></Box></TableCell>
                    <TableCell>{region.Cod_region || '—'}</TableCell>
                    <TableCell><Box display="flex" alignItems="center"><PublicIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />{getDistrictName(region.DistrictId)}</Box></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEdit(region)}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton size="small" color="error" onClick={() => handleDelete(region)}><DeleteIcon /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={filteredRegions.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} labelRowsPerPage="Lignes par page:" />
      </Paper>

      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleCreate}><AddIcon /></Fab>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouvelle région</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Nom de la région" value={formData.Lib_region} onChange={(e) => handleFormChange('Lib_region', e.target.value)} required /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Code de la région" value={formData.Cod_region} onChange={(e) => handleFormChange('Cod_region', e.target.value)} required /></Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>District</InputLabel>
                <Select value={formData.DistrictId} onChange={(e) => handleFormChange('DistrictId', e.target.value)} label="District">
                  {districts.map((d) => <MenuItem key={d._id || d.id} value={d._id || d.id}>{d.Lib_district || '—'}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><GeoJSONInput value={formData.Coordonnee} onChange={(value) => handleFormChange('Coordonnee', value)} geometryType="Point" label="Coordonnée (Point GeoJSON)" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitCreate} variant="contained" disabled={!formData.Lib_region || !formData.Cod_region || !formData.DistrictId}>Créer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier la région</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
             <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>District</InputLabel>
                <Select value={formData.DistrictId} onChange={(e) => handleFormChange('DistrictId', e.target.value)} label="District">
                  {districts.map((d) => <MenuItem key={d._id || d.id} value={d._id || d.id}>{d.Lib_district || '—'}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Code de la région" value={formData.Cod_region} onChange={(e) => handleFormChange('Cod_region', e.target.value)} required /></Grid>
           
            <Grid item xs={12} md={6}><TextField fullWidth label="Nom de la région" value={formData.Lib_region} onChange={(e) => handleFormChange('Lib_region', e.target.value)} required /></Grid>
            
            <Grid item xs={12}><GeoJSONInput value={formData.Coordonnee} onChange={(value) => handleFormChange('Coordonnee', value)} geometryType="Point" label="Coordonnée (Point GeoJSON)" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitEdit} variant="contained" disabled={!formData.Lib_region || !formData.Cod_region || !formData.DistrictId}>Modifier</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer "{selectedRegion?.Lib_region}" ?</Typography>
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

export default RegionsListPage;
