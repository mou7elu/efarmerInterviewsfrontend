/**
 * Piece Detail Page
 * Affichage des détails d'une pièce
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { piecesAPI } from '../../../services/api';
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
  Divider
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PieceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [piece, setPiece] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPiece = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await piecesAPI.getById(id);
        setPiece(data);
      } catch (err) {
        console.error('Erreur lors du chargement de la pièce:', err);
        setError('Impossible de charger les détails de la pièce');
      } finally {
        setIsLoading(false);
      }
    };

    loadPiece();
  }, [id]);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Chargement des détails...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/pieces')}
          sx={{ mt: 2 }}
        >
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/pieces')}
          sx={{ mb: 2 }}
        >
          Retour à la liste des pièces
        </Button>
        
        <Typography variant="h4" gutterBottom>
          Détails de la pièce
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {piece.id}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* En-tête avec nom */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <DescriptionIcon color="primary" />
              <Typography variant="h5">{piece.Nom_piece}</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
          </Grid>

          {/* Informations principales */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Informations générales
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Nom de la pièce
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {piece.Nom_piece}
              </Typography>
            </Box>
          </Grid>

          {/* Métadonnées */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Métadonnées
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Date de création
              </Typography>
              <Typography variant="body1">
                {format(new Date(piece.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Dernière modification
              </Typography>
              <Typography variant="body1">
                {format(new Date(piece.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </Typography>
            </Box>
          </Grid>

          {/* Statut */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Statut
            </Typography>
            <Chip 
              label="Active" 
              color="success" 
              variant="outlined"
              sx={{ mr: 1 }}
            />
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/pieces')}
              >
                Retour à la liste
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/pieces/${piece.id}/edit`)}
              >
                Modifier
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PieceDetailPage;