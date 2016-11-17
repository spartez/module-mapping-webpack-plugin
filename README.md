# Module Mapping Webpack Plugin

This is a [webpack](webpack.github.io) plugin for mapping modules onto different files.

## Installation

Install the plugin with npm:

```sh
$ npm install module-mapping-webpack-plugin --save-dev
```

## Usage

```js
// webpack.config.js
const webpack = require('webpack');
const ModuleMappingPlugin = require('module-mapping-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new ModuleMappingPlugin({
      './foo.js': './foo-spartez.js',
      // ...
    })
  ]
};

// foo.js
export default () => console.log('Hello World!');

// foo-spartez.js
export default () => console.log('Hello Spartez!');

// index.js
import foo from './foo';
foo(); // → 'Hello Spartez!';
```
## License

The MIT License

Copyright :copyright: 2016 Spartez, https://spartez.com
