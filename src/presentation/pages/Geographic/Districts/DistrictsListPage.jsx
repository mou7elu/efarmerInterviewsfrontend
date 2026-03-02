/**
 * Districts List Page
 * Page de gestion des districts (CRUD)
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
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocationCity as LocationCityIcon,
  Public as PublicIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';

import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';
import { districtAPI, paysAPI, handleApiError } from '../../../../services/api.js';

const DistrictsListPage = () => {
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [paysList, setPaysList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [importFile, setImportFile] = useState(null);
  const [importIsLoading, setImportIsLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [importStats, setImportStats] = useState(null);
  const [importErrors, setImportErrors] = useState([]);
  const [defaultPaysId, setDefaultPaysId] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [paysFilter, setPaysFilter] = useState('');
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  
  const [formData, setFormData] = useState({
    Lib_district: '',
    Cod_district: '',
    PaysId: '',
  });

  useEffect(() => {
    loadData();
    loadPays();
  }, []);

  useEffect(() => {
    if (!defaultPaysId && paysList.length > 0) {
      setDefaultPaysId(getDefaultPaysId());
    }
  }, [paysList, defaultPaysId]);

  useEffect(() => {
    if (!searchTerm && !paysFilter) {
      setFilteredDistricts(districts);
    } else {
      const filtered = districts.filter(d => {
        const Lib_district = d.Lib_district || '';
        const Cod_district = d.Cod_district || '';
        
        const paysMatch = !paysFilter || d.PaysId === paysFilter;
        const searchMatch = !searchTerm || 
          Lib_district.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Cod_district.toLowerCase().includes(searchTerm.toLowerCase());
        
        return searchMatch && paysMatch;
      });
      setFilteredDistricts(filtered);
    }
    setPage(0);
  }, [districts, searchTerm, paysFilter]);

  const normalizeHeader = (header) => header.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');

  const normalizeName = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/'/g, '');

  const parseBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    const stringValue = String(value).trim().toLowerCase();
    return ['1', 'true', 'vrai', 'oui', 'yes'].includes(stringValue);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await districtAPI.getAll({ limit: 1000 });
      const data = response.data || response;
      const districtsData = data.items || data || [];
      setDistricts(districtsData);
      setFilteredDistricts(districtsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadPays = async () => {
    try {
      const response = await paysAPI.getAll({ limit: 1000 });
      const data = response.data || response;
      setPaysList(data.items || data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des pays:', error);
    }
  };

  const getDefaultPaysId = () => {
    const normalizedTarget = normalizeName('Cote d\'Ivoire');
    const matched = paysList.find((paysItem) => {
      const label = paysItem?.Lib_pays || paysItem?.libPays?.Lib_pays || '';
      return normalizeName(label) === normalizedTarget;
    });

    return matched?._id || matched?.id || '';
  };

  const stats = {
    total: districts.length,
    pays: new Set(districts.map(d => d.PaysId).filter(Boolean)).size,
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownloadTemplate = () => {
    const headers = ['Lib_district', 'Cod_district'];
    const example = ['EXEMPLE_LIB', 'EXEMPLE_CODE'];
    const worksheet = XLSX.utils.aoa_to_sheet([headers, example]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'districts');

    const fileBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([fileBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'districts-modele.xlsx';
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

    if (!defaultPaysId) {
      setImportError('Veuillez selectionner un pays par defaut.');
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
        districts
          .map((d) => String(d.Cod_district || '').trim().toLowerCase())
          .filter(Boolean)
      );
      const importedCodes = new Set();

      const mappedRows = rows.map((row, index) => {
        const normalizedRow = Object.entries(row).reduce((acc, [key, value]) => {
          acc[normalizeHeader(String(key))] = value;
          return acc;
        }, {});

        const libDistrict = String(normalizedRow.libdistrict || '').trim();
        const codDistrict = String(normalizedRow.coddistrict || '').trim();
        const paysId = String(normalizedRow.paysid || defaultPaysId || '').trim();
        const sommeil = parseBoolean(normalizedRow.sommeil || false);
        const codeKey = codDistrict.toLowerCase();

        if (!libDistrict || !codDistrict || !paysId) {
          return {
            index,
            error: 'Lib_district et Cod_district sont obligatoires.'
          };
        }

        if (existingCodes.has(codeKey)) {
          return { index, error: `Cod_district deja existant: ${codDistrict}` };
        }

        if (importedCodes.has(codeKey)) {
          return { index, error: `Doublon Cod_district dans le fichier: ${codDistrict}` };
        }
        importedCodes.add(codeKey);

        return {
          index,
          data: {
            Lib_district: libDistrict,
            Cod_district: codDistrict,
            PaysId: paysId,
            Sommeil: sommeil
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
          await districtAPI.create(row.data);
          successCount += 1;
        } catch (err) {
          const message = err?.message || 'Erreur lors de la creation.';
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
    } catch (err) {
      console.error('Erreur lors de l\'import des districts:', err);
      setImportError(err.message || 'Erreur lors de l\'import du fichier.');
    } finally {
      setImportIsLoading(false);
      setImportProgress(0);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      Lib_district: '',
      Cod_district: '',
      PaysId: '',
    });
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (district) => {
    setSelectedDistrict(district);
    setFormData({
      Lib_district: district.Lib_district || '',
      Cod_district: district.Cod_district || '',
      PaysId: district.PaysId && typeof district.PaysId === 'object' ? district.PaysId._id : district.PaysId,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (district) => {
    setSelectedDistrict(district);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      await districtAPI.create(formData);
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
      const districtId = selectedDistrict.id || selectedDistrict._id;
      await districtAPI.update(districtId, formData);
      setEditDialogOpen(false);
      setSelectedDistrict(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(handleApiError(error));
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const districtId = selectedDistrict.id || selectedDistrict._id;
      await districtAPI.delete(districtId);
      setDeleteDialogOpen(false);
      setSelectedDistrict(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(handleApiError(error));
    }
  };

  const getPaysName = (paysId) => {
    const p = paysList.find(pays => pays._id === paysId._id || pays.id === paysId._id);
    return p ? (p.Lib_pays || '—') : '—';
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Chargement des districts..." />;
  }

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
          <Typography variant="h4" component="h1">Districts</Typography>
          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2} sx={{ width: { xs: '100%', md: 560 } }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
              Nouveau district
            </Button>
            
          </Box>
        </Box>
        
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">{stats.total}</Typography>
                <Typography variant="body2" color="textSecondary">Total districts</Typography>
              </CardContent>
            </Card>
          </Grid>
          
        </Grid>
      </Box>

      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom ou code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par pays</InputLabel>
              <Select value={paysFilter} onChange={(e) => setPaysFilter(e.target.value)} label="Filtrer par pays">
                <MenuItem value="">Tous les pays</MenuItem>
                {paysList.map((p) => (
                  <MenuItem key={p._id || p.id} value={p._id || p.id}>{p.Lib_pays || '—'}</MenuItem>
                ))}
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
                <TableCell>Nom</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Pays</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDistricts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                      {searchTerm || paysFilter ? 'Aucun district trouvé' : 'Aucune donnée'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDistricts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((district) => (
                    <TableRow key={district._id || district.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <LocationCityIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1" fontWeight="medium">
                            {district.Lib_district || '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{district.Cod_district || '—'}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <PublicIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                          {getPaysName(district.PaysId)}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => handleEdit(district)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton size="small" color="error" onClick={() => handleDelete(district)}>
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
          count={filteredDistricts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Lignes par page:"
        />
      </Paper>

      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleCreate}>
        <AddIcon />
      </Fab>

      {/* Dialog de création */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouveau district</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Paper sx={{ p: 3, width: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="h6">Importer un fichier Excel</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Modele avec Lib_district et Cod_district. Sommeil: false.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleDownloadTemplate}
                >
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
                    <input
                      type="file"
                      hidden
                      accept=".xlsx,.xls,.csv"
                      onChange={handleImportFileChange}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} md={7}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Pays par defaut</InputLabel>
                    <Select
                      value={defaultPaysId}
                      onChange={(e) => setDefaultPaysId(e.target.value)}
                      label="Pays par defaut"
                      disabled={importIsLoading}
                    >
                      <MenuItem value="">Selectionner un pays</MenuItem>
                      {paysList.map((p) => (
                        <MenuItem key={p._id || p.id} value={p._id || p.id}>
                          {p.Lib_pays || p.libPays?.Lib_pays || '—'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Button
                    variant="contained"
                    onClick={handleImportFile}
                    disabled={importIsLoading || !importFile || !defaultPaysId}
                    fullWidth
                  >
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
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Nom du district" value={formData.Lib_district} onChange={(e) => handleFormChange('Lib_district', e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Code du district" value={formData.Cod_district} onChange={(e) => handleFormChange('Cod_district', e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Pays</InputLabel>
                <Select value={formData.PaysId} onChange={(e) => handleFormChange('PaysId', e.target.value)} label="Pays">
                  {paysList.map((p) => (
                    <MenuItem key={p._id || p.id} value={p._id || p.id}>{p.Lib_pays || '—'}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitCreate} variant="contained" disabled={!formData.Lib_district || !formData.Cod_district || !formData.PaysId}>Créer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier le district</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Pays</InputLabel>
                <Select value={formData.PaysId} onChange={(e) => handleFormChange('PaysId', e.target.value)} label="Pays">
                  {paysList.map((p) => (
                    <MenuItem key={p._id || p.id} value={p._id || p.id}>{p.Lib_pays || '—'}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
             <Grid item xs={12} md={6}>
              <TextField fullWidth label="Code du district" value={formData.Cod_district} onChange={(e) => handleFormChange('Cod_district', e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Nom du district" value={formData.Lib_district} onChange={(e) => handleFormChange('Lib_district', e.target.value)} required />
            </Grid>
           
          
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmitEdit} variant="contained" disabled={!formData.Lib_district || !formData.Cod_district || !formData.PaysId}>Modifier</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer "{selectedDistrict?.Lib_district}" ?
          </Typography>
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

export default DistrictsListPage;
