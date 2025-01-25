  "use strict";

  /**
   * A set of functions called "actions" for `create-product`
   */

  module.exports = {
    async customCreate(ctx) {
      try {
        const { user } = ctx.state;
        const { user_role } = user;

        if (user_role !== "ADMIN") {
          ctx.status = 403;
          return (ctx.body = { error: "Unauthorized" });
        }
        const { Name, Price, Description, Stock, Category } = ctx.request.body;

        // Verifica que se reciban todos los datos requeridos
        if (!Name || !Price || !Stock || !Category) {
          return ctx.badRequest("Name, Price, Stock y Category son requeridos.");
        }

        // Manejar los archivos subidos (si los hay)
        const files = ctx.request.files?.Images;

        if (!files) {
          return ctx.badRequest("No se han subido imágenes.");
        }

        // Asegúrate de que `files` sea un arreglo
        const filesArray = Array.isArray(files) ? files : [files];

        // Verifica que la categoría exista
        const existingCategory = await strapi.entityService.findOne(
          "api::category.category",
          Category
        );

        if (!existingCategory) {
          return ctx.notFound("La categoría especificada no existe.");
        }

        // Crea el producto con la relación a la categoría
        const productData = {
          Name,
          Price,
          Description,
          Stock,
          Category: existingCategory.id, // Solo necesitas el ID
        };

        const newProduct = await strapi.entityService.create(
          "api::product.product",
          {
            data: productData,
          }
        );
        const product = await strapi.entityService.findMany(
          "api::product.product",
          {
            where: {
              documentId: newProduct.documentId,
            },
          }
        );

        // Subir las imágenes y obtener sus datos
        const uploadedFiles = await strapi.plugins.upload.services.upload.upload({
          data: {
            ref: "api::product.product",
            refId: product[0].id,
            field: "Images",
          },
          files: filesArray,
        });

        // Actualizar el producto para relacionarlo con las imágenes subidas
        const updatedProduct = await strapi.entityService.update(
          "api::product.product",
          newProduct.id,
          {
            data: {
              Images: uploadedFiles.map((file) => file.id),
            },
            populate: {
              Images: {
                fields: ["url"],
              },
              Category: true,
            },
          }
        );

        return ctx.send(updatedProduct);
      } catch (err) {
        console.error(err);
        return ctx.internalServerError("Error al crear el producto.");
      }
    },
  };
