# Dashboard - Nouvelle Architecture Clean

## 📋 Vue d'ensemble

Le Dashboard a été complètement refait selon les principes de **Clean Architecture** et utilise la nouvelle logique du système eFarmer.

## 🏗️ Architecture

### Structure des fichiers

```
frontend/src/presentation/
├── hooks/
│   └── useDashboardStats.js          # Hooks personnalisés pour la logique métier
├── components/
│   └── Dashboard/
│       ├── StatsCard.jsx              # Carte de statistique réutilisable
│       ├── ChartSection.jsx           # Section de graphique avec Chart.js
│       ├── ActivityTimeline.jsx       # Timeline des activités récentes
│       └── index.js                   # Export des composants
└── pages/
    └── Dashboard/
        └── DashboardPage.jsx          # Page principale du dashboard
```

## 🎯 Fonctionnalités

### 1. Statistiques en Temps Réel

Le dashboard affiche 8 cartes de statistiques principales :

#### Statistiques Principales
- **Producteurs** : Total + actifs
- **Parcelles** : Total + superficie totale
- **Ménages** : Total enregistré
- **Villages** : Total recensé

#### Localités & Entretiens
- **Localités** : Total toutes catégories
- **Entretiens** : Total des entretiens
- **Complétés** : Entretiens terminés
- **En cours** : Entretiens en attente

### 2. Analyses Graphiques

- **Parcelles par Type** : Graphique Doughnut montrant la répartition des parcelles par type de culture
- **Localités par Type** : Graphique Bar montrant la répartition des localités

### 3. Activités Récentes

Timeline des 7 derniers jours montrant :
- Nouveaux producteurs
- Nouvelles parcelles
- Nouveaux ménages

## 🔧 Hooks Personnalisés

### `useDashboardStats()`

Hook principal pour récupérer toutes les statistiques du dashboard.

**Retour :**
```javascript
{
  stats: {
    producteurs: { total, actifs, byVillage },
    parcelles: { total, superficie, byType },
    menages: { total, byLocalite },
    villages: { total },
    localites: { total, byType },
    interviews: { total, completed, inProgress }
  },
  loading: boolean,
  error: string | null,
  refetch: Function
}
```

**Utilisation :**
```javascript
const { stats, loading, error, refetch } = useDashboardStats();
```

### `useRecentActivities(days)`

Hook pour récupérer les activités récentes.

**Paramètres :**
- `days` (number) : Nombre de jours à inclure (défaut: 7)

**Retour :**
```javascript
{
  activities: [
    {
      type: 'producteur' | 'parcelle' | 'menage',
      title: string,
      date: Date,
      data: Object
    }
  ],
  loading: boolean,
  error: string | null
}
```

## 🎨 Composants Réutilisables

### StatsCard

Carte de statistique avec icône, titre, valeur et sous-titre.

**Props :**
```javascript
{
  icon: MUI Icon Component,
  title: string,
  value: number,
  subtitle: string,
  color: 'primary' | 'success' | 'info' | 'warning' | 'secondary',
  trend: number,        // Optionnel: pourcentage de variation
  loading: boolean      // Optionnel
}
```

**Exemple :**
```jsx
<StatsCard
  icon={PeopleIcon}
  title="Producteurs"
  value={150}
  subtitle="50 actifs"
  color="primary"
  trend={12}
/>
```

### ChartSection

Section pour afficher des graphiques Chart.js.

**Props :**
```javascript
{
  title: string,
  type: 'bar' | 'pie' | 'line' | 'doughnut',
  data: Chart.js data object,
  options: Chart.js options object,  // Optionnel
  height: number,                    // Défaut: 300
  loading: boolean                   // Optionnel
}
```

**Exemple :**
```jsx
<ChartSection
  title="Répartition des Parcelles"
  type="doughnut"
  data={chartData}
  height={350}
/>
```

### ActivityTimeline

Timeline d'activités récentes avec filtrage et pagination.

**Props :**
```javascript
{
  activities: Array<Activity>,
  loading: boolean,          // Optionnel
  maxItems: number          // Défaut: 10
}
```

## 🔄 Actualisation des Données

- **Automatique** : Toutes les 5 minutes
- **Manuel** : Bouton "Actualiser" dans l'en-tête

## 🎯 Avantages de la Nouvelle Architecture

### ✅ Séparation des Responsabilités
- **Hooks** : Logique métier et appels API
- **Composants** : Présentation et UI
- **Pages** : Orchestration et composition

### ✅ Réutilisabilité
- Composants génériques utilisables partout
- Hooks testables indépendamment
- Logique centralisée

### ✅ Maintenabilité
- Code organisé et modulaire
- Facile à tester
- Facile à étendre

### ✅ Performance
- Chargement parallèle des données
- Memoization des calculs
- Actualisation intelligente

## 📊 APIs Utilisées

Le dashboard utilise les APIs suivantes du backend :

- `producteursAPI.getAll()` - Récupérer tous les producteurs
- `parcellesAPI.getAll()` - Récupérer toutes les parcelles
- `menagesAPI.getAll()` - Récupérer tous les ménages
- `villagesAPI.getAll()` - Récupérer tous les villages
- `localitesAPI.getAll()` - Récupérer toutes les localités
- `interviewsAPI.getAll()` - Récupérer tous les entretiens

Toutes ces APIs sont définies dans `frontend/src/services/api.js`.

## 🚀 Prochaines Améliorations

- [ ] Filtrage par date/période
- [ ] Export des données (PDF, Excel)
- [ ] Graphiques interactifs avec zoom
- [ ] Comparaison de périodes
- [ ] Alertes et notifications
- [ ] Tableaux de bord personnalisables

## 🧪 Tests

Pour tester le nouveau dashboard :

1. **Démarrer le backend** :
```bash
cd backend
npm run dev
```

2. **Démarrer le frontend** :
```bash
cd frontend
npm run dev
```

3. **Accéder au dashboard** :
- URL : http://localhost:3000/dashboard
- Se connecter avec un compte utilisateur

## 📝 Notes Techniques

- **Chart.js v4** : Utilisé pour tous les graphiques
- **Material-UI v5** : Composants UI
- **React Hooks** : Gestion d'état et effets
- **Date-fns** : Manipulation des dates
- **Clean Architecture** : Séparation des couches

## 🐛 Dépannage

### Le dashboard ne charge pas les données

1. Vérifier que le backend est démarré
2. Vérifier la console pour les erreurs API
3. Vérifier la configuration de `VITE_API_BASE_URL`

### Les graphiques ne s'affichent pas

1. Vérifier l'installation de Chart.js : `npm install chart.js react-chartjs-2`
2. Vérifier les données transmises aux composants

### Les statistiques sont à zéro

1. Vérifier qu'il y a des données dans la base MongoDB
2. Vérifier les permissions API de l'utilisateur connecté

---

**Version** : 2.0.0  
**Date** : Novembre 2025  
**Architecture** : Clean Architecture  
**Status** : ✅ Complet
