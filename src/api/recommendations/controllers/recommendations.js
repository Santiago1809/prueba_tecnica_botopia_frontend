"use strict";

/**
 * A set of functions called "actions" for `recommendations`
 */

module.exports = {
  getRecommendations: async (ctx, next) => {
    try {
      const { user } = ctx.state;
      const { id: userId } = user;

      // Obtener las vistas del usuario con productos y categorías relacionadas
      const userViews = await strapi.db.query("api::view.view").findMany({
        where: { user: userId },
        populate: {
          product: {
            populate: ["Category", "Images"],
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Creamos un Set para mantener un registro de IDs y nombres únicos
      const uniqueProductIds = new Set();
      const uniqueProductNames = new Set();

      // Añadimos los productos ya vistos al conjunto de únicos
      userViews.forEach((view) => {
        if (view.product) {
          uniqueProductIds.add(view.product.id);
          uniqueProductNames.add(view.product.Name.toLowerCase()); // Normalizar a minúsculas
        }
      });

      // Analizar las preferencias de categorías del usuario
      const categoryAnalysis = userViews.reduce((acc, view) => {
        const categoryId = view.product?.Category?.id;
        if (categoryId) {
          acc[categoryId] = (acc[categoryId] || 0) + 1;
        }
        return acc;
      }, {});

      // Obtener las categorías más vistas por el usuario
      const topCategoryIds = Object.entries(categoryAnalysis)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([categoryId]) => parseInt(categoryId));

      // Obtener productos recomendados basados en las categorías preferidas
      const recommendedProducts = await strapi.db
        .query("api::product.product")
        .findMany({
          where: {
            Category: {
              id: {
                $in: topCategoryIds,
              },
            },
            Stock: {
              $gt: 0,
            },
            id: {
              $notIn: Array.from(uniqueProductIds),
            },
          },
          populate: {
            Images: true,
            Category: true,
            views: {
              count: true,
            },
          },
          limit: 20, // Aumentamos el límite para tener más opciones de filtrado
        });

      // Filtrar productos recomendados para asegurar nombres únicos
      const filteredRecommendedProducts = recommendedProducts
        .filter((product) => {
          const normalizedName = product.Name.toLowerCase();
          if (!uniqueProductNames.has(normalizedName)) {
            uniqueProductIds.add(product.id);
            uniqueProductNames.add(normalizedName);
            return true;
          }
          return false;
        })
        .slice(0, 10); // Limitamos a 10 productos después del filtrado

      // Obtener productos populares de la tienda
      const popularProducts = await strapi.db
        .query("api::product.product")
        .findMany({
          where: {
            Stock: {
              $gt: 0,
            },
            id: {
              $notIn: Array.from(uniqueProductIds),
            },
          },
          populate: {
            Images: true,
            Category: true,
            views: true,
          },
          limit: 20, // Aumentamos el límite para tener más opciones
        });

      // Ordenar y filtrar productos populares asegurando nombres únicos
      const filteredPopularProducts = popularProducts
        .sort((a, b) => (b.views?.length || 0) - (a.views?.length || 0))
        .filter((product) => {
          const normalizedName = product.Name.toLowerCase();
          if (!uniqueProductNames.has(normalizedName)) {
            uniqueProductIds.add(product.id);
            uniqueProductNames.add(normalizedName);
            return true;
          }
          return false;
        })
        .slice(0, 5);

      // Mapear los resultados filtrados
      return {
        categoryBased: filteredRecommendedProducts.map((product) => ({
          id: product.id,
          documentId: product.documentId,
          name: product.Name,
          description: product.Description,
          price: product.Price,
          images: product.Images.map((image) => image.url),
          category: {
            documentId: product.Category?.documentId,
            Name: product.Category?.Name,
          },
          stock: product.Stock,
        })),
        popular: filteredPopularProducts.map((product) => ({
          id: product.id,
          documentId: product.documentId,
          name: product.Name,
          description: product.Description,
          price: product.Price,
          images: product.Images.map((image) => image.url),
          category: {
            documentId: product.Category?.documentId,
            Name: product.Category?.Name,
          },
          stock: product.Stock,
          viewCount: product.views?.length || 0,
        })),
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  getRandomRecommendations: async (ctx, next) => {
    try {
      // Get all categories
      const categories = await strapi.db
        .query("api::category.category")
        .findMany({
          limit: 5,
        });

      const categoryIds = categories.map((cat) => cat.id);

      // Sets to track unique products
      const uniqueProductIds = new Set();
      const uniqueProductNames = new Set();

      // Get random products from these categories
      const randomProducts = await strapi.db
        .query("api::product.product")
        .findMany({
          where: {
            Category: {
              id: {
                $in: categoryIds,
              },
            },
            Stock: {
              $gt: 0,
            },
          },
          populate: {
            Images: true,
            Category: true,
            views: true,
          },
          limit: 20,
        });

      // Filter and track random products
      const filteredRandomProducts = randomProducts.filter((product) => {
        const normalizedName = product.Name.toLowerCase();
        if (!uniqueProductNames.has(normalizedName)) {
          uniqueProductIds.add(product.id);
          uniqueProductNames.add(normalizedName);
          return true;
        }
        return false;
      });

      // Get popular products excluding those in random
      const popularProducts = await strapi.db
        .query("api::product.product")
        .findMany({
          where: {
            Stock: {
              $gt: 0,
            },
            id: {
              $notIn: Array.from(uniqueProductIds),
            },
          },
          populate: {
            Images: true,
            Category: true,
            views: true,
          },
          limit: 10,
        });

      // Filter popular products to ensure unique names
      const filteredPopularProducts = popularProducts
        .sort((a, b) => (b.views?.length || 0) - (a.views?.length || 0))
        .filter((product) => {
          const normalizedName = product.Name.toLowerCase();
          if (!uniqueProductNames.has(normalizedName)) {
            uniqueProductIds.add(product.id);
            uniqueProductNames.add(normalizedName);
            return true;
          }
          return false;
        })
        .slice(0, 5);

      return {
        random: filteredRandomProducts.map((product) => ({
          id: product.id,
          documentId: product.documentId,
          name: product.Name,
          description: product.Description,
          price: product.Price,
          images: product.Images.map((image) => image.url),
          category: {
            documentId: product.Category?.documentId,
            Name: product.Category?.Name,
          },
          stock: product.Stock,
        })),
        popular: filteredPopularProducts.map((product) => ({
          id: product.id,
          documentId: product.documentId,
          name: product.Name,
          description: product.Description,
          price: product.Price,
          images: product.Images.map((image) => image.url),
          category: {
            documentId: product.Category?.documentId,
            Name: product.Category?.Name,
          },
          stock: product.Stock,
          viewCount: product.views?.length || 0,
        })),
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },
};
