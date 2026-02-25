/**
 * Villages List Page - Page de gestion des villages (CRUD)
 */
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Container, Typography, Paper, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Card, CardContent, Fab, Tooltip, FormControl, InputLabel, Select, MenuItem, LinearProgress } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Home as HomeIcon, Domain as DomainIcon, FileDownload as FileDownloadIcon } from '@mui/icons-material';
import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import GeoJSONInput from '@presentation/components/Common/GeoJSONInput.jsx';
import { villagesAPI, zonesdenombreAPI, handleApiError } from '../../../../services/api.js';

const VillagesListPage = () => {
  const [villages, setVillages] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);
  const [zones, setZones] = useState([]);
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
  const [zoneFilter, setZoneFilter] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [formData, setFormData] = useState({ Lib_village: '', Coordonnee: null, ZonedenombreId: '' });

  useEffect(() => { loadData(); loadZones(); }, []);

  useEffect(() => {
    if (!searchTerm && !zoneFilter) {
      setFilteredVillages(villages);
    } else {
      const filtered = villages.filter(v => {
        const Lib_village = v.Lib_village || '';
        
        // Comparer les IDs correctement (string ou objet)
        const villageZoneId = typeof v.ZonedenombreId === 'object' ? (v.ZonedenombreId._id || v.ZonedenombreId.id) : v.ZonedenombreId;
        const zoneMatch = !zoneFilter || villageZoneId === zoneFilter;
        
        const searchMatch = !searchTerm || Lib_village.toLowerCase().includes(searchTerm.toLowerCase());
        return searchMatch && zoneMatch;
      });
      setFilteredVillages(filtered);
    }
    setPage(0);
  }, [villages, searchTerm, zoneFilter]);

  const normalizeHeader = (header) => header.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');
  const normalizeName = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/'/g, '');

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
      const response = await villagesAPI.getAll({ limit: 2000 });
      const data = response.data || response;
      const villagesData = data.items || data || [];
      setVillages(villagesData);
      setFilteredVillages(villagesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadZones = async () => {
    try {
      const response = await zonesdenombreAPI.getAll({ limit: 2000 });
      const data = response.data || response;
      setZones(data.items || data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des zones de dénombrement:', error);
    }
  };

  const stats = { 
    total: villages.length, 
    zones: new Set(villages.map(v => {
      const id = typeof v.ZonedenombreId === 'object' ? (v.ZonedenombreId._id || v.ZonedenombreId.id) : v.ZonedenombreId;
      return id;
    }).filter(Boolean)).size 
  };
  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => { setRowsPerPage(Number.parseInt(event.target.value, 10)); setPage(0); };
  const handleFormChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const resetForm = () => setFormData({ Lib_village: '', Coordonnee: null, ZonedenombreId: '' });

  const handleDownloadTemplate = () => {
    const headers = ['Lib_village', 'Lib_ZD'];
    const example = ['EXEMPLE_LIB', 'EXEMPLE_ZONE'];
    const worksheet = XLSX.utils.aoa_to_sheet([headers, example]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'villages');

    const fileBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([fileBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'villages-modele.xlsx';
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

      const mappedRows = rows.map((row, index) => {
        const normalizedRow = Object.entries(row).reduce((acc, [key, value]) => {
          acc[normalizeHeader(String(key))] = value;
          return acc;
        }, {});

        const libVillage = String(normalizedRow.libvillage || '').trim();
        const libZone = String(normalizedRow.libzd || '').trim();
        const zoneId = String(normalizedRow.zonedenombreid || '').trim();
        const coordonnee = parseCoordonnee(normalizedRow.coordonnee);

        const matchedZone = libZone
          ? zones.find((z) => normalizeName(z.Lib_ZD) === normalizeName(libZone))
          : null;
        const resolvedZoneId = zoneId
          || (matchedZone ? (matchedZone._id || matchedZone.id) : '');

        if (!libVillage || !resolvedZoneId) {
          return { index, error: 'Lib_village et Lib_ZD sont obligatoires.' };
        }

        if (libZone && !matchedZone) {
          return { index, error: `Zone introuvable: ${libZone}` };
        }

        if (coordonnee && coordonnee.__parseError) {
          return { index, error: coordonnee.__parseError };
        }

        return {
          index,
          data: {
            Lib_village: libVillage,
            ZonedenombreId: resolvedZoneId,
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
          await villagesAPI.create(row.data);
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
      console.error('Erreur lors de l\'import des villages:', error);
      setImportError(error.message || 'Erreur lors de l\'import du fichier.');
    } finally {
      setImportIsLoading(false);
      setImportProgress(0);
    }
  };

  const handleCreate = () => { resetForm(); setCreateDialogOpen(true); };
  const handleEdit = (village) => {
    setSelectedVillage(village);
    setFormData({
      Lib_village: village.Lib_village || '',
      Coordonnee: village.Coordonnee || null,
      ZonedenombreId: typeof village.ZonedenombreId === 'object' ? (village.ZonedenombreId._id || village.ZonedenombreId.id) : village.ZonedenombreId,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (village) => { setSelectedVillage(village); setDeleteDialogOpen(true); };
  const handleSubmitCreate = async () => {
    try {
      await villagesAPI.create(formData);
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
      const villageId = selectedVillage.id || selectedVillage._id;
      await villagesAPI.update(villageId, formData);
      setEditDialogOpen(false);
      setSelectedVillage(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const villageId = selectedVillage.id || selectedVillage._id;
      await villagesAPI.delete(villageId);
      setDeleteDialogOpen(false);
      setSelectedVillage(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getZoneName = (zoneId) => {
    if (!zoneId) return '—';
    
    // Si zoneId est un objet avec _id ou id
    const searchId = typeof zoneId === 'object' ? (zoneId._id || zoneId.id) : zoneId;
    
    const zone = zones.find(z => (z._id || z.id) === searchId);
    return zone ? (zone.Lib_ZD || '—') : '—';
  };

  if (loading) return <LoadingSpinner size={60} message="Chargement des villages..." />;

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
          <Typography variant="h4" component="h1">Localites</Typography>
          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2} sx={{ width: { xs: '100%', md: 560 } }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>Nouvelle localite</Button>
            <Paper sx={{ p: 3, width: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="h6">Importer un fichier Excel</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Modele avec Lib_village et Lib_ZD.
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
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}><Card><CardContent sx={{ textAlign: 'center', py: 2 }}><Typography variant="h4" color="primary">{stats.total}</Typography><Typography variant="body2" color="textSecondary">Total localités</Typography></CardContent></Card></Grid>
        </Grid>
      </Box>

      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><TextField fullWidth placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} /></Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth><InputLabel>Filtrer par zone de dénombrement</InputLabel>
              <Select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} label="Filtrer par zone de dénombrement">
                <MenuItem value="">Toutes les zones</MenuItem>
                {zones.map((z) => <MenuItem key={z._id || z.id} value={z._id || z.id}>{z.Lib_ZD || '—'}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && <Box mb={2}><Typography variant="body1" color="error">Erreur : {error}</Typography></Box>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead><TableRow><TableCell>Nom</TableCell><TableCell>Zone de dénombrement</TableCell><TableCell align="center">Actions</TableCell></TableRow></TableHead>
            <TableBody>
              {filteredVillages.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center"><Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>{searchTerm || zoneFilter ? 'Aucun village trouvé' : 'Aucune donnée'}</Typography></TableCell></TableRow>
              ) : (
                filteredVillages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((village) => (
                  <TableRow key={village._id || village.id} hover>
                    <TableCell><Box display="flex" alignItems="center"><HomeIcon sx={{ mr: 1, color: 'primary.main' }} /><Typography variant="body1" fontWeight="medium">{village.Lib_village || '—'}</Typography></Box></TableCell>
                    <TableCell><Box display="flex" alignItems="center"><DomainIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />{getZoneName(village.ZonedenombreId)}</Box></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleEdit(village)}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Supprimer"><IconButton size="small" color="error" onClick={() => handleDelete(village)}><DeleteIcon /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[10, 25, 50, 100]} component="div" count={filteredVillages.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} labelRowsPerPage="Lignes par page:" />
      </Paper>

      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleCreate}><AddIcon /></Fab>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouvelle localité</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Nom de la localité" value={formData.Lib_village} onChange={(e) => handleFormChange('Lib_village', e.target.value)} required /></Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required><InputLabel>Zone de dénombrement</InputLabel>
                <Select value={formData.ZonedenombreId} onChange={(e) => handleFormChange('ZonedenombreId', e.target.value)} label="Zone de dénombrement">
                  {zones.map((z) => <MenuItem key={z._id || z.id} value={z._id || z.id}>{z.Lib_ZD || '—'}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><GeoJSONInput value={formData.Coordonnee} onChange={(value) => handleFormChange('Coordonnee', value)} geometryType="Point" label="Coordonnées (Point GeoJSON, optionnel)" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitCreate} variant="contained" disabled={!formData.Lib_village || !formData.ZonedenombreId}>Créer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier la localité</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Nom de la localité" value={formData.Lib_village} onChange={(e) => handleFormChange('Lib_village', e.target.value)} required /></Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required><InputLabel>Zone de dénombrement</InputLabel>
                <Select value={formData.ZonedenombreId} onChange={(e) => handleFormChange('ZonedenombreId', e.target.value)} label="Zone de dénombrement">
                  {zones.map((z) => <MenuItem key={z._id || z.id} value={z._id || z.id}>{z.Lib_ZD || '—'}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><GeoJSONInput value={formData.Coordonnee} onChange={(value) => handleFormChange('Coordonnee', value)} geometryType="Point" label="Coordonnées (Point GeoJSON, optionnel)" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitEdit} variant="contained" disabled={!formData.Lib_village || !formData.ZonedenombreId}>Modifier</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer "{selectedVillage?.Lib_village}" ?</Typography>
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

export default VillagesListPage;
