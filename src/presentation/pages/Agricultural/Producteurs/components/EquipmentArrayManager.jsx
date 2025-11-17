/**
 * Composant générique pour gérer les tableaux d'équipements
 * Utilisé pour Outillage, Petit Outillage, et Matériel de Transport
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
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const EquipmentArrayManager = ({ 
  title, 
  items, 
  onChange, 
  options, 
  fieldName 
}) => {
  const handleAddItem = () => {
    onChange([...items, {
      Rubrique: '',
      NombreTotalEquipement: 0,
      NombreTotalEquipementPropriete: 0
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
          Aucun élément. Cliquez sur "Ajouter" pour commencer.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="40%">Rubrique</TableCell>
                <TableCell width="25%">Nombre total</TableCell>
                <TableCell width="25%">Nombre propriété</TableCell>
                <TableCell width="10%">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={item.Rubrique || ''}
                        onChange={(e) => handleItemChange(index, 'Rubrique', e.target.value)}
                      >
                        {options.map((opt) => (
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
                      value={item.NombreTotalEquipement || 0}
                      onChange={(e) => handleItemChange(index, 'NombreTotalEquipement', Number.parseInt(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.NombreTotalEquipementPropriete || 0}
                      onChange={(e) => handleItemChange(index, 'NombreTotalEquipementPropriete', Number.parseInt(e.target.value) || 0)}
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

export default EquipmentArrayManager;
