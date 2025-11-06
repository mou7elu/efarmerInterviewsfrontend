import { paysAPI, districtAPI, regionsAPI, parcellesAPI } from './api';

// Récupère la hiérarchie pays > districts > regions > parcelles
export const getSIGData = async () => {
  const [pays, districts, regions, parcelles] = await Promise.all([
    paysAPI.getAll(),
    districtAPI.getAll(),
    regionsAPI.getAll(),
    parcellesAPI.getAll(),
  ]);
console.log('SIG Data fetched:', { pays, districts, regions, parcelles });
  return {
    pays: pays.data || pays,
    districts: districts.data || districts,
    regions: regions.data || regions,
    parcelles: parcelles.data || parcelles,
  };
};
