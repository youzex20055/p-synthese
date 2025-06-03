"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    'strapi::logger',
    'strapi::errors',
    {
        name: 'strapi::security',
        config: {
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'connect-src': ["'self'", 'http://localhost:*', 'https://*'],
                    'img-src': ["'self'", 'data:', 'blob:', 'http://localhost:*', 'https://*'],
                    'media-src': ["'self'", 'data:', 'blob:', 'http://localhost:*', 'https://*'],
                    'default-src': ["'self'", 'https://*'],
                    upgradeInsecureRequests: null,
                },
            },
        },
    },
    {
        name: 'strapi::cors',
        config: {
            enabled: true,
            origin: ['http://localhost:3000', 'http://localhost:1337', 'https://*'],
            headers: ['*'],
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
            credentials: true,
        },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
];
