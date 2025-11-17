/**
 * Administrative Routes Configuration
 * Routes pour le module administratif
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import des pages
import { 
  SousprefsListPage,
  SecteursListPage,
  ZonesListPage,
  LocalitesListPage,
  MenagesListPage,
} from './index';

const AdministrativeRoutes = () => {
  return (
    <Routes>
      {/* Sous-Préfectures */}
      <Route path="/souspref" element={<SousprefsListPage />} />
      
      {/* Secteurs Administratifs */}
      <Route path="/secteurs" element={<SecteursListPage />} />
      
      {/* Zones de Dénombrement */}
      <Route path="/zones" element={<ZonesListPage />} />
      
      {/* Localités */}
      <Route path="/localites" element={<LocalitesListPage />} />
      
      {/* Ménages */}
      <Route path="/menages" element={<MenagesListPage />} />
      
      {/* Route par défaut */}
      <Route path="/" element={<SousprefsListPage />} />
    </Routes>
  );
};

export default AdministrativeRoutes;
