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
  Place as PlaceIcon
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
    { text: 'Entretiens', icon: <InterviewIcon />, path: '/interviews' },
    { text: 'Producteurs', icon: <AgricultureIcon />, path: '/producteurs' },
    { text: 'Parcelles', icon: <TerrainIcon />, path: '/parcelles' },
    { text: 'Questionnaires', icon: <QuizIcon />, path: '/questionnaires' },
  ];

  const questionnaireStructureMenuItems = [
    { text: 'Questions', icon: <QuestionIcon />, path: '/questions' },
    { text: 'Sections', icon: <ListIcon />, path: '/sections' },
    { text: 'Volets', icon: <AssignmentIcon />, path: '/volets' },
  ];

  const geoMenuItems = [
    { text: 'Pays', icon: <PublicIcon />, path: '/pays' },
    { text: 'Régions', icon: <LocationIcon />, path: '/regions' },
    { text: 'Départements', icon: <LocationCityIcon />, path: '/departements' },
    { text: 'Districts', icon: <LocationIcon />, path: '/districts' },
    { text: 'Villages', icon: <PlaceIcon />, path: '/villages' },
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
      
      {/* Structure des questionnaires */}
      <List subheader={
        <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Structure questionnaires
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
      </List>
      <Divider />
      
      {/* Données géographiques */}
      <List subheader={
        <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Données géographiques
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
      <Divider />
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
          <ListItemButton onClick={() => handleNavigation('/producteurs/create')}>
            <ListItemIcon>
              <AgricultureIcon />
            </ListItemIcon>
            <ListItemText primary="Nouveau producteur" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/parcelles/create')}>
            <ListItemIcon>
              <TerrainIcon />
            </ListItemIcon>
            <ListItemText primary="Nouvelle parcelle" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/questionnaires/create')}>
            <ListItemIcon>
              <QuizIcon />
            </ListItemIcon>
            <ListItemText primary="Nouveau questionnaire" />
          </ListItemButton>
        </ListItem>
      </List>
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
            {location.pathname === '/interviews' && 'Sessions de réponses'}
            {location.pathname === '/interviews/new' && 'Nouvelle session'}
            {location.pathname === '/producteurs' && 'Producteurs Agricoles'}
            {location.pathname === '/producteurs/create' && 'Nouveau Producteur'}
            {location.pathname === '/parcelles' && 'Parcelles'}
            {location.pathname === '/parcelles/create' && 'Nouvelle Parcelle'}
            {location.pathname === '/questionnaires' && 'Questionnaires'}
            {location.pathname === '/questionnaires/create' && 'Nouveau Questionnaire'}
            {location.pathname === '/questions' && 'Questions'}
            {location.pathname === '/sections' && 'Sections'}
            {location.pathname === '/volets' && 'Volets'}
            {location.pathname === '/districts' && 'Districts'}
            {location.pathname === '/villages' && 'Villages'}
            {location.pathname === '/zones-interdites' && 'Zones interdites'}
            {location.pathname === '/pieces' && 'Pièces d\'identité'}
            {location.pathname === '/pays' && 'Pays'}
            {location.pathname === '/regions' && 'Régions'}
            {location.pathname === '/departements' && 'Départements'}
            {location.pathname === '/nationalites' && 'Nationalités'}
            {location.pathname === '/niveaux-scolaires' && 'Niveaux scolaires'}
            {location.pathname === '/users' && 'Utilisateurs'}
            {location.pathname === '/profile' && 'Mon profil'}
          </Typography>
          
          <IconButton color="inherit" onClick={handleMenuClick}>
            <Avatar
              sx={{ width: 32, height: 32 }}
              alt={user?.fullName}
              src={user?.photo}
            >
              {user?.initials}
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