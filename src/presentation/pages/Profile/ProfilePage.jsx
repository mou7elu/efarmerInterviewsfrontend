/**
 * Profile Page
 * Page de profil utilisateur
 */

import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { useAuthStore } from '@presentation/stores/authStore.js';

const ProfilePage = () => {
  const { user } = useAuthStore();

  return (
    <Container maxWidth="md">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mon profil
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="body1" gutterBottom>
          Informations du profil de {user?.fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Cette page sera implémentée avec les informations du profil utilisateur,
          la modification des données personnelles, changement de mot de passe, etc.
        </Typography>
        
        <Box mt={3}>
          <Typography variant="body2">
            <strong>Email:</strong> {user?.email}
          </Typography>
          <Typography variant="body2">
            <strong>Nom:</strong> {user?.nomUt}
          </Typography>
          <Typography variant="body2">
            <strong>Prénom:</strong> {user?.prenomUt}
          </Typography>
          <Typography variant="body2">
            <strong>Téléphone:</strong> {user?.telephone || 'Non renseigné'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;