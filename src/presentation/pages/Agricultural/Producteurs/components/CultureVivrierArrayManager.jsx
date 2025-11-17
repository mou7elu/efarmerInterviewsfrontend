/**
 * Composant pour gérer les cultures vivrières
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

const CultureVivrierArrayManager = ({ 
  title, 
  items, 
  onChange 
}) => {
  const cultureOptions = [
    { value: 'Igname', label: 'Igname' },
    { value: 'Maraîchère', label: 'Maraîchère' },
    { value: 'Maïs', label: 'Maïs' },
    { value: 'Manioc', label: 'Manioc' },
    { value: 'Arachide', label: 'Arachide' },
    { value: 'Banane', label: 'Banane' },
    { value: 'Ananas', label: 'Ananas' },
    { value: 'Riz', label: 'Riz' },
    { value: 'Taro', label: 'Taro' },
    { value: 'Autre', label: 'Autre' },
  ];

  const handleAddItem = () => {
    onChange([...items, {
      Speculation: '',
      Tonnage: 0,
      PrixKiloVente: 0
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
          Aucune culture. Cliquez sur "Ajouter" pour commencer.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="40%">Culture</TableCell>
                <TableCell width="25%">Tonnage (t)</TableCell>
                <TableCell width="25%">Prix/kg (FCFA)</TableCell>
                <TableCell width="10%">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={item.Speculation || ''}
                        onChange={(e) => handleItemChange(index, 'Speculation', e.target.value)}
                      >
                        {cultureOptions.map((opt) => (
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
                      value={item.Tonnage || 0}
                      onChange={(e) => handleItemChange(index, 'Tonnage', Number.parseFloat(e.target.value) || 0)}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.PrixKiloVente || 0}
                      onChange={(e) => handleItemChange(index, 'PrixKiloVente', Number.parseInt(e.target.value) || 0)}
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

export default CultureVivrierArrayManager;
