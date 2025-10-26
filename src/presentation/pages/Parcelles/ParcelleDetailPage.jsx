/**
 * Parcelle Detail Page
 * Page de détail d'une parcelle avec toutes les informations
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Breadcrumbs,
  Link,
  Alert,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
  Terrain as TerrainIcon,
  Person as PersonIcon,
  QrCode as QrCodeIcon,
  Straighten as StraightenIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { parcellesAPI, producteursAPI, handleApiError } from '../../../services/api.js';
import { getValue, getSafeId, getProducteurNomComplet, getProducteurCode, extractDataFromApiResponse, getSuperficieDisplay } from '../../../shared/utils/entityHelpers.js';

const ParcelleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parcelle, setParcelle] = useState(null);
  const [producteur, setProducteur] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadParcelle();
  }, [id]);

  const loadParcelle = async () => {
    try {
      setLoading(true);
      
      // Charger la parcelle depuis l'API
      const parcelleResponse = await parcellesAPI.getById(id);
      console.log('Réponse API parcelle brute:', parcelleResponse);
      const parcelleData = extractDataFromApiResponse(parcelleResponse);
      console.log('Données parcelle après extraction:', parcelleData);
      
      if (!parcelleData || (Array.isArray(parcelleData) && parcelleData.length === 0)) {
        setError('Parcelle non trouvée');
        return;
      }
      
      setParcelle(parcelleData);
      
      // Charger le producteur associé si disponible
      console.log('Données parcelle complètes:', parcelleData);
      const producteurId = parcelleData?.ProducteurId || parcelleData?.producteurId;
      console.log('ProducteurId extrait:', producteurId);
      
      if (producteurId && producteurId !== 'temp-' && !producteurId.startsWith('temp-')) {
        try {
          console.log('Chargement du producteur avec ID:', producteurId);
          const producteurResponse = await producteursAPI.getById(producteurId);
          console.log('Réponse API producteur brute:', producteurResponse);
          const producteurData = extractDataFromApiResponse(producteurResponse);
          console.log('Données producteur après extraction:', producteurData);
          setProducteur(producteurData);
        } catch (producteurError) {
          console.error('Erreur lors du chargement du producteur:', producteurError);
          // Ne pas bloquer l'affichage si le producteur n'est pas trouvé
        }
      } else {
        console.log('ProducteurId invalide ou temporaire, pas de chargement du producteur');
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error, 'Erreur lors du chargement de la parcelle'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette parcelle ?')) {
      try {
        // Supprimer via l'API
        await parcellesAPI.delete(id);
        console.log('Suppression réussie:', id);
        navigate('/parcelles', { 
          state: { message: 'Parcelle supprimée avec succès!' }
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression de la parcelle');
      }
    }
  };

  const getGenreLabel = (genre) => {
    return genre === 1 ? 'Homme' : genre === 2 ? 'Femme' : 'Non spécifié';
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement de la parcelle..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!parcelle) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning" sx={{ mt: 4 }}>
          Parcelle non trouvée.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* En-tête avec breadcrumbs */}
      <Box mb={4}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} mb={2}>
          <Link color="inherit" href="/dashboard">
            Agriculture
          </Link>
          <Link color="inherit" href="/parcelles">
            Parcelles
          </Link>
          <Typography color="text.primary">
            {getValue(parcelle?.Code) || getValue(parcelle?.code) || getValue(parcelle?.CodeParcelle) || getValue(parcelle?.codeParcelle) || `Parcelle ${id}`}
          </Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Détails de la parcelle
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/parcelles')}
              sx={{ mr: 2 }}
            >
              Retour à la liste
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/parcelles/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Modifier
            </Button>
            <IconButton
              color="error"
              onClick={handleDelete}
              aria-label="Supprimer"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Informations principales de la parcelle */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <TerrainIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h5" component="h2">
                    {getValue(parcelle?.Code) || getValue(parcelle?.code) || getValue(parcelle?.CodeParcelle) || getValue(parcelle?.codeParcelle) || 'Parcelle sans code'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {getSafeId(parcelle)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Informations détaillées */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <QrCodeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Code de la parcelle
                      </Typography>
                      <Typography variant="body1">
                        {getValue(parcelle?.Code) || getValue(parcelle?.code) || getValue(parcelle?.CodeParcelle) || getValue(parcelle?.codeParcelle) || 'Non défini'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <StraightenIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Superficie
                      </Typography>
                      <Typography variant="body1">
                        {getSuperficieDisplay(parcelle)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Informations du producteur propriétaire */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Producteur propriétaire
              </Typography>
              
              {producteur ? (
                <Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {getProducteurNomComplet(producteur)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Code: {getProducteurCode(producteur)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Informations de contact
                    </Typography>
                    
                    {getValue(producteur?.Telephone1) && (
                      <Typography variant="body2" gutterBottom>
                        <strong>Téléphone 1:</strong> {getValue(producteur.Telephone1)}
                      </Typography>
                    )}
                    
                    {getValue(producteur?.Telephone2) && (
                      <Typography variant="body2" gutterBottom>
                        <strong>Téléphone 2:</strong> {getValue(producteur.Telephone2)}
                      </Typography>
                    )}
                    
                    <Typography variant="body2" gutterBottom>
                      <strong>Genre:</strong> {getGenreLabel(getValue(producteur?.Genre))}
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/producteurs/${getSafeId(producteur)}`)}
                    >
                      Voir le profil complet
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Aucun producteur associé
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Statistiques rapides */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistiques
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="primary">
                      {getValue(parcelle?.Superficie) || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hectares
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="success.main">
                      {producteur ? '1' : '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Producteur
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Chip 
                      label={getValue(parcelle?.Code) ? "Codifiée" : "Non codifiée"}
                      color={getValue(parcelle?.Code) ? "success" : "warning"}
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Chip 
                      label="Active"
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ParcelleDetailPage;