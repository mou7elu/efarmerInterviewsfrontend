/**
 * Dashboard Page - Version Clean Architecture
 * Page d'accueil avec vue d'ensemble des données
 * Utilise les hooks personnalisés et composants réutilisables
 */

import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Alert,
  Button,
  Divider
} from '@mui/material';
import {
  People as PeopleIcon,
  Agriculture as AgricultureIcon,
  Home as HomeIcon,
  LocationCity as LocationCityIcon,
  Landscape as LandscapeIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

import { useAuthStore } from '@presentation/stores/authStore.js';
import { useDashboardStats, useRecentActivities } from '@presentation/hooks/useDashboardStats.js';
import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import StatsCard from '@presentation/components/Dashboard/StatsCard.jsx';
import ChartSection from '@presentation/components/Dashboard/ChartSection.jsx';
import ActivityTimeline from '@presentation/components/Dashboard/ActivityTimeline.jsx';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const { stats, loading, error, refetch } = useDashboardStats();
  const { activities, loading: activitiesLoading } = useRecentActivities(7);

  // Préparer les données pour les graphiques
  const parcellesChartData = {
    labels: Object.keys(stats.parcelles.byType),
    datasets: [{
      label: 'Nombre de parcelles',
      data: Object.values(stats.parcelles.byType),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
      ],
    }]
  };

  const localitesChartData = {
    labels: Object.keys(stats.localites.byType),
    datasets: [{
      label: 'Nombre de localités',
      data: Object.values(stats.localites.byType),
      backgroundColor: 'rgba(75, 192, 192, 0.8)',
    }]
    
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Bienvenue, {user?.firstName || 'Utilisateur'} {user?.lastName || ''}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tableau de bord - Vue d&apos;ensemble du système eFarmer
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refetch}
            disabled={loading}
          >
            Actualiser
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Section 1: Statistiques Principales */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom fontWeight="600" mb={3}>
          📊 Statistiques Principales
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={PeopleIcon}
              title="Producteurs"
              value={stats.producteurs.total}
              subtitle={`${stats.producteurs.actifs} actifs`}
              color="primary"
              loading={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={AgricultureIcon}
              title="Parcelles"
              value={stats.parcelles.total}
              subtitle={`${stats.parcelles.superficie.toFixed(2)} ha au total`}
              color="success"
              loading={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={HomeIcon}
              title="Ménages"
              value={stats.menages.total}
              subtitle="Enregistrés dans le système"
              color="info"
              loading={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={LocationCityIcon}
              title="Villages"
              value={stats.villages.total}
              subtitle="Villages recensés"
              color="warning"
              loading={loading}
            />
          </Grid>
        </Grid>
      </Box>


      

      <Divider sx={{ my: 4 }} />

      {/* Section 3: Graphiques */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom fontWeight="600" mb={3}>
          📈 Analyses Graphiques
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ChartSection
              title="Répartition des Parcelles par Type de Culture"
              type="doughnut"
              data={parcellesChartData}
              loading={loading}
              height={350}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ChartSection
              title="Répartition des Localités par Type"
              type="bar"
              data={localitesChartData}
              loading={loading}
              height={350}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Section 4: Activités Récentes */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom fontWeight="600" mb={3}>
          🕒 Activités Récentes (7 derniers jours)
        </Typography>
        
        <ActivityTimeline 
          activities={activities} 
          loading={activitiesLoading}
          maxItems={10}
        />
      </Box>
    </Container>
  );
};

export default DashboardPage;
