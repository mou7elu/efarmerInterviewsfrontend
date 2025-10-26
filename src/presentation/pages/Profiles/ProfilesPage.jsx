/**
 * Profiles Page
 * Page de liste des profils utilisateur avec permissions
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
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Security as SecurityIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ProfilesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState('');

  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profilesAPI.getAll();
      const data = response.data || response;
      
      setProfiles(data);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setIsLoading(true);
        // TODO: remplacer par fetch API réel
        await new Promise((r) => setTimeout(r, 800));
        
        setProfiles(profiles);
        setFilteredProfiles(profiles);
      } catch (err) {
        setError('Impossible de charger les profils');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, []);

  useEffect(() => {
    const filtered = profiles.filter(profile =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProfiles(filtered);
    setPage(0);
  }, [searchTerm, profiles]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      default: return status;
    }
  };

  const getPermissionLevel = (permissionsCount) => {
    const percentage = (permissionsCount.granted / permissionsCount.total) * 100;
    if (percentage >= 80) return { level: 'Élevé', color: 'error', icon: <WarningIcon fontSize="small" /> };
    if (percentage >= 50) return { level: 'Moyen', color: 'warning', icon: <WarningIcon fontSize="small" /> };
    return { level: 'Limité', color: 'success', icon: <CheckCircleIcon fontSize="small" /> };
  };

  const paginatedProfiles = filteredProfiles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Chargement des profils...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            color="inherit"
            onClick={() => navigate('/dashboard')}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Accueil
          </Link>
          <Typography sx={{ display: 'flex', alignItems: 'center' }} color="text.primary">
            <SecurityIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Gestion des profils
          </Typography>
        </Breadcrumbs>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Gestion des profils
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérer les profils utilisateur et leurs permissions d'accès
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/profiles/new')}
          sx={{ ml: 2 }}
        >
          Nouveau profil
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
          <TextField
            placeholder="Rechercher un profil..."
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
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />
          <Typography variant="body2" color="text.secondary">
            {filteredProfiles.length} profil(s) trouvé(s)
          </Typography>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profil</TableCell>
              <TableCell align="center">Utilisateurs</TableCell>
              <TableCell align="center">Permissions</TableCell>
              <TableCell align="center">Niveau d'accès</TableCell>
              <TableCell align="center">Statut</TableCell>
              <TableCell align="center">Dernière modif.</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProfiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <SecurityIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
                    <Typography variant="h6" color="text.secondary">
                      {searchTerm ? 'Aucun profil trouvé' : 'Aucun profil disponible'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm 
                        ? 'Essayez de modifier votre recherche'
                        : 'Commencez par créer votre premier profil'
                      }
                    </Typography>
                    {!searchTerm && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/profiles/new')}
                      >
                        Créer un profil
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedProfiles.map((profile) => {
                const permissionLevel = getPermissionLevel(profile.permissionsCount);
                return (
                  <TableRow key={profile._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <SecurityIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {profile.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {profile._id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        <GroupIcon fontSize="small" color="primary" />
                        <Typography variant="body2" fontWeight="medium">
                          {profile.usersCount}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {profile.permissionsCount.granted}/{profile.permissionsCount.total}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={permissionLevel.icon}
                        label={permissionLevel.level}
                        color={permissionLevel.color}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusLabel(profile.status)}
                        color={getStatusColor(profile.status)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {format(new Date(profile.updatedAt), 'dd/MM/yyyy', { locale: fr })}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Tooltip title="Voir les détails">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/profiles/${profile._id}`)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/profiles/${profile._id}/edit`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            color="error"
                            disabled={profile.usersCount > 0}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        
        {filteredProfiles.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProfiles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
            }
          />
        )}
      </TableContainer>
    </Container>
  );
};

export default ProfilesPage;