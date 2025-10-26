/**
 * Sections Page
 * Page de liste des sections (utilisant le modèle Section)
 */

import React, { useEffect, useState } from 'react';
import { sectionsAPI, voletsAPI } from '../../../services/api';
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
  List as ListIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';

const SectionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [voletFilter, setVoletFilter] = useState('');
  const [volets, setVolets] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Charger les sections et les volets en parallèle
      const [sectionsData, voletsData] = await Promise.all([
        sectionsAPI.getAll(),
        voletsAPI.getAll()
      ]);
      
      setSections(sectionsData);
      setVolets(voletsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur lors du chargement des sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sections, searchTerm, voletFilter]);

  const applyFilters = () => {
    let filtered = [...sections];

    // Filtre par recherche (titre de la section)
    if (searchTerm) {
      filtered = filtered.filter(section => 
        section.titre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par volet
    if (voletFilter) {
      filtered = filtered.filter(section => {
        const sectionVoletId = typeof section.voletId === 'object' && section.voletId !== null 
          ? section.voletId._id 
          : section.voletId;
        return sectionVoletId === voletFilter;
      });
    }

    // Tri par volet puis par ordre
    filtered.sort((a, b) => {
      const voletA = getVoletInfo(a.voletId);
      const voletB = getVoletInfo(b.voletId);
      
      if (voletA && voletB) {
        if (voletA.ordre !== voletB.ordre) {
          return voletA.ordre - voletB.ordre;
        }
      }
      return a.ordre - b.ordre;
    });

    setFilteredSections(filtered);
    setPage(0); // Reset pagination
  };

  const getVoletInfo = (voletId) => {
    // Si voletId est déjà un objet populé par le backend
    if (typeof voletId === 'object' && voletId !== null && voletId._id) {
      return voletId;
    }
    // Sinon, chercher dans la liste des volets
    return volets.find(v => v._id === voletId);
  };

  const handleDelete = async (id) => {
    if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
      try {
        // Supprimer via l'API
        await sectionsAPI.delete(id);
        console.log('Section supprimée avec succès:', id);
        // Recharger les données après suppression
        loadData();
        setSuccessMessage('Section supprimée avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError(handleApiError(error));
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
    return <LoadingSpinner size={60} message="Chargement des sections..." />;
  }

  // Pagination des données
  const paginatedSections = filteredSections.slice(
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
          <Typography color="text.primary">Sections</Typography>
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
            <ListIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              Sections
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestion des sections des questionnaires
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/sections/new')}
          size="large"
        >
          Nouvelle section
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            placeholder="Rechercher une section..."
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
            <InputLabel>Volet</InputLabel>
            <Select
              value={volets.find(v => v._id === voletFilter) ? voletFilter : ''}
              onChange={(e) => setVoletFilter(e.target.value)}
              label="Volet"
            >
              <MenuItem value="">Tous les volets</MenuItem>
              {volets.map((volet) => (
                <MenuItem key={volet._id} value={volet._id}>
                  {volet.titre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box display="flex" alignItems="center" gap={1} ml="auto">
            <FilterIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {filteredSections.length} section{filteredSections.length > 1 ? 's' : ''} trouvée{filteredSections.length > 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tableau des sections */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ordre</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Volet</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Dernière modification</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <ListIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucune section trouvée
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commencez par créer une nouvelle section
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/sections/new')}
                    >
                      Créer une section
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedSections.map((section) => {
                const volet = getVoletInfo(section.voletId);
                
                return (
                  <TableRow key={section._id} hover>
                    <TableCell>
                      <Chip 
                        label={section.ordre}
                        color="primary"
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                          <ListIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" fontWeight="bold">
                          {section.titre}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                          <AssignmentIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          {volet ? (
                            <>
                              <Typography variant="body2" fontWeight="bold">
                                {volet.titre}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Ordre: {volet.ordre}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" color="error">
                              Volet introuvable
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(section.createdAt), 'dd/MM/yyyy', { locale: fr })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(section.createdAt), 'HH:mm', { locale: fr })}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(section.updatedAt), 'dd/MM/yyyy', { locale: fr })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(section.updatedAt), 'HH:mm', { locale: fr })}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/sections/${section._id}`)}
                          title="Voir les détails"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => navigate(`/sections/${section._id}/edit`)}
                          title="Modifier"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(section._id)}
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
        {filteredSections.length > 0 && (
          <TablePagination
            component="div"
            count={filteredSections.length}
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

export default SectionsPage;