const path = require( 'path' )
const CleanWebpackPlugin = require( 'clean-webpack-plugin' )
// const CopyWebpackPlugin = require( 'copy-webpack-plugin' )


module.exports = {
	mode : "development",
	entry: {
		'tsreact.js': './src/index.ts',
	},
	output: {
		filename: '[name]',
		path    : path.resolve( __dirname, 'build' )
	},
	devtool: 'source-map',
	module : {
		rules: [
			{
				test   : /\.ts?$/,
				use    : 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		alias: {
		},
		extensions: [
			'.ts',
			'.js'
		],
	},
	plugins: [
		new CleanWebpackPlugin( [ 'build' ] ),
		// new CopyWebpackPlugin( [
		// ] ),
	]
}
