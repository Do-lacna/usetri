module.exports = {
  project: {
    ios: {},
    android: {},
  },
  dependency: {},
  commands: [
    {
      name: 'link',
      description: 'Link native fonts',
      func: () => {
        // Fonts are linked via the font files in assets/fonts
        console.log('Fonts linked successfully');
      },
    },
  ],
};

