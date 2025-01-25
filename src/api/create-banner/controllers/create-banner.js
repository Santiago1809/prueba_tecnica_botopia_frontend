"use strict";
/**
 * A set of functions called "actions" for `create-banner`
 */

module.exports = {
  customCreate: async (ctx) => {
    try {
      const { user } = ctx.state;
      const { user_role } = user;
      if (user_role !== "ADMIN") {
        ctx.status = 403;
        return (ctx.body = { error: "Unauthorized" });
      }
      const { Title, Url, ButtonText } = ctx.request.body;
      if (!Title || !Url || !ButtonText) {
        ctx.badRequest("Title, Url y ButtonText son requeridos.");
      }
      const file = ctx.request.files?.Image;
      if (!file) {
        ctx.badRequest("No se han subido la imagen.");
      }

      // Create the banner first
      const newBanner = await strapi.entityService.create(
        "api::banner.banner",
        {
          data: {
            Title,
            Url,
            ButtonText,
          },
        }
      );

      // Upload the image
      const uploadedFiles = await strapi.plugins.upload.services.upload.upload({
        data: {
          ref: "api::banner.banner",
          refId: newBanner.id,
          field: "Image",
        },
        files: file,
      });

      // Update the banner with the uploaded image
      const updatedBanner = await strapi.entityService.update(
        "api::banner.banner",
        {
          data: {
            Image: uploadedFiles[0].id,
          },
          populate: {
            Image: {
              fields: ["url"],
            },
          },
        }
      );

      ctx.body = updatedBanner;
    } catch (err) {
      console.error(err);
      ctx.body = err;
    }
  },
};
