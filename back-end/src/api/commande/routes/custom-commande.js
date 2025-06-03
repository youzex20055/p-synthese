'use strict';

/**
 * Custom routes for public order creation
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/public-orders',
      handler: 'custom-commande.createPublicOrder',
      config: {
        auth: false, // No authentication required
        policies: [],
        middlewares: [],
      },
    },
  ],
};
