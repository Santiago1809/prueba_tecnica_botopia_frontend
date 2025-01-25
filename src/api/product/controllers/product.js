"use strict";

/**
 * product controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  async update(ctx) {
    const { data } = ctx.request.body;

    try {
      // Encuentra el producto por su documentId
      const products = await strapi.entityService.findMany(
        "api::product.product",
        {
          where: {
            documentId: ctx.params.id,
          },
        }
      );

      if (products.length === 0) {
        return ctx.throw(404, "Producto no encontrado");
      }

      const product = products[0];

      // Actualiza el producto y lo publica
      const updated = await strapi.documents("api::product.product").update({
        documentId: product.documentId,
        data,
        status: "published",
      });

      
      ctx.body = updated;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      ctx.throw(500, "No se pudo actualizar el producto");
    }
  },
}));
