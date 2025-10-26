/**
 * Create User Page
 * Créer un nouvel utilisateur
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FormControlLabel,
  Switch,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

const CreateUserPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);

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
    // Charger les profils et utilisateurs (mock)
    const loadData = async () => {
      try {
        await new Promise((r) => setTimeout(r, 300));
        
        setProfiles(profiles);
        setUsers(users);
      } catch (err) {
        setError('Impossible de charger les données');
      }
    };

    loadData();
  }, []);

  const validate = () => {
    if (!formData.email.trim()) return 'L\'email est requis';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Format d\'email invalide';
    if (!formData.password) return 'Le mot de passe est requis';
    if (formData.password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères';
    if (formData.password !== formData.confirmPassword) return 'Les mots de passe ne correspondent pas';
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
      // TODO: appeler l'API pour créer l'utilisateur
      await new Promise((r) => setTimeout(r, 800));
      navigate('/users', { state: { message: 'Utilisateur créé avec succès' } });
    } catch (err) {
      setError('Erreur lors de la création de l\'utilisateur');
    } finally {
      setIsLoading(false);
    }
  };

  const getGenreLabel = (genre) => {
    switch (genre) {
      case 1: return 'Masculin';
      case 2: return 'Féminin';
      default: return 'Non spécifié';
    }
  };

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Créer un nouvel utilisateur
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ajouter un utilisateur au système avec ses informations personnelles
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
                        Cliquez pour ajouter une photo (max 5MB)
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
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        label="Mot de passe"
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
                        label="Confirmer le mot de passe"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        disabled={isLoading}
                      />
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
                        placeholder="KOUAME"
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
                        placeholder="Jean"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Téléphone"
                        value={formData.Tel}
                        onChange={(e) => setFormData(prev => ({ ...prev, Tel: e.target.value }))}
                        disabled={isLoading}
                        placeholder="+225 07 XX XX XX XX"
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
                {isLoading ? 'Création...' : 'Créer l\'utilisateur'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateUserPage;