'use strict';

/**
 * Test endpoint to verify server responses
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/test-endpoint',
      handler: (ctx) => {
        return {
          message: 'Test endpoint is working',
          timestamp: new Date().toISOString()
        };
      },
      config: {
        auth: false,
      },
    },
  ],
};
