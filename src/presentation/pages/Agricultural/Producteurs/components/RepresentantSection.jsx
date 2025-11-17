/**
 * Section des informations du représentant (si IsExploitant = false)
 */
import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, PersonOutline as PersonIcon } from '@mui/icons-material';

const RepresentantSection = ({ 
  formData, 
  handleFormChange, 
  pays, 
  sousprefectures, 
  niveauxScolaires, 
  professions 
}) => {
  if (formData.IsExploitant) return null;

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Représentant de l'exploitant
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Quel est le lien entre vous et l'exploitant ?</InputLabel>
              <Select
                value={formData.LienRepresentExploitant || ''}
                onChange={(e) => handleFormChange('LienRepresentExploitant', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                <MenuItem value={1}>Familial</MenuItem>
                <MenuItem value={2}>Professionnel (Gérant, Employé)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Nom du représentant"
              value={formData.NomRepresentant || ''}
              onChange={(e) => handleFormChange('NomRepresentant', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Prénom du représentant"
              value={formData.PrenomRepresentant || ''}
              onChange={(e) => handleFormChange('PrenomRepresentant', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Date de naissance"
              value={formData.DateNaissRepresentant || ''}
              onChange={(e) => handleFormChange('DateNaissRepresentant', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Pays de naissance</InputLabel>
              <Select
                value={formData.PaysNaissRepresentant || ''}
                onChange={(e) => handleFormChange('PaysNaissRepresentant', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {pays.map(p => (
                  <MenuItem key={p.id || p._id} value={p.id || p._id}>
                    {p.Lib_pays || p.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Lieu de naissance (Sous-préfecture)</InputLabel>
              <Select
                value={formData.LieuNaissRepresentant || ''}
                onChange={(e) => handleFormChange('LieuNaissRepresentant', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {sousprefectures.map(sp => (
                  <MenuItem key={sp.id || sp._id} value={sp.id || sp._id}>
                    {sp.Lib_Souspref || sp.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Sexe</InputLabel>
              <Select
                value={formData.GenreRepresentant || ''}
                onChange={(e) => handleFormChange('GenreRepresentant', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                <MenuItem value={1}>Masculin</MenuItem>
                <MenuItem value={2}>Féminin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Niveau d'instruction</InputLabel>
              <Select
                value={formData.NiveauScolaireRepresentant || ''}
                onChange={(e) => handleFormChange('NiveauScolaireRepresentant', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {niveauxScolaires.map(ns => (
                  <MenuItem key={ns.id || ns._id} value={ns.id || ns._id}>
                    {ns.Lib_niveauscolaire || ns.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasFormationAgricole || false}
                  onChange={(e) => handleFormChange('HasFormationAgricole', e.target.checked)}
                />
              }
              label="Avez-vous reçu une formation agricole ?"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Profession</InputLabel>
              <Select
                value={formData.ProfessionRepresentant || ''}
                onChange={(e) => handleFormChange('ProfessionRepresentant', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {professions.map(prof => (
                  <MenuItem key={prof.id || prof._id} value={prof.id || prof._id}>
                    {prof.Lib_profession || prof.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Nationalité</InputLabel>
              <Select
                value={formData.NatioliteRepresentant || ''}
                onChange={(e) => handleFormChange('NatioliteRepresentant', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                <MenuItem value={1}>Ivoirienne</MenuItem>
                <MenuItem value={2}>Étrangère</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {formData.NatioliteRepresentant === 2 && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Quel est votre pays d'origine ?</InputLabel>
                <Select
                  value={formData.PaysdorigineRepresentant || ''}
                  onChange={(e) => handleFormChange('PaysdorigineRepresentant', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                  {pays.map(p => (
                    <MenuItem key={p.id || p._id} value={p.id || p._id}>
                      {p.Lib_pays || p.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact principal"
              value={formData.ContactPrincipalRepresentant || ''}
              onChange={(e) => handleFormChange('ContactPrincipalRepresentant', e.target.value)}
              placeholder="Ex: +225 0123456789"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact secondaire"
              value={formData.ContactSecondaireRepresentant || ''}
              onChange={(e) => handleFormChange('ContactSecondaireRepresentant', e.target.value)}
              placeholder="Ex: +225 0123456789"
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default RepresentantSection;
