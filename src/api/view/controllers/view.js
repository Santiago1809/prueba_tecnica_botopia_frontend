"use strict";

/**
 * view controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::view.view", ({ strapi }) => ({
  async create(ctx) {
    // Get the request body data
    const { data } = ctx.request.body;
    console.log(data);
    const product = await strapi.query("api::product.product").findOne({
      filters: {
        documentId: data.product,
        publishedAt: null,
      }
    })
    
    const response = await strapi.entityService.create("api::view.view", {
      data: {
        product: product.id,
        user: data.user,
      }
    })

    return response;
  },
}));
