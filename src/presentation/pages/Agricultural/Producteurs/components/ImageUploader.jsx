/**
 * Composant pour l'upload d'images avec prévisualisation
 */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

const ImageUploader = ({ 
  label, 
  value, 
  onChange, 
  helperText 
}) => {
  const [preview, setPreview] = useState(value || null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier que c'est bien une image
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }

      // Créer un preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreview(base64String);
        onChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {label}
      </Typography>
      
      {preview ? (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <Box
            component="img"
            src={preview}
            alt={label}
            sx={{
              maxWidth: '100%',
              maxHeight: 300,
              objectFit: 'contain',
              mb: 1
            }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
            >
              Changer
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            <IconButton
              size="small"
              color="error"
              onClick={handleRemove}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      ) : (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 3, 
            textAlign: 'center',
            backgroundColor: 'grey.50'
          }}
        >
          <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Aucune image
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
            size="small"
          >
            Télécharger
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </Paper>
      )}
      
      {helperText && (
        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploader;
