/**
 * Section accès aux services (télécom, santé, éducation, banque, mobile money)
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
  Chip,
  Box,
  OutlinedInput,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  AccountBalance as AccountBalanceIcon,
  PhoneAndroid as PhoneIcon,
  HealthAndSafety as HealthIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const ServicesSection = ({ formData, handleFormChange }) => {
  const reseauxMobileOptions = [
    { value: 1, label: 'Orange' },
    { value: 2, label: 'MTN' },
    { value: 3, label: 'Moov' },
    { value: 4, label: 'Aucun' },
  ];

  const praticienSanteOptions = [
    { value: 1, label: 'Tradipraticien' },
    { value: 2, label: 'Aide-soignant' },
    { value: 3, label: 'Infirmier' },
    { value: 4, label: 'Médecin' },
  ];

  const infrastructureEducationOptions = [
    { value: 1, label: 'École primaire' },
    { value: 2, label: 'Collège de proximité' },
    { value: 3, label: 'Aucun' },
  ];

  const whyPasCompteBancaireOptions = [
    { value: 1, label: 'Manque de confiance' },
    { value: 2, label: 'Pas intéressé' },
    { value: 3, label: 'Trop éloigné' },
    { value: 4, label: 'Pas informé' },
    { value: 5, label: 'Préférence pour les transactions en espèces' },
    { value: 6, label: 'Faible revenu' },
  ];

  const structureMobileMoneyOptions = [
    { value: 1, label: 'MTN Mobile Money' },
    { value: 2, label: 'Orange Money' },
    { value: 3, label: 'Moov Money' },
    { value: 4, label: 'Wave' },
    { value: 5, label: 'Autres' },
  ];

  const typeServiceMobileMoneyOptions = [
    { value: 1, label: 'Dépôt' },
    { value: 2, label: 'Retrait' },
    { value: 3, label: 'Achat de services (Facture, …)' },
    { value: 4, label: 'Dépenses d\'exploitation' },
  ];

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <PhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Accès aux services
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Télécommunications */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              <PhoneIcon sx={{ mr: 1, fontSize: 20, verticalAlign: 'middle' }} />
              Télécommunications
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Q.70 A quels réseaux mobiles avez-vous accès ? (Question choix multiple) </InputLabel>
              <Select
                multiple
                value={formData.ReseauxMobile || []}
                onChange={(e) => handleFormChange('ReseauxMobile', e.target.value)}
                input={<OutlinedInput label="Q.70 A quels réseaux mobiles avez-vous accès ? (Question choix multiple)" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={reseauxMobileOptions.find(o => o.value === value)?.label}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {reseauxMobileOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasInternet || false}
                  onChange={(e) => handleFormChange('HasInternet', e.target.checked)}
                />
              }
              label="Q.71 Avez-vous accès à Internet ?"
            />
          </Grid>

          {/* Santé */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 2 }}>
              <HealthIcon sx={{ mr: 1, fontSize: 20, verticalAlign: 'middle' }} />
              Santé
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasInfastructureSante || false}
                  onChange={(e) => handleFormChange('HasInfastructureSante', e.target.checked)}
                />
              }
              label="Q.72 Avez-vous accès à des infrastructures de santé ?"
            />
          </Grid>

          {formData.HasInfastructureSante && (
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Q.73 Quelle est la distance entre votre localité et l'Infrastructure de santé ?  (Km)"
                value={formData.distanceInfastructureSanteKm || 0}
                onChange={(e) => handleFormChange('distanceInfastructureSanteKm', Number.parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
          )}

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Q.74 Quel type de praticien de santé consultez-vous prioritairement ? </InputLabel>
              <Select
                value={formData.PraticienSante || ''}
                onChange={(e) => handleFormChange('PraticienSante', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {praticienSanteOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Q.75 À combien s'élèvent vos dépenses annuelles de santé ?  (FCFA)"
              value={formData.DepenseSanteAnnuel || 0}
              onChange={(e) => handleFormChange('DepenseSanteAnnuel', Number.parseInt(e.target.value) || 0)}
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Éducation */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 2 }}>
              <SchoolIcon sx={{ mr: 1, fontSize: 20, verticalAlign: 'middle' }} />
              Éducation
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Q.76 Avez-vous accès aux Infrastructures d'éducation suivantes ? (Choix multiple)</InputLabel>
              <Select
                multiple
                value={formData.InfrastructueEducation || []}
                onChange={(e) => handleFormChange('InfrastructueEducation', e.target.value)}
                input={<OutlinedInput label="Q.76 Avez-vous accès aux Infrastructures d'éducation suivantes ? (Choix multiple)" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={infrastructureEducationOptions.find(o => o.value === value)?.label}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {infrastructureEducationOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Services bancaires */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 2 }}>
              <AccountBalanceIcon sx={{ mr: 1, fontSize: 20, verticalAlign: 'middle' }} />
              Services bancaires
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasCompteBancaire || false}
                  onChange={(e) => handleFormChange('HasCompteBancaire', e.target.checked)}
                />
              }
              label="Q.78 Avez-vous un compte bancaire ?"
            />
          </Grid>

          {!formData.HasCompteBancaire && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Q.80 Pourquoi n’avez-vous pas de compte bancaire ? (Question à choix multiple) </InputLabel>
                <Select
                  multiple
                  value={formData.WhyPasCompteBancaire || []}
                  onChange={(e) => handleFormChange('WhyPasCompteBancaire', e.target.value)}
                  input={<OutlinedInput label="Q.80 Pourquoi n’avez-vous pas de compte bancaire ? (Question à choix multiple)" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={whyPasCompteBancaireOptions.find(o => o.value === value)?.label}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {whyPasCompteBancaireOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.HasMobileMoney || false}
                  onChange={(e) => handleFormChange('HasMobileMoney', e.target.checked)}
                />
              }
              label="Q.81 Avez-vous un compte mobile money ?"
            />
          </Grid>

          {formData.HasMobileMoney && (
            <>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Services Mobile Money (choix multiple)</InputLabel>
                  <Select
                    multiple
                    value={formData.StructureMobileMoney || []}
                    onChange={(e) => handleFormChange('StructureMobileMoney', e.target.value)}
                    input={<OutlinedInput label="Services Mobile Money (choix multiple)" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={structureMobileMoneyOptions.find(o => o.value === value)?.label}
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {structureMobileMoneyOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.HasUseMobileMoneyService || false}
                      onChange={(e) => handleFormChange('HasUseMobileMoneyService', e.target.checked)}
                    />
                  }
                  label="Q.84 Avez-vous déjà utilisé les services Mobile Money ? "
                />
              </Grid>

              {formData.HasUseMobileMoneyService && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Q.85 Pour quels services utilisez-vous les Mobile Money ?  </InputLabel>
                      <Select
                        multiple
                        value={formData.TypeServiceMobileMoney || []}
                        onChange={(e) => handleFormChange('TypeServiceMobileMoney', e.target.value)}
                        input={<OutlinedInput label="Pour quels services utilisez-vous les Mobile Money ?  " />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={typeServiceMobileMoneyOptions.find(o => o.value === value)?.label}
                                size="small"
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {typeServiceMobileMoneyOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Q.86 Quel est le montant mensuel de vos transactions ?   (FCFA)"
                      value={formData.MontantMensuelMobileMoney || 0}
                      onChange={(e) => handleFormChange('MontantMensuelMobileMoney', Number.parseInt(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Q.87 Quel est le montant maximum de vos transactions ?   (FCFA)"
                      value={formData.MontantMaximumTransaction || 0}
                      onChange={(e) => handleFormChange('MontantMaximumTransaction', Number.parseInt(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </>
              )}
            </>
          )}

          {!formData.HasMobileMoney && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Q.83 Pourquoi ne disposez-vous pas de compte Mobile Money ? </InputLabel>
                <Select
                  multiple
                  value={formData.WhyPasMobileMoney || []}
                  onChange={(e) => handleFormChange('WhyPasMobileMoney', e.target.value)}
                  input={<OutlinedInput label="Q.83 Pourquoi ne disposez-vous pas de compte Mobile Money ? (choix multiple)" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={whyPasCompteBancaireOptions.find(o => o.value === value)?.label}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {whyPasCompteBancaireOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default ServicesSection;
