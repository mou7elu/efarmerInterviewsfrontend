/**
 * Users Page
 * Page de gestion des utilisateurs du système (CRUD)
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
  Fab,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  LockReset as LockResetIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { usersAPI, handleApiError } from '../../../services/api';


const UsersPage = () => {
  const navigate = useNavigate();
  
  // États pour les données
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // États pour la pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // États pour la recherche
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []); // Charger une seule fois au montage
   
  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await usersAPI.getAll({
        limit: 2000  // Charger tous les utilisateurs pour filtrage local
      });
      
      const data = response.data || response;
      const items = Array.isArray(data) ? data : (data.items || []);
      
      // Exclure les utilisateurs avec godemode === true
      const filteredItems = items.filter(user => !user.godemode && !user.isGodMode);
      console.log('Utilisateurs après filtrage godmode:', filteredItems);
      setUsers(filteredItems);
      setTotalCount(filteredItems.length);
          const mockProfiles = [
          { _id: '1', name: 'Administrateur' },
          { _id: '2', name: 'Enquêteur' },
          { _id: '3', name: 'Utilisateur' }
        ];
        setProfiles(mockProfiles);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setError(handleApiError(error));
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    navigate('/users/new');
  };

  const handleEditClick = (user) => {
    const userId = user.id || user._id;
    navigate(`/users/${userId}/edit`);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleResetPasswordClick = (user) => {
    setSelectedUser(user);
    setResetPasswordDialogOpen(true);
  };

  const handleSubmitDelete = async () => {
    try {
      const userId = selectedUser.id || selectedUser._id;
      await usersAPI.delete(userId);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitResetPassword = async () => {
    try {
      const userId = selectedUser.id || selectedUser._id;
      // TODO: Implémenter l'API de réinitialisation de mot de passe
      // await usersAPI.resetPassword(userId);
      console.log('Réinitialiser mot de passe pour:', userId);
      setResetPasswordDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      setError(handleApiError(error));
    }
  };

  const getStatusColor = (sommeil) => {
    return sommeil ? 'error' : 'success';
  };

  const getStatusLabel = (sommeil) => {
    return sommeil ? 'Inactif' : 'Actif';
  };

  const filteredUsers = users.filter(user =>
    user.Nom_ut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Pren_ut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des utilisateurs..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Utilisateurs
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Nouvel utilisateur
        </Button>
      </Box>

      {/* Affichage erreur */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Statistiques */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {totalCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total utilisateurs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {users.filter(u => !u.Sommeil).length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Actifs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {users.filter(u => u.Sommeil).length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Inactifs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
      </Grid>

      {/* Barre de recherche */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Rechercher un utilisateur (nom, prénom, email)..."
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
                <TableCell>Utilisateur</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell align="center">Profil</TableCell>
                <TableCell align="center">Statut</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id || user._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body1">
                            {user.Pren_ut} {user.Nom_ut}
                          </Typography>
                          {user.isGodMode && (
                            <Chip 
                              label="Super Admin" 
                              size="small" 
                              color="warning" 
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.Tel || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {(() => {
                        const profile = profiles.find(p => p._id == user.profileId);
                        return profile ? (
                          <Chip
                            label={profile.name}
                            size="small"
                            variant="outlined"
                          />
                        ) : user.profileId ? (
                          <Chip
                            label={`Profil ${user.profileId}`}
                            size="small"
                            variant="outlined"
                            color="default"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        );
                      })()}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusLabel(user.Sommeil)}
                        color={getStatusColor(user.Sommeil)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Réinitialiser mot de passe">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleResetPasswordClick(user)}
                        >
                          <LockResetIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(user)}
                          disabled={user.isGodMode}
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
          count={filteredUsers.length}
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

      {/* Dialog de réinitialisation mot de passe */}
      <Dialog
        open={resetPasswordDialogOpen}
        onClose={() => {
          setResetPasswordDialogOpen(false);
          setSelectedUser(null);
        }}
        maxWidth="sm"
      >
        <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir réinitialiser le mot de passe de <strong>{selectedUser?.Pren_ut} {selectedUser?.Nom_ut}</strong> ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Un nouveau mot de passe temporaire sera envoyé à l'adresse email : {selectedUser?.email}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setResetPasswordDialogOpen(false);
            setSelectedUser(null);
          }}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmitResetPassword} 
            color="warning"
            variant="contained"
          >
            Réinitialiser
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        maxWidth="sm"
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{selectedUser?.Pren_ut} {selectedUser?.Nom_ut}</strong> ?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Cette action est irréversible. Toutes les données associées à cet utilisateur seront perdues.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDeleteDialogOpen(false);
            setSelectedUser(null);
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

export default UsersPage;