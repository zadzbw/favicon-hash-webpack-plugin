const path = require('path');
const fs = require('fs');
const md5 = require('blueimp-md5');

// in webpack v4, compilation.fileDependencies is a instance of SortableSet that extends Set

const removeOriginalFavicon = (compilation, faviconPath) => {
  const basename = path.basename(faviconPath); // original faviconName
  // remove
  delete compilation.assets[basename];
};

// waiting for add other options
const defaultOptions = {};

class FaviconHashWebpackPlugin {
  constructor(options = {}) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.constructor.name, (compilation) => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(this.constructor.name, (htmlPluginData, cb) => {
        const { plugin: { options: { favicon } } } = htmlPluginData; // HtmlWebpackPlugin instance config
        if (Object.prototype.toString.call(favicon) !== '[object String]') {
          throw new Error(`${this.constructor.name}: html-webpack-plugin options favicon key should be a string`);
        }
        const faviconPath = path.resolve(compilation.compiler.context, favicon); // logical path
        const ext = path.extname(faviconPath);
        let publicPath = compilation.mainTemplate.getPublicPath({ hash: compilation.hash }) || '';
        if (publicPath && publicPath.substr(-1) !== '/') {
          publicPath += '/';
        }
        try {
          const source = fs.readFileSync(faviconPath);
          const stat = fs.statSync(faviconPath);
          const hash = md5(source, 'utf-8');
          const faviconName = `${path.basename(faviconPath, ext)}.${hash}${ext}`;
          removeOriginalFavicon(compilation, faviconPath);
          compilation.assets[faviconName] = {
            source() {
              return source;
            },
            size() {
              return stat.size;
            },
          };
          htmlPluginData.assets.favicon = publicPath + faviconName;
          cb(null, htmlPluginData);
        } catch (err) {
          throw new Error(`FaviconHashPlugin: could not load file ${faviconPath}`);
        }
      });
    });
  }
}

module.exports = FaviconHashWebpackPlugin;
