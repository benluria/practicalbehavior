const path = require('path');
const webpack = require('webpack');
const StringReplacePlugin = require('string-replace-webpack-plugin');

module.exports = {
  entry: { server: './server.ts' },
  resolve: { 
    extensions: ['.js', '.ts']
  },
  target: 'node',
  mode: 'none',
  // this makes sure we include node_modules and other 3rd party libraries
  externals: [/node_modules/],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/, parser: { system: true }},
      { enforce: 'post', test: /unicode-properties[\/\\]index.js$/, loader: "transform-loader?brfs"},
      { enforce: 'post', test: /fontkit[\/\\]index.js$/, loader: "transform-loader?brfs"},
      { enforce: 'post', test: /linebreak[\/\\]src[\/\\]linebreaker.js/, loader: "transform-loader?brfs"},    
			{ 
        enforce: 'pre',
				test: /pdfkit[/\\]js[/\\]/,
				loader: StringReplacePlugin.replace({
					replacements: [
						{
							pattern: "import fs from 'fs';",
							replacement: function () {
								return "var fs = require('fs');";
							}
						}
					]
				})
			}
    ]
  },
  plugins: [
    // Temporary Fix for issue: https://github.com/angular/angular/issues/11580
    // for 'WARNING Critical dependency: the request of a dependency is an expression'
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
    ),
    new StringReplacePlugin()
  ],
  node: {
    __dirname: true
  }
};
