"use strict";

/**
 * A set of functions called "actions" for `admin-stats`
 */

module.exports = {
  getStats: async (ctx, next) => {
    try {
      const { user } = ctx.state;
      const { user_role } = user;

      if (user_role !== "ADMIN") {
        ctx.status = 403;
        return (ctx.body = { error: "Unauthorized" });
      }
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const orders = await strapi.entityService.findMany("api::order.order", {
        where: {
          createdAt: {
            $gte: lastMonth,
          },
        },
        populate: {
          user: {
            fields: ["display_name", "email"],
          },
        },
        fields: ["id", "TotalPrice", "createdAt"],
      });
      const users = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          where: {
            createdAt: {
              $gte: lastMonth,
            },
          },
        }
      );
      const monthNames = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];

      // Inicializamos el objeto con todos los meses en 0
      const datosMensuales = monthNames.reduce((acc, month) => {
        acc[month] = 0;
        return acc;
      }, {});

      // Agregamos un console.log para verificar los datos
      orders.forEach((order) => {
        const fecha = new Date(order.createdAt);

        const month = fecha.getMonth();
        if (month >= 0 && month < 12) {
          // Verificamos que el mes sea válido
          datosMensuales[monthNames[month]] += order.TotalPrice;
        }
      });

      const total = orders.reduce((acc, order) => acc + order.TotalPrice, 0);
      const ventas = orders.reduce((acc, _) => acc + 1, 0);
      const nuevosUsuarios = users.reduce((acc, _) => acc + 1, 0);
      ctx.body = {
        cards: [
          { title: "Ingresos totales", value: total, type: "Ingresos" },
          { title: "Ventas", value: ventas, type: "Ventas" },
          { title: "Nuevos clientes", value: nuevosUsuarios, type: "Clientes" },
        ],
        ventasRecientes: orders.slice(0, 5),
        datosMensuales,
      };
    } catch (err) {
      ctx.body = err;
    }
  },
};
