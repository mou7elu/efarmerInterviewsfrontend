/**
 * App Component
 * Composant principal de l'application
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Stores
import { useAuthStore } from '@presentation/stores/authStore.js';

// Components
import Layout from '@presentation/components/Layout/Layout.jsx';
import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import ProtectedRoute from '@presentation/components/Auth/ProtectedRoute.jsx';

// Pages
import LoginPage from '@presentation/pages/Auth/LoginPage.jsx';
import DashboardPage from '@presentation/pages/Dashboard/DashboardPage.jsx';
import InterviewsPage from '@presentation/pages/Interviews/InterviewsPage.jsx';
import InterviewDetailPage from '@presentation/pages/Interviews/InterviewDetailPage.jsx';
import CreateInterviewPage from '@presentation/pages/Interviews/CreateInterviewPage.jsx';
import EditInterviewPage from '@presentation/pages/Interviews/EditInterviewPage.jsx';

// Producteurs
import ProducteursListPage from '@presentation/pages/Producteurs/ProducteursListPage.jsx';
import CreateProducteurPage from '@presentation/pages/Producteurs/CreateProducteurPage.jsx';
import ProducteurDetailPage from '@presentation/pages/Producteurs/ProducteurDetailPage.jsx';
import EditProducteurPage from '@presentation/pages/Producteurs/EditProducteurPage.jsx';

// Parcelles
import ParcellesListPage from '@presentation/pages/Parcelles/ParcellesListPage.jsx';
import CreateParcellePage from '@presentation/pages/Parcelles/CreateParcellePage.jsx';
import ParcelleDetailPage from '@presentation/pages/Parcelles/ParcelleDetailPage.jsx';
import EditParcellePage from '@presentation/pages/Parcelles/EditParcellePage.jsx';

// Questionnaires
import QuestionnairesListPage from '@presentation/pages/Questionnaires/QuestionnairesListPage.jsx';
import QuestionnaireDetailPage from '@presentation/pages/Questionnaires/QuestionnaireDetailPage.jsx';
import EditQuestionnairePage from '@presentation/pages/Questionnaires/EditQuestionnairePage.jsx';

// Nouveaux modèles
import QuestionsPage from '@presentation/pages/Questions/QuestionsPage.jsx';
import CreateQuestionPage from '@presentation/pages/Questions/CreateQuestionPage.jsx';
import EditQuestionPage from '@presentation/pages/Questions/EditQuestionPage.jsx';
import QuestionDetailPage from '@presentation/pages/Questions/QuestionDetailPage.jsx';
import DistrictsPage from '@presentation/pages/Districts/DistrictsPage.jsx';
import CreateDistrictPage from '@presentation/pages/Districts/CreateDistrictPage.jsx';
import EditDistrictPage from '@presentation/pages/Districts/EditDistrictPage.jsx';
import DistrictDetailPage from '@presentation/pages/Districts/DistrictDetailPage.jsx';
import SectionsPage from '@presentation/pages/Sections/SectionsPage.jsx';
import CreateSectionPage from '@presentation/pages/Sections/CreateSectionPage.jsx';
import EditSectionPage from '@presentation/pages/Sections/EditSectionPage.jsx';
import SectionDetailPage from '@presentation/pages/Sections/SectionDetailPage.jsx';
import VoletsPage from '@presentation/pages/Volets/VoletsPage.jsx';
import CreateVoletPage from '@presentation/pages/Volets/CreateVoletPage.jsx';
import EditVoletPage from '@presentation/pages/Volets/EditVoletPage.jsx';
import VoletDetailPage from '@presentation/pages/Volets/VoletDetailPage.jsx';
import ZonesInterditesPage from '@presentation/pages/ZonesInterdites/ZonesInterditesPage.jsx';
import CreateZoneInterditePage from '@presentation/pages/ZonesInterdites/CreateZoneInterditePage.jsx';
import EditZoneInterditePage from '@presentation/pages/ZonesInterdites/EditZoneInterditePage.jsx';
import ZoneInterditeDetailPage from '@presentation/pages/ZonesInterdites/ZoneInterditeDetailPage.jsx';
import PiecesPage from '@presentation/pages/Pieces/PiecesPage.jsx';
import CreatePiecePage from '@presentation/pages/Pieces/CreatePiecePage.jsx';
import EditPiecePage from '@presentation/pages/Pieces/EditPiecePage.jsx';
import PieceDetailPage from '@presentation/pages/Pieces/PieceDetailPage.jsx';
import VillagesPage from '@presentation/pages/Villages/VillagesPage.jsx';
import CreateVillagePage from '@presentation/pages/Villages/CreateVillagePage.jsx';
import EditVillagePage from '@presentation/pages/Villages/EditVillagePage.jsx';
import VillageDetailPage from '@presentation/pages/Villages/VillageDetailPage.jsx';

// Profiles
import ProfilesPage from '@presentation/pages/Profiles/ProfilesPage.jsx';
import CreateProfilePage from '@presentation/pages/Profiles/CreateProfilePage.jsx';
import EditProfilePage from '@presentation/pages/Profiles/EditProfilePage.jsx';
import ProfileDetailPage from '@presentation/pages/Profiles/ProfileDetailPage.jsx';

// Geographic
import PaysListPage from '@presentation/pages/Geographic/PaysListPage.jsx';
import RegionsListPage from '@presentation/pages/Geographic/RegionsListPage.jsx';
import DepartementsListPage from '@presentation/pages/Geographic/DepartementsListPage.jsx';
import SousprefsListPage from '@presentation/pages/Geographic/SousprefsListPage.jsx';

// Reference
import NationalitesListPage from '@presentation/pages/Reference/NationalitesListPage.jsx';
import CreateNationalitePage from '@presentation/pages/Nationalites/CreateNationalitePage.jsx';
import EditNationalitePage from '@presentation/pages/Nationalites/EditNationalitePage.jsx';
import NationaliteDetailPage from '@presentation/pages/Nationalites/NationaliteDetailPage.jsx';
import NiveauxScolairesListPage from '@presentation/pages/Reference/NiveauxScolairesListPage.jsx';
import CreateNiveauScolairePage from '@presentation/pages/NiveauxScolaires/CreateNiveauScolairePage.jsx';
import EditNiveauScolairePage from '@presentation/pages/NiveauxScolaires/EditNiveauScolairePage.jsx';
import NiveauScolaireDetailPage from '@presentation/pages/NiveauxScolaires/NiveauScolaireDetailPage.jsx';

import UsersPage from '@presentation/pages/Users/UsersPage.jsx';
import CreateUserPage from '@presentation/pages/Users/CreateUserPage.jsx';
import EditUserPage from '@presentation/pages/Users/EditUserPage.jsx';
import UserDetailPage from '@presentation/pages/Users/UserDetailPage.jsx';
import ProfilePage from '@presentation/pages/Profile/ProfilePage.jsx';
import NotFoundPage from '@presentation/pages/Common/NotFoundPage.jsx';

// Thème Material-UI - Style agricole
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Vert agricole
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: '#ff8f00', // Orange terre
      light: '#ffc046',
      dark: '#c56000',
    },
    success: {
      main: '#4caf50', // Vert croissance
    },
    warning: {
      main: '#ff9800', // Orange avertissement
    },
    background: {
      default: '#f1f8e9', // Vert très clair
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8',
          },
        },
      },
    },
  },
});

function App() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <LoadingSpinner size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Route de connexion */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />

          {/* Routes protégées */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Redirection par défaut */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* Entretiens */}
            <Route path="interviews" element={<InterviewsPage />} />
            <Route path="interviews/new" element={<CreateInterviewPage />} />
            <Route path="interviews/:id" element={<InterviewDetailPage />} />
            <Route path="interviews/:id/edit" element={<EditInterviewPage />} />
            
            {/* Producteurs */}
            <Route path="producteurs" element={<ProducteursListPage />} />
            <Route path="producteurs/create" element={<CreateProducteurPage />} />
            <Route path="producteurs/:id" element={<ProducteurDetailPage />} />
            <Route path="producteurs/:id/edit" element={<EditProducteurPage />} />
            
            {/* Parcelles */}
            <Route path="parcelles" element={<ParcellesListPage />} />
            <Route path="parcelles/create" element={<CreateParcellePage />} />
            <Route path="parcelles/:id" element={<ParcelleDetailPage />} />
            <Route path="parcelles/:id/edit" element={<EditParcellePage />} />
            
            {/* Questionnaires */}
            <Route path="questionnaires" element={<QuestionnairesListPage />} />
            <Route path="questionnaires/create" element={<div>Créer un questionnaire (à implémenter)</div>} />
            <Route path="questionnaires/:id" element={<QuestionnaireDetailPage />} />
            <Route path="questionnaires/:id/edit" element={<EditQuestionnairePage />} />
            <Route path="questionnaires/:id/use" element={<div>Utiliser questionnaire (à implémenter)</div>} />
            
            {/* Structure des questionnaires */}
            <Route path="questions" element={<QuestionsPage />} />
            <Route path="questions/new" element={<CreateQuestionPage />} />
            <Route path="questions/:id" element={<QuestionDetailPage />} />
            <Route path="questions/:id/edit" element={<EditQuestionPage />} />
            <Route path="sections" element={<SectionsPage />} />
            <Route path="sections/new" element={<CreateSectionPage />} />
            <Route path="sections/:id" element={<SectionDetailPage />} />
            <Route path="sections/:id/edit" element={<EditSectionPage />} />
            <Route path="volets" element={<VoletsPage />} />
            <Route path="volets/new" element={<CreateVoletPage />} />
            <Route path="volets/:id" element={<VoletDetailPage />} />
            <Route path="volets/:id/edit" element={<EditVoletPage />} />
            
            {/* Données géographiques */}
            <Route path="pays" element={<PaysListPage />} />
            <Route path="regions" element={<RegionsListPage />} />
            <Route path="departements" element={<DepartementsListPage />} />
            <Route path="sousprefectures" element={<SousprefsListPage />} />
            <Route path="districts" element={<DistrictsPage />} />
            <Route path="districts/new" element={<CreateDistrictPage />} />
            <Route path="districts/:id" element={<DistrictDetailPage />} />
            <Route path="districts/:id/edit" element={<EditDistrictPage />} />
            <Route path="villages" element={<VillagesPage />} />
            <Route path="villages/new" element={<CreateVillagePage />} />
            <Route path="villages/:id" element={<VillageDetailPage />} />
            <Route path="villages/:id/edit" element={<EditVillagePage />} />
            <Route path="zones-interdites" element={<ZonesInterditesPage />} />
            <Route path="zones-interdites/new" element={<CreateZoneInterditePage />} />
            <Route path="zones-interdites/:id" element={<ZoneInterditeDetailPage />} />
            <Route path="zones-interdites/:id/edit" element={<EditZoneInterditePage />} />
            
            {/* Données de référence */}
            <Route path="nationalites" element={<NationalitesListPage />} />
            <Route path="nationalites/new" element={<CreateNationalitePage />} />
            <Route path="nationalites/:id" element={<NationaliteDetailPage />} />
            <Route path="nationalites/:id/edit" element={<EditNationalitePage />} />
            <Route path="niveaux-scolaires" element={<NiveauxScolairesListPage />} />
            <Route path="niveaux-scolaires/new" element={<CreateNiveauScolairePage />} />
            <Route path="niveaux-scolaires/:id" element={<NiveauScolaireDetailPage />} />
            <Route path="niveaux-scolaires/:id/edit" element={<EditNiveauScolairePage />} />
            <Route path="pieces" element={<PiecesPage />} />
            <Route path="pieces/new" element={<CreatePiecePage />} />
            <Route path="pieces/:id" element={<PieceDetailPage />} />
            <Route path="pieces/:id/edit" element={<EditPiecePage />} />
            
            {/* Utilisateurs */}
            <Route path="users" element={<UsersPage />} />
            <Route path="users/new" element={<CreateUserPage />} />
            <Route path="users/:id" element={<UserDetailPage />} />
            <Route path="users/:id/edit" element={<EditUserPage />} />
            
            {/* Gestion des profils */}
            <Route path="profiles" element={<ProfilesPage />} />
            <Route path="profiles/new" element={<CreateProfilePage />} />
            <Route path="profiles/:id" element={<ProfileDetailPage />} />
            <Route path="profiles/:id/edit" element={<EditProfilePage />} />
            
            {/* Profil utilisateur */}
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Page 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>

      {/* Notifications toast */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  );
}

export default App;