const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // REMOVE QUALQUER PREPROCESSADOR WEBPACK
      return config;
    },
    bundler: "esbuild",
  },
})
