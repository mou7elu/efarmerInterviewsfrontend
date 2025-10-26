/**
 * Profile Detail Page
 * Affichage des détails d'un profil avec ses permissions
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ProfileDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfileDetails = async () => {
      try {
        setIsLoading(true);
        
        // TODO: remplacer par fetch API réel
        await new Promise((r) => setTimeout(r, 500));
        
        const mockMenus = [
          { _id: '1', name: 'Dashboard', description: 'Tableau de bord principal' },
          { _id: '2', name: 'Producteurs', description: 'Gestion des producteurs' },
          { _id: '3', name: 'Parcelles', description: 'Gestion des parcelles' },
          { _id: '4', name: 'Questionnaires', description: 'Gestion des questionnaires' },
          { _id: '5', name: 'Entretiens', description: 'Gestion des entretiens' },
          { _id: '6', name: 'Utilisateurs', description: 'Gestion des utilisateurs' },
          { _id: '7', name: 'Paramètres', description: 'Configuration système' }
        ];
        
        const mockProfile = {
          _id: id,
          name: 'Administrateur Système',
          permissions: [
            { menuId: '1', canAdd: false, canEdit: false, canDelete: false, canView: true },
            { menuId: '2', canAdd: true, canEdit: true, canDelete: true, canView: true },
            { menuId: '3', canAdd: true, canEdit: true, canDelete: false, canView: true },
            { menuId: '4', canAdd: true, canEdit: true, canDelete: true, canView: true },
            { menuId: '5', canAdd: false, canEdit: true, canDelete: false, canView: true },
            { menuId: '6', canAdd: true, canEdit: true, canDelete: true, canView: true },
            { menuId: '7', canAdd: false, canEdit: true, canDelete: false, canView: true }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usersCount: 3 // Nombre d'utilisateurs ayant ce profil
        };
        
        setMenus(mockMenus);
        setProfile(mockProfile);
      } catch (err) {
        setError('Impossible de charger les détails du profil');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileDetails();
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
          onClick={() => navigate('/profiles')}
          sx={{ mt: 2 }}
        >
          Retour à la liste
        </Button>
      </Container>
    );
  }

  const getMenuName = (menuId) => {
    const menu = menus.find(m => m._id === menuId);
    return menu ? menu.name : 'Menu inconnu';
  };

  const getMenuDescription = (menuId) => {
    const menu = menus.find(m => m._id === menuId);
    return menu ? menu.description : '';
  };

  const countPermissions = () => {
    return profile.permissions.reduce((acc, perm) => {
      if (perm.canView) acc.view++;
      if (perm.canAdd) acc.add++;
      if (perm.canEdit) acc.edit++;
      if (perm.canDelete) acc.delete++;
      return acc;
    }, { view: 0, add: 0, edit: 0, delete: 0 });
  };

  const permissionStats = countPermissions();

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/profiles')}
          sx={{ mb: 2 }}
        >
          Retour à la liste des profils
        </Button>
        
        <Typography variant="h4" gutterBottom>
          Détails du profil
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {profile._id}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Informations générales */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <SecurityIcon />
              </Avatar>
              <Box>
                <Typography variant="h5">{profile.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Profil utilisateur
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Date de création
              </Typography>
              <Typography variant="body1">
                {format(new Date(profile.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Dernière modification
              </Typography>
              <Typography variant="body1">
                {format(new Date(profile.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </Typography>
            </Box>

            <Box mb={3}>
              <Typography variant="body2" color="text.secondary">
                Utilisateurs associés
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <GroupIcon fontSize="small" color="primary" />
                <Typography variant="body1" fontWeight="medium">
                  {profile.usersCount} utilisateur(s)
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Statistiques des permissions */}
            <Typography variant="subtitle1" gutterBottom>
              Résumé des permissions
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Chip 
                  label={`Consulter: ${permissionStats.view}`}
                  color="info"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Chip 
                  label={`Ajouter: ${permissionStats.add}`}
                  color="success"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Chip 
                  label={`Modifier: ${permissionStats.edit}`}
                  color="warning"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Chip 
                  label={`Supprimer: ${permissionStats.delete}`}
                  color="error"
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>

            <Box mt={3}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/profiles/${profile._id}/edit`)}
                fullWidth
              >
                Modifier le profil
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Détail des permissions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Permissions détaillées par module
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Droits d'accès accordés pour chaque module de l'application
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Module</TableCell>
                    <TableCell align="center">Consulter</TableCell>
                    <TableCell align="center">Ajouter</TableCell>
                    <TableCell align="center">Modifier</TableCell>
                    <TableCell align="center">Supprimer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profile.permissions.map((permission) => (
                    <TableRow key={permission.menuId} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">
                            {getMenuName(permission.menuId)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getMenuDescription(permission.menuId)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {permission.canView ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="disabled" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {permission.canAdd ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="disabled" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {permission.canEdit ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="disabled" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {permission.canDelete ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="disabled" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/profiles')}
              >
                Retour à la liste
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/profiles/${profile._id}/edit`)}
              >
                Modifier
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileDetailPage;