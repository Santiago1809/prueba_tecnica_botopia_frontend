"use strict";

/**
 * A set of functions called "actions" for `report-new-sale`
 */

module.exports = {
  reportSale: async (ctx, next) => {
    try {
      const { Products, sendingData, totalPrice } = ctx.request.body;

      if (!Array.isArray(Products)) {
        ctx.throw(400, "Products must be an array");
      }

      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          filters: {
            email: sendingData.email,
          },
        });
      console.log(user);

      await strapi.entityService.create("api::order.order", {
        data: {
          Products,
          PaymentMethod: sendingData.paymentMethod,
          user: user.id,
          TotalPrice: totalPrice,
          DeliveryAddress: sendingData.address,
          Country: sendingData.country,
          City: sendingData.city,
        },
      });
      await strapi.entityService;
      for (const item of Products) {
        const product = await strapi.entityService.findOne(
          "api::product.product",
          item.id
        );

        if (!product) {
          ctx.throw(404, `Product with id ${item.id} not found`);
        }

        if (product.Stock < item.quantity) {
          ctx.throw(400, `Insufficient stock for product ${product.id}`);
        }

        await strapi.entityService.update("api::product.product", item.id, {
          data: {
            Stock: product.Stock - item.quantity,
          },
        });

        await strapi.documents("api::product.product").publish({
          documentId: item.documentId,
        });
      }

      ctx.body = { message: "Stock updated successfully" };
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = { error: err.message };
    }
  },
  getSalesByUser: async (ctx) => {
    try {
      const { user: userParam } = await ctx.params;
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          filters: {
            username: userParam,
          },
        });
      const sales = await strapi.entityService.findMany("api::order.order", {
        filters: {
          user: user.id,
        },
        sort: { createdAt: "desc" },
        limit: 100,
      });
      for (const sale of sales) {
        const productsPromises = sale.Products.map(async (product) => {
          const fetchedProduct = await strapi.db
            .query("api::product.product")
            .findOne({
              where: {
                documentId: product.documentId,
              },
              select: ["documentId", "Name", "Price"],
            });
          return {
            ...fetchedProduct,
            quantity: product.quantity,
          };
        });
        sale.Products = await Promise.all(productsPromises);
      }
      ctx.body = sales;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = { error: err.message };
    }
  },
  getSales: async (ctx) => {
    try {
      const sales = await strapi.entityService.findMany("api::order.order", {
        sort: { createdAt: "desc" },
        populate: {
          user: {
            fields: ["display_name", "email", "user_role", "username"],
          },
        },
        limit: 100,
      });
      for (const sale of sales) {
        const productsPromises = sale.Products.map(async (product) => {
          const fetchedProduct = await strapi.db
            .query("api::product.product")
            .findOne({
              where: {
                documentId: product.documentId,
              },
              select: ["documentId", "Name", "Price"],
            });
          return {
            ...fetchedProduct,
            quantity: product.quantity,
          };
        });
        sale.Products = await Promise.all(productsPromises);
      }
      ctx.body = sales;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = { error: err.message };
    }
  },
};
