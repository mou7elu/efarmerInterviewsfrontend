/**
 * Departements List Page - Page de gestion des départements (CRUD)
 */
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Card, CardContent, Fab, Tooltip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Domain as DomainIcon, Map as MapIcon } from '@mui/icons-material';
import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { departementsAPI, regionsAPI, handleApiError } from '../../../../services/api.js';

const DepartementsListPage = () => {
  const [departements, setDepartements] = useState([]);
  const [filteredDepartements, setFilteredDepartements] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [formData, setFormData] = useState({ Lib_Departement: '', Cod_departement: '', RegionId: '' });

  useEffect(() => { loadData(); loadRegions(); }, []);
  useEffect(() => {
    if (!searchTerm && !regionFilter) {
      setFilteredDepartements(departements);
    } else {
      const filtered = departements.filter(d => {
        const Lib_Departement = d.Lib_Departement || '';
        const Cod_departement = d.Cod_departement || '';
        const regionMatch = !regionFilter || d.RegionId === regionFilter;
        const searchMatch = !searchTerm || Lib_Departement.toLowerCase().includes(searchTerm.toLowerCase()) || Cod_departement.toLowerCase().includes(searchTerm.toLowerCase());
        return searchMatch && regionMatch;
      });
      setFilteredDepartements(filtered);
    }
    setPage(0);
  }, [departements, searchTerm, regionFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await departementsAPI.getAll({ limit: 1000 });
      const data = response.data || response;
      const departementsData = data.items || data || [];
      setDepartements(departementsData);
      setFilteredDepartements(departementsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadRegions = async () => {
    try {
      const response = await regionsAPI.getAll({ limit: 1000 });
      const data = response.data || response;
      setRegions(data.items || data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des régions:', error);
    }
  };

  const stats = { total: departements.length, regions: new Set(departements.map(d => d.RegionId).filter(Boolean)).size };
  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => { setRowsPerPage(Number.parseInt(event.target.value, 10)); setPage(0); };
  const handleFormChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const resetForm = () => setFormData({ Lib_Departement: '', Cod_departement: '', RegionId: '' });

  const handleCreate = () => { resetForm(); setCreateDialogOpen(true); };
  const handleEdit = (departement) => {
    setSelectedDepartement(departement);
    setFormData({
      Lib_Departement: departement.Lib_Departement || '',
      Cod_departement: departement.Cod_departement || '',
      RegionId: typeof departement.RegionId === 'object' ? departement.RegionId._id : departement.RegionId,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (departement) => { setSelectedDepartement(departement); setDeleteDialogOpen(true); };
  const handleSubmitCreate = async () => {
    try {
      await departementsAPI.create(formData);
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
      const departementId = selectedDepartement.id || selectedDepartement._id;
      await departementsAPI.update(departementId, formData);
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
      const departementId = selectedDepartement.id || selectedDepartement._id;
      await departementsAPI.delete(departementId);
      setDeleteDialogOpen(false);
      setSelectedDepartement(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getRegionName = (regionId) => {
    const r = regions.find(region => region._id === regionId._id || region.id === regionId._id);
    return r ? (r.Lib_region || '—') : '—';
  };

  if (loading) return <LoadingSpinner size={60} message="Chargement des départements..." />;

  return (
    <Container maxWidth="xl">
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">Départements</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>Nouveau département</Button>
        </Box>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}><Card><CardContent sx={{ textAlign: 'center', py: 2 }}><Typography variant="h4" color="primary">{stats.total}</Typography><Typography variant="body2" color="textSecondary">Total départements</Typography></CardContent></Card></Grid>
          
        </Grid>
      </Box>

      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><TextField fullWidth placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth><InputLabel>Filtrer par région</InputLabel>
              <Select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} label="Filtrer par région">
                <MenuItem value="">Toutes les régions</MenuItem>
                {regions.map((r) => <MenuItem key={r._id || r.id} value={r._id || r.id}>{r.Lib_region || '—'}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && <Box mb={2}><Typography variant="body1" color="error">Erreur : {error}</Typography></Box>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead><TableRow><TableCell>Nom</TableCell><TableCell>Code</TableCell><TableCell>Région</TableCell><TableCell align="center">Actions</TableCell></TableRow></TableHead>
            <TableBody>
              {filteredDepartements.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center"><Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>{searchTerm || regionFilter ? 'Aucun département trouvé' : 'Aucune donnée'}</Typography></TableCell></TableRow>
              ) : (
                filteredDepartements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((departement) => (
                  <TableRow key={departement._id || departement.id} hover>
                    <TableCell><Box display="flex" alignItems="center"><DomainIcon sx={{ mr: 1, color: 'primary.main' }} /><Typography variant="body1" fontWeight="medium">{departement.Lib_Departement || '—'}</Typography></Box></TableCell>
                    <TableCell>{departement.Cod_departement || '—'}</TableCell>
                    <TableCell><Box display="flex" alignItems="center"><MapIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />{getRegionName(departement.RegionId)}</Box></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEdit(departement)}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton size="small" color="error" onClick={() => handleDelete(departement)}><DeleteIcon /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={filteredDepartements.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} labelRowsPerPage="Lignes par page:" />
      </Paper>

      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleCreate}><AddIcon /></Fab>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouveau département</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Nom du département" value={formData.Lib_Departement} onChange={(e) => handleFormChange('Lib_Departement', e.target.value)} required /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Code du département" value={formData.Cod_departement} onChange={(e) => handleFormChange('Cod_departement', e.target.value)} required /></Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required><InputLabel>Région</InputLabel>
                <Select value={formData.RegionId} onChange={(e) => handleFormChange('RegionId', e.target.value)} label="Région">
                  {regions.map((r) => <MenuItem key={r._id || r.id} value={r._id || r.id}>{r.Lib_region || '—'}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitCreate} variant="contained" disabled={!formData.Lib_Departement || !formData.Cod_departement || !formData.RegionId}>Créer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier le département</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Nom du département" value={formData.Lib_Departement} onChange={(e) => handleFormChange('Lib_Departement', e.target.value)} required /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Code du département" value={formData.Cod_departement} onChange={(e) => handleFormChange('Cod_departement', e.target.value)} required /></Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required><InputLabel>Région</InputLabel>
                <Select value={formData.RegionId} onChange={(e) => handleFormChange('RegionId', e.target.value)} label="Région">
                  {regions.map((r) => <MenuItem key={r._id || r.id} value={r._id || r.id}>{r.Lib_region || '—'}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitEdit} variant="contained" disabled={!formData.Lib_Departement || !formData.Cod_departement || !formData.RegionId}>Modifier</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer "{selectedDepartement?.Lib_Departement}" ?</Typography>
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

export default DepartementsListPage;
