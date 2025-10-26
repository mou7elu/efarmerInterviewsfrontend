/**
 * Not Found Page
 * Page 404 pour les routes non trouvées
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 6, textAlign: 'center', width: '100%' }}>
          <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', mb: 2 }}>
            404
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Page non trouvée
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            La page que vous recherchez n'existe pas ou a été déplacée.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/dashboard')}
            >
              Retour au dashboard
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Page précédente
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFoundPage;