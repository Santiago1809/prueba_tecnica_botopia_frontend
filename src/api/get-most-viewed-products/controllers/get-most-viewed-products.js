"use strict";

/**
 * A set of functions called "actions" for `get-most-viewed-products`
 */

module.exports = {
  exampleAction: async (ctx, next) => {
    try {
      const entries = await strapi.entityService.findMany(
        "api::product.product",
        {
          populate: ["Images", "views", "Category"],
        }
      );

      // Procesar los resultados para obtener el conteo de vistas
      const productsWithViewCount = entries
        .map((product) => ({
          id: product.id,
          attributes: {
            ...product,
            id: undefined,
            viewCount: product.views?.length || 0,
            Images: product.Images.map((image) => ({
              id: image.id,
              url: image.url,
            })),
            views: undefined,
            Category: {
              id: product.Category.id,
              documentId: product.Category.documentId,
              Name: product.Category.Name
            }
          },
        }))
        .sort((a, b) => b.attributes.viewCount - a.attributes.viewCount)
        .slice(0, 4);

      return {
        data: productsWithViewCount,
        meta: {
          count: productsWithViewCount.length,
        },
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },  
};
