module.exports = {
  usetri: {
    input:
      'https://usetri-api.livelypond-189c8f13.polandcentral.azurecontainerapps.io/swagger/v1/swagger.json',
    output: {
      mode: 'tags-split',
      target: 'src/network/apicko.ts',
      schemas: 'src/network/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/network/api-client.ts',
          name: 'orvalApiClient',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: ['biome format --write'],
    },
  },
};
