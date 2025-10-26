/**
 * Edit User Page
 * Modifier un utilisateur existant
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { usersAPI, usersService, profilesAPI, handleApiError } from '../../../services/api';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [changePassword, setChangePassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    profileId: '',
    Nom_ut: '',
    Pren_ut: '',
    Photo: null,
    Tel: '',
    Genre: 0,
    ResponsableId: ''
  });

  
  useEffect(() => {
    const loadUserAndData = async () => {
      try {
        setIsLoading(true);
        setError('');

        console.log('EditUserPage - ID from params:', id);
        
        if (!id) {
          setError('ID utilisateur manquant');
          setIsLoading(false);
          return;
        }

        // Pour l'instant, on ne charge que les utilisateurs car /api/profiles n'existe pas
        const [userRes, usersRes] = await Promise.all([
          usersAPI.getById(id),
          usersAPI.getAll({ limit: 1000 })
        ]);

        const userData = userRes || {};
        const usersList = (usersRes && usersRes.items) ? usersRes.items : (usersRes || []);

        // Mock profiles temporaire - remplacer quand /api/profiles sera disponible
        const mockProfiles = [
          { _id: '1', name: 'Administrateur' },
          { _id: '2', name: 'Superviseur' },
          { _id: '3', name: 'Utilisateur' }
        ];
        setProfiles(mockProfiles);
        // Normalize ids (_id or id)
        setUsers(usersList.filter(u => (u._id || u.id) !== id));

        setFormData({
          email: userData.email || '',
          password: '',
          confirmPassword: '',
          profileId: userData.profileId || userData.profileId || '',
          Nom_ut: userData.Nom_ut || userData.Nom || '',
          Pren_ut: userData.Pren_ut || userData.Prenom || '',
          Photo: userData.Photo || null,
          Tel: userData.Tel || '',
          Genre: userData.Genre !== undefined ? userData.Genre : 0,
          ResponsableId: userData.ResponsableId || ''
        });

        if (userData.Photo) {
          setPhotoPreview(`/api/users/${id}/photo`);
        }
      } catch (err) {
        console.error('Erreur lors du chargement de l\'utilisateur:', err);
        setError(handleApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadUserAndData();
  }, [id]);

  const validate = () => {
    if (!formData.email.trim()) return 'L\'email est requis';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Format d\'email invalide';
    
    if (changePassword) {
      if (!formData.password) return 'Le nouveau mot de passe est requis';
      if (formData.password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères';
      if (formData.password !== formData.confirmPassword) return 'Les mots de passe ne correspondent pas';
    }
    
    if (!formData.Nom_ut.trim()) return 'Le nom est requis';
    if (!formData.Pren_ut.trim()) return 'Le prénom est requis';
    if (formData.Tel && !/^[\d\s\-\+\(\)]+$/.test(formData.Tel)) return 'Format de téléphone invalide';
    
    return '';
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('La photo ne doit pas dépasser 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, Photo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Préparer les données à envoyer
      const updateData = {
        email: formData.email.trim(),
        Nom_ut: formData.Nom_ut.trim(),
        Pren_ut: formData.Pren_ut.trim(),
        Tel: formData.Tel.trim(),
        Genre: formData.Genre,
        profileId: formData.profileId || null,
        ResponsableId: formData.ResponsableId || null
      };

      // Ajouter le mot de passe seulement s'il doit être changé
      if (changePassword && formData.password) {
        updateData.password = formData.password;
      }

      console.log('Données de mise à jour:', updateData);

      // Mettre à jour l'utilisateur
      const updatedUser = await usersAPI.update(id, updateData);
      console.log('Utilisateur mis à jour:', updatedUser);

      // Gérer l'upload de photo si une nouvelle photo a été sélectionnée
      if (formData.Photo && formData.Photo instanceof File) {
        try {
          const photoFormData = new FormData();
          photoFormData.append('photo', formData.Photo);
          
          await usersService.uploadPhoto(id, photoFormData);
          console.log('Photo uploadée avec succès');
        } catch (photoError) {
          console.warn('Erreur upload photo:', photoError);
          // Ne pas bloquer la sauvegarde pour une erreur de photo
          // L'utilisateur sera informé que la modification de base a réussi
        }
      }

      navigate('/users', { 
        state: { 
          message: 'Utilisateur modifié avec succès',
          severity: 'success'
        } 
      });
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Container sx={{ mt: 6 }}><Typography>Chargement...</Typography></Container>;

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Modifier l'utilisateur
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {id}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Photo de profil */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Photo de profil
                  </Typography>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Avatar
                      sx={{ width: 80, height: 80 }}
                      src={photoPreview}
                    >
                      <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="photo-upload"
                        type="file"
                        onChange={handlePhotoChange}
                      />
                      <label htmlFor="photo-upload">
                        <IconButton color="primary" component="span">
                          <PhotoCameraIcon />
                        </IconButton>
                      </label>
                      <Typography variant="body2" color="text.secondary">
                        Cliquez pour modifier la photo (max 5MB)
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Informations de connexion */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Informations de connexion
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={isLoading}
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <LockIcon color="primary" />
                        <Typography variant="subtitle1">
                          Mot de passe
                        </Typography>
                        <Chip
                          label={changePassword ? "Modifier le mot de passe" : "Conserver le mot de passe actuel"}
                          color={changePassword ? "warning" : "success"}
                          variant="outlined"
                          onClick={() => setChangePassword(!changePassword)}
                          clickable
                        />
                      </Box>
                      {changePassword && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              required
                              fullWidth
                              label="Nouveau mot de passe"
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                              disabled={isLoading}
                              helperText="Minimum 6 caractères"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              required
                              fullWidth
                              label="Confirmer le nouveau mot de passe"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              disabled={isLoading}
                            />
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Informations personnelles */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Informations personnelles
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        label="Nom"
                        value={formData.Nom_ut}
                        onChange={(e) => setFormData(prev => ({ ...prev, Nom_ut: e.target.value }))}
                        disabled={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        label="Prénom"
                        value={formData.Pren_ut}
                        onChange={(e) => setFormData(prev => ({ ...prev, Pren_ut: e.target.value }))}
                        disabled={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Téléphone"
                        value={formData.Tel}
                        onChange={(e) => setFormData(prev => ({ ...prev, Tel: e.target.value }))}
                        disabled={isLoading}
                        InputProps={{
                          startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Genre</InputLabel>
                        <Select
                          value={formData.Genre}
                          label="Genre"
                          onChange={(e) => setFormData(prev => ({ ...prev, Genre: e.target.value }))}
                          disabled={isLoading}
                        >
                          <MenuItem value={0}>Non spécifié</MenuItem>
                          <MenuItem value={1}>Masculin</MenuItem>
                          <MenuItem value={2}>Féminin</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Profil et hiérarchie */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Profil et hiérarchie
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Profil</InputLabel>
                        <Select
                          value={formData.profileId}
                          label="Profil"
                          onChange={(e) => setFormData(prev => ({ ...prev, profileId: e.target.value }))}
                          disabled={isLoading}
                        >
                          <MenuItem value="">Aucun profil</MenuItem>
                          {profiles.map((profile) => (
                            <MenuItem key={profile._id} value={profile._id}>
                              {profile.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Responsable</InputLabel>
                        <Select
                          value={formData.ResponsableId}
                          label="Responsable"
                          onChange={(e) => setFormData(prev => ({ ...prev, ResponsableId: e.target.value }))}
                          disabled={isLoading}
                        >
                          <MenuItem value="">Aucun responsable</MenuItem>
                          {users.map((user) => (
                            <MenuItem key={user._id} value={user._id}>
                              {user.Pren_ut} {user.Nom_ut} ({user.email})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Actions */}
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button 
                variant="outlined" 
                startIcon={<CancelIcon />} 
                onClick={() => navigate('/users')} 
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={isLoading ? <CircularProgress size={18} /> : <SaveIcon />}
                disabled={isLoading}
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditUserPage;