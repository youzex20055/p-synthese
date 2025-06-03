export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'http://localhost:*', 'https://*', 'http://*'],
          'img-src': ["'self'", 'data:', 'blob:', 'http://localhost:*', 'https://*', 'http://*'],
          'media-src': ["'self'", 'data:', 'blob:', 'http://localhost:*', 'https://*', 'http://*'],
          'default-src': ["'self'", 'https://*', 'http://*'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000', 'http://localhost:1337', 'http://18.208.134.101:*', 'https://*', 'http://*'],
      headers: ['*'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
