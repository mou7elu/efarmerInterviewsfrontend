/**
 * Sous-Préfectures List Page
 * Page de gestion des sous-préfectures (CRUD)
 */

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Container,
  Typography,
  Paper,
  Alert,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocationCity as LocationCityIcon,
  Domain as DomainIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { sousprefsAPI, departementsAPI, handleApiError } from '../../../../services/api.js';

const SousprefsListPage = () => {
  // États locaux
  const [sousprefs, setSousprefs] = useState([]);
  const [filteredSousprefs, setFilteredSousprefs] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [importFile, setImportFile] = useState(null);
  const [importIsLoading, setImportIsLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [importStats, setImportStats] = useState(null);
  const [importErrors, setImportErrors] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [departementFilter, setDepartementFilter] = useState('');
  
  // États pour les modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSouspref, setSelectedSouspref] = useState(null);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    Lib_Souspref: '',
    Cod_Souspref: '',
    DepartementId: '',
  });

  useEffect(() => {
    loadData();
    loadDepartements();
  }, []);

  // Appliquer le filtre de recherche
  useEffect(() => {
    if (!searchTerm && !departementFilter) {
      setFilteredSousprefs(sousprefs);
    } else {
      const filtered = sousprefs.filter(s => {
        const Lib_Souspref = s.Lib_Souspref || '';
        const Cod_Souspref = s.Cod_Souspref || '';
        
        // Comparer les IDs correctement (string ou objet)
        const sousprefDeptId = s.DepartementId && typeof s.DepartementId === 'object' ? (s.DepartementId._id || s.DepartementId.id) : s.DepartementId;
        const departementMatch = !departementFilter || sousprefDeptId === departementFilter;
        
        const searchMatch = !searchTerm || 
          Lib_Souspref.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Cod_Souspref.toLowerCase().includes(searchTerm.toLowerCase());
        
        return searchMatch && departementMatch;
      });
      setFilteredSousprefs(filtered);
    }
    setPage(0);
  }, [sousprefs, searchTerm, departementFilter]);

  const normalizeHeader = (header) => header.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');
  const normalizeName = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/'/g, '');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await sousprefsAPI.getAll({ limit: 1000 });
      const data = response.data || response;
      const sousprefsData = data.items || data || [];
      
      setSousprefs(sousprefsData);
      setFilteredSousprefs(sousprefsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadDepartements = async () => {
    try {
      const response = await departementsAPI.getAll({ limit: 1000 });
      const data = response.data || response;
      const departementsData = data.items || data || [];
      setDepartements(departementsData);
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownloadTemplate = () => {
    const headers = ['Lib_Souspref', 'Cod_Souspref', 'Lib_Departement'];
    const example = ['EXEMPLE_LIB', 'EXEMPLE_CODE', 'EXEMPLE_DEPARTEMENT'];
    const worksheet = XLSX.utils.aoa_to_sheet([headers, example]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'sousprefectures');

    const fileBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([fileBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'sousprefectures-modele.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportFileChange = (event) => {
    const [file] = event.target.files || [];
    setImportFile(file || null);
    setImportError('');
    setImportSuccess('');
    setImportStats(null);
    setImportProgress(0);
    setImportErrors([]);
  };

  const handleImportFile = async () => {
    if (!importFile) {
      setImportError('Veuillez choisir un fichier Excel ou CSV.');
      return;
    }

    setImportIsLoading(true);
    setImportError('');
    setImportSuccess('');
    setImportStats(null);
    setImportProgress(0);
    setImportErrors([]);

    try {
      const arrayBuffer = await importFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        throw new Error('Aucune feuille detectee dans le fichier.');
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (!rows.length) {
        throw new Error('Le fichier est vide.');
      }

      const existingCodes = new Set(
        sousprefs
          .map((s) => String(s.Cod_Souspref || '').trim().toLowerCase())
          .filter(Boolean)
      );
      const importedCodes = new Set();

      const mappedRows = rows.map((row, index) => {
        const normalizedRow = Object.entries(row).reduce((acc, [key, value]) => {
          acc[normalizeHeader(String(key))] = value;
          return acc;
        }, {});

        const libSouspref = String(normalizedRow.libsouspref || '').trim();
        const codSouspref = String(normalizedRow.codsouspref || '').trim();
        const libDepartement = String(normalizedRow.libdepartement || '').trim();
        const departementId = String(normalizedRow.departementid || '').trim();
        const codeKey = codSouspref.toLowerCase();

        const matchedDepartement = libDepartement
          ? departements.find((d) => normalizeName(d.Lib_Departement) === normalizeName(libDepartement))
          : null;
        const resolvedDepartementId = departementId
          || (matchedDepartement ? (matchedDepartement._id || matchedDepartement.id) : '');

        if (!libSouspref || !codSouspref || !resolvedDepartementId) {
          return { index, error: 'Lib_Souspref, Cod_Souspref et Lib_Departement sont obligatoires.' };
        }

        if (existingCodes.has(codeKey)) {
          return { index, error: `Cod_Souspref deja existant: ${codSouspref}` };
        }

       
        importedCodes.add(codeKey);

        if (libDepartement && !matchedDepartement) {
          return { index, error: `Departement introuvable: ${libDepartement}` };
        }

        return {
          index,
          data: {
            Lib_Souspref: libSouspref,
            Cod_Souspref: codSouspref,
            DepartementId: resolvedDepartementId,
          }
        };
      });

      const totalRows = mappedRows.length;
      let successCount = 0;
      const errors = [];

      for (let i = 0; i < mappedRows.length; i += 1) {
        const row = mappedRows[i];
        setImportProgress(Math.round(((i + 1) / totalRows) * 100));

        if (row.error) {
          errors.push(`Ligne ${row.index + 2}: ${row.error}`);
          continue;
        }

        try {
          await sousprefsAPI.create(row.data);
          successCount += 1;
        } catch (error) {
          const message = error?.message || 'Erreur lors de la creation.';
          errors.push(`Ligne ${row.index + 2}: ${message}`);
        }
      }

      setImportStats({ total: totalRows, success: successCount, failed: errors.length });
      setImportErrors(errors);

      if (errors.length) {
        setImportError('Des erreurs sont survenues pendant l\'import.');
      } else {
        setImportSuccess('Importation terminee avec succes.');
      }

      await loadData();
    } catch (error) {
      console.error('Erreur lors de l\'import des sous-prefectures:', error);
      setImportError(error.message || 'Erreur lors de l\'import du fichier.');
    } finally {
      setImportIsLoading(false);
      setImportProgress(0);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      Lib_Souspref: '',
      Cod_Souspref: '',
      DepartementId: '',
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (souspref) => {
    setSelectedSouspref(souspref);
    setFormData({
      Lib_Souspref: souspref.Lib_Souspref || '',
      Cod_Souspref: souspref.Cod_Souspref || '',
      DepartementId: souspref.DepartementId && typeof souspref.DepartementId === 'object' ? souspref.DepartementId._id : souspref.DepartementId,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (souspref) => {
    setSelectedSouspref(souspref);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      console.log('handleSubmitCreate - formData:', formData);
      await sousprefsAPI.create(formData);
      setCreateDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      alert(`Erreur: ${errorMessage}`);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const sousprefId = selectedSouspref.id || selectedSouspref._id;
      await sousprefsAPI.update(sousprefId, formData);
      setEditDialogOpen(false);
      setSelectedSouspref(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const sousprefId = selectedSouspref.id || selectedSouspref._id;
      await sousprefsAPI.delete(sousprefId);
      setDeleteDialogOpen(false);
      setSelectedSouspref(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getDepartementName = (deptId) => {
    if (!deptId) return '—';
    
    // Si deptId est un objet avec _id ou id
    const searchId = typeof deptId === 'object' ? (deptId._id || deptId.id) : deptId;
    
    const dept = departements.find(d => (d._id || d.id) === searchId);
    return dept ? (dept.Lib_Departement || '—') : '—';
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des sous-préfectures..." />;
  }

  return (
    <Container maxWidth="xl">
      {/* En-tête */}
      <Box mb={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          gap={2}
          mb={2}
        >
          <Typography variant="h4" component="h1">
            Sous-Prefectures
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2} sx={{ width: { xs: '100%', md: 560 } }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Nouvelle sous-prefecture
            </Button>
            <Paper sx={{ p: 3, width: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="h6">Importer un fichier Excel</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Modele avec Lib_Souspref et Cod_Souspref.
                  </Typography>
                </Box>
                <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleDownloadTemplate}>
                  Telecharger le modele
                </Button>
              </Box>

              {importError && <Alert severity="error" sx={{ mb: 2, mt: 2 }}>{importError}</Alert>}
              {importSuccess && <Alert severity="success" sx={{ mb: 2, mt: 2 }}>{importSuccess}</Alert>}
              {importStats && (
                <Alert severity="info" sx={{ mb: 2, mt: 2 }}>
                  {importStats.success} cree(s) sur {importStats.total} ligne(s). {importStats.failed} erreur(s).
                </Alert>
              )}
              {importErrors.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2, mt: 2 }}>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {importErrors.map((message, index) => (
                      <li key={`${index}-${message}`}>{message}</li>
                    ))}
                  </Box>
                </Alert>
              )}

              <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                <Grid item xs={12} md={7}>
                  <Button variant="outlined" component="label" fullWidth disabled={importIsLoading}>
                    {importFile ? importFile.name : 'Choisir un fichier Excel/CSV'}
                    <input type="file" hidden accept=".xlsx,.xls,.csv" onChange={handleImportFileChange} />
                  </Button>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Button variant="contained" onClick={handleImportFile} disabled={importIsLoading || !importFile} fullWidth>
                    {importIsLoading ? 'Importation...' : 'Importer le fichier'}
                  </Button>
                </Grid>
                {importIsLoading && (
                  <Grid item xs={12}>
                    <LinearProgress variant="determinate" value={importProgress} />
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
        </Box>
        
        {/* Statistiques */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">
                  {sousprefs.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total sous-préfectures
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>

      {/* Barre de recherche */}
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom ou code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par département</InputLabel>
              <Select
                value={departementFilter}
                onChange={(e) => setDepartementFilter(e.target.value)}
                label="Filtrer par département"
              >
                <MenuItem value="">Tous les départements</MenuItem>
                {departements.map((d) => (
                  <MenuItem key={d._id || d.id} value={d._id || d.id}>
                    {d.Lib_Departement || '—'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Messages d'erreur */}
      {error && (
        <Box mb={2}>
          <Typography variant="body1" color="error">
            Erreur : {error}
          </Typography>
        </Box>
      )}

      {/* Tableau */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Département</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSousprefs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      {searchTerm || departementFilter ? 'Aucune sous-préfecture trouvée' : 'Aucune donnée'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSousprefs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((souspref) => (
                    <TableRow key={souspref._id || souspref.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <LocationCityIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1" fontWeight="medium">
                            {souspref.Lib_Souspref || '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={souspref.Cod_Souspref || '—'} size="small" />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <DomainIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                          {getDepartementName(souspref.DepartementId)}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => handleEdit(souspref)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton size="small" color="error" onClick={() => handleDelete(souspref)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredSousprefs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Lignes par page:"
        />
      </Paper>

      {/* FAB */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreate}
      >
        <AddIcon />
      </Fab>

      {/* Dialog de création */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouvelle sous-préfecture</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de la sous-préfecture"
                value={formData.Lib_Souspref}
                onChange={(e) => handleFormChange('Lib_Souspref', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code de la sous-préfecture"
                value={formData.Cod_Souspref}
                onChange={(e) => handleFormChange('Cod_Souspref', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Département</InputLabel>
                <Select
                  value={formData.DepartementId}
                  onChange={(e) => handleFormChange('DepartementId', e.target.value)}
                  label="Département"
                >
                  {departements.map((d) => (
                    <MenuItem key={d._id || d.id} value={d._id || d.id}>
                      {d.Lib_Departement || '—'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleSubmitCreate} 
            variant="contained"
            disabled={!formData.Lib_Souspref || !formData.Cod_Souspref || !formData.DepartementId}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier la sous-préfecture</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de la sous-préfecture"
                value={formData.Lib_Souspref}
                onChange={(e) => handleFormChange('Lib_Souspref', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code de la sous-préfecture"
                value={formData.Cod_Souspref}
                onChange={(e) => handleFormChange('Cod_Souspref', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Département</InputLabel>
                <Select
                  value={formData.DepartementId}
                  onChange={(e) => handleFormChange('DepartementId', e.target.value)}
                  label="Département"
                >
                  {departements.map((d) => (
                    <MenuItem key={d._id || d.id} value={d._id || d.id}>
                      {d.Lib_Departement || '—'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleSubmitEdit} 
            variant="contained"
            disabled={!formData.Lib_Souspref || !formData.Cod_Souspref || !formData.DepartementId}
          >
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer "{selectedSouspref?.Lib_Souspref}" ?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SousprefsListPage;
