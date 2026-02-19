/**
 * GeoJSON Input Component
 * Composant pour saisir et valider des coordonnées GeoJSON (Point ou Polygon)
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Alert,
  Button,
  Grid,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Code as CodeIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pour les icônes Leaflet par défaut
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GeoJSONInput = ({ value, onChange, label, type = 'all', disabled = false, autoCapture = false }) => {
  const [mode, setMode] = useState('point'); // 'point', 'polygon', 'json'
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [polygonCoords, setPolygonCoords] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [capturing, setCapturing] = useState(false);

  // Fonction pour convertir les coordonnées GeoJSON en format Leaflet
  const toNumber = (value) => {
    const num = typeof value === 'string' ? Number(value) : value;
    return Number.isFinite(num) ? num : null;
  };

  const parseGeoJSONForMap = (geojson) => {
    try {
      const obj = typeof geojson === 'string' ? JSON.parse(geojson) : geojson;
      
      // Gérer FeatureCollection
      if (obj.type === 'FeatureCollection' && Array.isArray(obj.features) && obj.features.length > 0) {
        const feature = obj.features[0]; // Prendre le premier feature
        if (feature.geometry) {
          return parseGeoJSONForMap(feature.geometry);
        }
      }
      
      // Gérer Feature
      if (obj.type === 'Feature' && obj.geometry) {
        return parseGeoJSONForMap(obj.geometry);
      }
      
      // Gérer Point
      if (obj.type === 'Point' && Array.isArray(obj.coordinates)) {
        // Point: [longitude, latitude] -> [latitude, longitude]
        const lat = toNumber(obj.coordinates[1]);
        const lng = toNumber(obj.coordinates[0]);
        if (lat === null || lng === null) {
          return null;
        }
        return {
          type: 'Point',
          position: [lat, lng],
          center: [lat, lng],
          zoom: 13
        };
      } 
      
      // Gérer Polygon
      if (obj.type === 'Polygon' && Array.isArray(obj.coordinates)) {
        // Polygon: convertir [lng, lat] en [lat, lng]
        const positions = obj.coordinates[0]
          .map(([lng, lat]) => {
            const safeLat = toNumber(lat);
            const safeLng = toNumber(lng);
            if (safeLat === null || safeLng === null) {
              return null;
            }
            return [safeLat, safeLng];
          })
          .filter(Boolean);

        if (positions.length === 0) {
          return null;
        }
        // Calculer le centre du polygone
        const sumLat = positions.reduce((sum, [lat]) => sum + lat, 0);
        const sumLng = positions.reduce((sum, [, lng]) => sum + lng, 0);
        const center = [sumLat / positions.length, sumLng / positions.length];
        
        if (center.some((coord) => !Number.isFinite(coord))) {
          return null;
        }

        return {
          type: 'Polygon',
          positions,
          center,
          zoom: 10
        };
      }
    } catch (e) {
      console.error('Error parsing GeoJSON for map:', e);
    }
    return null;
  };

  // Initialiser depuis la valeur existante
  useEffect(() => {
    if (value) {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        setJsonInput(JSON.stringify(parsed, null, 2));
        
        // Extraire la géométrie si c'est une FeatureCollection ou Feature
        let geometry = parsed;
        if (parsed.type === 'FeatureCollection' && parsed.features?.[0]?.geometry) {
          geometry = parsed.features[0].geometry;
        } else if (parsed.type === 'Feature' && parsed.geometry) {
          geometry = parsed.geometry;
        }
        
        if (geometry.type === 'Point' && geometry.coordinates) {
          setLongitude(geometry.coordinates[0].toString());
          setLatitude(geometry.coordinates[1].toString());
          setMode('point');
        } else if (geometry.type === 'Polygon' && geometry.coordinates) {
          setMode('polygon');
        }
      } catch (err) {
        // Valeur invalide, ignorer
      }
    }
  }, [value]);

  // Auto-capture de la position GPS si autoCapture est activé et qu'il n'y a pas encore de valeur
  useEffect(() => {
    if (autoCapture && !value && !capturing) {
      setCapturing(true);
      
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const geoJSON = {
              type: 'Point',
              coordinates: [longitude, latitude]
            };
            onChange(geoJSON);
            setLatitude(latitude.toString());
            setLongitude(longitude.toString());
            setCapturing(false);
          },
          (error) => {
            console.error('Erreur de géolocalisation:', error);
            setError('Impossible de récupérer la position GPS automatiquement');
            setCapturing(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        setError('La géolocalisation n\'est pas supportée par ce navigateur');
        setCapturing(false);
      }
    }
  }, [autoCapture, value, capturing, onChange]);

  const validateGeoJSON = (geoJSON) => {
    try {
      if (!geoJSON.type) {
        return 'Le GeoJSON doit contenir un champ "type"';
      }

      // Gérer FeatureCollection
      if (geoJSON.type === 'FeatureCollection') {
        if (!Array.isArray(geoJSON.features)) {
          return 'Une FeatureCollection doit contenir un tableau "features"';
        }
        if (geoJSON.features.length === 0) {
          return 'La FeatureCollection ne peut pas être vide';
        }
        // Valider le premier feature
        const feature = geoJSON.features[0];
        if (!feature.geometry) {
          return 'Le Feature doit contenir une "geometry"';
        }
        return validateGeoJSON(feature.geometry);
      }

      // Gérer Feature
      if (geoJSON.type === 'Feature') {
        if (!geoJSON.geometry) {
          return 'Un Feature doit contenir une "geometry"';
        }
        return validateGeoJSON(geoJSON.geometry);
      }

      // Valider que les coordonnées existent pour Point et Polygon
      if (!geoJSON.coordinates) {
        return 'Le GeoJSON doit contenir "coordinates"';
      }

      // Valider Point
      if (geoJSON.type === 'Point') {
        if (!Array.isArray(geoJSON.coordinates) || geoJSON.coordinates.length !== 2) {
          return 'Un Point doit avoir exactement 2 coordonnées [longitude, latitude]';
        }
        const [lng, lat] = geoJSON.coordinates;
        if (typeof lng !== 'number' || typeof lat !== 'number') {
          return 'Les coordonnées doivent être des nombres';
        }
        if (lng < -180 || lng > 180) {
          return 'La longitude doit être entre -180 et 180';
        }
        if (lat < -90 || lat > 90) {
          return 'La latitude doit être entre -90 et 90';
        }
      } 
      
      // Valider Polygon
      else if (geoJSON.type === 'Polygon') {
        if (!Array.isArray(geoJSON.coordinates) || geoJSON.coordinates.length === 0) {
          return 'Un Polygon doit avoir au moins un anneau';
        }
        // Valider chaque anneau
        for (const ring of geoJSON.coordinates) {
          if (!Array.isArray(ring) || ring.length < 4) {
            return 'Chaque anneau doit avoir au moins 4 points';
          }
          // Vérifier que le premier et dernier point sont identiques
          const first = ring[0];
          const last = ring[ring.length - 1];
          if (first[0] !== last[0] || first[1] !== last[1]) {
            return 'Le polygone doit être fermé (premier point = dernier point)';
          }
        }
      } 
      
      // Type non supporté
      else {
        return `Type "${geoJSON.type}" non supporté. Utilisez "Point", "Polygon", "Feature" ou "FeatureCollection"`;
      }

      return null;
    } catch (err) {
      return `Erreur de validation: ${err.message}`;
    }
  };

  const handlePointInput = () => {
    setError('');
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Latitude et longitude doivent être des nombres');
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('La latitude doit être entre -90 et 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      setError('La longitude doit être entre -180 et 180');
      return;
    }

    const geoJSON = {
      type: 'Point',
      coordinates: [lng, lat]
    };

    onChange(geoJSON);
  };

  const handlePolygonInput = () => {
    setError('');
    
    try {
      // Parse polygon coordinates
      // Format attendu: "[[lng1,lat1],[lng2,lat2],[lng3,lat3],[lng1,lat1]]"
      const parsed = JSON.parse(`[${polygonCoords}]`);
      
      if (!Array.isArray(parsed) || parsed.length < 4) {
        setError('Un polygone doit avoir au moins 4 points');
        return;
      }

      // Vérifier que c'est fermé
      const first = parsed[0];
      const last = parsed[parsed.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        setError('Le polygone doit être fermé (premier point = dernier point)');
        return;
      }

      const geoJSON = {
        type: 'Polygon',
        coordinates: [parsed]
      };

      const validationError = validateGeoJSON(geoJSON);
      if (validationError) {
        setError(validationError);
        return;
      }

      onChange(geoJSON);
    } catch (err) {
      setError(`Format invalide: ${err.message}`);
    }
  };

  const handleJSONInput = () => {
    setError('');
    
    try {
      const parsed = JSON.parse(jsonInput);
      const validationError = validateGeoJSON(parsed);
      
      if (validationError) {
        setError(validationError);
        return;
      }

      onChange(parsed);
    } catch (err) {
      setError(`JSON invalide: ${err.message}`);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {label || 'Coordonnées GeoJSON'}
        {capturing && ' (Capture en cours...)'}
      </Typography>

      {!disabled && (
        <Tabs value={mode} onChange={(e, v) => setMode(v)} sx={{ mb: 2 }}>
          <Tab value="point" label="Point GeoJSON" icon={<LocationIcon />} iconPosition="start" />
          <Tab value="polygon" label="Polygon GeoJSON" icon={<MapIcon />} iconPosition="start" />
          <Tab value="json" label="JSON brut" icon={<CodeIcon />} iconPosition="start" />
        </Tabs>
      )}

      <Paper sx={{ p: 2 }}>
        {/* Mode Point GeoJSON */}
        {mode === 'point' && !disabled && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Longitude"
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-180 à 180"
                inputProps={{ step: 'any', min: -180, max: 180 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Latitude"
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-90 à 90"
                inputProps={{ step: 'any', min: -90, max: 90 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Format GeoJSON Point: {`{ "type": "Point", "coordinates": [longitude, latitude] }`}
              </Alert>
              <Button variant="contained" onClick={handlePointInput} fullWidth>
                Créer Point GeoJSON
              </Button>
            </Grid>
          </Grid>
        )}

        {/* Mode Polygon GeoJSON */}
        {mode === 'polygon' && !disabled && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Entrez les coordonnées du polygone au format: [lng1,lat1],[lng2,lat2],[lng3,lat3],[lng1,lat1]
                <br />
                Le premier et dernier point doivent être identiques pour fermer le polygone.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coordonnées du polygone"
                multiline
                rows={4}
                value={polygonCoords}
                onChange={(e) => setPolygonCoords(e.target.value)}
                placeholder="[-5.5,7.5],[-5.4,7.5],[-5.4,7.6],[-5.5,7.6],[-5.5,7.5]"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handlePolygonInput} fullWidth>
                Créer Polygon GeoJSON
              </Button>
            </Grid>
          </Grid>
        )}

        {/* Mode JSON brut */}
        {mode === 'json' && !disabled && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="GeoJSON"
                multiline
                rows={8}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"type": "Point", "coordinates": [-5.5, 7.5]}'
                sx={{ fontFamily: 'monospace' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleJSONInput} fullWidth>
                Valider JSON
              </Button>
            </Grid>
          </Grid>
        )}

        {/* Affichage de l'erreur */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Affichage de la valeur actuelle */}
        {value && !error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success">
              <Typography variant="subtitle2">Valeur GeoJSON actuelle:</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1 }}>
                {JSON.stringify(value, null, 2)}
              </Typography>
            </Alert>
            
            {/* Carte Leaflet */}
            <Box sx={{ mt: 2, height: '300px', borderRadius: 1, overflow: 'hidden' }}>
              {(() => {
                const mapData = parseGeoJSONForMap(value);
                if (!mapData) return null;
                
                return (
                  <MapContainer 
                    center={mapData.center} 
                    zoom={mapData.zoom} 
                    style={{ height: '100%', width: '100%' }}
                    key={JSON.stringify(mapData.center)} // Force re-render on center change
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    
                    {mapData.type === 'Point' && (
                      <Marker position={mapData.position} />
                    )}
                    
                    {mapData.type === 'Polygon' && (
                      <Polygon
                        positions={mapData.positions}
                        pathOptions={{ color: 'blue', weight: 2, fillOpacity: 0.3 }}
                      />
                    )}
                  </MapContainer>
                );
              })()}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default GeoJSONInput;
