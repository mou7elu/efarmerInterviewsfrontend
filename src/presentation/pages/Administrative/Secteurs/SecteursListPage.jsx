/**
 * Secteurs Administratifs List Page
 * Page de gestion des secteurs administratifs (CRUD)
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
import { secteursAdministratifsAPI, sousprefsAPI, handleApiError } from '../../../../services/api.js';

const SecteursListPage = () => {
  // États locaux
  const [secteurs, setSecteurs] = useState([]);
  const [filteredSecteurs, setFilteredSecteurs] = useState([]);
  const [sousprefs, setSousprefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sousprefFilter, setSousprefFilter] = useState('');
  
  // États pour les modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSecteur, setSelectedSecteur] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    Lib_SecteurAdministratif: '',
    Cod_SecteurAdministratif: '',
    SousprefId: '',
  });

  useEffect(() => {
    loadData();
    loadSousprefs();
  }, []);

  // Appliquer le filtre de recherche
  useEffect(() => {
    if (!searchTerm && !sousprefFilter) {
      setFilteredSecteurs(secteurs);
    } else {
      const filtered = secteurs.filter(s => {
        const Lib_SecteurAdministratif = s.Lib_SecteurAdministratif || '';
        const Cod_SecteurAdministratif = s.Cod_SecteurAdministratif || '';
        
        // Comparer les IDs correctement (string ou objet)
        const secteurSousprefId = typeof s.SousprefId === 'object' ? (s.SousprefId._id || s.SousprefId.id) : s.SousprefId;
        const sousprefMatch = !sousprefFilter || secteurSousprefId === sousprefFilter;
        
        const searchMatch = !searchTerm || 
          Lib_SecteurAdministratif.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Cod_SecteurAdministratif.toLowerCase().includes(searchTerm.toLowerCase());
        
        return searchMatch && sousprefMatch;
      });
      setFilteredSecteurs(filtered);
    }
    setPage(0);
  }, [secteurs, searchTerm, sousprefFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await secteursAdministratifsAPI.getAll({ limit: 1000 });
      const data = response.data || response;
      const secteursData = data.items || data || [];
      
      setSecteurs(secteursData);
      setFilteredSecteurs(secteursData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadSousprefs = async () => {
    try {
      const response = await sousprefsAPI.getAll({ limit: 100 });
      const data = response.data || response;
      const sousprefsData = data.items || data || [];
      setSousprefs(sousprefsData);
    } catch (error) {
      console.error('Erreur lors du chargement des sous-préfectures:', error);
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
      Lib_SecteurAdministratif: '',
      Cod_SecteurAdministratif: '',
      SousprefId: '',
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (secteur) => {
    setSelectedSecteur(secteur);
    setFormData({
      Lib_SecteurAdministratif: secteur.Lib_SecteurAdministratif || '',
      Cod_SecteurAdministratif: secteur.Cod_SecteurAdministratif || '',
      SousprefId: typeof secteur.SousprefId === 'object' ? (secteur.SousprefId._id || secteur.SousprefId.id) : secteur.SousprefId,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (secteur) => {
    setSelectedSecteur(secteur);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      await secteursAdministratifsAPI.create(formData);
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
      const secteurId = selectedSecteur.id || selectedSecteur._id;
      await secteursAdministratifsAPI.update(secteurId, formData);
      setEditDialogOpen(false);
      setSelectedSecteur(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const secteurId = selectedSecteur.id || selectedSecteur._id;
      await secteursAdministratifsAPI.delete(secteurId);
      setDeleteDialogOpen(false);
      setSelectedSecteur(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getSousprefName = (sousprefId) => {
    if (!sousprefId) return '—';
    
    // Si sousprefId est un objet avec _id ou id
    const searchId = typeof sousprefId === 'object' ? (sousprefId._id || sousprefId.id) : sousprefId;
    
    const souspref = sousprefs.find(s => (s._id || s.id) === searchId);
    return souspref ? (souspref.Lib_Souspref || '—') : '—';
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des secteurs administratifs..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Secteurs Administratifs
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nouveau secteur
          </Button>
        </Box>
        
        {/* Statistiques */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">
                  {secteurs.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total secteurs
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
              <InputLabel>Filtrer par sous-préfecture</InputLabel>
              <Select
                value={sousprefFilter}
                onChange={(e) => setSousprefFilter(e.target.value)}
                label="Filtrer par sous-préfecture"
              >
                <MenuItem value="">Toutes les sous-préfectures</MenuItem>
                {sousprefs.map((s) => (
                  <MenuItem key={s._id || s.id} value={s._id || s.id}>
                    {s.Lib_Souspref || '—'}
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
                <TableCell>Sous-préfecture</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSecteurs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      {searchTerm || sousprefFilter ? 'Aucun secteur trouvé' : 'Aucune donnée'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSecteurs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((secteur) => (
                    <TableRow key={secteur._id || secteur.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <LocationCityIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1" fontWeight="medium">
                            {secteur.Lib_SecteurAdministratif || '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={secteur.Cod_SecteurAdministratif || '—'} size="small" />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <DomainIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                          {getSousprefName(secteur.SousprefId)}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => handleEdit(secteur)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton size="small" color="error" onClick={() => handleDelete(secteur)}>
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
          count={filteredSecteurs.length}
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
        <DialogTitle>Nouveau secteur administratif</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom du secteur"
                value={formData.Lib_SecteurAdministratif}
                onChange={(e) => handleFormChange('Lib_SecteurAdministratif', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code du secteur"
                value={formData.Cod_SecteurAdministratif}
                onChange={(e) => handleFormChange('Cod_SecteurAdministratif', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Sous-préfecture</InputLabel>
                <Select
                  value={formData.SousprefId}
                  onChange={(e) => handleFormChange('SousprefId', e.target.value)}
                  label="Sous-préfecture"
                >
                  {sousprefs.map((s) => (
                    <MenuItem key={s._id || s.id} value={s._id || s.id}>
                      {s.Lib_Souspref || '—'}
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
            disabled={!formData.Lib_SecteurAdministratif || !formData.Cod_SecteurAdministratif || !formData.SousprefId}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier le secteur administratif</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom du secteur"
                value={formData.Lib_SecteurAdministratif}
                onChange={(e) => handleFormChange('Lib_SecteurAdministratif', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code du secteur"
                value={formData.Cod_SecteurAdministratif}
                onChange={(e) => handleFormChange('Cod_SecteurAdministratif', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Sous-préfecture</InputLabel>
                <Select
                  value={formData.SousprefId}
                  onChange={(e) => handleFormChange('SousprefId', e.target.value)}
                  label="Sous-préfecture"
                >
                  {sousprefs.map((s) => (
                    <MenuItem key={s._id || s.id} value={s._id || s.id}>
                      {s.Lib_Souspref || '—'}
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
            disabled={!formData.Lib_SecteurAdministratif || !formData.Cod_SecteurAdministratif || !formData.SousprefId}
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
            Êtes-vous sûr de vouloir supprimer "{selectedSecteur?.Lib_SecteurAdministratif}" ?
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

export default SecteursListPage;
