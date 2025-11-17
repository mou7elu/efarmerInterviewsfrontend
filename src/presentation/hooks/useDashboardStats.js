/**
 * Hook personnalisé pour gérer les statistiques du dashboard
 * Suit les principes de Clean Architecture
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  producteursAPI, 
  parcellesAPI, 
  menagesAPI,
  villagesAPI,
  localitesAPI
} from '../../services/api';

/**
 * Hook pour récupérer toutes les statistiques du dashboard
 * @returns {Object} { stats, loading, error, refetch }
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    producteurs: { total: 0, actifs: 0, byVillage: {} },
    parcelles: { total: 0, superficie: 0, byType: {} },
    menages: { total: 0, byLocalite: {} },
    villages: { total: 0 },
    localites: { total: 0, byType: {} },
    interviews: { total: 0, completed: 0, inProgress: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupérer toutes les données en parallèle
      const [
        producteursRes,
        parcellesRes,
        menagesRes,
        villagesRes,
        localitesRes
      ] = await Promise.allSettled([
        producteursAPI.getAll(),
        parcellesAPI.getAll(),
        menagesAPI.getAll(),
        villagesAPI.getAll(),
        localitesAPI.getAll()
      ]);

      // Traiter les producteurs
      const producteurs = producteursRes.status === 'fulfilled' 
        ? (producteursRes.value?.data || producteursRes.value || [])
        : [];
      
      const producteursStats = {
        total: producteurs.length,
        actifs: producteurs.filter(p => p.isActive !== false).length,
        byVillage: producteurs.reduce((acc, p) => {
          const villageId = p.village?._id || p.village || 'Inconnu';
          acc[villageId] = (acc[villageId] || 0) + 1;
          return acc;
        }, {})
      };

      // Traiter les parcelles
      const parcelles = parcellesRes.status === 'fulfilled' 
        ? (parcellesRes.value?.data || parcellesRes.value || [])
        : [];
      
      const parcellesStats = {
        total: parcelles.length,
        superficie: parcelles.reduce((sum, p) => sum + (p.superficie || 0), 0),
        byType: parcelles.reduce((acc, p) => {
          const type = p.typeCulture || 'Autre';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
      };

      // Traiter les ménages
      const menages = menagesRes.status === 'fulfilled' 
        ? (menagesRes.value?.data || menagesRes.value || [])
        : [];
      
      const menagesStats = {
        total: menages.length,
        byLocalite: menages.reduce((acc, m) => {
          const localiteId = m.localite?._id || m.localite || 'Inconnu';
          acc[localiteId] = (acc[localiteId] || 0) + 1;
          return acc;
        }, {})
      };

      // Traiter les villages
      const villages = villagesRes.status === 'fulfilled' 
        ? (villagesRes.value?.data || villagesRes.value || [])
        : [];
      
      const villagesStats = {
        total: villages.length
      };

      // Traiter les localités
      const localites = localitesRes.status === 'fulfilled' 
        ? (localitesRes.value?.data || localitesRes.value || [])
        : [];
      
      const localitesStats = {
        total: localites.length,
        byType: localites.reduce((acc, l) => {
          const type = l.type || 'Autre';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
      };

      setStats({
        producteurs: producteursStats,
        parcelles: parcellesStats,
        menages: menagesStats,
        villages: villagesStats,
        localites: localitesStats,
        interviews: { total: 0, completed: 0, inProgress: 0 }
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Rafraîchir toutes les 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

/**
 * Hook pour récupérer les statistiques des activités récentes
 * @param {number} days - Nombre de jours à inclure (défaut: 7)
 * @returns {Object} { activities, loading, error }
 */
export const useRecentActivities = (days = 7) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);

      try {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);

        const [producteursRes, parcellesRes, menagesRes] = await Promise.allSettled([
          producteursAPI.getAll(),
          parcellesAPI.getAll(),
          menagesAPI.getAll()
        ]);

        const allActivities = [];

        // Producteurs récents
        if (producteursRes.status === 'fulfilled') {
          const producteurs = producteursRes.value?.data || producteursRes.value || [];
          producteurs
            .filter(p => new Date(p.createdAt) >= dateLimit)
            .forEach(p => {
              allActivities.push({
                type: 'producteur',
                title: `Nouveau producteur: ${p.nom} ${p.prenom}`,
                date: new Date(p.createdAt),
                data: p
              });
            });
        }

        // Parcelles récentes
        if (parcellesRes.status === 'fulfilled') {
          const parcelles = parcellesRes.value?.data || parcellesRes.value || [];
          parcelles
            .filter(p => new Date(p.createdAt) >= dateLimit)
            .forEach(p => {
              allActivities.push({
                type: 'parcelle',
                title: `Nouvelle parcelle: ${p.typeCulture || 'N/A'}`,
                date: new Date(p.createdAt),
                data: p
              });
            });
        }

        // Ménages récents
        if (menagesRes.status === 'fulfilled') {
          const menages = menagesRes.value?.data || menagesRes.value || [];
          menages
            .filter(m => new Date(m.createdAt) >= dateLimit)
            .forEach(m => {
              allActivities.push({
                type: 'menage',
                title: `Nouveau ménage: ${m.nom || 'N/A'}`,
                date: new Date(m.createdAt),
                data: m
              });
            });
        }

        // Trier par date (plus récent en premier)
        allActivities.sort((a, b) => b.date - a.date);

        setActivities(allActivities);
      } catch (err) {
        console.error('Erreur lors de la récupération des activités:', err);
        setError(err.message || 'Erreur lors du chargement des activités');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [days]);

  return { activities, loading, error };
};
