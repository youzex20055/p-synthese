/**
 * global router.
 */

import { factories } from '@strapi/strapi';

export default {
  routes: [
    {
      method: 'POST',
      path: '/global/send-payment-email',
      handler: 'global.sendPaymentEmail',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
