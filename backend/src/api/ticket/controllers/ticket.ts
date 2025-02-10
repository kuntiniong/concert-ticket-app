/**
 * ticket controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::ticket.ticket', ({ strapi }) => ({
  async bookTickets(ctx) {
    const { documentId, requestedQuantity } = ctx.request.body;

    try {
      // Preconditions:
      // 1. fetch concert with document id
      const concert = await strapi.documents('api::concert.concert').findOne({
        documentId,
      });

      if (!concert) {
        return ctx.badRequest('Concert not found');
      }

      // 2. check if the current time is before the concert date
      const currentTime = new Date();
      const concertDateTime = new Date(concert.dateTime);

      if (currentTime >= concertDateTime) {
        return ctx.badRequest('Cannot purchase tickets for a past or ongoing concert');
      }

      // 3. check if enough tickets are available
      if (concert.availableTickets < requestedQuantity) {
        return ctx.badRequest('Not enough tickets available');
      }

      // Executions:
      // 4. calculate total price
      const totalPrice = requestedQuantity * concert.price;

      // 5. create the ticket
      const ticket = await strapi.entityService.create('api::ticket.ticket', {
        data: {
          documentId,
          requestedQuantity,
          totalPrice,
          purchaseDateTime: currentTime,
        },
      });

      // 6. update the concert's available tickets
      await strapi.documents('api::concert.concert').update({
        documentId: concert.documentId, // Use the documentId of the concert
        data: {
          availableTickets: concert.availableTickets - requestedQuantity,
        },
      });

      return ticket;
    } catch (err) {
      strapi.log.error(err);
      return ctx.internalServerError('Something went wrong');
    }
  },
}));