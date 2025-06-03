"use strict";
/**
 * global router.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
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
