const path = require('path');

module.exports = {
    mode:'development',
    entry: './src/js/app.js',
    output: {
        filename: 'js/bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
    }
};