# favicon-hash-webpack-plugin

This is an extension plugin for [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) - it can add hash to favicon file, just like `favicon.[hash].ico`, the hash algorithm is md5 now, and use [blueimp-md5](https://github.com/blueimp/JavaScript-MD5) to calculate hash.

## Installation

### Notice

> * it requires node **v8** or higher
> * it requires [webpack](https://webpack.js.org/) **>=v4.0.0** and [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) **>=3.0.0**
> * if you want to use this plugin in webpack v3, please check [v1 branch](https://github.com/zadzbw/favicon-hash-webpack-plugin/tree/v1)

### Install

You can install this plugin with npm:

```bash
npm install favicon-hash-webpack-plugin --save-dev
```

or you can use yarn:

```bash
yarn add favicon-hash-webpack-plugin -D
```

## Usage

First, require the plugin in your webpack config:

```js
const FaviconHashPlugin = require('favicon-hash-webpack-plugin');
```

finally, set favicon in `html-webpack-plugin` and add the plugin in `plugins` options after `html-webpack-plugin`

```js
...
plugins: [
  new HtmlWebpackPlugin({
    favicon: 'path-to-favicon/favicon.ico', // favicon path
  }),
  new FaviconHashPlugin({}),
],
...
```

and the following icon link will be injected into `<head>`:

```html
<link rel="shortcut icon" href="your-public-path/favicon.e513b5416b8dc82513c174d5ccde5c21.ico">
```

## Options

This plugin only has the default options now.

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
