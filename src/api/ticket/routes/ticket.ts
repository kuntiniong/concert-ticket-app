/**
 * ticket router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::ticket.ticket');

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/tickets/book',
      handler: 'ticket.bookTickets', 
      config: {
        policies: [], 
      },
    },
  ],
};
