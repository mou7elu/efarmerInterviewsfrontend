/**
 * Geographic module routes
 */

import React from 'react';
import { Route } from 'react-router-dom';

import { PaysListPage } from './Pays';
import { DistrictsListPage } from './Districts';
import { RegionsListPage } from './Regions';
import { DepartementsListPage } from './Departements';
import { VillagesListPage } from './Villages';

export const geographicRoutes = (
  <>
    <Route path="/pays" element={<PaysListPage />} />
    <Route path="/districts" element={<DistrictsListPage />} />
    <Route path="/regions" element={<RegionsListPage />} />
    <Route path="/departements" element={<DepartementsListPage />} />
    <Route path="/villages" element={<VillagesListPage />} />
  </>
);

export default geographicRoutes;
