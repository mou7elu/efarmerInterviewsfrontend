/**
 * Districts List Page
 * Page de gestion des districts (CRUD)
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocationCity as LocationCityIcon,
  Public as PublicIcon,
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { districtAPI, paysAPI, handleApiError } from '../../../../services/api.js';

const DistrictsListPage = () => {
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [paysList, setPaysList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [paysFilter, setPaysFilter] = useState('');
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  
  const [formData, setFormData] = useState({
    Lib_district: '',
    Cod_district: '',
    PaysId: '',
  });

  useEffect(() => {
    loadData();
    loadPays();
  }, []);

  useEffect(() => {
    if (!searchTerm && !paysFilter) {
      setFilteredDistricts(districts);
    } else {
      const filtered = districts.filter(d => {
        const Lib_district = d.Lib_district || '';
        const Cod_district = d.Cod_district || '';
        
        const paysMatch = !paysFilter || d.PaysId === paysFilter;
        const searchMatch = !searchTerm || 
          Lib_district.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Cod_district.toLowerCase().includes(searchTerm.toLowerCase());
        
        return searchMatch && paysMatch;
      });
      setFilteredDistricts(filtered);
    }
    setPage(0);
  }, [districts, searchTerm, paysFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await districtAPI.getAll({ limit: 1000 });
      const data = response.data || response;
      const districtsData = data.items || data || [];
      setDistricts(districtsData);
      setFilteredDistricts(districtsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadPays = async () => {
    try {
      const response = await paysAPI.getAll({ limit: 1000 });
      const data = response.data || response;
      setPaysList(data.items || data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des pays:', error);
    }
  };

  const stats = {
    total: districts.length,
    pays: new Set(districts.map(d => d.PaysId).filter(Boolean)).size,
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      Lib_district: '',
      Cod_district: '',
      PaysId: '',
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (district) => {
    setSelectedDistrict(district);
    setFormData({
      Lib_district: district.Lib_district || '',
      Cod_district: district.Cod_district || '',
      PaysId: typeof district.PaysId === 'object' ? district.PaysId._id : district.PaysId,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (district) => {
    setSelectedDistrict(district);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      await districtAPI.create(formData);
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
      const districtId = selectedDistrict.id || selectedDistrict._id;
      await districtAPI.update(districtId, formData);
      setEditDialogOpen(false);
      setSelectedDistrict(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const districtId = selectedDistrict.id || selectedDistrict._id;
      await districtAPI.delete(districtId);
      setDeleteDialogOpen(false);
      setSelectedDistrict(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getPaysName = (paysId) => {
    const p = paysList.find(pays => pays._id === paysId._id || pays.id === paysId._id);
    return p ? (p.Lib_pays || '—') : '—';
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des districts..." />;
  }

  return (
    <Container maxWidth="xl">
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">Districts</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Nouveau district
          </Button>
        </Box>
        
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">{stats.total}</Typography>
                <Typography variant="body2" color="textSecondary">Total districts</Typography>
              </CardContent>
            </Card>
          </Grid>
          
        </Grid>
      </Box>

      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom ou code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par pays</InputLabel>
              <Select value={paysFilter} onChange={(e) => setPaysFilter(e.target.value)} label="Filtrer par pays">
                <MenuItem value="">Tous les pays</MenuItem>
                {paysList.map((p) => (
                  <MenuItem key={p._id || p.id} value={p._id || p.id}>{p.Lib_pays || '—'}</MenuItem>
                ))}
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
                <TableCell>Nom</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Pays</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDistricts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      {searchTerm || paysFilter ? 'Aucun district trouvé' : 'Aucune donnée'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDistricts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((district) => (
                    <TableRow key={district._id || district.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <LocationCityIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1" fontWeight="medium">
                            {district.Lib_district || '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{district.Cod_district || '—'}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <PublicIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                          {getPaysName(district.PaysId)}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => handleEdit(district)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton size="small" color="error" onClick={() => handleDelete(district)}>
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
          count={filteredDistricts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Lignes par page:"
        />
      </Paper>

      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleCreate}>
        <AddIcon />
      </Fab>

      {/* Dialog de création */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouveau district</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Nom du district" value={formData.Lib_district} onChange={(e) => handleFormChange('Lib_district', e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Code du district" value={formData.Cod_district} onChange={(e) => handleFormChange('Cod_district', e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Pays</InputLabel>
                <Select value={formData.PaysId} onChange={(e) => handleFormChange('PaysId', e.target.value)} label="Pays">
                  {paysList.map((p) => (
                    <MenuItem key={p._id || p.id} value={p._id || p.id}>{p.Lib_pays || '—'}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitCreate} variant="contained" disabled={!formData.Lib_district || !formData.Cod_district || !formData.PaysId}>Créer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier le district</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Pays</InputLabel>
                <Select value={formData.PaysId} onChange={(e) => handleFormChange('PaysId', e.target.value)} label="Pays">
                  {paysList.map((p) => (
                    <MenuItem key={p._id || p.id} value={p._id || p.id}>{p.Lib_pays || '—'}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
             <Grid item xs={12} md={6}>
              <TextField fullWidth label="Code du district" value={formData.Cod_district} onChange={(e) => handleFormChange('Cod_district', e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Nom du district" value={formData.Lib_district} onChange={(e) => handleFormChange('Lib_district', e.target.value)} required />
            </Grid>
           
          
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitEdit} variant="contained" disabled={!formData.Lib_district || !formData.Cod_district || !formData.PaysId}>Modifier</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer "{selectedDistrict?.Lib_district}" ?
          </Typography>
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

export default DistrictsListPage;
