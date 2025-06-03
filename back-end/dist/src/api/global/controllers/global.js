"use strict";
/**
 *  global controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::global.global', ({ strapi }) => ({
    async sendPaymentEmail(ctx) {
        var _a;
        console.log('Received payment email request:', ctx.request.body);
        const { email } = ctx.request.body;
        if (!email) {
            console.log('Email is missing in request');
            return ctx.badRequest('Email is required');
        }
        try {
            console.log('Calling email service for:', email);
            await strapi.service('api::global.global').sendPaymentConfirmationEmail(email);
            console.log('Email sent successfully');
            return { message: 'Email sent successfully' };
        }
        catch (error) {
            console.error('Controller error:', error);
            // Handle specific error cases
            if (error.message === 'Invalid email format') {
                return ctx.badRequest('Invalid email format');
            }
            if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.includes('550')) {
                return ctx.badRequest('Email address not found or cannot receive messages');
            }
            return ctx.internalServerError('Error sending email: ' + error.message);
        }
    },
}));
