import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getSIGData } from '../../../services/sigService';

const parseGeoJsonCoordinates = (geojson) => {
  try {
    const obj = typeof geojson === 'string' ? JSON.parse(geojson) : geojson;
    // FeatureCollection
    if (obj && obj.type === 'FeatureCollection' && Array.isArray(obj.features)) {
      // Prend le premier feature polygon
      const feature = obj.features.find(f => f.geometry && f.geometry.type === 'Polygon');
      if (feature && Array.isArray(feature.geometry.coordinates)) {
        return feature.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
      }
    }
    // Feature
    if (obj && obj.type === 'Feature' && obj.geometry && obj.geometry.type === 'Polygon') {
      return obj.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
    }
    // Polygon direct
    if (obj && obj.type === 'Polygon' && Array.isArray(obj.coordinates)) {
      return obj.coordinates[0].map(([lng, lat]) => [lat, lng]);
    }
  } catch (e) {}
  return null;
};

const SIGPage = () => {
  const [pays, setPays] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [regions, setRegions] = useState([]);
  const [parcelles, setParcelles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSIGData()
      .then(({ pays, districts, regions, parcelles }) => {
  let paysArr = pays?.data || pays || [];
  let districtsArr = districts?.data || districts || [];
  let regionsArr = regions?.data || regions || [];
  let parcellesArr = parcelles?.data || parcelles || [];
  // Si ce n'est pas un tableau, mais un objet, on prend les valeurs
  if (!Array.isArray(paysArr) && typeof paysArr === 'object') paysArr = Object.values(paysArr);
  if (!Array.isArray(districtsArr) && typeof districtsArr === 'object') districtsArr = Object.values(districtsArr);
  if (!Array.isArray(regionsArr) && typeof regionsArr === 'object') regionsArr = Object.values(regionsArr);
  if (!Array.isArray(parcellesArr) && typeof parcellesArr === 'object') parcellesArr = Object.values(parcellesArr);
        setPays(paysArr);
        setDistricts(districtsArr);
        setRegions(regionsArr);
        setParcelles(parcellesArr);
        if (paysArr.length > 0) {
          // Log pour debug coordonnées pays
          const country = paysArr[0];
          const coords = country.Coordonnee || country.coordinates;
          console.log('Pays coordinates:', coords);
          console.log('Parsed:', parseGeoJsonCoordinates(coords));
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Erreur chargement SIG');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}>
      {loading && <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', padding: 8, zIndex: 10 }}>Chargement...</div>}
      {error && <div style={{ position: 'absolute', top: 40, left: 10, background: 'white', color: 'red', padding: 8, zIndex: 10 }}>{error}</div>}
      {!loading && !error && pays.length === 0 && (
        <div style={{ position: 'absolute', top: 80, left: 10, background: 'white', color: 'gray', padding: 8, zIndex: 10 }}>
          Aucune donnée SIG trouvée.
        </div>
      )}
      <MapContainer center={[7.5, -5.5]} zoom={7} style={{ height: '100vh', width: '100vw' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {/* Polygons des pays uniquement */}
        {Array.isArray(pays) && pays.map((country) => {
          const coords = country.Coordonnee || country.coordinates;
          const parsed = parseGeoJsonCoordinates(coords);
          return parsed ? (
            <Polygon
              key={country.id || country._id}
              positions={parsed}
              pathOptions={{ color: 'red', weight: 2 }}
            />
          ) : null;
        })}
        {/* Pour afficher districts, regions, parcelles, ajouter ici si besoin */}
      </MapContainer>
    </div>
  );
};

export default SIGPage;

// ...existing code...
