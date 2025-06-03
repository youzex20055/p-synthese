/**
 *  global controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::global.global', ({ strapi }) => ({
  async sendPaymentEmail(ctx) {
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
    } catch (error) {
      console.error('Controller error:', error);
      
      // Handle specific error cases
      if (error.message === 'Invalid email format') {
        return ctx.badRequest('Invalid email format');
      }
      
      if (error.response?.includes('550')) {
        return ctx.badRequest('Email address not found or cannot receive messages');
      }
      
      return ctx.internalServerError('Error sending email: ' + error.message);
    }
  },
}));
