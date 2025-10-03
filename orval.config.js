module.exports = {
  petstore: {
    input:
      'https://usetri-api.livelypond-189c8f13.polandcentral.azurecontainerapps.io/swagger/v1/swagger.json',
    output: {
      mode: 'tags-split',
      target: 'network/apicko.ts',
      schemas: 'network/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './network/api-client.ts',
          name: 'orvalApiClient',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: ['biome format --write'],
    },
  },
};
