const path = require('path');
const webpack = require('webpack');
const StringReplacePlugin = require('string-replace-webpack-plugin');

module.exports = {
  entry: { server: './server.ts' },
  resolve: { 
    extensions: ['.js', '.ts'],
    alias: {
			fs: path.join(__dirname, './src/browser-extensions/virtual-fs.js')
		}
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
			// for fs don't use babel _interopDefault command
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
			},
			{
				test: /\.js$/,
				include: /(pdfkit)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								"@babel/preset-env",
								{
									targets: {
										"ie": "11"
									},
									modules: false,
									useBuiltIns: 'usage',
									loose: true
								}
							]
						],
						plugins: ["@babel/plugin-transform-modules-commonjs"]
					}
				}
			},
			/* temporary bugfix for FileSaver: added hack for mobile device support, see https://github.com/bpampuch/pdfmake/issues/1664 */
			/* waiting to merge and release PR https://github.com/eligrey/FileSaver.js/pull/533 */
			{
				test: /FileSaver.min.js$/, loader: StringReplacePlugin.replace({
					replacements: [
						{
							pattern: '"download"in HTMLAnchorElement.prototype',
							replacement: function () {
								return '(typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype)';
							}
						}
					]
				})
			},

			{ enforce: 'post', test: /fontkit[/\\]index.js$/, loader: "transform-loader?brfs" },
			{ enforce: 'post', test: /linebreak[/\\]src[/\\]linebreaker.js/, loader: "transform-loader?brfs" }
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
