var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

var path = require('path');
module.exports = {
	entry: path.resolve(__dirname, './src/index.js'),
	output: {
		filename: 'js/[name].bundle.js',
		path: path.resolve(__dirname, './dist'),
		chunkFilename: '[id].[chunkhash].chunk.js',
		publicPath: '/',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.js?/,
				include: path.resolve(__dirname, './src'),
				loader: 'babel-loader',
				query: {
					presets: ['@babel/env', '@babel/react'],
				},
			},
			{
				test: /\.(scss)$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(png|j?g|svg|gif|ico)?$/,
				use: 'file-loader',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, './public/index.html'),
			filename: 'index.html',
		}),
		new MiniCssExtractPlugin({
			filename: 'style.css',
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.EnvironmentPlugin(['NODE_ENV', 'API_URL'])
	],
	devServer: {
		historyApiFallback: true,
		hot: true,
		open: false,
		contentBase: './src',
		host: 'teacher.localhost',
		port: 8080,
	},
};
