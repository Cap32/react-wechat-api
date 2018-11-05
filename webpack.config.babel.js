const { resolve } = require('path');
const { name } = require('./package.json');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const isDemo = process.env.REACT_DEMO && process.env.REACT_DEMO !== 'false';
const PROJECT_PATH = __dirname;
const inProject = (...args) => resolve(PROJECT_PATH, ...args);
const inSrc = inProject.bind(null, 'src');
const inTest = inProject.bind(null, 'test');
const inDemo = inProject.bind(null, 'demo');
const srcDir = inSrc();
const testDir = inTest();
const demoDir = inDemo();

module.exports = (webpackEnv = {}) => {
	const { minify } = webpackEnv;

	const config = {
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.js$/,
					include: [srcDir, testDir, demoDir],
					loader: 'babel-loader',
					options: { cacheDirectory: true },
				},
			],
		},
		resolve: {
			modules: [srcDir, 'node_modules'],
			extensions: ['.js'],
		},
		resolveLoader: {
			moduleExtensions: ['-loader'],
		},
		mode: process.env.NODE_ENV,
		optimization: {
			minimize: !!minify,
		},
		devServer: {
			contentBase: demoDir,
			port: 3000,
		},
	};

	if (isDemo) {
		config.entry = './demo';
		config.output = {
			filename: 'bundle.js',
			path: resolve(__dirname, 'demo'),
		};
		config.module.rules.push(
			{
				test: /\.scss$/,
				include: demoDir,
				use: ['style', 'css', 'postcss', 'sass'],
			},
			{
				test: /\.es$/,
				include: demoDir,
				use: ['raw'],
			},
		);
	}
	else {
		config.entry = './src';
		config.output = {
			filename: `${name}${minify ? '.min' : ''}.js`,
			path: resolve(__dirname, 'dist'),
			library: 'ReactWechatAPI',
			libraryTarget: 'umd',
		};
		config.externals = {
			react: 'React',
			'react-dom': 'ReactDom',
		};
	}

	return config;
};
