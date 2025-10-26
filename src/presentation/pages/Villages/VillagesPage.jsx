/**
 * Villages Page
 * Page de liste des villages (utilisant le modèle Village)
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
  LocationCity as LocationCityIcon,
  Public as PublicIcon,
  Place as PlaceIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, questionnairesAPI, interviewsAPI, usersAPI, villagesAPI, zonesInterditesAPI, profilesAPI, paysAPI, regionsAPI, departementsAPI, sousprefsAPI, parcellesAPI, handleApiError } from '../../../services/api.js';

const VillagesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [villages, setVillages] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [paysFilter, setPaysFilter] = useState('');
  const [pays, setPays] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [villages, searchTerm, paysFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les données en parallèle
      const [villagesResponse, paysResponse] = await Promise.all([
        villagesAPI.getAll(),
        paysAPI.getAll()
      ]);
      
      setVillages(villagesResponse.data || villagesResponse);
      setPays(paysResponse.data || paysResponse);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...villages];

    // Filtre par recherche (libellé du village)
    if (searchTerm) {
      filtered = filtered.filter(village => 
        village.Lib_village.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par pays
    if (paysFilter) {
      filtered = filtered.filter(village => village.PaysId && village.PaysId === paysFilter);
    }

    // Tri par nom de village
    filtered.sort((a, b) => a.Lib_village.localeCompare(b.Lib_village));

    setFilteredVillages(filtered);
    setPage(0); // Reset pagination
  };

  const getPaysInfo = (paysId) => {
    return pays.find(p => p._id === paysId);
  };

  const handleDelete = async (id) => {
    if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer ce village ?')) {
      try {
        // Supprimer via l'API
        await villagesAPI.delete(id);
        console.log('Suppression réussie:', id);
        // Recharger les données après suppression
        loadData();
        setSuccessMessage('Village supprimé avec succès');
      } catch (error) {
        setError('Erreur lors de la suppression');
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

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des villages..." />;
  }

  // Pagination des données
  const paginatedVillages = filteredVillages.slice(
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
          <Typography color="text.primary">Villages</Typography>
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
            <LocationCityIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              Villages
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestion des villages par pays
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/villages/new')}
          size="large"
        >
          Nouveau village
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            placeholder="Rechercher un village..."
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
              {pays.map((paysItem) => (
                <MenuItem key={paysItem._id} value={paysItem._id}>
                  {paysItem.libPays?._value || paysItem.Lib_pays || 'Pays sans nom'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box display="flex" alignItems="center" gap={1} ml="auto">
            <FilterIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {filteredVillages.length} village{filteredVillages.length > 1 ? 's' : ''} trouvé{filteredVillages.length > 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tableau des villages */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Village</TableCell>
              <TableCell>Pays</TableCell>
              <TableCell>Coordonnées</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Dernière modification</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedVillages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <LocationCityIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucun village trouvé
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commencez par créer un nouveau village
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/villages/new')}
                    >
                      Créer un village
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedVillages.map((village) => {
                const pays = getPaysInfo(village.PaysId);
                
                return (
                  <TableRow key={village._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          <LocationCityIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" fontWeight="bold">
                          {village.Lib_village}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                          <PublicIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          {village.PaysId && pays ? (
                            <>
                              <Typography variant="body2" fontWeight="bold">
                                {pays.libPays?._value || pays.Lib_pays || 'Pays sans nom'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Code: {pays.Code_pays || 'N/A'}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Non assigné
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PlaceIcon 
                          fontSize="small" 
                          color={village.Coordonnee ? 'primary' : 'disabled'}
                        />
                        <Typography variant="body2" color={village.Coordonnee ? 'text.primary' : 'text.secondary'}>
                          {village.Coordonnee ? 'Géolocalisé' : 'Non géolocalisé'}
                        </Typography>
                      </Box>
                      {village.Coordonnee && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Point GPS disponible
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(village.createdAt), 'dd/MM/yyyy', { locale: fr })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(village.createdAt), 'HH:mm', { locale: fr })}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(village.updatedAt), 'dd/MM/yyyy', { locale: fr })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(village.updatedAt), 'HH:mm', { locale: fr })}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/villages/${village._id}`)}
                          title="Voir les détails"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => navigate(`/villages/${village._id}/edit`)}
                          title="Modifier"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(village._id)}
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
        {filteredVillages.length > 0 && (
          <TablePagination
            component="div"
            count={filteredVillages.length}
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

export default VillagesPage;