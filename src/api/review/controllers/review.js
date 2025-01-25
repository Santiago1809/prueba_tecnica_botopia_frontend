"use strict";

/**
 * review controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::review.review", ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const product = await strapi.query("api::product.product").findOne({
      filters: {
        documentId: id,
        publishedAt: null,
      },
    });
    const response = await strapi.entityService.findMany("api::review.review", {
      where: {
        product: product.id,
      },
      populate: {
        user: {
          fields: ["display_name"],
        },
      },
    });

    ctx.body = response;
  },
  async create(ctx) {
    const { data } = ctx.request.body;
    console.log(data);

    const product = await strapi.entityService.findMany(
      "api::product.product",
      {
        where: {
          documentId: data.product,
        },
      }
    );

    await strapi.entityService.create("api::review.review", {
      data: {
        product: product[0].id,
        user: data.user,
        Text: data.Text,
      },
    });
    const response = await strapi.entityService.findMany("api::review.review", {
      filters: {
        product: product[0].id,
      },
      populate: {
        user: {
          fields: ["display_name"],
        },
      },
    });
    console.log(response);

    return response;
  },
}));
