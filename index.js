const path = require('path');
const fs = require('fs');
const md5 = require('blueimp-md5');

const removeOriginalFavicon = (compilation, faviconPath) => {
  const basename = path.basename(faviconPath); // original faviconName
  // remove
  compilation.fileDependencies = compilation.fileDependencies.filter(name => name !== basename);
  delete compilation.assets[basename];
};

// waiting for add other options
const defaultOptions = {};

class FaviconHashPlugin {
  constructor(options = {}) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  apply(compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, cb) => {
        const { plugin } = htmlPluginData; // HtmlWebpackPlugin instance
        const faviconPath = path.resolve(compilation.compiler.context, plugin.options.favicon); // logical path
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
          compilation.fileDependencies.push(faviconName); // add new favicon
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

module.exports = FaviconHashPlugin;
