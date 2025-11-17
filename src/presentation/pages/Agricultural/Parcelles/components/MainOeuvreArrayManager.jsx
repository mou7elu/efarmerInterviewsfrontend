/**
 * Composant pour gérer le tableau de la main d'oeuvre
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

const MainOeuvreArrayManager = ({ items, onChange }) => {
  const typeMainOeuvreOptions = [
    'Familiale',
    'Journalière',
    'Permanente',
    'Contractuelle',
    'Autre',
  ];

  const handleAddItem = () => {
    onChange([...items, {
      TypeMainOeuvre: '',
      Frequence: 0,
      Effectif: 0
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
          Quel(s) type(s) de main d'œuvre utilisez-vous ?  
Pour la fréquence, inscrire (1, 2 ou 3) : 

1. Ponctuelle (de 1 à 3 
fois/an) 
2. Régulière (de 4 à 12 
fois/an) 
3. Autre (précisez) 
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
          Aucune main d'oeuvre. Cliquez sur "Ajouter" pour commencer.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="40%">Type</TableCell>
                <TableCell width="25%">Fréquence/an</TableCell>
                <TableCell width="25%">Effectif</TableCell>
                <TableCell width="10%">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={item.TypeMainOeuvre || ''}
                        onChange={(e) => handleItemChange(index, 'TypeMainOeuvre', e.target.value)}
                      >
                        {typeMainOeuvreOptions.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
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
                      value={item.Frequence || 0}
                      onChange={(e) => handleItemChange(index, 'Frequence', Number.parseInt(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={item.Effectif || 0}
                      onChange={(e) => handleItemChange(index, 'Effectif', Number.parseInt(e.target.value) || 0)}
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

export default MainOeuvreArrayManager;
