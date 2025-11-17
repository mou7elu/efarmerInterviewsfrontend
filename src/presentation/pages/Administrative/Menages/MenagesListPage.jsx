/**
 * Ménages List Page - Version Modulaire
 * Page de gestion complète des ménages avec architecture modulaire
 */

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Fab,
  Tooltip,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import {
  menagesAPI,
  paysAPI,
  districtAPI,
  regionsAPI,
  departementsAPI,
  sousprefsAPI,
  secteursAdministratifsAPI,
  zonesdenombreAPI,
  villagesAPI,
  localitesAPI,
  usersAPI,
  handleApiError,
} from '../../../../services/api.js';
import { useAuthStore } from '@presentation/stores/authStore.js';

// Import des composants modulaires
import {
  BasicInfoSection,
  LocationSection,
  ExploitantSection,
  EnqueteurSection,
} from './components';

const MenagesListPage = () => {
  const { user } = useAuthStore();

  // États pour les données
  const [menages, setMenages] = useState([]);
  const [filteredMenages, setFilteredMenages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour les données de référence
  const [pays, setPays] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [allRegions, setAllRegions] = useState([]);
  const [allDepartements, setAllDepartements] = useState([]);
  const [allSousprefectures, setAllSousprefectures] = useState([]);
  const [allSecteursAdministratifs, setAllSecteursAdministratifs] = useState([]);
  const [allZonedenombres, setAllZonedenombres] = useState([]);
  const [allVillages, setAllVillages] = useState([]);
  const [allLocalites, setAllLocalites] = useState([]);
  const [enqueteurs, setEnqueteurs] = useState([]);

  // États pour les listes filtrées (cascade)
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [filteredDepartements, setFilteredDepartements] = useState([]);
  const [filteredSousprefectures, setFilteredSousprefectures] = useState([]);
  const [filteredSecteursAdministratifs, setFilteredSecteursAdministratifs] = useState([]);
  const [filteredZonedenombres, setFilteredZonedenombres] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);
  const [filteredLocalites, setFilteredLocalites] = useState([]);

  // États UI
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMenage, setSelectedMenage] = useState(null);
  const [formData, setFormData] = useState(getInitialFormData());

  // Données initiales du formulaire
  function getInitialFormData() {
    return {
      PaysId: '',
      DistrictId: '',
      RegionId: '',
      DepartementId: '',
      SousprefId: '',
      SecteurAdministratifId: '',
      ZonedenombreId: '',
      VillageId: '',
      LocaliteId: '',
      EnqueteurId: '',
      Cod_menage: '',
      HasanacProducteur: false,
      NomChefMenage: '',
      PrenomChefMenage: '',
      ContactChefMenage: '',
      NombreExploitants: 0,
      ExploitantIsPresent: false,
      RepresentantIsPresent: false,
      NomRepresentant: '',
      PrenomRepresentant: '',
      ContactRepresentant: '',
      CoordonneesGPS: null,
      MilieuResidence: 0,
    };
  }

  useEffect(() => {
    loadData();
    loadReferenceData();
  }, []);

  // Recherche et filtrage
  useEffect(() => {
    if (searchTerm) {
      const filtered = menages.filter(
        (m) =>
          m.Cod_menage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.NomChefMenage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.PrenomChefMenage?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenages(filtered);
    } else {
      setFilteredMenages(menages);
    }
    setPage(0);
  }, [searchTerm, menages]);

  // Cascade de filtrage géographique
  useEffect(() => {
    if (formData.PaysId) {
      const filtered = allDistricts.filter((d) => d.PaysId === formData.PaysId || d.PaysId?._id === formData.PaysId);
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
  }, [formData.PaysId, allDistricts]);

  useEffect(() => {
    if (formData.DistrictId) {
      const filtered = allRegions.filter((r) => r.DistrictId === formData.DistrictId || r.DistrictId?._id === formData.DistrictId);
      setFilteredRegions(filtered);
    } else {
      setFilteredRegions([]);
    }
  }, [formData.DistrictId, allRegions]);

  useEffect(() => {
    if (formData.RegionId) {
      const filtered = allDepartements.filter((d) => d.RegionId === formData.RegionId || d.RegionId?._id === formData.RegionId);
      setFilteredDepartements(filtered);
    } else {
      setFilteredDepartements([]);
    }
  }, [formData.RegionId, allDepartements]);

  useEffect(() => {
    if (formData.DepartementId) {
      const filtered = allSousprefectures.filter((s) => s.DepartementId === formData.DepartementId || s.DepartementId?._id === formData.DepartementId);
      setFilteredSousprefectures(filtered);
    } else {
      setFilteredSousprefectures([]);
    }
  }, [formData.DepartementId, allSousprefectures]);

  useEffect(() => {
    if (formData.SousprefId) {
      const filtered = allSecteursAdministratifs.filter((s) => s.SousprefId === formData.SousprefId || s.SousprefId?._id === formData.SousprefId);
      setFilteredSecteursAdministratifs(filtered);
    } else {
      setFilteredSecteursAdministratifs([]);
    }
  }, [formData.SousprefId, allSecteursAdministratifs]);

  useEffect(() => {
    if (formData.SecteurAdministratifId) {
      const filtered = allZonedenombres.filter((z) => z.SecteurAdministratifId === formData.SecteurAdministratifId || z.SecteurAdministratifId?._id === formData.SecteurAdministratifId);
      setFilteredZonedenombres(filtered);
    } else {
      setFilteredZonedenombres([]);
    }
  }, [formData.SecteurAdministratifId, allZonedenombres]);

  useEffect(() => {
    if (formData.ZonedenombreId) {
      const filtered = allVillages.filter((v) => v.ZonedenombreId === formData.ZonedenombreId || v.ZonedenombreId?._id === formData.ZonedenombreId);
      setFilteredVillages(filtered);
    } else {
      setFilteredVillages([]);
    }
  }, [formData.ZonedenombreId, allVillages]);

  useEffect(() => {
    if (formData.VillageId) {
      const filtered = allLocalites.filter((l) => l.VillageId === formData.VillageId || l.VillageId?._id === formData.VillageId);
      setFilteredLocalites(filtered);
    } else {
      setFilteredLocalites([]);
    }
  }, [formData.VillageId, allLocalites]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await menagesAPI.getAll({ limit: 1000 });
      const menagesArray = Array.isArray(data) ? data : (data?.data || []);
      console.log('loadData - Premier ménage:', menagesArray[0]);
      console.log('loadData - VillageId du premier:', menagesArray[0]?.VillageId);
      console.log('loadData - LocaliteId du premier:', menagesArray[0]?.LocaliteId);
      setMenages(menagesArray);
      setFilteredMenages(menagesArray);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des ménages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadReferenceData = async () => {
    try {
      const [
        paysData,
        districtsData,
        regionsData,
        departementsData,
        sousprefsData,
        secteursData,
        zonedenombresData,
        villagesData,
        localitesData,
        usersData,
      ] = await Promise.all([
        paysAPI.getAll({ limit: 100 }),
        districtAPI.getAll({ limit: 100 }),
        regionsAPI.getAll({ limit: 100 }),
        departementsAPI.getAll({ limit: 200 }),
        sousprefsAPI.getAll({ limit: 500 }),
        secteursAdministratifsAPI.getAll({ limit: 500 }),
        zonesdenombreAPI.getAll({ limit: 1000 }),
        villagesAPI.getAll({ limit: 2000 }),
        localitesAPI.getAll({ limit: 3000 }),
        usersAPI.getAll({ limit: 200 }),
      ]);
      setPays(Array.isArray(paysData) ? paysData : (paysData?.data || []));
      setAllDistricts(Array.isArray(districtsData) ? districtsData : (districtsData?.data || []));
      setAllRegions(Array.isArray(regionsData?.data) ? regionsData.data : []);
      setAllDepartements(Array.isArray(departementsData?.data) ? departementsData.data : []);
      setAllSousprefectures(Array.isArray(sousprefsData) ? sousprefsData : []);
      setAllSecteursAdministratifs(Array.isArray(secteursData) ? secteursData : []);
      setAllZonedenombres(Array.isArray(zonedenombresData) ? zonedenombresData : []);
      setAllVillages(Array.isArray(villagesData?.data) ? villagesData.data : []);
      setAllLocalites(Array.isArray(localitesData) ? localitesData : []);
      setEnqueteurs(Array.isArray(usersData) ? usersData : (usersData?.data || []));
      
      console.log('loadReferenceData - allVillages sample:', (Array.isArray(villagesData?.data) ? villagesData.data : []).slice(0, 2));
      console.log('loadReferenceData - allLocalites sample:', (Array.isArray(localitesData) ? localitesData : []).slice(0, 2));
    } catch (err) {
      console.error('Erreur lors du chargement des données de référence:', err);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Réinitialiser les champs en cascade lors du changement
      if (field === 'PaysId') {
        newData.DistrictId = '';
        newData.RegionId = '';
        newData.DepartementId = '';
        newData.SousprefId = '';
        newData.SecteurAdministratifId = '';
        newData.ZonedenombreId = '';
        newData.LocaliteId = '';
      } else if (field === 'DistrictId') {
        newData.RegionId = '';
        newData.DepartementId = '';
        newData.SousprefId = '';
        newData.SecteurAdministratifId = '';
        newData.ZonedenombreId = '';
        newData.LocaliteId = '';
      } else if (field === 'RegionId') {
        newData.DepartementId = '';
        newData.SousprefId = '';
        newData.SecteurAdministratifId = '';
        newData.ZonedenombreId = '';
        newData.LocaliteId = '';
      } else if (field === 'DepartementId') {
        newData.SousprefId = '';
        newData.SecteurAdministratifId = '';
        newData.ZonedenombreId = '';
        newData.LocaliteId = '';
      } else if (field === 'SousprefId') {
        newData.SecteurAdministratifId = '';
        newData.ZonedenombreId = '';
        newData.LocaliteId = '';
      } else if (field === 'SecteurAdministratifId') {
        newData.ZonedenombreId = '';
        newData.VillageId = '';
        newData.LocaliteId = '';
      } else if (field === 'ZonedenombreId') {
        newData.VillageId = '';
        newData.LocaliteId = '';
      } else if (field === 'VillageId') {
        newData.LocaliteId = '';
      } else if (field === 'HasanacProducteur' && value === false) {
        // Si pas de producteur anacarde, vider tous les champs liés
        newData.NomChefMenage = '';
        newData.PrenomChefMenage = '';
        newData.ContactChefMenage = '';
        newData.NombreExploitants = 0;
        newData.ExploitantIsPresent = false;
        newData.RepresentantIsPresent = false;
        newData.NomRepresentant = '';
        newData.PrenomRepresentant = '';
        newData.ContactRepresentant = '';
      } else if (field === 'ExploitantIsPresent' && value === true) {
        // Si l'exploitant est présent, vider les données du représentant
        newData.RepresentantIsPresent = false;
        newData.NomRepresentant = '';
        newData.PrenomRepresentant = '';
        newData.ContactRepresentant = '';
      }

      return newData;
    });
  };

  const handleOpenCreate = () => {
    const initialData = getInitialFormData();
    console.log('handleOpenCreate - user:', user);
    console.log('handleOpenCreate - initialData avant:', initialData);
    // Définir automatiquement l'enquêteur avec l'utilisateur connecté
    if (user) {
      // Essayer différentes propriétés possibles pour l'ID
      const userId = user._id || user.id || user.userId || user.user_id || user.user?._id || user.user?.id;
      console.log('handleOpenCreate - userId:', userId);
      if (userId) {
        initialData.EnqueteurId = userId;
      }
    }
    console.log('handleOpenCreate - initialData après:', initialData);
    setFormData(initialData);
    setCreateDialogOpen(true);
  };

  const handleOpenEdit = (menage) => {
    console.log('handleOpenEdit - menage complet:', menage);
    console.log('handleOpenEdit - menage.MilieuResidence:', menage.MilieuResidence);
    setSelectedMenage(menage);
    setFormData({
      ...menage,
      PaysId: typeof menage.PaysId === 'object' ? menage.PaysId._id : menage.PaysId,
      DistrictId: typeof menage.DistrictId === 'object' ? menage.DistrictId._id : menage.DistrictId,
      RegionId: typeof menage.RegionId === 'object' ? menage.RegionId._id : menage.RegionId,
      DepartementId: typeof menage.DepartementId === 'object' ? menage.DepartementId._id : menage.DepartementId,
      SousprefId: typeof menage.SousprefId === 'object' ? menage.SousprefId._id : menage.SousprefId,
      SecteurAdministratifId: typeof menage.SecteurAdministratifId === 'object' ? menage.SecteurAdministratifId._id : menage.SecteurAdministratifId,
      ZonedenombreId: typeof menage.ZonedenombreId === 'object' ? menage.ZonedenombreId._id : menage.ZonedenombreId,
      VillageId: typeof menage.VillageId === 'object' ? menage.VillageId._id : menage.VillageId,
      LocaliteId: typeof menage.LocaliteId === 'object' ? menage.LocaliteId._id : menage.LocaliteId,
      EnqueteurId: typeof menage.EnqueteurId === 'object' ? menage.EnqueteurId._id : menage.EnqueteurId,
      MilieuResidence: menage.MilieuResidence ?? 0,
      CoordonneesGPS: menage.CoordonneesGPS || null,
    });
    setEditDialogOpen(true);
  };

  const handleOpenDelete = (menage) => {
    setSelectedMenage(menage);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      // Validation des champs obligatoires
      if (!formData.PaysId || !formData.DistrictId || !formData.RegionId || 
          !formData.DepartementId || !formData.SousprefId || !formData.SecteurAdministratifId || 
          !formData.ZonedenombreId || !formData.VillageId || !formData.LocaliteId || !formData.EnqueteurId) {
        setError('Tous les champs géographiques et l\'enquêteur sont obligatoires');
        return;
      }

      // Si HasanacProducteur est true, valider les champs du chef de ménage
      if (formData.HasanacProducteur && !formData.NomChefMenage) {
        setError('Le nom du chef de ménage est obligatoire');
        return;
      }

      console.log('handleSubmitCreate - formData avant envoi:', formData);
      console.log('handleSubmitCreate - NombreExploitants:', formData.NombreExploitants, 'Type:', typeof formData.NombreExploitants);

      setLoading(true);
      await menagesAPI.create(formData);
      setCreateDialogOpen(false);
      loadData();
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      if (!selectedMenage) return;

      setLoading(true);
      await menagesAPI.update(selectedMenage.id || selectedMenage._id, formData);
      setEditDialogOpen(false);
      loadData();
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedMenage) return;

      setLoading(true);
      await menagesAPI.delete(selectedMenage.id || selectedMenage._id);
      setDeleteDialogOpen(false);
      loadData();
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Statistiques
  const totalMenages = menages.length;
  const menagesAvecProducteur = menages.filter((m) => m.HasanacProducteur).length;
  const menagesExploitantPresent = menages.filter((m) => m.ExploitantIsPresent).length;
  const menagesAvecRepresentant = menages.filter((m) => m.RepresentantIsPresent).length;

  // Rendu du formulaire dans les dialogs
  const renderFormDialog = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <LocationSection
          formData={formData}
          handleFormChange={handleFormChange}
          pays={pays}
          districts={filteredDistricts}
          regions={filteredRegions}
          departements={filteredDepartements}
          sousprefectures={filteredSousprefectures}
          secteursAdministratifs={filteredSecteursAdministratifs}
          zonedenombres={filteredZonedenombres}
          villages={filteredVillages}
          localites={filteredLocalites}
        />
      </Grid>
      <Grid item xs={12}>
        <BasicInfoSection formData={formData} handleFormChange={handleFormChange} />
      </Grid>
      
      <Grid item xs={12}>
        <ExploitantSection formData={formData} handleFormChange={handleFormChange} />
      </Grid>
      <Grid item xs={12}>
        <EnqueteurSection formData={formData} handleFormChange={handleFormChange} enqueteurs={enqueteurs} currentUser={user} />
      </Grid>
    </Grid>
  );

  const getMilieuLabel = (milieu) => {
    switch (milieu) {
      case 1: return 'Urbain';
      case 2: return 'Semi-urbain';
      case 3: return 'Rural';
      default: return 'Non défini';
    }
  };

  const getMilieuColor = (milieu) => {
    switch (milieu) {
      case 1: return 'info';
      case 2: return 'warning';
      case 3: return 'success';
      default: return 'default';
    }
  };

  if (loading && menages.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Dénombrement des Ménages
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Nouveau Ménage
        </Button>
      </Box>

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistiques */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Ménages
              </Typography>
              <Typography variant="h4">{totalMenages}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Avec Exploitant d'anacarde
              </Typography>
              <Typography variant="h4">{menagesAvecProducteur}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Exploitant présent
              </Typography>
              <Typography variant="h4">{menagesExploitantPresent}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Avec représentant
              </Typography>
              <Typography variant="h4">{menagesAvecRepresentant}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barre de recherche */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher par code, nom ou prénom du chef de ménage..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
      </Paper>

      {/* Tableau */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Chef de ménage</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Localité / Quartier</TableCell>
                <TableCell>Milieu</TableCell>
                <TableCell>Exploitants</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMenages
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((menage) => (
                  <TableRow key={menage._id || menage.id} hover>
                    <TableCell>{menage.Cod_menage}</TableCell>
                    <TableCell>
                      {menage.NomChefMenage} {menage.PrenomChefMenage}
                    </TableCell>
                    <TableCell>{menage.ContactChefMenage}</TableCell>
                    <TableCell>
                      {typeof menage.VillageId === 'object' 
                        ? menage.VillageId?.Lib_village 
                        : allVillages.find((v) => v.id === menage.VillageId || v._id === menage.VillageId)?.Lib_village || 'N/A'}
                      {' / '}
                      {typeof menage.LocaliteId === 'object' 
                        ? menage.LocaliteId?.Lib_localite 
                        : allLocalites.find((l) => l.id === menage.LocaliteId || l._id === menage.LocaliteId)?.Lib_localite || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getMilieuLabel(menage.MilieuResidence)}
                        color={getMilieuColor(menage.MilieuResidence)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{menage.NombreExploitants}</TableCell>
                    <TableCell>
                      {menage.HasanacProducteur && (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Producteur"
                          color="success"
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      )}
                      {menage.ExploitantIsPresent && (
                        <Chip
                          label="Exploitant"
                          color="primary"
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      )}
                      {menage.RepresentantIsPresent && (
                        <Chip
                          label="Représentant"
                          color="secondary"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Modifier">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenEdit(menage)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleOpenDelete(menage)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredMenages.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number.parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Lignes par page:"
        />
      </Paper>

      {/* Dialog Création */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Nouveau Ménage</DialogTitle>
        <DialogContent>{renderFormDialog()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitCreate} variant="contained" color="primary" disabled={loading}>
            {loading ? 'Création...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Édition */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Modifier le Ménage</DialogTitle>
        <DialogContent>{renderFormDialog()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitEdit} variant="contained" color="primary" disabled={loading}>
            {loading ? 'Modification...' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le ménage{' '}
            <strong>{selectedMenage?.Cod_menage}</strong> ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" disabled={loading}>
            {loading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MenagesListPage;
