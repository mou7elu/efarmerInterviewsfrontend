/**
 * SIG Page - Système d'Information Géographique
 * Page de cartographie avec affichage des différentes couches géographiques
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Typography, 
  Box, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Chip,
  Container
} from "@mui/material";
import { 
  ExpandMore as ExpandMoreIcon, 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon,
  Public as PublicIcon,
  Dangerous as DangerousIcon,
  Agriculture as AgricultureIcon,
  ZoomIn as ZoomInIcon,
  Home as HomeIcon
} from "@mui/icons-material";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON, LayersControl, useMap, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { paysAPI, regionsAPI, parcellesAPI, zonesInterditesAPI, menagesAPI } from '../../../services/api';

const SIGPage = () => {
  const [paysPolygons, setPaysPolygons] = useState(null);
  const [regionsPolygons, setRegionsPolygons] = useState([]);
  const [zonesInterditesPolygons, setZonesInterditesPolygons] = useState([]);
  const [parcellesPolygons, setParcellesPolygons] = useState([]);
  const [menagesPoints, setMenagesPoints] = useState([]);
  
  const [showPays, setShowPays] = useState(true);
  const [showRegions, setShowRegions] = useState(true);
  const [showZonesInterdites, setShowZonesInterdites] = useState(true);
  const [showParcelles, setShowParcelles] = useState(true);
  const [showMenages, setShowMenages] = useState(true);
  
  const [visibleRegions, setVisibleRegions] = useState({});
  const [visibleZones, setVisibleZones] = useState({});
  const [visibleParcelles, setVisibleParcelles] = useState({});
  const [visibleMenages, setVisibleMenages] = useState({});
  
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour valider un GeoJSON
  const isValidGeoJSON = (data) => {
    try {
      if (!data || typeof data !== 'object') return false;
      if (!data.type) return false;
      
      if (data.type === 'FeatureCollection') {
        if (!Array.isArray(data.features)) return false;
        return data.features.every(feature => 
          feature.type === 'Feature' && 
          feature.geometry && 
          (feature.geometry.type || feature.geometry.geometries) // Support GeometryCollection
        );
      }
      
      if (data.type === 'Feature') {
        return data.geometry && 
               (data.geometry.type || data.geometry.geometries); // Support GeometryCollection
      }
      
      if (data.type === 'GeometryCollection') {
        return Array.isArray(data.geometries) && data.geometries.length > 0;
      }
      
      if (['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'].includes(data.type)) {
        return Array.isArray(data.coordinates) && data.coordinates.length > 0;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };

  // Fonction pour nettoyer et valider les coordonnées
  const sanitizeGeoJSON = (data) => {
    try {
      if (!data) return null;
      
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (parseError) {
          return null;
        }
      }
      
      if (!data || typeof data !== 'object') return null;
      
      if (data.type === 'FeatureCollection') {
        if (!Array.isArray(data.features)) return null;
        
        const validFeatures = data.features.filter(feature => {
          if (!feature.geometry) return false;
          
          // Gérer GeometryCollection
          if (feature.geometry.type === 'GeometryCollection') {
            return Array.isArray(feature.geometry.geometries) && feature.geometry.geometries.length > 0;
          }
          
          return feature.geometry.coordinates && 
                 Array.isArray(feature.geometry.coordinates) &&
                 feature.geometry.coordinates.length > 0;
        });
        
        if (validFeatures.length === 0) return null;
        data.features = validFeatures;
      }
      
      if (data.type === 'Feature') {
        if (!data.geometry) return null;
        
        // Gérer GeometryCollection
        if (data.geometry.type === 'GeometryCollection') {
          if (!Array.isArray(data.geometry.geometries) || data.geometry.geometries.length === 0) {
            return null;
          }
        } else {
          if (!data.geometry.coordinates || !Array.isArray(data.geometry.coordinates)) {
            return null;
          }
        }
      }
      
      if (data.type === 'GeometryCollection') {
        if (!Array.isArray(data.geometries) || data.geometries.length === 0) {
          return null;
        }
      }
      
      if (['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'].includes(data.type)) {
        if (!data.coordinates || !Array.isArray(data.coordinates)) {
          return null;
        }
      }
      
      return isValidGeoJSON(data) ? data : null;
    } catch (error) {
      console.error('Erreur sanitizeGeoJSON:', error);
      return null;
    }
  };

  // Fonction pour zoomer vers un polygone
  const zoomToPolygon = (coords) => {
    if (!mapRef.current || !coords) return;
    
    try {
      const layer = L.geoJSON(coords);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [20, 20] });
      }
    } catch (error) {
      console.error("Erreur lors du zoom:", error);
    }
  };

  // Fonctions de basculement de visibilité
  const toggleRegionVisibility = (id) => {
    setVisibleRegions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleZoneVisibility = (id) => {
    setVisibleZones(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleParcelleVisibility = (id) => {
    setVisibleParcelles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleMenageVisibility = (id) => {
    setVisibleMenages(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger les données en parallèle
        const [paysRes, regionsRes, zonesRes, parcellesRes, menagesRes] = await Promise.allSettled([
          paysAPI.getAll({ limit: 1000 }),
          regionsAPI.getAll({ limit: 1000 }),
          zonesInterditesAPI.getAll({ limit: 1000 }),
          parcellesAPI.getAll({ limit: 100000 }),
          menagesAPI.getAll({ limit: 100000 })
        ]);

        // Traiter les pays
        if (paysRes.status === 'fulfilled' && paysRes.value?.data) {
          const paysData = Array.isArray(paysRes.value.data) ? paysRes.value.data : [];
          const validPays = paysData
            .map(pays => {
              const coords = pays?.coordonnee || pays?.Coordonnee;
              if (coords) {
                const cleanedCoords = sanitizeGeoJSON(coords);
                if (cleanedCoords) {
                  return { ...pays, coordonnee: cleanedCoords };
                }
              }
              return null;
            })
            .filter(p => p !== null);
          
          // Prendre le premier pays si disponible
          if (validPays.length > 0) {
            setPaysPolygons(validPays[0]);
          }
        }

        // Traiter les régions
        if (regionsRes.status === 'fulfilled' && regionsRes.value?.data) {
          const regionsData = Array.isArray(regionsRes.value.data) ? regionsRes.value.data : [];
          console.log(`Total régions reçues: ${regionsData.length}`);
          
          const validRegions = regionsData
            .map(region => {
              const coords = region?.coordonnee || region?.Coordonnee;
              if (!coords) {
                console.warn(`Région sans coordonnées:`, region.Lib_region || region.nom || region._id);
                return null;
              }
              const cleanedCoords = sanitizeGeoJSON(coords);
              if (!cleanedCoords) {
                console.warn(`Région avec coordonnées invalides:`, region.Lib_region || region.nom || region._id, coords);
                return null;
              }
              return { ...region, coordonnee: cleanedCoords };
            })
            .filter(r => r !== null);
          
          console.log(`Régions valides: ${validRegions.length}`);
          setRegionsPolygons(validRegions);
          const initialVisibility = {};
          validRegions.forEach(r => initialVisibility[r._id || r.id] = true);
          setVisibleRegions(initialVisibility);
        }

        // Traiter les zones interdites
        if (zonesRes.status === 'fulfilled' && zonesRes.value) {
          const zonesData = Array.isArray(zonesRes.value) ? zonesRes.value : [];
          console.log(`Total zones interdites reçues: ${zonesData.length}`);
          
          const validZones = zonesData
            .map(zone => {
              const coords = zone?.coordonnee || zone?.Coordonnee;
              if (!coords) {
                console.warn(`Zone interdite sans coordonnées:`, zone.Lib_zi || zone.nom || zone._id);
                return null;
              }
              const cleanedCoords = sanitizeGeoJSON(coords);
              if (!cleanedCoords) {
                console.warn(`Zone interdite avec coordonnées invalides:`, zone.Lib_zi || zone.nom || zone._id, coords);
                return null;
              }
              return { ...zone, coordonnee: cleanedCoords };
            })
            .filter(z => z !== null);
          
          console.log(`Zones interdites valides: ${validZones.length}`);
          setZonesInterditesPolygons(validZones);
          const initialVisibility = {};
          validZones.forEach(z => initialVisibility[z._id || z.id] = true);
          setVisibleZones(initialVisibility);
        }

        // Traiter les parcelles
        if (parcellesRes.status === 'fulfilled' && parcellesRes.value?.data) {
          const parcellesData = Array.isArray(parcellesRes.value.data) ? parcellesRes.value.data : [];
          const validParcelles = parcellesData
            .map(parcelle => {
              const coords = parcelle?.coordonnee || parcelle?.Coordonnee;
              if (coords) {
                const cleanedCoords = sanitizeGeoJSON(coords);
                if (cleanedCoords) {
                  return { ...parcelle, coordonnee: cleanedCoords };
                }
              }
              return null;
            })
            .filter(p => p !== null);
          
          setParcellesPolygons(validParcelles);
          const initialVisibility = {};
          validParcelles.forEach(p => initialVisibility[p._id || p.id] = true);
          setVisibleParcelles(initialVisibility);
        }

        // Traiter les ménages
        console.log(`Ménages response:`, menagesRes.value);
        if (menagesRes.status === 'fulfilled' && menagesRes.value) {
          // L'API menage retourne directement un tableau, pas un objet {data: []}
          const menagesData = Array.isArray(menagesRes.value) 
            ? menagesRes.value 
            : (Array.isArray(menagesRes.value.data) ? menagesRes.value.data : []);
          console.log(`Total ménages reçus: ${menagesData.length}`);
          
          const validMenages = menagesData
            .map(menage => {
              const coords = menage?.coordonnee || menage?.Coordonnee || menage?.CoordonneesGPS;
              if (!coords) {
                console.warn(`Ménage sans coordonnées:`, menage.Cod_menage || menage.id);
                return null;
              }
              const cleanedCoords = sanitizeGeoJSON(coords);
              if (!cleanedCoords) {
                console.warn(`Ménage avec coordonnées invalides:`, menage.Cod_menage || menage.id, coords);
                return null;
              }
              return { ...menage, coordonnee: cleanedCoords };
            })
            .filter(m => m !== null);
          
          console.log(`Ménages valides: ${validMenages.length}`);
          setMenagesPoints(validMenages);
          const initialVisibility = {};
          validMenages.forEach(m => initialVisibility[m._id || m.id] = true);
          setVisibleMenages(initialVisibility);
        }

      } catch (err) {
        console.error("Erreur lors du chargement des données SIG:", err);
        setError("Impossible de charger les données cartographiques");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Styles pour les polygones
  const paysStyle = {
    color: "blue",
    weight: 2,
    fillColor: "rgba(0, 0, 255, 0.1)",
    fillOpacity: 0.1,
  };

  const regionStyle = {
    color: "#FF8C00",
    weight: 2,
    fillColor: "rgba(255, 140, 0, 0.2)",
    fillOpacity: 0.2,
  };

  const zoneInterditStyle = {
    color: "green",
    weight: 2,
    fillColor: "rgba(0, 255, 0, 0.3)",
    fillOpacity: 0.3,
  };

  const parcelleStyle = {
    color: "red",
    weight: 2,
    fillColor: "rgba(255, 0, 0, 0.3)",
    fillOpacity: 0.3,
  };

  const menagePointStyle = {
    radius: 6,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };

  if (loading) {
    return (
      <Container>
        <Typography>Chargement de la carte...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', width: "100%", height: '100vh' }}>
      {/* Panneau de contrôle latéral */}
      <Paper 
        elevation={3} 
        sx={{ 
          width: 350, 
          height: '100vh', 
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
          borderRight: '2px solid #ddd'
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
            🌍 Couches cartographiques
          </Typography>
          
          {/* Section Pays */}
          <Accordion sx={{ mb: 1, boxShadow: 1 }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: '#e3f2fd', minHeight: 48 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <PublicIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Pays</Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPays(!showPays);
                  }}
                  sx={{ mr: 1 }}
                >
                  {showPays ? <VisibilityIcon color="primary" /> : <VisibilityOffIcon />}
                </IconButton>
                <Chip 
                  label="1" 
                  size="small" 
                  color={showPays ? "primary" : "default"}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#fafafa' }}>
              {paysPolygons && (
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary={paysPolygons.Lib_pays || paysPolygons.nom || "Pays"}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => showPays && zoomToPolygon(paysPolygons.coordonnee)}
                    />
                    {showPays && (
                      <IconButton
                        size="small"
                        onClick={() => zoomToPolygon(paysPolygons.coordonnee)}
                        title="Zoomer"
                      >
                        <ZoomInIcon />
                      </IconButton>
                    )}
                  </ListItem>
                </List>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Section Régions */}
          <Accordion sx={{ mb: 1, boxShadow: 1 }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: '#fff8f0', minHeight: 48 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <PublicIcon sx={{ mr: 1, color: '#FF8C00' }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Régions</Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRegions(!showRegions);
                  }}
                  sx={{ mr: 1 }}
                >
                  {showRegions ? <VisibilityIcon sx={{ color: '#FF8C00' }} /> : <VisibilityOffIcon />}
                </IconButton>
                <Chip 
                  label={regionsPolygons.length} 
                  size="small" 
                  sx={{ backgroundColor: showRegions ? '#FF8C00' : 'default', color: showRegions ? 'white' : 'inherit' }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#fafafa', maxHeight: 300, overflow: 'auto' }}>
              <List dense>
                {regionsPolygons.map((region, index) => {
                  const regionId = region._id || region.id || index;
                  const isVisible = showRegions && visibleRegions[regionId];
                  return (
                    <ListItem key={regionId}>
                      <ListItemIcon>
                        <IconButton
                          size="small"
                          onClick={() => toggleRegionVisibility(regionId)}
                        >
                          {isVisible ? <VisibilityIcon sx={{ color: '#FF8C00' }} /> : <VisibilityOffIcon />}
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText 
                        primary={region.Lib_region || region.nom || `Région ${index + 1}`}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => isVisible && zoomToPolygon(region.coordonnee)}
                      />
                      {isVisible && (
                        <IconButton
                          size="small"
                          onClick={() => zoomToPolygon(region.coordonnee)}
                        >
                          <ZoomInIcon />
                        </IconButton>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Section Zones Interdites */}
          <Accordion sx={{ mb: 1, boxShadow: 1 }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: '#e8f5e8', minHeight: 48 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <DangerousIcon sx={{ mr: 1, color: '#2e7d32' }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Zones interdites</Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowZonesInterdites(!showZonesInterdites);
                  }}
                  sx={{ mr: 1 }}
                >
                  {showZonesInterdites ? <VisibilityIcon color="success" /> : <VisibilityOffIcon />}
                </IconButton>
                <Chip 
                  label={zonesInterditesPolygons.length} 
                  size="small" 
                  color={showZonesInterdites ? "success" : "default"}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#fafafa', maxHeight: 300, overflow: 'auto' }}>
              <List dense>
                {zonesInterditesPolygons.map((zone, index) => {
                  const zoneId = zone._id || zone.id || index;
                  const isVisible = showZonesInterdites && visibleZones[zoneId];
                  return (
                    <ListItem key={zoneId}>
                      <ListItemIcon>
                        <IconButton
                          size="small"
                          onClick={() => toggleZoneVisibility(zoneId)}
                        >
                          {isVisible ? <VisibilityIcon color="success" /> : <VisibilityOffIcon />}
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText 
                        primary={zone.Lib_zi || zone.nom || `Zone ${index + 1}`}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => isVisible && zoomToPolygon(zone.coordonnee)}
                      />
                      {isVisible && (
                        <IconButton
                          size="small"
                          onClick={() => zoomToPolygon(zone.coordonnee)}
                        >
                          <ZoomInIcon />
                        </IconButton>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Section Parcelles */}
          <Accordion sx={{ mb: 1, boxShadow: 1 }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: '#ffebee', minHeight: 48 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <AgricultureIcon sx={{ mr: 1, color: '#d32f2f' }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Parcelles</Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowParcelles(!showParcelles);
                  }}
                  sx={{ mr: 1 }}
                >
                  {showParcelles ? <VisibilityIcon color="error" /> : <VisibilityOffIcon />}
                </IconButton>
                <Chip 
                  label={parcellesPolygons.length} 
                  size="small" 
                  color={showParcelles ? "error" : "default"}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#fafafa', maxHeight: 400, overflow: 'auto' }}>
              <List dense>
                {parcellesPolygons.map((parcelle, index) => {
                  const parcelleId = parcelle.id || parcelle._id || index;
                  const isVisible = showParcelles && visibleParcelles[parcelleId];
                  return (
                    <ListItem key={parcelleId}>
                      <ListItemIcon>
                        <IconButton
                          size="small"
                          onClick={() => toggleParcelleVisibility(parcelleId)}
                        >
                          {isVisible ? <VisibilityIcon color="error" /> : <VisibilityOffIcon />}
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText 
                        primary={parcelle.Code || parcelle.code || `Parcelle ${index + 1}`}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => isVisible && zoomToPolygon(parcelle.coordonnee)}
                      />
                      {isVisible && (
                        <IconButton
                          size="small"
                          onClick={() => zoomToPolygon(parcelle.coordonnee)}
                        >
                          <ZoomInIcon />
                        </IconButton>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Section Ménages */}
          <Accordion sx={{ mb: 1, boxShadow: 1 }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: '#fff3e0', minHeight: 48 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <HomeIcon sx={{ mr: 1, color: '#ff7800' }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Ménages</Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenages(!showMenages);
                  }}
                  sx={{ mr: 1 }}
                >
                  {showMenages ? <VisibilityIcon sx={{ color: '#ff7800' }} /> : <VisibilityOffIcon />}
                </IconButton>
                <Chip 
                  label={menagesPoints.length} 
                  size="small" 
                  sx={{ backgroundColor: showMenages ? '#ff7800' : 'default', color: showMenages ? 'white' : 'inherit' }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#fafafa', maxHeight: 400, overflow: 'auto' }}>
              <List dense>
                {menagesPoints.map((menage, index) => {
                  const menageId = menage.id || menage._id || index;
                  const isVisible = showMenages && visibleMenages[menageId];
                  return (
                    <ListItem key={menageId}>
                      <ListItemIcon>
                        <IconButton
                          size="small"
                          onClick={() => toggleMenageVisibility(menageId)}
                        >
                          {isVisible ? <VisibilityIcon sx={{ color: '#ff7800' }} /> : <VisibilityOffIcon />}
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText 
                        primary={menage.Code || menage.code || menage.Nom || `Ménage ${index + 1}`}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => isVisible && zoomToPolygon(menage.coordonnee)}
                      />
                      {isVisible && (
                        <IconButton
                          size="small"
                          onClick={() => zoomToPolygon(menage.coordonnee)}
                        >
                          <ZoomInIcon />
                        </IconButton>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper>

      {/* Carte principale */}
      <Box sx={{ flexGrow: 1, height: '100vh' }}>
        <MapContainer 
          center={[7.5, -5.5]} 
          zoom={7} 
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <FeatureGroup>
            <LayersControl position="topright">
                 <LayersControl.BaseLayer  name="OpenStreetMap">
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </LayersControl.BaseLayer>
              
              <LayersControl.BaseLayer name="Google Satellite">
                <TileLayer 
                  url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                  attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                />
              </LayersControl.BaseLayer>
              
              <LayersControl.BaseLayer name="Google Hybrid">
                <TileLayer 
                  url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                  attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                />
              </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Bing Satellite">
                <TileLayer
                  url="https://ecn.t3.tiles.virtualearth.net/tiles/a{q}.jpeg?g=1"
                  attribution="&copy; Microsoft Bing Maps"
                />
              </LayersControl.BaseLayer>
              
              <LayersControl.BaseLayer checked name="Esri Satellite">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="&copy; Esri"
                />
              </LayersControl.BaseLayer>

              {/* Couche Pays */}
              {showPays && paysPolygons && (
                <LayersControl.Overlay checked name="Pays">
                  <GeoJSON
                    key="pays"
                    data={paysPolygons.coordonnee}
                    style={paysStyle}
                  />
                </LayersControl.Overlay>
              )}

              {/* Couche Régions */}
              {showRegions && (
                <LayersControl.Overlay checked name="Régions">
                  <FeatureGroup>
                    {regionsPolygons.map((region, index) => {
                      const regionId = region._id || region.id || index;
                      const isVisible = visibleRegions[regionId];
                      
                      if (!isVisible || !region.coordonnee) return null;
                      
                      return (
                        <GeoJSON
                          key={`region-${regionId}`}
                          data={region.coordonnee}
                          style={regionStyle}
                        />
                      );
                    })}
                  </FeatureGroup>
                </LayersControl.Overlay>
              )}

              {/* Couche Zones Interdites */}
              {showZonesInterdites && (
                <LayersControl.Overlay checked name="Zones Interdites">
                  <FeatureGroup>
                    {zonesInterditesPolygons.map((zone, index) => {
                      const zoneId = zone._id || zone.id || index;
                      const isVisible = visibleZones[zoneId];
                      
                      if (!isVisible || !zone.coordonnee) return null;
                      
                      return (
                        <GeoJSON
                          key={`zone-${zoneId}`}
                          data={zone.coordonnee}
                          style={zoneInterditStyle}
                        />
                      );
                    })}
                  </FeatureGroup>
                </LayersControl.Overlay>
              )}

              {/* Couche Parcelles */}
              {showParcelles && (
                <LayersControl.Overlay checked name="Parcelles">
                  <FeatureGroup>
                    {parcellesPolygons.map((parcelle, index) => {
                      const parcelleId = parcelle.id || parcelle._id || index;
                      const isVisible = visibleParcelles[parcelleId];
                      
                      if (!isVisible || !parcelle.coordonnee) return null;
                      
                      return (
                        <GeoJSON
                          key={`parcelle-${parcelleId}`}
                          data={parcelle.coordonnee}
                          style={parcelleStyle}
                        />
                      );
                    })}
                  </FeatureGroup>
                </LayersControl.Overlay>
              )}

              {/* Couche Ménages */}
              {showMenages && (
                <LayersControl.Overlay checked name="Ménages">
                  <FeatureGroup>
                    {menagesPoints.map((menage, index) => {
                      const menageId = menage.id || menage._id || index;
                      const isVisible = visibleMenages[menageId];
                      
                      if (!isVisible || !menage.coordonnee) return null;
                      
                      return (
                        <GeoJSON
                          key={`menage-${menageId}`}
                          data={menage.coordonnee}
                          pointToLayer={(feature, latlng) => {
                            return L.circleMarker(latlng, menagePointStyle);
                          }}
                          onEachFeature={(feature, layer) => {
                            layer.bindPopup(`
                              <div>
                                <strong>${menage.Code || menage.code || 'Ménage'}</strong><br/>
                                ${menage.Nom || menage.nom || ''}
                              </div>
                            `);
                          }}
                        />
                      );
                    })}
                  </FeatureGroup>
                </LayersControl.Overlay>
              )}

            </LayersControl>
          </FeatureGroup>
        </MapContainer>
      </Box>
    </Box>
  );
};

export default SIGPage;
