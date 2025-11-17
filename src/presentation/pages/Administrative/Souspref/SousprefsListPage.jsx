/**
 * Sous-Préfectures List Page
 * Page de gestion des sous-préfectures (CRUD)
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
  LocationCity as LocationCityIcon,
  Domain as DomainIcon,
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { sousprefsAPI, departementsAPI, handleApiError } from '../../../../services/api.js';

const SousprefsListPage = () => {
  // États locaux
  const [sousprefs, setSousprefs] = useState([]);
  const [filteredSousprefs, setFilteredSousprefs] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [departementFilter, setDepartementFilter] = useState('');
  
  // États pour les modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSouspref, setSelectedSouspref] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    Lib_Souspref: '',
    Cod_Souspref: '',
    DepartementId: '',
  });

  useEffect(() => {
    loadData();
    loadDepartements();
  }, []);

  // Appliquer le filtre de recherche
  useEffect(() => {
    if (!searchTerm && !departementFilter) {
      setFilteredSousprefs(sousprefs);
    } else {
      const filtered = sousprefs.filter(s => {
        const Lib_Souspref = s.Lib_Souspref || '';
        const Cod_Souspref = s.Cod_Souspref || '';
        
        // Comparer les IDs correctement (string ou objet)
        const sousprefDeptId = typeof s.DepartementId === 'object' ? (s.DepartementId._id || s.DepartementId.id) : s.DepartementId;
        const departementMatch = !departementFilter || sousprefDeptId === departementFilter;
        
        const searchMatch = !searchTerm || 
          Lib_Souspref.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Cod_Souspref.toLowerCase().includes(searchTerm.toLowerCase());
        
        return searchMatch && departementMatch;
      });
      setFilteredSousprefs(filtered);
    }
    setPage(0);
  }, [sousprefs, searchTerm, departementFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await sousprefsAPI.getAll({ limit: 1000 });
      const data = response.data || response;
      const sousprefsData = data.items || data || [];
      
      setSousprefs(sousprefsData);
      setFilteredSousprefs(sousprefsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadDepartements = async () => {
    try {
      const response = await departementsAPI.getAll({ limit: 1000 });
      const data = response.data || response;
      const departementsData = data.items || data || [];
      setDepartements(departementsData);
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
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
      Lib_Souspref: '',
      Cod_Souspref: '',
      DepartementId: '',
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (souspref) => {
    setSelectedSouspref(souspref);
    setFormData({
      Lib_Souspref: souspref.Lib_Souspref || '',
      Cod_Souspref: souspref.Cod_Souspref || '',
      DepartementId: typeof souspref.DepartementId === 'object' ? souspref.DepartementId._id : souspref.DepartementId,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (souspref) => {
    setSelectedSouspref(souspref);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      await sousprefsAPI.create(formData);
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
      const sousprefId = selectedSouspref.id || selectedSouspref._id;
      await sousprefsAPI.update(sousprefId, formData);
      setEditDialogOpen(false);
      setSelectedSouspref(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const sousprefId = selectedSouspref.id || selectedSouspref._id;
      await sousprefsAPI.delete(sousprefId);
      setDeleteDialogOpen(false);
      setSelectedSouspref(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getDepartementName = (deptId) => {
    if (!deptId) return '—';
    
    // Si deptId est un objet avec _id ou id
    const searchId = typeof deptId === 'object' ? (deptId._id || deptId.id) : deptId;
    
    const dept = departements.find(d => (d._id || d.id) === searchId);
    return dept ? (dept.Lib_Departement || '—') : '—';
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des sous-préfectures..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Sous-Préfectures
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nouvelle sous-préfecture
          </Button>
        </Box>
        
        {/* Statistiques */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">
                  {sousprefs.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total sous-préfectures
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
              <InputLabel>Filtrer par département</InputLabel>
              <Select
                value={departementFilter}
                onChange={(e) => setDepartementFilter(e.target.value)}
                label="Filtrer par département"
              >
                <MenuItem value="">Tous les départements</MenuItem>
                {departements.map((d) => (
                  <MenuItem key={d._id || d.id} value={d._id || d.id}>
                    {d.Lib_Departement || '—'}
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
                <TableCell>Département</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSousprefs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      {searchTerm || departementFilter ? 'Aucune sous-préfecture trouvée' : 'Aucune donnée'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSousprefs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((souspref) => (
                    <TableRow key={souspref._id || souspref.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <LocationCityIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1" fontWeight="medium">
                            {souspref.Lib_Souspref || '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={souspref.Cod_Souspref || '—'} size="small" />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <DomainIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                          {getDepartementName(souspref.DepartementId)}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => handleEdit(souspref)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton size="small" color="error" onClick={() => handleDelete(souspref)}>
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
          count={filteredSousprefs.length}
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
        <DialogTitle>Nouvelle sous-préfecture</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de la sous-préfecture"
                value={formData.Lib_Souspref}
                onChange={(e) => handleFormChange('Lib_Souspref', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code de la sous-préfecture"
                value={formData.Cod_Souspref}
                onChange={(e) => handleFormChange('Cod_Souspref', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Département</InputLabel>
                <Select
                  value={formData.DepartementId}
                  onChange={(e) => handleFormChange('DepartementId', e.target.value)}
                  label="Département"
                >
                  {departements.map((d) => (
                    <MenuItem key={d._id || d.id} value={d._id || d.id}>
                      {d.Lib_Departement || '—'}
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
            disabled={!formData.Lib_Souspref || !formData.Cod_Souspref || !formData.DepartementId}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier la sous-préfecture</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de la sous-préfecture"
                value={formData.Lib_Souspref}
                onChange={(e) => handleFormChange('Lib_Souspref', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code de la sous-préfecture"
                value={formData.Cod_Souspref}
                onChange={(e) => handleFormChange('Cod_Souspref', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Département</InputLabel>
                <Select
                  value={formData.DepartementId}
                  onChange={(e) => handleFormChange('DepartementId', e.target.value)}
                  label="Département"
                >
                  {departements.map((d) => (
                    <MenuItem key={d._id || d.id} value={d._id || d.id}>
                      {d.Lib_Departement || '—'}
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
            disabled={!formData.Lib_Souspref || !formData.Cod_Souspref || !formData.DepartementId}
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
            Êtes-vous sûr de vouloir supprimer "{selectedSouspref?.Lib_Souspref}" ?
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

export default SousprefsListPage;
