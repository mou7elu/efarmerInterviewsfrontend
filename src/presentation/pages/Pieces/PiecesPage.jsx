/**
 * Pieces Page
 * Page de liste des pièces (utilisant le modèle Piece)
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
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  NavigateNext as NavigateNextIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { piecesAPI, handleApiError } from '@/services/api.js';

const PiecesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [pieces, setPieces] = useState([]);
  const [filteredPieces, setFilteredPieces] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');



  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [pieces, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await piecesAPI.getAll({ page: 1, limit: 100 });
      const piecesData = response.data?.items || response.items || response;
      
      // Convertir les données pour utiliser id au lieu de _id
      const formattedPieces = piecesData.map(piece => ({
        ...piece,
        _id: piece.id || piece._id, // Assurer la compatibilité
        id: piece.id || piece._id
      }));
      
      setPieces(formattedPieces);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...pieces];

    // Filtre par recherche (nom de la pièce)
    if (searchTerm) {
      filtered = filtered.filter(piece => 
        piece.Nom_piece.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tri par nom de pièce
    filtered.sort((a, b) => a.Nom_piece.localeCompare(b.Nom_piece));

    setFilteredPieces(filtered);
    setPage(0); // Reset pagination
  };

  const handleDelete = async (id) => {
    if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer cette pièce ?')) {
      try {
        await piecesAPI.delete(id);
        console.log('Suppression réussie:', id);
        // Recharger les données après suppression
        loadData();
        setSuccessMessage('Pièce supprimée avec succès');
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
    return <LoadingSpinner size={60} message="Chargement des pièces..." />;
  }

  // Pagination des données
  const paginatedPieces = filteredPieces.slice(
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
          <Typography color="text.primary">Pièces d'identité</Typography>
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
            <DescriptionIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              Pièces d'identité
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestion des types de pièces d'identité
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/pieces/new')}
          size="large"
        >
          Nouvelle pièce
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            placeholder="Rechercher une pièce d'identité..."
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
            sx={{ minWidth: 400 }}
          />
          
          <Box display="flex" alignItems="center" gap={1} ml="auto">
            <FilterIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {filteredPieces.length} pièce{filteredPieces.length > 1 ? 's' : ''} trouvée{filteredPieces.length > 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tableau des pièces */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom de la pièce</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Dernière modification</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPieces.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <DescriptionIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucune pièce d'identité trouvée
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commencez par créer une nouvelle pièce d'identité
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/pieces/new')}
                    >
                      Créer une pièce
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedPieces.map((piece, index) => (
                <TableRow key={piece.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <DescriptionIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {piece.Nom_piece}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {piece.id ? piece.id.slice(-8) : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(piece.createdAt), 'dd/MM/yyyy', { locale: fr })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(piece.createdAt), 'HH:mm', { locale: fr })}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(piece.updatedAt), 'dd/MM/yyyy', { locale: fr })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(piece.updatedAt), 'HH:mm', { locale: fr })}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/pieces/${piece.id}`)}
                        title="Voir les détails"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => navigate(`/pieces/${piece.id}/edit`)}
                        title="Modifier"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(piece.id)}
                        title="Supprimer"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        {filteredPieces.length > 0 && (
          <TablePagination
            component="div"
            count={filteredPieces.length}
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

export default PiecesPage;