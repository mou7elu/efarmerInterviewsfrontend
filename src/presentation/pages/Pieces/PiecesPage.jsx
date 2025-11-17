/**
 * Pieces Page
 * Page de gestion des pièces d'identité (CRUD)
 * Harmonisée avec le design pattern établi
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { piecesAPI, handleApiError } from '@/services/api.js';


const PiecesPage = () => {
  // États pour les données
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // États pour la pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // États pour la recherche
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    Nom_piece: ''
  });

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await piecesAPI.getAll({
        limit: rowsPerPage,
        skip: page * rowsPerPage,
        search: searchTerm
      });
      
      const data = response.data || response;
      const items = Array.isArray(data) ? data : data.items || [];
      
      setPieces(items);
      setTotalCount(data.total || items.length);
    } catch (error) {
      console.error('Erreur lors du chargement des pièces:', error);
      setError(handleApiError(error));
      setPieces([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      Nom_piece: ''
    });
  };

  const handleCreateClick = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEditClick = (piece) => {
    setSelectedPiece(piece);
    setFormData({
      Nom_piece: piece.Nom_piece || ''
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (piece) => {
    setSelectedPiece(piece);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    if (!formData.Nom_piece || formData.Nom_piece.trim() === '') {
      setError('Le nom de la pièce est requis');
      return;
    }

    try {
      await piecesAPI.create(formData);
      setCreateDialogOpen(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitEdit = async () => {
    if (!formData.Nom_piece || formData.Nom_piece.trim() === '') {
      setError('Le nom de la pièce est requis');
      return;
    }

    try {
      const pieceId = selectedPiece.id || selectedPiece._id;
      await piecesAPI.update(pieceId, formData);
      setEditDialogOpen(false);
      setSelectedPiece(null);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const pieceId = selectedPiece.id || selectedPiece._id;
      await piecesAPI.delete(pieceId);
      setDeleteDialogOpen(false);
      setSelectedPiece(null);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const filteredPieces = pieces.filter(piece =>
    piece.Nom_piece?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des pièces..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Pièces d'identité
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Nouvelle pièce
        </Button>
      </Box>

      {/* Affichage erreur */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Statistique */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {totalCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total pièces
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barre de recherche */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Rechercher une pièce d'identité..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Box>

      {/* Tableau */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pièce d'identité</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPieces
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((piece) => (
                  <TableRow key={piece.id || piece._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">
                          {piece.Nom_piece}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(piece)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(piece)}
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
          count={filteredPieces.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
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
        onClick={handleCreateClick}
      >
        <AddIcon />
      </Fab>

      {/* Dialog de création */}
      <Dialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          resetForm();
          setError('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nouvelle pièce d'identité</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nom de la pièce"
              value={formData.Nom_piece}
              onChange={(e) => handleFormChange('Nom_piece', e.target.value)}
              required
              placeholder="Ex: CNI, Passeport, Permis de conduire..."
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateDialogOpen(false);
            resetForm();
            setError('');
          }}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmitCreate} 
            variant="contained"
            disabled={!formData.Nom_piece || formData.Nom_piece.trim() === ''}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedPiece(null);
          resetForm();
          setError('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modifier la pièce d'identité</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nom de la pièce"
              value={formData.Nom_piece}
              onChange={(e) => handleFormChange('Nom_piece', e.target.value)}
              required
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditDialogOpen(false);
            setSelectedPiece(null);
            resetForm();
            setError('');
          }}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmitEdit} 
            variant="contained"
            disabled={!formData.Nom_piece || formData.Nom_piece.trim() === ''}
          >
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedPiece(null);
        }}
        maxWidth="sm"
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer la pièce <strong>"{selectedPiece?.Nom_piece}"</strong> ?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Cette action est irréversible et peut affecter les producteurs ayant cette pièce d'identité.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDeleteDialogOpen(false);
            setSelectedPiece(null);
          }}>
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

export default PiecesPage;