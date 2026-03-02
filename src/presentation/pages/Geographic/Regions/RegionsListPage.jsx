/**
 * Regions List Page
 * Page de gestion des régions (CRUD)
 */

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Container, Typography, Paper, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, Button, Box, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Card, CardContent, Fab, Tooltip, FormControl, InputLabel, Select, MenuItem,
  LinearProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Map as MapIcon, Public as PublicIcon, FileDownload as FileDownloadIcon } from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import GeoJSONInput from '@presentation/components/Common/GeoJSONInput.jsx';
import { regionsAPI, districtAPI, handleApiError } from '../../../../services/api.js';

const RegionsListPage = () => {
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [importFile, setImportFile] = useState(null);
  const [importIsLoading, setImportIsLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [importStats, setImportStats] = useState(null);
  const [importErrors, setImportErrors] = useState([]);
  const [defaultDistrictId, setDefaultDistrictId] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  
  const [formData, setFormData] = useState({ Lib_region: '', Cod_region: '', DistrictId: '', Coordonnee: null });

  useEffect(() => { loadData(); loadDistricts(); }, []);

  useEffect(() => {
    if (!defaultDistrictId && districts.length > 0) {
      setDefaultDistrictId(districts[0]?._id || districts[0]?.id || '');
    }
  }, [districts, defaultDistrictId]);

  useEffect(() => {
    if (!searchTerm && !districtFilter) {
      setFilteredRegions(regions);
    } else {
      const filtered = regions.filter(r => {
        const Lib_region = r.Lib_region || '';
        const Cod_region = r.Cod_region || '';
        const districtMatch = !districtFilter || r.DistrictId === districtFilter;
        const searchMatch = !searchTerm || Lib_region.toLowerCase().includes(searchTerm.toLowerCase()) || Cod_region.toLowerCase().includes(searchTerm.toLowerCase());
        return searchMatch && districtMatch;
      });
      setFilteredRegions(filtered);
    }
    setPage(0);
  }, [regions, searchTerm, districtFilter]);

  const normalizeHeader = (header) => header.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');

  const parseCoordonnee = (value) => {
    if (!value) return null;
    if (typeof value === 'object') return value;
    try {
      return JSON.parse(value);
    } catch (error) {
      return { __parseError: 'Coordonnee invalide' };
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await regionsAPI.getAll({ limit: 100 });
      const data = response.data || response;
      const regionsData = data.items || data || [];
      console.log('Régions chargées:', regionsData);
      setRegions(regionsData);
      setFilteredRegions(regionsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadDistricts = async () => {
    try {
      const response = await districtAPI.getAll({ limit: 100 });
      const data = response.data || response;
      setDistricts(data.items || data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des districts:', error);
    }
  };

  const stats = { total: regions.length, districts: new Set(regions.map(r => r.DistrictId).filter(Boolean)).size };

  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => { setRowsPerPage(Number.parseInt(event.target.value, 10)); setPage(0); };
  const handleFormChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const resetForm = () => setFormData({ Lib_region: '', Cod_region: '', DistrictId: '', Coordonnee: null });

  const handleDownloadTemplate = () => {
    const headers = ['Lib_region', 'Cod_region'];
    const example = ['EXEMPLE_LIB', 'EXEMPLE_CODE'];
    const worksheet = XLSX.utils.aoa_to_sheet([headers, example]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'regions');

    const fileBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([fileBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'regions-modele.xlsx';
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

    if (!defaultDistrictId) {
      setImportError('Veuillez selectionner un district par defaut.');
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
        regions
          .map((r) => String(r.Cod_region || '').trim().toLowerCase())
          .filter(Boolean)
      );
      const importedCodes = new Set();

      const mappedRows = rows.map((row, index) => {
        const normalizedRow = Object.entries(row).reduce((acc, [key, value]) => {
          acc[normalizeHeader(String(key))] = value;
          return acc;
        }, {});

        const libRegion = String(normalizedRow.libregion || '').trim();
        const codRegion = String(normalizedRow.codregion || '').trim();
        const districtId = String(normalizedRow.districtid || defaultDistrictId || '').trim();
        const coordonnee = parseCoordonnee(normalizedRow.coordonnee);
        const codeKey = codRegion.toLowerCase();

        if (!libRegion || !codRegion || !districtId) {
          return { index, error: 'Lib_region et Cod_region sont obligatoires.' };
        }

        if (existingCodes.has(codeKey)) {
          return { index, error: `Cod_region deja existant: ${codRegion}` };
        }

        if (importedCodes.has(codeKey)) {
          return { index, error: `Doublon Cod_region dans le fichier: ${codRegion}` };
        }
        importedCodes.add(codeKey);

        if (coordonnee && coordonnee.__parseError) {
          return { index, error: coordonnee.__parseError };
        }

        return {
          index,
          data: {
            Lib_region: libRegion,
            Cod_region: codRegion,
            DistrictId: districtId,
            Coordonnee: coordonnee || null,
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
          await regionsAPI.create(row.data);
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
      console.error('Erreur lors de l\'import des regions:', error);
      setImportError(error.message || 'Erreur lors de l\'import du fichier.');
    } finally {
      setImportIsLoading(false);
      setImportProgress(0);
    }
  };

  const handleCreate = () => { resetForm(); setCreateDialogOpen(true); };
  const handleEdit = (region) => {
    setSelectedRegion(region);
    setFormData({
      Lib_region: region.Lib_region || '',
      Cod_region: region.Cod_region || '',
      DistrictId: region.DistrictId && typeof region.DistrictId === 'object' ? region.DistrictId._id : region.DistrictId,
      Coordonnee: region.Coordonnee || null,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (region) => { setSelectedRegion(region); setDeleteDialogOpen(true); };

  const handleSubmitCreate = async () => {
    try {
      await regionsAPI.create(formData);
      setCreateDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const regionId = selectedRegion.id || selectedRegion._id;
      await regionsAPI.update(regionId, formData);
      setEditDialogOpen(false);
      setSelectedRegion(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const regionId = selectedRegion.id || selectedRegion._id;
      await regionsAPI.delete(regionId);
      setDeleteDialogOpen(false);
      setSelectedRegion(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getDistrictName = (districtId) => {
    const d = districts.find(district => district._id === districtId._id || district.id === districtId._id);
    return d ? (d.Lib_district || '—') : '—';
  };

  if (loading) return <LoadingSpinner size={60} message="Chargement des régions..." />;

  return (
    <Container maxWidth="xl">
      <Box mb={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          gap={2}
          mb={2}
        >
          <Typography variant="h4" component="h1">Régions</Typography>
          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2} sx={{ width: { xs: '100%', md: 560 } }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>Nouvelle région</Button>
            <Paper sx={{ p: 3, width: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="h6">Importer un fichier Excel</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Modele avec Lib_region et Cod_region.
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
                <Grid item xs={12} md={7}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>District par defaut</InputLabel>
                    <Select
                      value={defaultDistrictId}
                      onChange={(e) => setDefaultDistrictId(e.target.value)}
                      label="District par defaut"
                      disabled={importIsLoading}
                    >
                      <MenuItem value="">Selectionner un district</MenuItem>
                      {districts.map((d) => (
                        <MenuItem key={d._id || d.id} value={d._id || d.id}>
                          {d.Lib_district || '—'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Button variant="contained" onClick={handleImportFile} disabled={importIsLoading || !importFile || !defaultDistrictId} fullWidth>
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
        
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card><CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="primary">{stats.total}</Typography>
              <Typography variant="body2" color="textSecondary">Total régions</Typography>
            </CardContent></Card>
          </Grid>
          
        </Grid>
      </Box>

      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par district</InputLabel>
              <Select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} label="Filtrer par district">
                <MenuItem value="">Tous les districts</MenuItem>
                {districts.map((d) => <MenuItem key={d._id || d.id} value={d._id || d.id}>{d.Lib_district || '—'}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && <Box mb={2}><Typography variant="body1" color="error">Erreur : {error}</Typography></Box>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell><TableCell>Code</TableCell><TableCell>District</TableCell><TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRegions.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center"><Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>{searchTerm || districtFilter ? 'Aucune région trouvée' : 'Aucune donnée'}</Typography></TableCell></TableRow>
              ) : (
                filteredRegions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((region) => (
                  <TableRow key={region._id || region.id} hover>
                    <TableCell><Box display="flex" alignItems="center"><MapIcon sx={{ mr: 1, color: 'primary.main' }} /><Typography variant="body1" fontWeight="medium">{region.Lib_region || '—'}</Typography></Box></TableCell>
                    <TableCell>{region.Cod_region || '—'}</TableCell>
                    <TableCell><Box display="flex" alignItems="center"><PublicIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />{getDistrictName(region.DistrictId)}</Box></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEdit(region)}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton size="small" color="error" onClick={() => handleDelete(region)}><DeleteIcon /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={filteredRegions.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} labelRowsPerPage="Lignes par page:" />
      </Paper>

      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleCreate}><AddIcon /></Fab>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouvelle région</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Nom de la région" value={formData.Lib_region} onChange={(e) => handleFormChange('Lib_region', e.target.value)} required /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Code de la région" value={formData.Cod_region} onChange={(e) => handleFormChange('Cod_region', e.target.value)} required /></Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>District</InputLabel>
                <Select value={formData.DistrictId} onChange={(e) => handleFormChange('DistrictId', e.target.value)} label="District">
                  {districts.map((d) => <MenuItem key={d._id || d.id} value={d._id || d.id}>{d.Lib_district || '—'}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><GeoJSONInput value={formData.Coordonnee} onChange={(value) => handleFormChange('Coordonnee', value)} geometryType="Point" label="Coordonnée (Point GeoJSON)" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitCreate} variant="contained" disabled={!formData.Lib_region || !formData.Cod_region || !formData.DistrictId}>Créer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier la région</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
             <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>District</InputLabel>
                <Select value={formData.DistrictId} onChange={(e) => handleFormChange('DistrictId', e.target.value)} label="District">
                  {districts.map((d) => <MenuItem key={d._id || d.id} value={d._id || d.id}>{d.Lib_district || '—'}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Code de la région" value={formData.Cod_region} onChange={(e) => handleFormChange('Cod_region', e.target.value)} required /></Grid>
           
            <Grid item xs={12} md={6}><TextField fullWidth label="Nom de la région" value={formData.Lib_region} onChange={(e) => handleFormChange('Lib_region', e.target.value)} required /></Grid>
            
            <Grid item xs={12}><GeoJSONInput value={formData.Coordonnee} onChange={(value) => handleFormChange('Coordonnee', value)} geometryType="Point" label="Coordonnée (Point GeoJSON)" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitEdit} variant="contained" disabled={!formData.Lib_region || !formData.Cod_region || !formData.DistrictId}>Modifier</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer "{selectedRegion?.Lib_region}" ?</Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>Cette action est irréversible.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitDelete} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RegionsListPage;
