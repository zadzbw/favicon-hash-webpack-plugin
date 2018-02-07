const path = require('path');
const MemoryFileSystem = require('memory-fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadPlugin = require('../index');

const OUTPUT_DIR = path.join(__dirname, 'dist');
const chai = require('chai');

const { expect } = chai;

describe('favicon-hash-webpack-plugin test', () => {
  it('should add hash to favicon', (done) => {
    const compiler = webpack({
      entry: {
        js: path.join(__dirname, 'files', 'app.js'),
      },
      output: {
        path: OUTPUT_DIR,
        filename: 'bundle.js',
        publicPath: '/',
      },
      plugins: [
        new HtmlWebpackPlugin({
          favicon: 'test/favicon.ico',
        }),
        new PreloadPlugin(),
      ],
    }, (err, stats) => {
      expect(stats.hasErrors()).to.equal(false);
      const html = stats.compilation.assets['index.html'].source();
      // console.log(html);
      expect(html).to.match(new RegExp('<link rel="shortcut icon" href="/favicon.[0-9a-f]{32}.ico', 'i'));
      done();
    });
    compiler.outputFileSystem = new MemoryFileSystem();
  });

  it('should add hash to favicon with correct publicPath', (done) => {
    const publicPath = '/public';
    const compiler = webpack({
      entry: {
        js: path.join(__dirname, 'files', 'app.js'),
      },
      output: {
        path: OUTPUT_DIR,
        filename: 'bundle.js',
        publicPath,
      },
      plugins: [
        new HtmlWebpackPlugin({
          favicon: 'test/favicon.ico',
        }),
        new PreloadPlugin(),
      ],
    }, (err, stats) => {
      expect(stats.hasErrors()).to.equal(false);
      const html = stats.compilation.assets['index.html'].source();
      // console.log(html);
      expect(html).to.match(new RegExp(`<link rel="shortcut icon" href="${publicPath}/favicon.[0-9a-f]{32}.ico`, 'i'));
      done();
    });
    compiler.outputFileSystem = new MemoryFileSystem();
  });

  it('should throw error when html-webpack-plugin options.favicon is not a string', (done) => {
    const compiler = webpack({
      entry: {
        js: path.join(__dirname, 'files', 'app.js'),
      },
      output: {
        path: OUTPUT_DIR,
        filename: 'bundle.js',
        publicPath: '/',
      },
      plugins: [
        new HtmlWebpackPlugin({
          // favicon: 'test/favicon.ico',
        }),
        new PreloadPlugin(),
      ],
    }, (err, stats) => {
      expect(stats.hasErrors()).to.equal(true);
      expect(stats.compilation.errors).to.not.have.lengthOf(0);
      done();
    });
    compiler.outputFileSystem = new MemoryFileSystem();
  });
});

