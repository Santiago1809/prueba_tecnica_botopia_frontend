module.exports = {
  routes: [
    {
      method: "GET",
      path: "/get-most-viewed-products",
      handler: "get-most-viewed-products.exampleAction",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
