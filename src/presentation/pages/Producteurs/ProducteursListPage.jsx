/**
 * Producteurs List Page
 * Page de liste des producteurs agricoles
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
  Chip,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, handleApiError } from '../../../services/api.js';
import { getValue, getSafeId, getProducteurNomComplet, extractDataFromApiResponse, getGenreTexte } from '../../../shared/utils/entityHelpers.js';

const ProducteursListPage = () => {
  const navigate = useNavigate();
  
  // État local
  const [producteurs, setProducteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fonctions utilitaires pour extraire les données des objets API
  // Fonctions utilitaires maintenant importées depuis entityHelpers



  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducteurs();
    }, 300); // Délai de 300ms pour éviter les appels trop rapides
    
    return () => clearTimeout(timer);
  }, [page, rowsPerPage, searchTerm, genreFilter, statusFilter]);

  const loadProducteurs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Appel API réel
      const params = {
        page: page + 1, // L'API commence à 1, React Table à 0
        limit: rowsPerPage
      };

      // Ajouter les filtres si présents
      if (searchTerm) params.search = searchTerm;
      if (genreFilter) params.genre = genreFilter;
      if (statusFilter) {
        params.actif = statusFilter === 'actif' ? 'true' : 'false';
      }

      console.log('Chargement des producteurs avec params:', params);
      const response = await producteursAPI.getAll(params);
      console.log('Réponse API:', response);
      
      // Utiliser l'utilitaire pour extraire les données
      const items = extractDataFromApiResponse(response);
      const total = response?.data?.total || items.length;
      
      setProducteurs(items);
      setTotalCount(total);
      
    } catch (error) {
      console.error('Erreur lors du chargement des producteurs:', error);
      setError(handleApiError(error));
      setProducteurs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setGenreFilter('');
    setStatusFilter('');
    setFilterDialogOpen(false);
  };

  const getGenreLabel = (genre) => {
    return genre === 1 ? 'Homme' : genre === 2 ? 'Femme' : 'Non défini';
  };

  const getGenreColor = (genre) => {
    return genre === 1 ? 'primary' : genre === 2 ? 'secondary' : 'default';
  };

  const getStatutLabel = (sommeil) => {
    return sommeil ? 'Inactif' : 'Actif';
  };

  const getStatutColor = (sommeil) => {
    return sommeil ? 'error' : 'success';
  };

  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return null;
    const today = new Date();
    const birth = new Date(dateNaissance);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des producteurs..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête de la page */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Producteurs Agricoles
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/producteurs/create')}
            size="large"
          >
            Nouveau producteur
          </Button>
        </Box>

        {/* Statistiques rapides */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Total Producteurs
                </Typography>
                <Typography variant="h4" component="div">
                  {totalCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Actifs
                </Typography>
                <Typography variant="h4" component="div" color="success.main">
                  {producteurs.filter(p => !p.sommeil).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Hommes
                </Typography>
                <Typography variant="h4" component="div" color="primary.main">
                  {producteurs.filter(p => p.genre === 1).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Femmes
                </Typography>
                <Typography variant="h4" component="div" color="secondary.main">
                  {producteurs.filter(p => p.genre === 2).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Barre de recherche et filtres */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rechercher un producteur..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                placeholder="Code, nom, prénom, téléphone..."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setFilterDialogOpen(true)}
                fullWidth
              >
                Filtres avancés
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="text"
                onClick={resetFilters}
                fullWidth
              >
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Affichage des erreurs */}
      {error && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="h6">Erreur de chargement</Typography>
          <Typography>{error}</Typography>
          <Button 
            variant="contained" 
            onClick={loadProducteurs} 
            sx={{ mt: 2 }}
            color="inherit"
          >
            Réessayer
          </Button>
        </Paper>
      )}

      {/* Tableau des producteurs */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producteur</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Âge</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Lieu de naissance</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Fichiers</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!producteurs || producteurs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                      {loading ? 'Chargement...' : 'Aucun producteur trouvé'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                producteurs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((producteur) => (
                <TableRow key={getSafeId(producteur)} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar 
                        sx={{ 
                          mr: 2, 
                          bgcolor: producteur.photo ? 'success.main' : 'grey.400',
                          width: 40,
                          height: 40
                        }}
                      >
                        {producteur.photo ? (
                          <PhotoCameraIcon />
                        ) : (
                          <PersonIcon />
                        )}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {getValue(producteur.nom)} {getValue(producteur.prenom)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getValue(producteur.lieuNaissance) || 'Lieu non renseigné'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {producteur.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getGenreLabel(producteur.genre)}
                      color={getGenreColor(producteur.genre)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {calculateAge(producteur.dateNaissance) || '-'} ans
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" display="flex" alignItems="center">
                        <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {producteur.telephone1 || 'N/A'}
                      </Typography>
                      {producteur.telephone2 && (
                        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
                          <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          {producteur.telephone2}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getValue(producteur.lieuNaissance) || 'Non renseigné'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatutLabel(producteur.sommeil)}
                      color={getStatutColor(producteur.sommeil)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5}>
                      {producteur.photo && (
                        <Chip size="small" label="Photo" color="info" variant="outlined" />
                      )}
                      {producteur.signature && (
                        <Chip size="small" label="Signature" color="warning" variant="outlined" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/producteurs/${getSafeId(producteur)}`)}
                        title="Voir les détails"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="default"
                        onClick={() => navigate(`/producteurs/${getSafeId(producteur)}/edit`)}
                        title="Modifier"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}–${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
        />
      </Paper>

      {/* Dialog des filtres avancés */}
      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Filtres avancés</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                  label="Genre"
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value="1">Homme</MenuItem>
                  <MenuItem value="2">Femme</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Statut"
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value="actif">Actif</MenuItem>
                  <MenuItem value="inactif">Inactif (Sommeil)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>Annuler</Button>
          <Button onClick={resetFilters} color="warning">Réinitialiser</Button>
          <Button onClick={() => setFilterDialogOpen(false)} variant="contained">Appliquer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProducteursListPage;