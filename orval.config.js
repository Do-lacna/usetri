module.exports = {
  petstore: {
    input: "./apicko.json",
    output: {
      mode: "tags-split",
      target: "network/apicko.ts",
      schemas: "network/model",
      client: "react-query",
      //   override: {
      //     mutator: {
      //       path: "./network/api-client.ts",
      //       name: "apiClient",
      //     },
      //   },
    },
  },
};
