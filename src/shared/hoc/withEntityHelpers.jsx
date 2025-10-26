/**
 * Higher Order Component pour ajouter les utilitaires d'entités à toutes les pages
 */

import React from 'react';
import { getValue, getSafeId, getLibelle, getProducteurNomComplet, getProducteurCode, extractDataFromApiResponse, getSuperficieDisplay, getGenreTexte } from '../utils/entityHelpers.js';

/**
 * HOC qui injecte les utilitaires d'entités comme props
 * @param {React.Component} WrappedComponent - Le composant à wrapper
 * @returns {React.Component} - Le composant avec les utilitaires injectés
 */
export const withEntityHelpers = (WrappedComponent) => {
  const WithEntityHelpersComponent = (props) => {
    const entityHelpers = {
      getValue,
      getSafeId,
      getLibelle,
      getProducteurNomComplet,
      getProducteurCode,
      extractDataFromApiResponse,
      getSuperficieDisplay,
      getGenreTexte
    };

    return <WrappedComponent {...props} entityHelpers={entityHelpers} />;
  };

  WithEntityHelpersComponent.displayName = `withEntityHelpers(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithEntityHelpersComponent;
};

export default withEntityHelpers;