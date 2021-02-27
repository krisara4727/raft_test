// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.
require("@babel/register")({
  presets: [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "10"
        }
      }
    ]  ],
    plugins: ["@babel/plugin-transform-async-to-generator"]
  });
  
  // Import the rest of our application.
  module.exports = require('./server.js');