/**
 * Composant pour gérer les types d'élevage
 */
import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Paper,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ElevageArrayManager = ({ 
  title, 
  items, 
  onChange 
}) => {
  const elevageOptions = [
    { value: 'Volaille', label: 'Volaille' },
    { value: 'Bovin', label: 'Bovin' },
    { value: 'Ovin', label: 'Ovin' },
    { value: 'Caprin', label: 'Caprin' },
    { value: 'Porcin', label: 'Porcin' },
    { value: 'Autre espèce', label: 'Autre espèce' },
  ];

  const handleAddItem = () => {
    onChange([...items, {
      Espece: '',
      NombreTeteVendu: 0,
      PrixTeteVente: 0,
      NombreTeteDispo: 0
    }]);
  };

  const handleRemoveItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
          variant="outlined"
        >
          Ajouter
        </Button>
      </Box>

      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 2 }}>
          Aucun élevage. Cliquez sur "Ajouter" pour commencer.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="25%">Espèce</TableCell>
                <TableCell width="20%">Têtes vendues (12 mois)</TableCell>
                <TableCell width="20%">Prix/tête (FCFA)</TableCell>
                <TableCell width="20%">Têtes disponibles</TableCell>
                <TableCell width="15%">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={item.Espece || ''}
                        onChange={(e) => handleItemChange(index, 'Espece', e.target.value)}
                      >
                        {elevageOptions.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.NombreTeteVendu || 0}
                      onChange={(e) => handleItemChange(index, 'NombreTeteVendu', Number.parseInt(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.PrixTeteVente || 0}
                      onChange={(e) => handleItemChange(index, 'PrixTeteVente', Number.parseInt(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.NombreTeteDispo || 0}
                      onChange={(e) => handleItemChange(index, 'NombreTeteDispo', Number.parseInt(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ElevageArrayManager;
