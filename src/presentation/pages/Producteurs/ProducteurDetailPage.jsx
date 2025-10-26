/**
 * Producteur Detail Page
 * Page de détail d'un producteur avec informations complètes
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  Chip,
  Button,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
  Link,
  IconButton,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  ContactPhone as ContactPhoneIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  PhotoCamera as PhotoCameraIcon,
  Draw as DrawIcon
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { producteursAPI, handleApiError } from '../../../services/api.js';

// Composant pour un onglet
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ProducteurDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [producteur, setProducteur] = useState(null);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  // Fonctions utilitaires pour extraire les données des objets API
  const getValue = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (obj && obj._value) return obj._value;
    if (obj) return obj.toString();
    return '';
  };

  const getSafeId = (obj) => {
    return obj._id || obj.id || 'unknown';
  };

  useEffect(() => {
    loadProducteurData();
  }, [id]);

  const loadProducteurData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Chargement du producteur ID:', id);
      const response = await producteursAPI.getById(id);
      console.log('Réponse API producteur:', response);
      
      if (response.success && response.data) {
        setProducteur(response.data);
      } else {
        setError('Producteur non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données du producteur:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce producteur ?')) {
      try {
        // Supprimer via l'API
        await producteursAPI.delete(id);
        console.log('Producteur supprimé avec succès:', id);
        navigate('/producteurs', {
          state: { message: 'Producteur supprimé avec succès' }
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError(handleApiError(error));
      }
    }
  };

  const getGenreLabel = (genre) => {
    return genre === 1 ? 'Homme' : genre === 2 ? 'Femme' : 'Non défini';
  };

  const getStatutLabel = (sommeil) => {
    return sommeil ? 'Inactif (Sommeil)' : 'Actif';
  };

  const getStatutColor = (sommeil) => {
    return sommeil ? 'error' : 'success';
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement du producteur..." />;
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!producteur) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 4 }}>
          Producteur non trouvé
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
          <Link color="inherit" href="/producteurs">
            Producteurs
          </Link>
          <Typography color="text.primary">{getValue(producteur?.nom)} {getValue(producteur?.prenom)}</Typography>
        </Breadcrumbs>
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
      </Box>

      {/* En-tête du producteur */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{ 
                width: 80, 
                height: 80, 
                mr: 3,
                bgcolor: 'primary.main',
                fontSize: '2rem'
              }}
            >
              {producteur?.photo ? (
                <PhotoCameraIcon />
              ) : (
                `${(getValue(producteur?.nom) || 'P').charAt(0)}${(getValue(producteur?.prenom) || 'P').charAt(0)}`
              )}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1">
                {getValue(producteur?.nom)} {getValue(producteur?.prenom)}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Code: {producteur?.code} • {getGenreLabel(producteur?.genre)}
              </Typography>
              <Box display="flex" gap={2} alignItems="center" mt={1}>
                <Chip
                  label={getStatutLabel(producteur?.sommeil)}
                  color={getStatutColor(producteur?.sommeil)}
                  variant="filled"
                />
                {producteur?.photo && (
                  <Chip 
                    icon={<PhotoCameraIcon />}
                    label="Photo disponible" 
                    color="info" 
                    variant="outlined" 
                  />
                )}
                {producteur?.signature && (
                  <Chip 
                    icon={<DrawIcon />}
                    label="Signature disponible" 
                    color="info" 
                    variant="outlined" 
                  />
                )}
              </Box>
            </Box>
          </Box>
          
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/producteurs')}
            >
              Retour
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/producteurs/${getSafeId(producteur)}/edit`)}
              sx={{ ml: 1 }}
            >
              Modifier
            </Button>
            <IconButton
              color="error"
              onClick={handleDelete}
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Statistiques rapides */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Parcelles</Typography>
                <Typography variant="h4">-</Typography>
                <Typography variant="body2">à implémenter</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Superficie</Typography>
                <Typography variant="h4">-</Typography>
                <Typography variant="body2">à implémenter</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Interviews</Typography>
                <Typography variant="h4">-</Typography>
                <Typography variant="body2">à implémenter</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Âge</Typography>
                <Typography variant="h4">
                  {producteur?.dateNaissance ? 
                    new Date().getFullYear() - new Date(producteur.dateNaissance).getFullYear() : 
                    '-'
                  }
                </Typography>
                <Typography variant="body2">ans</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Onglets de détails */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<PersonIcon />} label="Informations personnelles" />
          <Tab icon={<ContactPhoneIcon />} label="Contact" />
          <Tab icon={<AssignmentIcon />} label="Parcelles" />
          <Tab icon={<TrendingUpIcon />} label="Interviews" />
        </Tabs>

        {/* Informations personnelles */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Informations personnelles
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box display="flex" justifyContent="space-between" py={1}>
                    <Typography><strong>Code :</strong></Typography>
                    <Typography>{producteur?.code}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" py={1}>
                    <Typography><strong>Nom :</strong></Typography>
                    <Typography>{getValue(producteur?.nom)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" py={1}>
                    <Typography><strong>Prénom :</strong></Typography>
                    <Typography>{getValue(producteur?.prenom)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" py={1}>
                    <Typography><strong>Genre :</strong></Typography>
                    <Typography>{getGenreLabel(producteur?.genre)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" py={1}>
                    <Typography><strong>Date de naissance :</strong></Typography>
                    <Typography>
                      {producteur?.dateNaissance ? 
                        new Date(producteur.dateNaissance).toLocaleDateString('fr-FR') : 
                        'Non renseignée'
                      }
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" py={1}>
                    <Typography><strong>Lieu de naissance :</strong></Typography>
                    <Typography>{getValue(producteur?.lieuNaissance) || 'Non renseigné'}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" py={1}>
                    <Typography><strong>Statut :</strong></Typography>
                    <Chip 
                      size="small" 
                      label={getStatutLabel(producteur?.sommeil)} 
                      color={getStatutColor(producteur?.sommeil)} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PhotoCameraIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Photo et Signature
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box display="flex" justifyContent="space-between" py={1}>
                    <Typography><strong>Photo :</strong></Typography>
                    <Typography>
                      {producteur?.photo ? (
                        <Chip size="small" label="Disponible" color="success" />
                      ) : (
                        <Chip size="small" label="Non disponible" color="default" />
                      )}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" py={1}>
                    <Typography><strong>Signature :</strong></Typography>
                    <Typography>
                      {producteur?.signature ? (
                        <Chip size="small" label="Disponible" color="success" />
                      ) : (
                        <Chip size="small" label="Non disponible" color="default" />
                      )}
                    </Typography>
                  </Box>
                  
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      Date de création : {producteur?.createdAt ? 
                        new Date(producteur.createdAt).toLocaleDateString('fr-FR') : 
                        'Non disponible'
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dernière modification : {producteur?.updatedAt ?
                        new Date(producteur.updatedAt).toLocaleDateString('fr-FR') :
                        'Non disponible'
                      }
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Contact */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <PhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informations de contact
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" justifyContent="space-between" py={1}>
                    <Typography><strong>Téléphone 1 :</strong></Typography>
                    <Typography>{producteur?.telephone1 || 'Non renseigné'}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" py={1}>
                    <Typography><strong>Téléphone 2 :</strong></Typography>
                    <Typography>{producteur?.telephone2 || 'Non renseigné'}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Parcelles */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Parcelles du producteur</Typography>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body1" color="text.secondary" align="center">
              Les informations sur les parcelles seront disponibles prochainement.
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/parcelles')}
              >
                Voir toutes les parcelles
              </Button>
            </Box>
          </Paper>
        </TabPanel>

        {/* Interviews */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Interviews réalisées</Typography>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body1" color="text.secondary" align="center">
              Les informations sur les interviews seront disponibles prochainement.
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/interviews')}
              >
                Voir toutes les interviews
              </Button>
            </Box>
          </Paper>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProducteurDetailPage;