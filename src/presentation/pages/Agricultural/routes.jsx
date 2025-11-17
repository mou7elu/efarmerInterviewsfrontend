/**
 * Agricultural module routes
 */

import React from 'react';
import { Route } from 'react-router-dom';

import { ProducteursListPage } from './Producteurs';
import { ParcellesListPage } from './Parcelles';

export const agriculturalRoutes = (
  <>
    <Route path="/producteurs" element={<ProducteursListPage />} />
    <Route path="/parcelles" element={<ParcellesListPage />} />
  </>
);

export default agriculturalRoutes;
