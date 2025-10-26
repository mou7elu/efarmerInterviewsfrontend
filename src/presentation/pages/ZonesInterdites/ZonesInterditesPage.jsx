/**
 * Zones Interdites Page
 * Page de liste des zones interdites (utilisant le modèle Zone_interdit)
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
  Block as BlockIcon,
  Public as PublicIcon,
  Place as PlaceIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, questionnairesAPI, interviewsAPI, usersAPI, villagesAPI, zonesInterditesAPI, profilesAPI, paysAPI, regionsAPI, departementsAPI, sousprefsAPI, parcellesAPI, handleApiError } from '../../../services/api.js';

const ZonesInterditesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [zonesInterdites, setZonesInterdites] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [paysFilter, setPaysFilter] = useState('');
  const [sommeilFilter, setSommeilFilter] = useState('');
  const [pays, setPays] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [zonesInterdites, searchTerm, paysFilter, sommeilFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les données en parallèle
      const [zonesResponse, paysResponse] = await Promise.all([
        zonesInterditesAPI.getAll(),
        paysAPI.getAll()
      ]);
      
      setZonesInterdites(zonesResponse.data || zonesResponse);
      setPays(paysResponse.data || paysResponse);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...zonesInterdites];

    // Filtre par recherche (libellé de la zone)
    if (searchTerm) {
      filtered = filtered.filter(zone => 
        zone.Lib_zi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par pays
    if (paysFilter) {
      filtered = filtered.filter(zone => zone.Pays?.id === paysFilter);
    }

    // Filtre par statut sommeil
    if (sommeilFilter !== '') {
      const isActive = sommeilFilter === 'false';
      filtered = filtered.filter(zone => zone.Sommeil !== isActive);
    }

    setFilteredZones(filtered);
    setPage(0); // Reset pagination
  };

  const getPaysInfo = (paysId) => {
    return pays.find(p => p._id === paysId);
  };

  const handleDelete = async (id) => {
    if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer cette zone interdite ?')) {
      try {
        // Supprimer via l'API
        await zonesInterditesAPI.delete(id);
        console.log('Suppression réussie:', id);
        setZonesInterdites(prev => prev.filter(z => z._id !== id));
        setSuccessMessage('Zone interdite supprimée avec succès');
      } catch (error) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleToggleSommeil = async (id) => {
    try {
      // Simulation du changement de statut
      setZonesInterdites(prev => prev.map(z => 
        z._id === id 
          ? { ...z, Sommeil: !z.Sommeil, updatedAt: new Date().toISOString() }
          : z
      ));
      setSuccessMessage('Statut de la zone interdite mis à jour');
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
    return <LoadingSpinner size={60} message="Chargement des zones interdites..." />;
  }

  // Pagination des données
  const paginatedZones = filteredZones.slice(
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
          <Typography color="text.primary">Zones interdites</Typography>
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
          <Avatar sx={{ mr: 2, bgcolor: 'error.main' }}>
            <BlockIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              Zones interdites
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestion des zones d'exploitation interdites
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/zones-interdites/new')}
          size="large"
        >
          Nouvelle zone interdite
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            placeholder="Rechercher une zone interdite..."
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
                  {paysItem.libPays?._value || paysItem.libPays || paysItem._id}
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
              {filteredZones.length} zone{filteredZones.length > 1 ? 's' : ''} trouvée{filteredZones.length > 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tableau des zones interdites */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Zone interdite</TableCell>
              <TableCell>Pays</TableCell>
              <TableCell>Coordonnées</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedZones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <BlockIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucune zone interdite trouvée
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commencez par créer une nouvelle zone interdite
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/zones-interdites/new')}
                    >
                      Créer une zone interdite
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedZones.map((zone) => {
                const pays = getPaysInfo(zone.Pays?.id);
                
                return (
                  <TableRow key={zone.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'error.main', width: 32, height: 32 }}>
                          <BlockIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" fontWeight="bold">
                          {zone.Lib_zi}
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
                                {pays.libPays?._value || pays.libPays || 'Nom non disponible'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {pays._id}
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
                      <Box display="flex" alignItems="center" gap={1}>
                        <PlaceIcon 
                          fontSize="small" 
                          color={zone.Coordonnee ? 'primary' : 'disabled'}
                        />
                        <Typography variant="body2" color={zone.Coordonnee ? 'text.primary' : 'text.secondary'}>
                          {zone.Coordonnee ? 'Géolocalisée' : 'Non géolocalisée'}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={zone.Sommeil ? 'En sommeil' : 'Actif'}
                        color={zone.Sommeil ? 'warning' : 'success'}
                        size="small"
                        variant={zone.Sommeil ? 'filled' : 'outlined'}
                        onClick={() => handleToggleSommeil(zone.id)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(zone.createdAt), 'dd/MM/yyyy', { locale: fr })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(zone.createdAt), 'HH:mm', { locale: fr })}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/zones-interdites/${zone.id}`)}
                          title="Voir les détails"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => navigate(`/zones-interdites/${zone.id}/edit`)}
                          title="Modifier"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(zone.id)}
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
        {filteredZones.length > 0 && (
          <TablePagination
            component="div"
            count={filteredZones.length}
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

export default ZonesInterditesPage;