/**
 * global service.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::global.global', ({ strapi }) => ({
  async sendPaymentConfirmationEmail(email: string) {
    console.log('Attempting to send email to:', email);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      throw new Error('Invalid email format');
    }

    try {
      const result = await strapi.plugins['email'].services.email.send({
        to: email,
        from: 'youssefhdilisse5@gmail.com',
        subject: 'Payment Confirmation - Your Order Details',
        text: `
          Thank you for your payment!
          Your order has been confirmed.
          We will process your order shortly.
          If you have any questions, please contact us at youssefhdilisse5@gmail.com
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Payment Confirmation</h1>
            <p>Dear Customer,</p>
            <p>Thank you for your payment! Your order has been confirmed.</p>
            <p>We will process your order shortly.</p>
            <p>If you have any questions, please contact us at <a href="mailto:youssefhdilisse5@gmail.com">youssefhdilisse5@gmail.com</a></p>
            <p>Best regards,<br>YOUZEX SPORT</p>
          </div>
        `,
      });
      console.log('Email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      throw error;
    }
  },
}));
