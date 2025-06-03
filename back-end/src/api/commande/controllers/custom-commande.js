'use strict';

/**
 * Custom controller for handling public order creation
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::commande.commande', ({ strapi }) => ({
  // Custom create method that doesn't require authentication
  async createPublicOrder(ctx) {
    try {
      console.log('Received request body:', ctx.request.body);
      
      // Get data from request body
      const { data } = ctx.request.body;
      
      if (!data) {
        return ctx.badRequest({
          error: {
            message: 'Request body must contain a data object'
          }
        });
      }
      
      // Validate required fields
      if (!data.customerName || !data.email || !data.orderItems || !data.totalAmount || 
          !data.shippingAddress || !data.phoneNumber || !data.paymentMethod) {
        return ctx.badRequest({
          error: {
            message: 'Missing required fields',
            details: {
              required: ['customerName', 'email', 'orderItems', 'totalAmount', 'shippingAddress', 'phoneNumber', 'paymentMethod'],
              received: Object.keys(data)
            }
          }
        });
      }
      
      console.log('Creating order with data:', data);
      
      // Create the order
      const entity = await strapi.entityService.create('api::commande.commande', {
        data: {
          ...data,
          publishedAt: new Date()
        }
      });
      
      console.log('Order created successfully:', entity);
      
      // Return the created order
      return { 
        data: entity,
        meta: { success: true }
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return ctx.badRequest({
        error: {
          message: `Error creating order: ${error.message}`,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      });
    }
  }
}));
