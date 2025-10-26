/**
 * Edit Profile Page
 * Modifier un profil existant avec ses permissions
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

const EditProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [menus, setMenus] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    permissions: []
  });

  useEffect(() => {
    const loadProfileAndMenus = async () => {
      try {
        setIsLoading(true);
        
        // Charger les menus et le profil (mock)
        await new Promise((r) => setTimeout(r, 600));
        
        const mockMenus = [
          { _id: '1', name: 'Dashboard', description: 'Tableau de bord principal' },
          { _id: '2', name: 'Producteurs', description: 'Gestion des producteurs' },
          { _id: '3', name: 'Parcelles', description: 'Gestion des parcelles' },
          { _id: '4', name: 'Questionnaires', description: 'Gestion des questionnaires' },
          { _id: '5', name: 'Entretiens', description: 'Gestion des entretiens' },
          { _id: '6', name: 'Utilisateurs', description: 'Gestion des utilisateurs' },
          { _id: '7', name: 'Paramètres', description: 'Configuration système' }
        ];
        
        const mockProfile = {
          _id: id,
          name: 'Administrateur Système',
          permissions: [
            { menuId: '1', canAdd: false, canEdit: false, canDelete: false, canView: true },
            { menuId: '2', canAdd: true, canEdit: true, canDelete: true, canView: true },
            { menuId: '3', canAdd: true, canEdit: true, canDelete: false, canView: true },
            { menuId: '4', canAdd: true, canEdit: true, canDelete: true, canView: true },
            { menuId: '5', canAdd: false, canEdit: true, canDelete: false, canView: true },
            { menuId: '6', canAdd: true, canEdit: true, canDelete: true, canView: true },
            { menuId: '7', canAdd: false, canEdit: true, canDelete: false, canView: true }
          ]
        };
        
        setMenus(mockMenus);
        setFormData({
          name: mockProfile.name,
          permissions: mockProfile.permissions
        });
      } catch (err) {
        setError('Impossible de charger le profil');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileAndMenus();
  }, [id]);

  const validate = () => {
    if (!formData.name.trim()) return 'Le nom du profil est requis';
    if (formData.name.length < 3) return 'Le nom doit contenir au moins 3 caractères';
    
    // Vérifier qu'au moins une permission est accordée
    const hasPermissions = formData.permissions.some(p => 
      p.canAdd || p.canEdit || p.canDelete || p.canView
    );
    if (!hasPermissions) return 'Au moins une permission doit être accordée';
    
    return '';
  };

  const handlePermissionChange = (menuId, permission, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.map(p => 
        p.menuId === menuId ? { ...p, [permission]: value } : p
      )
    }));
  };

  const handleSelectAll = (menuId, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.map(p => 
        p.menuId === menuId ? {
          ...p,
          canAdd: value,
          canEdit: value,
          canDelete: value,
          canView: value
        } : p
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      // TODO: appeler l'API pour mettre à jour le profil
      await new Promise((r) => setTimeout(r, 700));
      navigate('/profiles', { state: { message: 'Profil modifié avec succès' } });
    } catch (err) {
      setError('Erreur lors de la modification du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const getMenuPermission = (menuId) => {
    return formData.permissions.find(p => p.menuId === menuId) || {};
  };

  const hasAnyPermission = (menuId) => {
    const perm = getMenuPermission(menuId);
    return perm.canAdd || perm.canEdit || perm.canDelete || perm.canView;
  };

  if (isLoading) return <Container sx={{ mt: 6 }}><Typography>Chargement...</Typography></Container>;

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Modifier le profil
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {id}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Informations générales */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Informations générales
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    label="Nom du profil"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={isLoading}
                    helperText="Ex: Administrateur, Superviseur, Enquêteur..."
                    placeholder="Administrateur"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Permissions */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <SecurityIcon color="primary" />
                    <Typography variant="h6" color="primary">
                      Permissions d'accès
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Définir les droits d'accès pour chaque module de l'application
                  </Typography>

                  {menus.map((menu) => (
                    <Accordion key={menu._id} sx={{ mb: 1 }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          bgcolor: hasAnyPermission(menu._id) ? 'primary.50' : 'grey.50',
                          '&:hover': { bgcolor: 'grey.100' }
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={2} width="100%">
                          <Typography variant="subtitle1" fontWeight="medium">
                            {menu.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                            {menu.description}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                              <Typography variant="body2" color="text.secondary">
                                Permissions pour {menu.name}
                              </Typography>
                              <Button
                                size="small"
                                onClick={() => handleSelectAll(menu._id, !hasAnyPermission(menu._id))}
                              >
                                {hasAnyPermission(menu._id) ? 'Désélectionner tout' : 'Sélectionner tout'}
                              </Button>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                          </Grid>
                          
                          <Grid item xs={3}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={getMenuPermission(menu._id).canView || false}
                                  onChange={(e) => handlePermissionChange(menu._id, 'canView', e.target.checked)}
                                />
                              }
                              label="Consulter"
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={getMenuPermission(menu._id).canAdd || false}
                                  onChange={(e) => handlePermissionChange(menu._id, 'canAdd', e.target.checked)}
                                />
                              }
                              label="Ajouter"
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={getMenuPermission(menu._id).canEdit || false}
                                  onChange={(e) => handlePermissionChange(menu._id, 'canEdit', e.target.checked)}
                                />
                              }
                              label="Modifier"
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={getMenuPermission(menu._id).canDelete || false}
                                  onChange={(e) => handlePermissionChange(menu._id, 'canDelete', e.target.checked)}
                                />
                              }
                              label="Supprimer"
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Actions */}
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button 
                variant="outlined" 
                startIcon={<CancelIcon />} 
                onClick={() => navigate('/profiles')} 
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={isLoading ? <CircularProgress size={18} /> : <SaveIcon />}
                disabled={isLoading}
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProfilePage;