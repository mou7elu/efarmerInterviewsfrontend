/**
 * Sous-préfectures List Page
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
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Public as PublicIcon,
  LocationOn as LocationIcon,
  LocationCity as LocationCityIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, questionnairesAPI, interviewsAPI, usersAPI, villagesAPI, zonesInterditesAPI, profilesAPI, paysAPI, regionsAPI, departementsAPI, sousprefsAPI, parcellesAPI, handleApiError } from '../../../services/api.js';

const SousprefsListPage = () => {
  // État local
  const [sousprefs, setSousprefs] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [regions, setRegions] = useState([]);
  const [pays, setPays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [departementFilter, setDepartementFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [paysFilter, setPaysFilter] = useState('');
  
  // États pour les modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSouspref, setSelectedSouspref] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    nom: '',
    code: '',
    description: '',
    chefLieu: '',
    superficie: '',
    population: '',
    departementId: '',
    regionId: '',
    paysId: ''
  });

  // Données factices pour la démonstration
  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, searchTerm, departementFilter, regionFilter, paysFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredSousprefs = sousprefs;
      
      // Appliquer les filtres
      if (searchTerm) {
        filteredSousprefs = filteredSousprefs.filter(s => 
          s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.chefLieu.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (departementFilter) {
        filteredSousprefs = filteredSousprefs.filter(s => s.departementId === departementFilter);
      }

      if (regionFilter) {
        filteredSousprefs = filteredSousprefs.filter(s => s.regionId === regionFilter);
      }

      if (paysFilter) {
        filteredSousprefs = filteredSousprefs.filter(s => s.paysId === paysFilter);
      }

      setSousprefs(filteredSousprefs);
      setTotalCount(filteredSousprefs.length);
      setDepartements(departements);
      setRegions(regions);
      setPays(pays);
    } catch (error) {
      console.error('Erreur lors du chargement des sous-préfectures:', error);
    } finally {
      setLoading(false);
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
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Si on change le pays, réinitialiser région et département
      if (field === 'paysId') {
        newData.regionId = '';
        newData.departementId = '';
      }
      
      // Si on change la région, réinitialiser le département
      if (field === 'regionId') {
        newData.departementId = '';
      }
      
      return newData;
    });
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      code: '',
      description: '',
      chefLieu: '',
      superficie: '',
      population: '',
      departementId: '',
      regionId: '',
      paysId: ''
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (souspref) => {
    setSelectedSouspref(souspref);
    setFormData({
      nom: souspref.nom,
      code: souspref.code,
      description: souspref.description,
      chefLieu: souspref.chefLieu,
      superficie: souspref.superficie,
      population: souspref.population,
      departementId: souspref.departementId,
      regionId: souspref.regionId,
      paysId: souspref.paysId
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (souspref) => {
    setSelectedSouspref(souspref);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      console.log('Créer sous-préfecture:', formData);
      setCreateDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      console.log('Modifier sous-préfecture:', selectedSouspref.id, formData);
      setEditDialogOpen(false);
      setSelectedSouspref(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  const handleSubmitDelete = async () => {
    try {
      console.log('Supprimer sous-préfecture:', selectedSouspref.id);
      setDeleteDialogOpen(false);
      setSelectedSouspref(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getRegionsForPays = (paysId) => {
    return regions.filter(r => r.paysId === paysId);
  };

  const getDepartementsForRegion = (regionId) => {
    return departements.filter(d => d.regionId === regionId);
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des sous-préfectures..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête avec breadcrumbs */}
      <Box mb={4}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} mb={2}>
          <Link color="inherit" href="/pays">
            Données géographiques
          </Link>
          <Typography color="text.primary">Sous-préfectures</Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Sous-préfectures
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nouvelle sous-préfecture
          </Button>
        </Box>
        
        {/* Statistiques rapides */}
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
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="success.main">
                  {sousprefs.reduce((acc, s) => acc + parseInt(s.superficie), 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  km² total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="info.main">
                  {(sousprefs.reduce((acc, s) => acc + parseInt(s.population), 0) / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Population totale
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="warning.main">
                  {new Set(sousprefs.map(s => s.departementId)).size}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Départements couverts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Barre de recherche et filtres */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par pays</InputLabel>
              <Select
                value={paysFilter}
                onChange={(e) => setPaysFilter(e.target.value)}
                label="Filtrer par pays"
              >
                <MenuItem value="">Tous les pays</MenuItem>
                {pays.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par région</InputLabel>
              <Select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                label="Filtrer par région"
              >
                <MenuItem value="">Toutes les régions</MenuItem>
                {regions
                  .filter(r => !paysFilter || r.paysId === paysFilter)
                  .map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.nom}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par département</InputLabel>
              <Select
                value={departementFilter}
                onChange={(e) => setDepartementFilter(e.target.value)}
                label="Filtrer par département"
              >
                <MenuItem value="">Tous les départements</MenuItem>
                {departements
                  .filter(d => !regionFilter || d.regionId === regionFilter)
                  .map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.nom}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Tableau des sous-préfectures */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sous-préfecture</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Département</TableCell>
                <TableCell>Région</TableCell>
                <TableCell align="right">Superficie</TableCell>
                <TableCell align="right">Population</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sousprefs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((souspref) => (
                <TableRow key={souspref.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {souspref.nom}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Chef-lieu: {souspref.chefLieu}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {souspref.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<LocationCityIcon />}
                      label={souspref.departementNom}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <LocationIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {souspref.regionNom}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatNumber(souspref.superficie)} km²
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatNumber(souspref.population)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Modifier">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(souspref)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(souspref)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
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
        <DialogTitle>Nouvelle sous-préfecture</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de la sous-préfecture"
                value={formData.nom}
                onChange={(e) => handleFormChange('nom', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code sous-préfecture"
                value={formData.code}
                onChange={(e) => handleFormChange('code', e.target.value)}
                required
                inputProps={{ maxLength: 3 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Chef-lieu"
                value={formData.chefLieu}
                onChange={(e) => handleFormChange('chefLieu', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Pays</InputLabel>
                <Select
                  value={formData.paysId}
                  onChange={(e) => handleFormChange('paysId', e.target.value)}
                  label="Pays"
                >
                  {pays.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={!formData.paysId}>
                <InputLabel>Région</InputLabel>
                <Select
                  value={formData.regionId}
                  onChange={(e) => handleFormChange('regionId', e.target.value)}
                  label="Région"
                >
                  {getRegionsForPays(formData.paysId).map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={!formData.regionId}>
                <InputLabel>Département</InputLabel>
                <Select
                  value={formData.departementId}
                  onChange={(e) => handleFormChange('departementId', e.target.value)}
                  label="Département"
                >
                  {getDepartementsForRegion(formData.regionId).map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Superficie (km²)"
                type="number"
                value={formData.superficie}
                onChange={(e) => handleFormChange('superficie', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Population"
                type="number"
                value={formData.population}
                onChange={(e) => handleFormChange('population', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
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
            disabled={!formData.nom || !formData.code || !formData.departementId}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Similar dialogs for edit and delete... */}
      {/* Dialog de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer la sous-préfecture "{selectedSouspref?.nom}" ?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Cette action supprimera également tous les districts et villages associés.
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

export default SousprefsListPage;