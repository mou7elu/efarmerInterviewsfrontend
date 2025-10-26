/**
 * Districts Page
 * Page de liste des districts (utilisant le modèle District)
 */

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  Avatar,
  Breadcrumbs,
  Link,
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Add as AddIcon, 
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  NavigateNext as NavigateNextIcon,
  LocationOn as LocationIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, questionnairesAPI, interviewsAPI, usersAPI, villagesAPI, zonesInterditesAPI, profilesAPI, paysAPI, regionsAPI, departementsAPI, sousprefsAPI, parcellesAPI, handleApiError, districtAPI } from '../../../services/api.js';

const DistrictsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [pays, setPays] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [paysFilter, setPaysFilter] = useState('');
  const [sommeilFilter, setSommeilFilter] = useState('');

  useEffect(() => {
    loadData();
    loadPays();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [districts, searchTerm, paysFilter, sommeilFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Chargement des districts...');
      
      // Chargement via API
      const response = await districtAPI.getAll({ limit: 100 });
      const data = response.data || response;
      const districtsData = data.items || data || [];
      
      console.log('🏛️ Districts chargés:', districtsData.length);
      setDistricts(districtsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur lors du chargement des districts');
    } finally {
      setLoading(false);
    }
  };

  const loadPays = async () => {
    try {
      console.log('🔍 Chargement des pays...');
      const response = await paysAPI.getAll({ limit: 100 });
      const data = response.data || response;
      const paysData = data.items || data || [];
      
      console.log('🌍 Pays chargés:', paysData.length);
      setPays(paysData);
    } catch (error) {
      console.error('Erreur lors du chargement des pays:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...districts];

    // Filtre par recherche (libellé du district)
    if (searchTerm) {
      filtered = filtered.filter(district => 
        district.Lib_district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par pays
    if (paysFilter) {
      filtered = filtered.filter(district => district.PaysId === paysFilter);
    }

    // Filtre par statut sommeil
    if (sommeilFilter !== '') {
      const isActive = sommeilFilter === 'false';
      filtered = filtered.filter(district => district.Sommeil !== isActive);
    }

    setFilteredDistricts(filtered);
    setPage(0); // Reset pagination
  };

  const getPaysInfo = (paysId) => {
    return pays.find(p => p._id === paysId);
  };

  const handleDelete = async (id) => {
    if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer ce district ?')) {
      try {
        // Supprimer via l'API
        await districtAPI.delete(id);
        console.log('Suppression réussie:', id);
        // Recharger les données après suppression
        loadData();
        setSuccessMessage('District supprimé avec succès');
      } catch (error) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleToggleSommeil = async (id) => {
    try {
      // Simulation du changement de statut
      setDistricts(prev => prev.map(d => 
        d._id === id 
          ? { ...d, Sommeil: !d.Sommeil, updatedAt: new Date().toISOString() }
          : d
      ));
      setSuccessMessage('Statut du district mis à jour');
    } catch (error) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des districts..." />;
  }

  // Pagination des données
  const paginatedDistricts = filteredDistricts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="lg">
      {/* Breadcrumbs */}
      <Box mb={3}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link color="inherit" href="/dashboard">
            Agriculture
          </Link>
          <Typography color="text.primary">Districts</Typography>
        </Breadcrumbs>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* En-tête avec actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            <LocationIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              Districts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestion des districts par pays
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/districts/new')}
          size="large"
        >
          Nouveau district
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            placeholder="Rechercher un district..."
            variant="outlined"
            size="small"
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
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Pays</InputLabel>
            <Select
              value={paysFilter}
              onChange={(e) => setPaysFilter(e.target.value)}
              label="Pays"
            >
              <MenuItem value="">Tous les pays</MenuItem>
              {pays.map((pays) => (
                <MenuItem key={pays._id} value={pays._id}>
                  {pays.Lib_pays}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Statut</InputLabel>
            <Select
              value={sommeilFilter}
              onChange={(e) => setSommeilFilter(e.target.value)}
              label="Statut"
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="false">Actif</MenuItem>
              <MenuItem value="true">En sommeil</MenuItem>
            </Select>
          </FormControl>
          
          <Box display="flex" alignItems="center" gap={1} ml="auto">
            <FilterIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {filteredDistricts.length} district{filteredDistricts.length > 1 ? 's' : ''} trouvé{filteredDistricts.length > 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tableau des districts */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>District</TableCell>
              <TableCell>Pays</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Dernière modification</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDistricts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <LocationIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucun district trouvé
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commencez par créer un nouveau district
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/districts/new')}
                    >
                      Créer un district
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedDistricts.map((district) => {
                const pays = district.paysId;
                
                return (
                  <TableRow key={district._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          <LocationIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" fontWeight="bold">
                          {district.libDistrict}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                          <PublicIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          {pays ? (
                            <>
                              <Typography variant="body2" fontWeight="bold">
                                {pays.Lib_pays}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Indicatif: {pays.Indicatif}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" color="error">
                              Pays introuvable
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={district.Sommeil ? 'En sommeil' : 'Actif'}
                        color={district.Sommeil ? 'warning' : 'success'}
                        size="small"
                        variant={district.Sommeil ? 'filled' : 'outlined'}
                        onClick={() => handleToggleSommeil(district._id)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {district._createdAt ? format(new Date(district._createdAt), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {district._createdAt ? format(new Date(district._createdAt), 'HH:mm', { locale: fr }) : 'N/A'}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {district._updatedAt ? format(new Date(district._updatedAt), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {district._updatedAt ? format(new Date(district._updatedAt), 'HH:mm', { locale: fr }) : 'N/A'}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/districts/${district._id}`)}
                          title="Voir les détails"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => navigate(`/districts/${district._id}/edit`)}
                          title="Modifier"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(district._id)}
                          title="Supprimer"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        {filteredDistricts.length > 0 && (
          <TablePagination
            component="div"
            count={filteredDistricts.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Lignes par page:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        )}
      </TableContainer>
    </Container>
  );
};

export default DistrictsPage;