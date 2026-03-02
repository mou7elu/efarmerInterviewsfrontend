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
  sousprefectures
}) => {
  const niveauxInstructionOptions = [
    { value: 1, label: "N'est pas allé à l'école" },
    { value: 2, label: "École coranique" },
    { value: 3, label: "Primaire" },
    { value: 4, label: "Secondaire" },
    { value: 5, label: "Technique" },
    { value: 6, label: "Professionnel" },
    { value: 7, label: "Supérieur" },
  ];

  const professionsOptions = [
    { value: 1, label: "Sans emploi" },
    { value: 2, label: "Apprenant (Élève, Étudiant, apprenti, stagiaire)" },
    { value: 3, label: "Salarié (secteur privé ou publique)" },
    { value: 4, label: "Travailleur indépendant / Homme d'affaire" },
    { value: 5, label: "Commerçant détaillant" },
    { value: 6, label: "Commerçant grossiste" },
    { value: 7, label: "Artisan (couture, coiffure, menuiserie, mécanique, artisanat, etc.)" },
    { value: 8, label: "Agriculteur/paysan/ fermier / éleveur" },
    { value: 9, label: "Ménagère" },
    { value: 10, label: "Retraité/ pensionné/ rentier" },
    { value: 11, label: "Ouvrier / Manœuvre" },
  ];

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
              <InputLabel>Q.17 Quel est le lien entre vous et l'exploitant ?</InputLabel>
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
              label="Q.18 Nom du représentant"
              value={formData.NomRepresentant || ''}
              onChange={(e) => handleFormChange('NomRepresentant', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Q.19 Prénom du représentant"
              value={formData.PrenomRepresentant || ''}
              onChange={(e) => handleFormChange('PrenomRepresentant', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Q.20 Date de naissance"
              value={formData.DateNaissRepresentant || ''}
              onChange={(e) => handleFormChange('DateNaissRepresentant', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Q.21 Pays de naissance</InputLabel>
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
              <InputLabel>Q.22 Lieu de naissance (Sous-préfecture)</InputLabel>
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
              <InputLabel>Q.23 Sexe</InputLabel>
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
              <InputLabel>Q.24 Niveau d'instruction</InputLabel>
              <Select
                value={niveauxInstructionOptions.some((item) => item.value === Number(formData.NiveauScolaireRepresentant)) ? Number(formData.NiveauScolaireRepresentant) : ''}
                onChange={(e) => handleFormChange('NiveauScolaireRepresentant', Number(e.target.value))}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {niveauxInstructionOptions.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
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
              label="Q.25 Avez-vous reçu une formation agricole ?"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Q.26 Profession</InputLabel>
              <Select
                value={professionsOptions.some((item) => item.value === Number(formData.ProfessionRepresentant)) ? Number(formData.ProfessionRepresentant) : ''}
                onChange={(e) => handleFormChange('ProfessionRepresentant', Number(e.target.value))}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {professionsOptions.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Q.27 Nationalité</InputLabel>
              <Select
                value={formData.NatioliteRepresentant || ''}
                onChange={(e) => handleFormChange('NatioliteRepresentant', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                <MenuItem value={1}>1. Ivoirienne</MenuItem>
                <MenuItem value={2}>2. Non ivoirien</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {formData.NatioliteRepresentant === 2 && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Q.28 Quel est votre pays d'origine ?</InputLabel>
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
              label="Q.29 Contact principal"
              value={formData.ContactPrincipalRepresentant || ''}
              onChange={(e) => handleFormChange('ContactPrincipalRepresentant', e.target.value)}
              placeholder="Ex: +225 xxxxxxxxx"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Q.30 Contact secondaire"
              value={formData.ContactSecondaireRepresentant || ''}
              onChange={(e) => handleFormChange('ContactSecondaireRepresentant', e.target.value)}
              placeholder="Ex: +225 xxxxxxxxx"
            />
          </Grid>
          <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Q.31 Nom de l'exploitant"
                        value={formData.NomExploitant || ''}
                        onChange={(e) => handleFormChange('NomExploitant', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Q.32 Prénom de l'exploitant"
                        value={formData.PrenomExploitant || ''}
                        onChange={(e) => handleFormChange('PrenomExploitant', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="Q.33 Contact principal"
                                  value={formData.ContactPrincipalExploitant || ''}
                                  onChange={(e) => handleFormChange('ContactPrincipalExploitant', e.target.value)}
                                  placeholder="Ex: +225 xxxxxxxxx"
                                />
                              </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default RepresentantSection;
