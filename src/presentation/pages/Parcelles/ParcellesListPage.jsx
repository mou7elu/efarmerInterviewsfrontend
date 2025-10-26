/**
 * Parcelles List Page
 * Page de liste des parcelles avec fonctionnalités CRUD
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  NavigateNext as NavigateNextIcon,
  Terrain as TerrainIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, questionnairesAPI, interviewsAPI, usersAPI, villagesAPI, zonesInterditesAPI, profilesAPI, paysAPI, regionsAPI, departementsAPI, sousprefsAPI, parcellesAPI, handleApiError } from '../../../services/api.js';
import { getValue, getSafeId, getProducteurNomComplet, getProducteurCode, extractDataFromApiResponse, getSuperficieDisplay } from '../../../shared/utils/entityHelpers.js';

const ParcellesListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [parcelles, setParcelles] = useState([]);
  const [producteurs, setProducteurs] = useState([]);
  const [filteredParcelles, setFilteredParcelles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProducteur, setFilterProducteur] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Données factices basées sur le vrai modèle Parcelle
  useEffect(() => {
    loadParcelles();
    
    // Afficher message de succès si passé via navigation
    if (location.state?.message) {
      setSnackbar({
        open: true,
        message: location.state.message,
        severity: 'success'
      });
    }
  }, [location.state]);

  useEffect(() => {
    filterParcelles();
  }, [parcelles, searchTerm, filterProducteur]);

  const loadParcelles = async () => {
    try {
      setLoading(true);
      
      // Charger les parcelles et les producteurs en parallèle
      const [parcellesData, producteursData] = await Promise.all([
        parcellesAPI.getAll(),
        producteursAPI.getAll()
      ]);
      
      console.log('Données parcelles reçues:', parcellesData);
      console.log('Données producteurs reçues:', producteursData);
      
      // Extraire les données depuis les réponses API
      const parcelles = extractDataFromApiResponse(parcellesData);
      const producteurs = extractDataFromApiResponse(producteursData);
      
      console.log('Parcelles extraites:', parcelles);
      console.log('Producteurs extraits:', producteurs);
      
      // Debug: examiner la structure du premier producteur
      if (producteurs.length > 0) {
        console.log('Premier producteur structure:', producteurs[0]);
        console.log('Premier producteur nom:', producteurs[0].nom);
        console.log('Premier producteur prenom:', producteurs[0].prenom);
        console.log('Premier producteur Nom:', producteurs[0].Nom);
        console.log('Premier producteur Prenom:', producteurs[0].Prenom);
      }
      
      setParcelles(parcelles);
      setProducteurs(producteurs);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des parcelles',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterParcelles = () => {
    // S'assurer que parcelles est un tableau avant de le traiter
    if (!Array.isArray(parcelles)) {
      console.warn('parcelles n\'est pas un tableau:', parcelles);
      setFilteredParcelles([]);
      return;
    }

    let filtered = [...parcelles];

    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(parcelle => {
        const producteurId = getValue(parcelle.ProducteurId) || parcelle.ProducteurId;
        const producteur = getProducteurInfo(producteurId);
        return (
          (getValue(parcelle.Code) && getValue(parcelle.Code).toLowerCase().includes(searchTerm.toLowerCase())) ||
          getSafeId(parcelle).toLowerCase().includes(searchTerm.toLowerCase()) ||
          (producteur && getProducteurNomComplet(producteur).toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    // Filtrage par producteur
    if (filterProducteur) {
      console.log('Filtrage par producteur:', filterProducteur);
      filtered = filtered.filter(parcelle => {
        console.log('Parcelle complète:', parcelle);
        console.log('parcelle.ProducteurId brut:', parcelle.ProducteurId);
        console.log('parcelle.producteurId brut:', parcelle.producteurId);
        const producteurId = getValue(parcelle.ProducteurId) || parcelle.ProducteurId || parcelle.producteurId;
        console.log('Parcelle ProducteurId après extraction:', producteurId, 'vs Filter:', filterProducteur);
        return producteurId === filterProducteur;
      });
      console.log('Parcelles filtrées:', filtered.length);
    }

    setFilteredParcelles(filtered);
  };

  const getProducteurInfo = (producteurId) => {
    if (!producteurId) return null;
    // Handle MongoDB $oid object or string
    const idStr = typeof producteurId === 'object' && producteurId.$oid ? producteurId.$oid : String(producteurId);
    return producteurs.find(p => getSafeId(p) === idStr);
  };

  const handleDelete = async (parcelleId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette parcelle ?')) {
      try {
        // Supprimer via l'API
        await parcellesAPI.delete(parcelleId);
        console.log('Suppression réussie:', parcelleId);
        
        setParcelles(prev => prev.filter(p => p._id !== parcelleId));
        setSnackbar({
          open: true,
          message: 'Parcelle supprimée avec succès',
          severity: 'success'
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setSnackbar({
          open: true,
          message: 'Erreur lors de la suppression',
          severity: 'error'
        });
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des parcelles..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête avec breadcrumbs */}
      <Box mb={4}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} mb={2}>
          <Link color="inherit" href="/dashboard">
            Agriculture
          </Link>
          <Typography color="text.primary">Parcelles</Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Gestion des parcelles
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/parcelles/create')}
          >
            Nouvelle parcelle
          </Button>
        </Box>
      </Box>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            placeholder="Rechercher une parcelle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filtrer par producteur</InputLabel>
            <Select
              value={filterProducteur}
              onChange={(e) => setFilterProducteur(e.target.value)}
              label="Filtrer par producteur"
            >
              <MenuItem value="">Tous les producteurs</MenuItem>
              {Array.isArray(producteurs) && producteurs.map((producteur) => (
                <MenuItem key={getSafeId(producteur)} value={getSafeId(producteur)}>
                  {getProducteurNomComplet(producteur)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box flexGrow={1} />
          
          <Chip
            icon={<FilterIcon />}
            label={`${filteredParcelles.length} parcelle${filteredParcelles.length > 1 ? 's' : ''}`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Tableau des parcelles */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Superficie</TableCell>
                <TableCell>Producteur propriétaire</TableCell>
                <TableCell>Code producteur</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredParcelles) && filteredParcelles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((parcelle) => {
                  const producteurId = parcelle.ProducteurId?.$oid || getValue(parcelle.ProducteurId) || parcelle.ProducteurId || parcelle.producteurId;
                  const producteur = getProducteurInfo(producteurId);
                  console.log('Rendu tableau - parcelle:', parcelle._id, 'producteurId:', producteurId, 'producteur trouvé:', !!producteur);
                  return (
                    <TableRow key={parcelle._id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <TerrainIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle2">
                              {getValue(parcelle.Code) || 'Sans code'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {getSafeId(parcelle)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {getValue(parcelle.Superficie) || '0'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        {producteur ? (
                          <Box>
                            <Typography variant="subtitle2">
                              {getProducteurNomComplet(producteur) || getProducteurCode(producteur) || 'Sans code'}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Producteur non trouvé
                          </Typography>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {producteur ? (
                          <Chip
                            label={getProducteurCode(producteur)}
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={getValue(parcelle.Code) ? "Codifiée" : "Non codifiée"}
                          size="small"
                          color={getValue(parcelle.Code) ? "success" : "warning"}
                          variant="outlined"
                        />
                      </TableCell>
                      
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/parcelles/${parcelle._id}`)}
                          title="Voir détails"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/parcelles/${parcelle._id}/edit`)}
                          title="Modifier"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(parcelle._id)}
                          title="Supprimer"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredParcelles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
        />
      </Paper>

      {/* Snackbar pour les messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ParcellesListPage;