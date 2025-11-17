/**
 * Layout Component
 * Composant de mise en page principal avec navigation
 */

import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as InterviewIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Agriculture as AgricultureIcon,
  Quiz as QuizIcon,
  Public as PublicIcon,
  LocationOn as LocationIcon,
  LocationCity as LocationCityIcon,
  Terrain as TerrainIcon,
  Flag as FlagIcon,
  School as SchoolIcon,
  HelpOutline as QuestionIcon,
  List as ListIcon,
  Assignment as AssignmentIcon,
  Block as BlockIcon,
  Description as DescriptionIcon,
  Place as PlaceIcon,
  Home as HomeIcon,
  Domain as DomainIcon,
  Map as MapIcon,
  Apartment as ApartmentIcon,
  Group as GroupIcon,
  Landscape as LandscapeIcon
} from '@mui/icons-material';

import { useAuthStore } from '@presentation/stores/authStore.js';
import { toast } from 'react-toastify';

const drawerWidth = 240;

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, logout } = useAuthStore();
  console.log(user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
    handleMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'SIG', icon: <LocationIcon />, path: '/sig' },
  ];

  const agricultureMenuItems = [
    { text: 'Dénombrement des ménages', icon: <GroupIcon />, path: '/menages' },
    { text: 'Identification des exploitants', icon: <AgricultureIcon />, path: '/producteurs-geojson' },
    { text: 'Identification des exploitations', icon: <LandscapeIcon />, path: '/parcelles-geojson' },
  ];

  const administrativeMenuItems = [
     { text: 'Pays', icon: <PublicIcon />, path: '/pays' },
    { text: 'Districts', icon: <LocationCityIcon />, path: '/districts' },
    { text: 'Régions', icon: <MapIcon />, path: '/regions' },
    { text: 'Départements', icon: <DomainIcon />, path: '/departements' },
    { text: 'Sous-préfectures', icon: <DomainIcon />, path: '/sousprefectures' },
    { text: 'Secteurs Admin.', icon: <MapIcon />, path: '/secteurs' },
    { text: 'Zones de dénomb.', icon: <ApartmentIcon />, path: '/zones' },
    { text: 'Localités', icon: <PlaceIcon />, path: '/villages' },
    { text: 'Quartiers/Campements', icon: <HomeIcon />, path: '/localites' },
    
  ];


  const geoMenuItems = [
   
    
    { text: 'Zones interdites', icon: <BlockIcon />, path: '/zones-interdites' },
  ];

  const referenceMenuItems = [
    { text: 'Nationalités', icon: <FlagIcon />, path: '/nationalites' },
    { text: 'Niveaux scolaires', icon: <SchoolIcon />, path: '/niveaux-scolaires' },
    { text: 'Pièces d\'identité', icon: <DescriptionIcon />, path: '/pieces' },
  ];

  const adminMenuItems = [
    { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/users' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          eFarmer Interviews
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      
      {/* Module Agricole */}
      <List subheader={
        <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold' }}>
          Agriculture
        </Typography>
      }>
        {agricultureMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      
      {/* Module Administratif */}
      <List subheader={
        <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 'bold' }}>
          Module Administratif
        </Typography>
      }>
        {administrativeMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      
      {/* Structure des questionnaires */}
      {/* <List subheader={
        <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Questionnaires
        </Typography>
      }>
        {questionnaireStructureMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
      <Divider />
      
      {/* Données géographiques */}
      <List subheader={
        <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Géographie
        </Typography>
      }>
        {geoMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      
      {/* Données de référence */}
      <List subheader={
        <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Données de référence
        </Typography>
      }>
        {referenceMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      
      {/* Administration */}
      <List subheader={
        <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Administration
        </Typography>
      }>
        {adminMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* <Divider />
      <List subheader={
        <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Actions rapides
        </Typography>
      }>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/interviews/new')}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Nouvel entretien" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/producteurs-geojson')}>
            <ListItemIcon>
              <AgricultureIcon />
            </ListItemIcon>
            <ListItemText primary="Producteur (GeoJSON)" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/parcelles-geojson')}>
            <ListItemIcon>
              <LandscapeIcon />
            </ListItemIcon>
            <ListItemText primary="Parcelle (GeoJSON)" />
          </ListItemButton>
        </ListItem>
      </List> */}
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* Titre dynamique basé sur la route */}
            {location.pathname === '/dashboard' && 'Dashboard'}
            {location.pathname === '/sig' && 'SIG - Système d\'Information Géographique'}
            {location.pathname === '/interviews' && 'Sessions de réponses'}
            {location.pathname === '/interviews/new' && 'Nouvelle session'}
            
            {/* Agriculture */}
            {location.pathname === '/producteurs-geojson' && 'Gestion des identifications des exploitants'}
            {location.pathname === '/parcelles-geojson' && 'Gestion des identifications d\'exploitations'}
            {location.pathname === '/producteurs' && 'Producteurs Agricoles'}
            {location.pathname === '/producteurs/create' && 'Nouveau Producteur'}
            {location.pathname === '/parcelles' && 'Parcelles'}
            {location.pathname === '/parcelles/create' && 'Nouvelle Parcelle'}
            
            {/* Administratif */}
            {location.pathname === '/sousprefectures' && 'Sous-préfectures'}
            {location.pathname === '/secteurs' && 'Secteurs Administratifs'}
            {location.pathname === '/zones' && 'Zones de Dénombrement'}
            {location.pathname === '/localites' && 'Quartiers / Campements'}
            {location.pathname === '/menages' && 'Dénombrement des Ménages'}
            
            {/* Questionnaires */}
            {location.pathname === '/questionnaires' && 'Questionnaires'}
            {location.pathname === '/questionnaires/create' && 'Nouveau Questionnaire'}
            {location.pathname === '/questions' && 'Questions'}
            {location.pathname === '/sections' && 'Sections'}
            {location.pathname === '/volets' && 'Volets'}
            
            {/* Géographie */}
            {location.pathname === '/pays' && 'Pays'}
            {location.pathname === '/districts' && 'Districts'}
            {location.pathname === '/regions' && 'Régions'}
            {location.pathname === '/departements' && 'Départements'}
            {location.pathname === '/villages' && 'Localités'}
            {location.pathname === '/zones-interdites' && 'Zones interdites'}
            
            {/* Référence */}
            {location.pathname === '/pieces' && 'Pièces d\'identité'}
            {location.pathname === '/nationalites' && 'Nationalités'}
            {location.pathname === '/niveaux-scolaires' && 'Niveaux scolaires'}
            
            {/* Admin */}
            {location.pathname === '/users' && 'Utilisateurs'}
            {location.pathname === '/profile' && 'Mon profil'}
          </Typography>
          
          <IconButton color="inherit" onClick={handleMenuClick}>
            <Avatar
              sx={{ width: 32, height: 32 }}
              alt={`${user?.firstName || ''} ${user?.lastName || ''}`}
              src={user?.photo}
            >
              {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => { handleNavigation('/profile'); handleMenuClose(); }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Mon profil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Déconnexion
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;