/**
 * Users Page
 * Page de liste des utilisateurs du système
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
  Tooltip,
  Badge
} from '@mui/material';
import { 
  Add as AddIcon, 
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Security as SecurityIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { usersAPI, handleApiError } from '../../../services/api';

const UsersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState('');

  
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await usersAPI.getAll();
      console.log('Réponse API utilisateurs:', response);
      
      // L'API retourne { items: [...], total, page, limit, totalPages }
      const data = response.items || response;
      
      setUsers(data);
      setFilteredUsers(data);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setIsLoading(false);
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
    loadData();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.Nom_ut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Pren_ut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.profileName && user.profileName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
    setPage(0);
  }, [searchTerm, users]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (sommeil) => {
    return sommeil ? 'error' : 'success';
  };

  const getStatusLabel = (sommeil) => {
    return sommeil ? 'Inactif' : 'Actif';
  };

  const getGenreIcon = (genre) => {
    switch (genre) {
      case 1: return <MaleIcon color="primary" fontSize="small" />;
      case 2: return <FemaleIcon sx={{ color: 'pink' }} fontSize="small" />;
      default: return <HelpOutlineIcon color="disabled" fontSize="small" />;
    }
  };

  const isRecentLogin = (lastUpdate) => {
    if (!lastUpdate) return false;
    const daysSinceLogin = (new Date() - new Date(lastUpdate)) / (1000 * 60 * 60 * 24);
    return daysSinceLogin <= 7; // Activité récente dans les 7 derniers jours
  };

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Chargement des utilisateurs...</Typography>
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
            <GroupIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Gestion des utilisateurs
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
            Gestion des utilisateurs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérer les comptes utilisateur et leurs accès au système
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/users/new')}
          sx={{ ml: 2 }}
        >
          Nouvel utilisateur
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
          <TextField
            placeholder="Rechercher un utilisateur..."
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
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </Typography>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell align="center">Profil</TableCell>
              <TableCell>Responsable</TableCell>
              <TableCell align="center">Statut</TableCell>
              <TableCell align="center">Dernière connexion</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <GroupIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
                    <Typography variant="h6" color="text.secondary">
                      {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur disponible'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm 
                        ? 'Essayez de modifier votre recherche'
                        : 'Commencez par créer votre premier utilisateur'
                      }
                    </Typography>
                    {!searchTerm && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/users/new')}
                      >
                        Créer un utilisateur
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={isRecentLogin(user.updatedAt) ? '●' : null}
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: '#44b700',
                            color: '#44b700',
                            '&::after': {
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              animation: 'ripple 1.2s infinite ease-in-out',
                              border: '1px solid currentColor',
                              content: '""',
                            },
                          },
                        }}
                      >
                        <Avatar sx={{ width: 40, height: 40 }}>
                          <PersonIcon />
                        </Avatar>
                      </Badge>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {user.Pren_ut} {user.Nom_ut}
                          </Typography>
                          {getGenreIcon(user.Genre)}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          ID: {user._id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <EmailIcon fontSize="small" color="primary" />
                        <Typography variant="body2">{user.email}</Typography>
                      </Box>
                      {user.Tel && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <PhoneIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            {user.Tel}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {user.profileName ? (
                      <Chip
                        icon={<SecurityIcon />}
                        label={user.profileName}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Aucun profil
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.responsableName ? (
                      <Typography variant="body2">
                        {user.responsableName}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Aucun responsable
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={getStatusLabel(user.Sommeil)}
                      color={getStatusColor(user.Sommeil)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {user.updatedAt ? format(new Date(user.updatedAt), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.updatedAt ? format(new Date(user.updatedAt), 'HH:mm', { locale: fr }) : ''}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={1}>
                      <Tooltip title="Voir les détails">
                        <IconButton
                          size="small"
                          onClick={() => {
                            const userId = user.id || user._id;
                            console.log('Navigation vers détails utilisateur:', userId);
                            console.log('Objet user complet:', user);
                            navigate(`/users/${userId}`);
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/users/${user.id || user._id}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          disabled={user._id === '1'} // Protéger l'admin principal
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {filteredUsers.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
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

export default UsersPage;