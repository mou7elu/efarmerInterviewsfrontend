/**
 * Producteurs List Page - Version Modulaire
 * Page de gestion complète des producteurs avec architecture modulaire
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
  Agriculture as AgricultureIcon,
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { useAuthStore } from '@presentation/stores/authStore.js';
import {
  producteursAPI,
  menagesAPI,
  paysAPI,
  sousprefsAPI,
  niveauxScolairesAPI,
  professionsAPI,
  piecesAPI,
  handleApiError,
} from '../../../../services/api.js';

// Import des composants modulaires
import BasicInfoSection from './components/BasicInfoSection';
import RepresentantSection from './components/RepresentantSection';
import ExploitantSection from './components/ExploitantSection';
import MenageCompositionSection from './components/MenageCompositionSection';
import MenageCharacteristicsSection from './components/MenageCharacteristicsSection';
import InfrastructureSection from './components/InfrastructureSection';
import ServicesSection from './components/ServicesSection';
import SocialSection from './components/SocialSection';
import ExploitationSection from './components/ExploitationSection';
import ExploitationDetailsSection from './components/ExploitationDetailsSection';

const ProducteursListPage = () => {
  const { user } = useAuthStore();

  // États de base
  const [producteurs, setProducteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // États des dialogues
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProducteur, setSelectedProducteur] = useState(null);

  // États des données de référence
  const [menages, setMenages] = useState([]);
  const [pays, setPays] = useState([]);
  const [sousprefectures, setSousprefectures] = useState([]);
  const [niveauxScolaires, setNiveauxScolaires] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [pieces, setPieces] = useState([]);

  // État du formulaire - Initialisation avec valeurs par défaut
  const getInitialFormData = () => ({
    MenageId: '',
    EnqueteurId: user ? (user.id || user._id) : '',
    IsExploitant: true,
    
    // Représentant
    LienRepresentExploitant: '',
    NomRepresentant: '',
    PrenomRepresentant: '',
    DateNaissRepresentant: '',
    PaysNaissRepresentant: '',
    LieuNaissRepresentant: '',
    GenreRepresentant: '',
    NiveauScolaireRepresentant: '',
    HasFormationAgricole: false,
    HasCouvertureMaladie: false,
    ProfessionRepresentant: '',
    NatioliteRepresentant: '',
    PaysdorigineRepresentant: '',
    ContactPrincipalRepresentant: '',
    ContactSecondaireRepresentant: '',
    NumsecSocial: 0,
    // Exploitant
    NomExploitant: '',
    PrenomExploitant: '',
    DateNaissExploitant: '',
    PaysNaissExploitant: '',
    LieuNaissExploitant: '',
    GenreExploitant: '',
    NiveauScolaireExploitant: '',
    ProfessionExploitant: '',
    NationaliteExploitant: '',
    PaysdorigineExploitant: '',
    ContactPrincipalExploitant: '',
    ContactSecondaireExploitant: '',
    PieceExploitant: '',
    NumeroPieceExploitant: '',
    PhotoExploitant: null,
    PhotoJustificative: null,
    SituationMatrimonialeExploitant: '',
    PrecisionSituationMatrimoniale: '',
    
    // Composition ménage
    NombreMembresMenage: 0,
    NombreEnfants: 0,
    NombreEnfantsScolarisés: 0,
    NombrePersonnesChargeHorMenage: 0,
    NombreEpouse: 0,
    
    // Caractéristiques ménage
    TypeBatimentResidence: [],
    PreciserTypeBatiment: '',
    PrincipalMateriauBatiment: '',
    PreciserMateriauBatiment: '',
    PrincipalMateriauToit: '',
    PreciserMateriauToit: '',
    PrincipaleSourceEclairage: '',
    PreciserSourceEclairage: '',
    PrincipaleSourceEau: '',
    PreciserSourceEau: '',
    PrincipaleInstallationSanitaire: '',
    PreciserInstallationSanitaire: '',
    PrincipaleSourceCombustible: '',
    PreciserSourceCombustible: '',
    PrincipalMoyenMobilite: '',
    
    // Infrastructure
    HasStockageBatimentAgricole: false,
    CapaciteStockageKg: 0,
    HasMachineAgricole: false,
    MachineAgricole: '',
    PreciserMachineAgricole: '',
    EquipementSechageAgricole: '',
    PreciserEquipementSechage: '',
    
    // Services
    ReseauxMobile: [],
    HasInternet: false,
    HasInfastructureSante: false,
    distanceInfastructureSanteKm: 0,
    PraticienSante: '',
    DepenseSanteAnnuel: 0,
    InfrastructueEducation: [],
    DistanceInfrastructureEducationKm: [],
    HasCompteBancaire: false,
    StructureBancaire: [],
    WhyPasCompteBancaire: [],
    HasMobileMoney: false,
    StructureMobileMoney: [],
    WhyPasMobileMoney: [],
    HasUseMobileMoneyService: false,
    TypeServiceMobileMoney: [],
    MontantMensuelMobileMoney: 0,
    MontantMaximumTransaction: 0,
    
    // Social
    HasAppartenanceGroupe: false,
    TypeGroupe: '',
    SpecialiteGroupe: '',
    HasAppartenanceTontine: false,
    TypeTontine: [],
    MontantTontine: 0,
    BienNatureTontine: [],
    
    // Exploitation
    SurfaceAgricoleTotaleUseHa: 0,
    SurfaceAgricoleTotaleJachèreHa: 0,
    SurfaceAgricoleTotaleHa: 0,
    NombreParcellesAnacarde: 1,
    OutillageExploitationAnacarde: [],
    PetitOutillageExploitationAnacarde: [],
    MaterielTransportExploitationAnacarde: [],
    HasPratiqueOtherSpeculation: false,
    OtherSpeculations: [],
    HasPratiqueCulturesVivrier: false,
    CultureVivriers: [],
    TypeElevages: [],
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
      const data = await producteursAPI.getAll({ limit: 1000 });
      setProducteurs(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des producteurs');
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

      const [menagesData, paysData, sousprefsData, niveauxData, professionsData, piecesData] =
        await Promise.all([
          menagesAPI.getAll({ limit: 1000 }),
          paysAPI.getAll({ limit: 100 }),
          sousprefsAPI.getAll({ limit: 1000 }),
          niveauxScolairesAPI.getAll({ limit: 100 }),
          professionsAPI.getAll({ limit: 100 }),
          piecesAPI.getAll({ limit: 100 }),
        ]);

      setMenages(asArray(menagesData));
      setPays(asArray(paysData));
      setSousprefectures(asArray(sousprefsData));
      setNiveauxScolaires(asArray(niveauxData));
      setProfessions(asArray(professionsData));
      setPieces(asArray(piecesData));
    } catch (err) {
      console.error('Erreur lors du chargement des données de référence:', err);
    }
  };

  const handleCreate = () => {
    setFormData(getInitialFormData());
    setCreateDialogOpen(true);
  };

  const handleEdit = (producteur) => {
    setSelectedProducteur(producteur);
    setFormData({
      ...getInitialFormData(),
      ...producteur,
      // Convertir les dates
      DateNaissRepresentant: producteur.DateNaissRepresentant ? producteur.DateNaissRepresentant.split('T')[0] : '',
      DateNaissExploitant: producteur.DateNaissExploitant ? producteur.DateNaissExploitant.split('T')[0] : '',
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (producteur) => {
    setSelectedProducteur(producteur);
    setDeleteDialogOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const normalizeProducteurPayload = (data) => {
    const payload = { ...data };
    const objectIdFields = [
      'MenageId',
      'EnqueteurId',
      'PaysNaissRepresentant',
      'LieuNaissRepresentant',
      'NiveauScolaireRepresentant',
      'ProfessionRepresentant',
      'PaysdorigineRepresentant',
      'PaysNaissExploitant',
      'LieuNaissExploitant',
      'NiveauScolaireExploitant',
      'ProfessionExploitant',
      'PaysdorigineExploitant',
      'PieceExploitant',
    ];

    objectIdFields.forEach((field) => {
      if (payload[field] === '') {
        payload[field] = null;
      }
    });

    delete payload.id;
    delete payload.createdAt;
    delete payload.updatedAt;

    return payload;
  };

  const handleSubmitCreate = async () => {
    try {
      const fallbackEnqueteurId = user?.id || user?._id || user?.userId || user?.user_id || user?.user?._id || user?.user?.id;
      if (!formData.EnqueteurId && fallbackEnqueteurId) {
        setFormData((prev) => ({ ...prev, EnqueteurId: fallbackEnqueteurId }));
      }

      // Validation de base
      if (!formData.MenageId) {
        setError('Le ménage est requis');
        return;
      }

      if (!formData.EnqueteurId && !fallbackEnqueteurId) {
        setError('L\'enquêteur est requis');
        return;
      }

      if (formData.IsExploitant) {
        if (!formData.NomExploitant || !formData.PrenomExploitant) {
          setError('Nom et prénom de l\'exploitant sont requis');
          return;
        }
      } else if (!formData.LienRepresentExploitant || !formData.NomRepresentant || !formData.PrenomRepresentant) {
        setError('Lien, nom et prénom du représentant sont requis');
        return;
      }

      setLoading(true);
      const payload = normalizeProducteurPayload({
        ...formData,
        EnqueteurId: formData.EnqueteurId || fallbackEnqueteurId || '',
      });
      await producteursAPI.create(payload);
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
      setLoading(true);
      const payload = normalizeProducteurPayload(formData);
      await producteursAPI.update(selectedProducteur.id, payload);
      setEditDialogOpen(false);
      loadData();
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDelete = async () => {
    try {
      setLoading(true);
      await producteursAPI.delete(selectedProducteur.id);
      setDeleteDialogOpen(false);
      loadData();
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les producteurs
  const filteredProducteurs = producteurs.filter((p) =>
    p.Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.NomExploitant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.PrenomExploitant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.NomRepresentant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.PrenomRepresentant?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Rendu du dialogue de formulaire (création ou édition)
  const renderFormDialog = (isEdit = false) => (
    <Dialog
      open={isEdit ? editDialogOpen : createDialogOpen}
      onClose={() => (isEdit ? setEditDialogOpen(false) : setCreateDialogOpen(false))}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>{isEdit ? 'Modifier le producteur' : 'Nouveau producteur'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          {/* Composants modulaires */}
          <BasicInfoSection
            formData={formData}
            handleFormChange={handleFormChange}
            menages={menages}
          />

          <RepresentantSection
            formData={formData}
            handleFormChange={handleFormChange}
            pays={pays}
            sousprefectures={sousprefectures}
          />

          <ExploitantSection
            formData={formData}
            handleFormChange={handleFormChange}
            pays={pays}
            sousprefectures={sousprefectures}
          />

          <MenageCompositionSection formData={formData} handleFormChange={handleFormChange} />

          <MenageCharacteristicsSection formData={formData} handleFormChange={handleFormChange} />

          <InfrastructureSection formData={formData} handleFormChange={handleFormChange} />

          <ServicesSection formData={formData} handleFormChange={handleFormChange} />

          <SocialSection formData={formData} handleFormChange={handleFormChange} />

          <ExploitationSection formData={formData} handleFormChange={handleFormChange} />

          <ExploitationDetailsSection formData={formData} handleFormChange={handleFormChange} />
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

  if (loading && producteurs.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <AgricultureIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Gestion des identifications des exploitants
        </Typography>

      </Box>

      {error && !createDialogOpen && !editDialogOpen && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Barre de recherche */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Rechercher par code, nom, prénom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
              Nouvelle identification des exploitants
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistiques rapides */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total exploitants
              </Typography>
              <Typography variant="h4">{producteurs.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Exploitants directs
              </Typography>
              <Typography variant="h4">{producteurs.filter((p) => p.IsExploitant).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avec Mobile Money
              </Typography>
              <Typography variant="h4">{producteurs.filter((p) => p.HasMobileMoney).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avec compte bancaire
              </Typography>
              <Typography variant="h4">{producteurs.filter((p) => p.HasCompteBancaire).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tableau des producteurs */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Nom & Prénom</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Surface (Ha)</TableCell>
                <TableCell>Parcelles</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducteurs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((producteur) => (
                  <TableRow key={producteur.id || producteur._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {producteur.Code || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {producteur.IsExploitant
                          ? `${producteur.NomExploitant || ''} ${producteur.PrenomExploitant || ''}`
                          : `${producteur.NomRepresentant || ''} ${producteur.PrenomRepresentant || ''}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={producteur.IsExploitant ? 'Exploitant' : 'Représentant'}
                        color={producteur.IsExploitant ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {producteur.IsExploitant
                          ? producteur.ContactPrincipalExploitant
                          : producteur.ContactPrincipalRepresentant}
                      </Typography>
                    </TableCell>
                    <TableCell>{producteur.SurfaceAgricoleTotaleHa || 0}</TableCell>
                    <TableCell>{producteur.NombreParcellesAnacarde || 0}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Modifier">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(producteur)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton size="small" color="error" onClick={() => handleDelete(producteur)}>
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
          count={filteredProducteurs.length}
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
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce producteur ?
            {selectedProducteur && (
              <strong>
                {' '}
                {selectedProducteur.IsExploitant
                  ? `${selectedProducteur.NomExploitant} ${selectedProducteur.PrenomExploitant}`
                  : `${selectedProducteur.NomRepresentant} ${selectedProducteur.PrenomRepresentant}`}
              </strong>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitDelete} color="error" variant="contained" disabled={loading}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bouton d'action flottant */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreate}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default ProducteursListPage;
