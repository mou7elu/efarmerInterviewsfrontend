/**
 * Producteurs List Page - Version complète
 * Page de gestion des producteurs avec tous les champs du modèle
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
  Fab,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  Tabs,
  Tab,
  Divider,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Agriculture as AgricultureIcon,
  AccountBalance as BankIcon,
  Group as GroupIcon,
  Landscape as LandscapeIcon,
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { 
  producteursAPI, 
  menagesAPI,
  paysAPI,
  sousprefsAPI,
  niveauxScolairesAPI,
  professionsAPI,
  piecesAPI,
  handleApiError 
} from '../../../../services/api.js';
import { useAuth } from '@presentation/hooks/useAuth';

// Composant TabPanel pour les onglets
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`producteur-tabpanel-${index}`}
      aria-labelledby={`producteur-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProducteursListPage = () => {
  const { user } = useAuth();
  
  // États pour les données
  const [producteurs, setProducteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les dialogues
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProducteur, setSelectedProducteur] = useState(null);
  
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState(0);
  
  // États pour les données de référence
  const [menages, setMenages] = useState([]);
  const [pays, setPays] = useState([]);
  const [sousprefectures, setSousprefectures] = useState([]);
  const [niveauxScolaires, setNiveauxScolaires] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [pieces, setPieces] = useState([]);
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    // Références
    MenageId: '',
    EnqueteurId: user?.id || '',
    
    // Informations de base
    Code: '',
    IsExploitant: true,
    LienRepresentExploitant: 0,
    
    // Bloc Représentant (si IsExploitant = false)
    NomRepresentant: '',
    PrenomRepresentant: '',
    DateNaissRepresentant: '',
    PaysNaissRepresentant: '',
    LieuNaissRepresentant: '',
    GenreRepresentant: 0,
    NiveauScolaireRepresentant: '',
    ProfessionRepresentant: '',
    NatioliteRepresentant: 0,
    PaysdorigineRepresentant: '',
    ContactPrincipalRepresentant: '',
    ContactSecondaireRepresentant: '',
    
    // Bloc Exploitant (si IsExploitant = true)
    NomExploitant: '',
    PrenomExploitant: '',
    DateNaissExploitant: '',
    PaysNaissExploitant: '',
    LieuNaissExploitant: '',
    GenreExploitant: 0,
    NiveauScolaireExploitant: '',
    HasFormationAgricole: false,
    ProfessionExploitant: '',
    NationaliteExploitant: 0,
    PaysdorigineExploitant: '',
    ContactPrincipalExploitant: '',
    ContactSecondaireExploitant: '',
    PieceExploitant: '',
    NumeroPieceExploitant: '',
    SituationMatrimonialeExploitant: 0,
    PrecisionSituationMatrimoniale: '',
    
    // Composition du ménage
    NombreMembresMenage: 0,
    NombreEnfants: 0,
    NombreEnfantsScolarisés: 0,
    NombrePersonnesChargeHorMenage: 0,
    NombreEpouse: 0,
    
    // Caractéristiques du ménage
    TypeBatimentResidence: [],
    PreciserTypeBatiment: '',
    PrincipalMateriauBatiment: 0,
    PreciserMateriauBatiment: '',
    PrincipalMateriauToit: 0,
    PreciserMateriauToit: '',
    PrincipaleSourceEclairage: 0,
    PreciserSourceEclairage: '',
    PrincipaleSourceEau: 0,
    PreciserSourceEau: '',
    PrincipaleInstallationSanitaire: 0,
    PreciserInstallationSanitaire: '',
    PrincipaleSourceCombustible: 0,
    PreciserSourceCombustible: '',
    PrincipalMoyenMobilite: 0,
    
    // Infrastructure et équipement
    HasStockageBatimentAgricole: false,
    CapaciteStockageKg: 0,
    HasMachineAgricole: false,
    MachineAgricole: 0,
    PreciserMachineAgricole: '',
    EquipementSechageAgricole: 0,
    PreciserEquipementSechage: '',
    
    // Accès aux services
    ReseauxMobile: [],
    HasInternet: false,
    HasInfastructureSante: false,
    distanceInfastructureSanteKm: 0,
    PraticienSante: 0,
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
    
    // Aspects sociaux et culturels
    HasAppartenanceGroupe: false,
    TypeGroupe: 0,
    SpecialiteGroupe: '',
    HasAppartenanceTontine: false,
    TypeTontine: [],
    MontantTontine: 0,
    BienNatureTontine: [],
    
    // Surface agricole
    SurfaceAgricoleTotaleUseHa: 0,
    SurfaceAgricoleTotaleJachèreHa: 0,
    SurfaceAgricoleTotaleHa: 0,
    
    // Exploitation anacarde
    NombreParcellesAnacarde: 1,
    OutillageExploitationAnacarde: [],
    PetitOutillageExploitationAnacarde: [],
    MaterielTransportExploitationAnacarde: [],
    HasPratiqueOtherSpeculation: false,
    
    // Autres spéculations
    OtherSpeculations: [],
    HasPratiqueCulturesVivrier: false,
    CultureVivriers: [],
    TypeElevages: [],
  });

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        producteursRes,
        menagesRes,
        paysRes,
        sousprefsRes,
        niveauxRes,
        professionsRes,
        piecesRes
      ] = await Promise.all([
        producteursAPI.getAll({ limit: 1000 }),
        menagesAPI.getAll({ limit: 1000 }),
        paysAPI.getAll({ limit: 100 }),
        sousprefsAPI.getAll({ limit: 1000 }),
        niveauxScolairesAPI.getAll({ limit: 100 }),
        professionsAPI.getAll({ limit: 100 }),
        piecesAPI.getAll({ limit: 100 })
      ]);

      setProducteurs(Array.isArray(producteursRes) ? producteursRes : []);
      setMenages(Array.isArray(menagesRes) ? menagesRes : []);
      setPays(Array.isArray(paysRes) ? paysRes : (paysRes?.data || []));
      setSousprefectures(Array.isArray(sousprefsRes) ? sousprefsRes : []);
      setNiveauxScolaires(Array.isArray(niveauxRes) ? niveauxRes : []);
      setProfessions(Array.isArray(professionsRes) ? professionsRes : []);
      setPieces(Array.isArray(piecesRes) ? piecesRes : []);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Calculer automatiquement la surface totale
    if (field === 'SurfaceAgricoleTotaleUseHa' || field === 'SurfaceAgricoleTotaleJachèreHa') {
      const use = field === 'SurfaceAgricoleTotaleUseHa' ? value : formData.SurfaceAgricoleTotaleUseHa;
      const jachere = field === 'SurfaceAgricoleTotaleJachèreHa' ? value : formData.SurfaceAgricoleTotaleJachèreHa;
      setFormData(prev => ({
        ...prev,
        [field]: value,
        SurfaceAgricoleTotaleHa: parseFloat(use || 0) + parseFloat(jachere || 0)
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value.split(',').map(v => parseInt(v.trim())) : value
    }));
  };

  const resetForm = () => {
    setFormData({
      MenageId: '',
      EnqueteurId: user?.id || '',
      Code: '',
      IsExploitant: true,
      LienRepresentExploitant: 0,
      NomRepresentant: '',
      PrenomRepresentant: '',
      DateNaissRepresentant: '',
      PaysNaissRepresentant: '',
      LieuNaissRepresentant: '',
      GenreRepresentant: 0,
      NiveauScolaireRepresentant: '',
      ProfessionRepresentant: '',
      NatioliteRepresentant: 0,
      PaysdorigineRepresentant: '',
      ContactPrincipalRepresentant: '',
      ContactSecondaireRepresentant: '',
      NomExploitant: '',
      PrenomExploitant: '',
      DateNaissExploitant: '',
      PaysNaissExploitant: '',
      LieuNaissExploitant: '',
      GenreExploitant: 0,
      NiveauScolaireExploitant: '',
      HasFormationAgricole: false,
      ProfessionExploitant: '',
      NationaliteExploitant: 0,
      PaysdorigineExploitant: '',
      ContactPrincipalExploitant: '',
      ContactSecondaireExploitant: '',
      PieceExploitant: '',
      NumeroPieceExploitant: '',
      SituationMatrimonialeExploitant: 0,
      PrecisionSituationMatrimoniale: '',
      NombreMembresMenage: 0,
      NombreEnfants: 0,
      NombreEnfantsScolarisés: 0,
      NombrePersonnesChargeHorMenage: 0,
      NombreEpouse: 0,
      TypeBatimentResidence: [],
      PreciserTypeBatiment: '',
      PrincipalMateriauBatiment: 0,
      PreciserMateriauBatiment: '',
      PrincipalMateriauToit: 0,
      PreciserMateriauToit: '',
      PrincipaleSourceEclairage: 0,
      PreciserSourceEclairage: '',
      PrincipaleSourceEau: 0,
      PreciserSourceEau: '',
      PrincipaleInstallationSanitaire: 0,
      PreciserInstallationSanitaire: '',
      PrincipaleSourceCombustible: 0,
      PreciserSourceCombustible: '',
      PrincipalMoyenMobilite: 0,
      HasStockageBatimentAgricole: false,
      CapaciteStockageKg: 0,
      HasMachineAgricole: false,
      MachineAgricole: 0,
      PreciserMachineAgricole: '',
      EquipementSechageAgricole: 0,
      PreciserEquipementSechage: '',
      ReseauxMobile: [],
      HasInternet: false,
      HasInfastructureSante: false,
      distanceInfastructureSanteKm: 0,
      PraticienSante: 0,
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
      HasAppartenanceGroupe: false,
      TypeGroupe: 0,
      SpecialiteGroupe: '',
      HasAppartenanceTontine: false,
      TypeTontine: [],
      MontantTontine: 0,
      BienNatureTontine: [],
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
    setActiveTab(0);
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (producteur) => {
    setSelectedProducteur(producteur);
    setFormData({
      ...producteur,
      DateNaissRepresentant: producteur.DateNaissRepresentant?.split('T')[0] || '',
      DateNaissExploitant: producteur.DateNaissExploitant?.split('T')[0] || '',
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (producteur) => {
    setSelectedProducteur(producteur);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      setLoading(true);
      
      // Filtrer les champs vides
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          if (key === 'Code') return false; // Le code sera auto-généré
          if (value === '') return false;
          if (Array.isArray(value) && value.length === 0) return false;
          return true;
        })
      );
      
      await producteursAPI.create(cleanedData);
      setCreateDialogOpen(false);
      resetForm();
      await loadData();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      setLoading(true);
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          if (value === '') return false;
          return true;
        })
      );
      
      await producteursAPI.update(selectedProducteur.id, cleanedData);
      setEditDialogOpen(false);
      setSelectedProducteur(null);
      resetForm();
      await loadData();
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
      setSelectedProducteur(null);
      await loadData();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les producteurs selon le terme de recherche
  const filteredProducteurs = producteurs.filter(p =>
    (p.Code && p.Code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.NomExploitant && p.NomExploitant.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.PrenomExploitant && p.PrenomExploitant.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.NomRepresentant && p.NomRepresentant.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.PrenomRepresentant && p.PrenomRepresentant.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedProducteurs = filteredProducteurs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading && producteurs.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <AgricultureIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Gestion des Producteurs
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nouveau Producteur
        </Button>
      </Box>

      {/* Messages d'erreur */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistiques */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Producteurs
              </Typography>
              <Typography variant="h4">
                {producteurs.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Exploitants
              </Typography>
              <Typography variant="h4">
                {producteurs.filter(p => p.IsExploitant).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avec Mobile Money
              </Typography>
              <Typography variant="h4">
                {producteurs.filter(p => p.HasMobileMoney).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Superficie Totale (ha)
              </Typography>
              <Typography variant="h4">
                {producteurs.reduce((sum, p) => sum + (p.SurfaceAgricoleTotaleHa || 0), 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barre de recherche */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un producteur (code, nom, prénom)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Paper>

      {/* Tableau des producteurs */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Nom Complet</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Ménage</TableCell>
              <TableCell>Parcelles</TableCell>
              <TableCell>Surface (ha)</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducteurs.map((producteur) => (
              <TableRow key={producteur.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {producteur.Code}
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
                  {producteur.IsExploitant ? (
                    <>
                      {producteur.NomExploitant} {producteur.PrenomExploitant}
                    </>
                  ) : (
                    <>
                      {producteur.NomRepresentant} {producteur.PrenomRepresentant}
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {producteur.IsExploitant 
                    ? producteur.ContactPrincipalExploitant 
                    : producteur.ContactPrincipalRepresentant}
                </TableCell>
                <TableCell>{producteur.MenageId}</TableCell>
                <TableCell>{producteur.NombreParcellesAnacarde || 0}</TableCell>
                <TableCell>{producteur.SurfaceAgricoleTotaleHa || 0}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Modifier">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(producteur)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(producteur)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {paginatedProducteurs.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Aucun producteur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredProducteurs.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </TableContainer>

      {/* Suite du composant dans le prochain fichier... */}
    </Container>
  );
};

export default ProducteursListPage;
