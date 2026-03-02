/**
 * Parcelles List Page - Version Modulaire
 * Page de gestion complète des parcelles avec architecture modulaire
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
  Landscape as LandscapeIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import {
  parcellesAPI,
  menagesAPI,
  producteursAPI,
  regionsAPI,
  departementsAPI,
  sousprefsAPI,
  secteursAdministratifsAPI,
  zonesdenombreAPI,
  villagesAPI,
  localitesAPI,
  districtAPI,
  handleApiError,
} from '../../../../services/api.js';

// Import des composants modulaires
import BasicInfoSection from './components/BasicInfoSection';
import LocationSection from './components/LocationSection';
import TechnicalSection from './components/TechnicalSection';
import ProductionSection from './components/ProductionSection';

const ParcellesListPage = () => {
  // États de base
  const [parcelles, setParcelles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // États des dialogues
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedParcelle, setSelectedParcelle] = useState(null);

  // États des données de référence
  const [menages, setMenages] = useState([]);
  const [producteurs, setProducteurs] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [regions, setRegions] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [sousprefectures, setSousprefectures] = useState([]);
  const [secteursAdministratifs, setSecteursAdministratifs] = useState([]);
  const [zonedenombres, setZonedenombres] = useState([]);
  const [villages, setVillages] = useState([]);
  const [localites, setLocalites] = useState([]);

  // État du formulaire
  const getInitialFormData = () => ({
    MenageId: '',
    ProducteurId: '',
    Code: '',
    Superficie: 0,
    Coordonnee: null,
    IsSameLocalitethanExploitant: true,
    DistrictId: '',
    RegionId: '',
    DepartementId: '',
    SousprefId: '',
    SecteurAdministratifId: '',
    ZonedenombreId: '',
    LocaliteId: '',
    MilieuResidence: 0,
    yearofcreationParcelle: new Date().getFullYear(),
    yearofProductionStart: new Date().getFullYear(),
    SuperficieProductive: 0,
    SuperficieNonProductive: 0,
    TypeFaitValoirParcelle: '',
    TonnageLastYear: 0,
    PrixVenteLastYear: 0,
    NombreEntretien: 0,
    ProvenanceDesPlants: [],
    HasCertificationProgramme: false,
    HasRecoursServicesConseils: false,
    RecoursServices: '',
    HasParcelleRehabilitee: false,
    SuperficieRehabilitee: 0,
    HasUseEngrais: false,
    HasUsePhytosanitaire: false,
    Depenses: [],
    HasAssociationCulturelle: false,
    AssociationCulturelle: [],
    HasAnarcadePrincipaleCulture: false,
    MainOeuvre: [],
    SalaireMainOeuvre: 0,
  });

  const [formData, setFormData] = useState(getInitialFormData());

  // Charger les données au montage
  useEffect(() => {
    loadData();
    loadReferenceData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await parcellesAPI.getAll({ limit: 10000000 });
      setParcelles(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des parcelles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadReferenceData = async () => {
    try {
      const asArray = (payload) => {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.data)) return payload.data;
        return [];
      };

      const [
        menagesData,
        producteursData,
        districtsData,
        regionsData,
        departementsData,
        sousprefsData,
        secteursData,
        zonedenombresData,
        villagesData,
        localitesData,
      ] = await Promise.all([
        menagesAPI.getAll({ limit: 1000000 }),
        producteursAPI.getAll({ limit: 1000000 }),
        districtAPI.getAll({ limit: 100000 }),
        regionsAPI.getAll({ limit: 1000000 }),
        departementsAPI.getAll({ limit: 1000000 }),
        sousprefsAPI.getAll({ limit: 1000000 }),
        secteursAdministratifsAPI.getAll({ limit: 1000000 }),
        zonesdenombreAPI.getAll({ limit: 1000000 }),
        villagesAPI.getAll({ limit: 1000000 }),
        localitesAPI.getAll({ limit: 1000000 }),
      ]);

      const menagesList = asArray(menagesData);
      const producteursList = asArray(producteursData);
      const districtsList = asArray(districtsData);
      const regionsList = asArray(regionsData);
      const departementsList = asArray(departementsData);
      const sousprefsList = asArray(sousprefsData);
      const secteursList = asArray(secteursData);
      const zonedenombresList = asArray(zonedenombresData);
      const villagesList = asArray(villagesData);
      const localitesList = asArray(localitesData);

      setMenages(menagesList);
      setProducteurs(producteursList);
      setDistricts(districtsList);
      setRegions(regionsList);
      setDepartements(departementsList);
      setSousprefectures(sousprefsList);
      setSecteursAdministratifs(secteursList);
      setZonedenombres(zonedenombresList);
      setVillages(villagesList);
      setLocalites(localitesList);
      
      // DEBUG LOGS
      console.log('=== REFERENCE DATA LOADED ===');
      console.log('Districts:', districtsList.length);
      console.log('Regions:', regionsList.length);
      console.log('Departements:', departementsList.length);
      console.log('Sousprefectures:', sousprefsList.length);
      console.log('SecteursAdministratifs (raw data):', secteursData);
      console.log('SecteursAdministratifs (normalized):', secteursList.length);
      console.log('Zonedenombres:', zonedenombresList.length);
      console.log('Villages:', villagesList.length);
      console.log('Localites:', localitesList.length);
    } catch (err) {
      console.error('Erreur lors du chargement des données de référence:', err);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenCreate = () => {
    setFormData(getInitialFormData());
    setCreateDialogOpen(true);
  };

  const handleOpenEdit = (parcelle) => {
    setSelectedParcelle(parcelle);
    setFormData({
      ...parcelle,
      MenageId: parcelle.MenageId && typeof parcelle.MenageId === 'object' ? parcelle.MenageId._id : parcelle.MenageId,
      ProducteurId: parcelle.ProducteurId && typeof parcelle.ProducteurId === 'object' ? parcelle.ProducteurId._id : parcelle.ProducteurId,
      DistrictId: parcelle.DistrictId && typeof parcelle.DistrictId === 'object' ? parcelle.DistrictId._id : parcelle.DistrictId,
      RegionId: parcelle.RegionId && typeof parcelle.RegionId === 'object' ? parcelle.RegionId._id : parcelle.RegionId,
      DepartementId: parcelle.DepartementId && typeof parcelle.DepartementId === 'object' ? parcelle.DepartementId._id : parcelle.DepartementId,
      SousprefId: parcelle.SousprefId && typeof parcelle.SousprefId === 'object' ? parcelle.SousprefId._id : parcelle.SousprefId,
      SecteurAdministratifId: parcelle.SecteurAdministratifId && typeof parcelle.SecteurAdministratifId === 'object' ? parcelle.SecteurAdministratifId._id : parcelle.SecteurAdministratifId,
      ZonedenombreId: parcelle.ZonedenombreId && typeof parcelle.ZonedenombreId === 'object' ? parcelle.ZonedenombreId._id : parcelle.ZonedenombreId,
      LocaliteId: parcelle.LocaliteId && typeof parcelle.LocaliteId === 'object' ? parcelle.LocaliteId._id : parcelle.LocaliteId,
    });
    setEditDialogOpen(true);
  };

  const handleOpenDelete = (parcelle) => {
    setSelectedParcelle(parcelle);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      // Validation
      if (!formData.MenageId || !formData.ProducteurId) {
        setError('Ménage et Producteur sont requis');
        return;
      }

      if (!formData.IsSameLocalitethanExploitant) {
        if (!formData.RegionId || !formData.DepartementId || !formData.SousprefId || !formData.SecteurAdministratifId || !formData.ZonedenombreId || !formData.LocaliteId) {
          setError('Toutes les informations de localisation sont requises si la parcelle n\'est pas dans la même localité que l\'exploitant');
          return;
        }
      }

      setLoading(true);
      await parcellesAPI.create(formData);
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
      if (!selectedParcelle) return;

      setLoading(true);
      await parcellesAPI.update(selectedParcelle.id || selectedParcelle._id, formData);
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
      if (!selectedParcelle) return;

      setLoading(true);
      await parcellesAPI.delete(selectedParcelle.id || selectedParcelle._id);
      setDeleteDialogOpen(false);
      loadData();
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Filtrage
  const filteredParcelles = parcelles.filter((parcelle) => {
    const searchLower = searchTerm.toLowerCase();
    const code = parcelle.Code || '';
    const producteurNom = parcelle.ProducteurId?.NomExploitant || parcelle.ProducteurId?.NomRepresentant || '';
    
    return (
      code.toLowerCase().includes(searchLower) ||
      producteurNom.toLowerCase().includes(searchLower)
    );
  });

  // Statistiques
  const stats = {
    total: parcelles.length,
    productive: parcelles.filter((p) => p.SuperficieProductive > 0).length,
    certified: parcelles.filter((p) => p.HasCertificationProgramme).length,
    rehabilitees: parcelles.filter((p) => p.HasParcelleRehabilitee).length,
  };

  // Helper pour obtenir les infos du producteur
  const getProducteurInfo = (producteurId) => {
    if (!producteurId) return null;
    
    // Si c'est déjà un objet peuplé
    if (typeof producteurId === 'object') {
      return producteurId;
    }
    
    // Sinon chercher dans la liste des producteurs
    return producteurs.find(p => p._id === producteurId || p.id === producteurId);
  };

  const renderFormDialog = (isEdit = false) => (
    <Dialog
      open={isEdit ? editDialogOpen : createDialogOpen}
      onClose={() => (isEdit ? setEditDialogOpen(false) : setCreateDialogOpen(false))}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {isEdit ? 'Modifier de l\'exploitation' : 'Nouvelle identification d\'une exploitation'}
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ mt: 2 }}>
          <LocationSection
            formData={formData}
            handleFormChange={handleFormChange}
            districts={districts}
            regions={regions}
            departements={departements}
            sousprefectures={sousprefectures}
            secteursAdministratifs={secteursAdministratifs}
            zonedenombres={zonedenombres}
            villages={villages}
            localites={localites}
          />
          <BasicInfoSection
            formData={formData}
            handleFormChange={handleFormChange}
            menages={menages}
            producteurs={producteurs}
          />

          

          <TechnicalSection formData={formData} handleFormChange={handleFormChange} />

          <ProductionSection formData={formData} handleFormChange={handleFormChange} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => (isEdit ? setEditDialogOpen(false) : setCreateDialogOpen(false))}>
          Annuler
        </Button>
        <Button
          onClick={isEdit ? handleSubmitEdit : handleSubmitCreate}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'Enregistrement...' : (isEdit ? 'Modifier' : 'Créer')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading && parcelles.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <LandscapeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Gestion des identifications d'exploitations
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Nouvelle identification d'une exploitation
        </Button>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total exploitations
              </Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                En production
              </Typography>
              <Typography variant="h4">{stats.productive}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Certifiées
              </Typography>
              <Typography variant="h4">{stats.certified}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Réhabilitées
              </Typography>
              <Typography variant="h4">{stats.rehabilitees}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recherche */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher par code ou producteur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
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
                <TableCell>Producteur</TableCell>
                <TableCell>Superficie (ha)</TableCell>
                <TableCell>Année création</TableCell>
                <TableCell>Production (t)</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredParcelles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((parcelle) => (
                  <TableRow key={parcelle.id || parcelle._id}>
                    <TableCell>{parcelle.Code}</TableCell>
                    <TableCell>
                      {(() => {
                        const producteur = getProducteurInfo(parcelle.ProducteurId);
                        const fullName = [
                          producteur?.NomExploitant || producteur?.NomRepresentant || '',
                          producteur?.PrenomExploitant || producteur?.PrenomRepresentant || ''
                        ].filter(Boolean).join(' ');
                        const contact = producteur?.ContactPrincipal || producteur?.Telephone || '';
                        return (
                          <>
                            {producteur?.Code || '-'}
                            <br />
                            <Typography variant="caption" color="textSecondary">
                              {fullName}
                              {contact && ` • ${contact}`}
                            </Typography>
                          </>
                        );
                      })()}
                    </TableCell>
                    <TableCell>{parcelle.Superficie?.toFixed(2) || 0}</TableCell>
                    <TableCell>{parcelle.yearofcreationParcelle}</TableCell>
                    <TableCell>{parcelle.TonnageLastYear?.toFixed(2) || 0}</TableCell>
                    <TableCell>
                      {parcelle.HasCertificationProgramme && (
                        <Chip label="Certifiée" color="success" size="small" sx={{ mr: 0.5 }} />
                      )}
                      {parcelle.HasParcelleRehabilitee && (
                        <Chip label="Réhabilitée" color="info" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenEdit(parcelle)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleOpenDelete(parcelle)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredParcelles.length}
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

      {/* Dialogues */}
      {renderFormDialog(false)}
      {renderFormDialog(true)}

      {/* Dialogue de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette parcelle ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAB pour mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleOpenCreate}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default ParcellesListPage;
