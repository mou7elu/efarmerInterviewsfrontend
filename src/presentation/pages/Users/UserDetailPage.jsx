/**
 * User Detail Page
 * Affichage des détails d'un utilisateur
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  SupervisorAccount as SupervisorIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { usersAPI, profilesAPI, handleApiError } from '../../../services/api';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [responsable, setResponsable] = useState(null);
  const [subordinates, setSubordinates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper pour formater les dates en toute sécurité
  const formatDate = (dateValue) => {
    if (!dateValue) return 'Non disponible';
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return 'Date invalide';
      return format(date, 'dd/MM/yyyy à HH:mm', { locale: fr });
    } catch (error) {
      console.warn('Erreur formatage date:', error);
      return 'Date invalide';
    }
  };

  useEffect(() => {
    const loadUserDetails = async (userId) => {
      try {
        setIsLoading(true);
        setError('');

        console.log('UserDetailPage - ID from params:', userId);
        console.log('UserDetailPage - window.location:', window.location.href);

        if (!userId || userId === 'undefined') {
          setError('ID utilisateur manquant ou invalide');
          setIsLoading(false);
          return;
        }

        // Pour l'instant, on ne charge que les utilisateurs car /api/profiles n'existe pas
        const [userRes, usersRes] = await Promise.all([
          usersAPI.getById(userId),
          usersAPI.getAll({ limit: 1000 })
        ]);

        const userData = userRes || {};
        const usersList = (usersRes && usersRes.items) ? usersRes.items : (usersRes || []);

        setUser(userData);

        // Mock profile temporaire - remplacer quand /api/profiles sera disponible
        const mockProfile = userData.profileId ? {
          _id: userData.profileId,
          name: userData.profileId === '1' ? 'Administrateur' : 'Utilisateur',
          permissionsCount: userData.profileId === '1' ? 25 : 10
        } : null;
        setProfile(mockProfile);

        const responsableObj = usersList.find(u => (u._id || u.id) === (userData.ResponsableId || userData.ResponsableId)) || null;
        setResponsable(responsableObj);

        const subs = usersList.filter(u => (u.ResponsableId === userData._id) || (u.ResponsableId === userData.id));
        setSubordinates(subs || []);
      } catch (err) {
        console.error('Erreur lors du chargement des détails utilisateur:', err);
        setError(handleApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadUserDetails(id);
  }, [id]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Chargement des détails...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/users')}
          sx={{ mt: 2 }}
        >
          Retour à la liste
        </Button>
      </Container>
    );
  }

  const getGenreIcon = (genre) => {
    switch (genre) {
      case 1: return <MaleIcon color="primary" />;
      case 2: return <FemaleIcon sx={{ color: 'pink' }} />;
      default: return <HelpOutlineIcon color="disabled" />;
    }
  };

  const getGenreLabel = (genre) => {
    switch (genre) {
      case 1: return 'Masculin';
      case 2: return 'Féminin';
      default: return 'Non spécifié';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'suspended': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'suspended': return 'Suspendu';
      default: return status;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/users')}
          sx={{ mb: 2 }}
        >
          Retour à la liste des utilisateurs
        </Button>
        
        <Typography variant="h4" gutterBottom>
          Détails de l'utilisateur
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {user.id}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Informations principales */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Chip
                    label={getStatusLabel(user.status)}
                    color={getStatusColor(user.status)}
                    size="small"
                  />
                }
              >
                <Avatar
                  sx={{ width: 120, height: 120, mb: 2 }}
                  src={user.Photo ? `/api/users/${user.id}/photo` : null}
                >
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
              </Badge>
              <Typography variant="h5" textAlign="center">
                {user.Pren_ut} {user.Nom_ut}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {user.email}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Informations de base */}
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={user.email}
                />
              </ListItem>
              
              {user.Tel && (
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Téléphone"
                    secondary={user.Tel}
                  />
                </ListItem>
              )}

              <ListItem>
                <ListItemIcon>
                  {getGenreIcon(user.Genre)}
                </ListItemIcon>
                <ListItemText
                  primary="Genre"
                  secondary={getGenreLabel(user.Genre)}
                />
              </ListItem>

              {profile && (
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Profil"
                    secondary={
                      <Box>
                        <Typography variant="body2">{profile.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {profile.permissionsCount} permissions
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              )}
            </List>

            <Box mt={3}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/users/${user.id}/edit`)}
                fullWidth
              >
                Modifier l'utilisateur
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Détails et hiérarchie */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Informations système */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Informations système
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Date de création
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Dernière modification
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(user.updatedAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Dernière connexion
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(user.lastLogin)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Hiérarchie */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  <SupervisorIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Responsable hiérarchique
                </Typography>
                {responsable ? (
                  <Card variant="outlined">
                    <CardContent sx={{ py: 2 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {responsable.Pren_ut} {responsable.Nom_ut}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {responsable.email}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    Aucun responsable assigné
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Équipe */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Équipe ({subordinates.length})
                </Typography>
                {subordinates.length > 0 ? (
                  <Box>
                    {subordinates.map((subordinate, idx) => {
                      const key = subordinate._id || subordinate.id || idx;
                      return (
                        <Card key={key} variant="outlined" sx={{ mb: 1 }}>
                          <CardContent sx={{ py: 1 }}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                <PersonIcon fontSize="small" />
                              </Avatar>
                              <Box>
                                <Typography variant="body2">
                                  {subordinate.Pren_ut} {subordinate.Nom_ut}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {subordinate.email}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    Aucun membre dans l'équipe
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/users')}
                  >
                    Retour à la liste
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/users/${user.id}/edit`)}
                  >
                    Modifier
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDetailPage;