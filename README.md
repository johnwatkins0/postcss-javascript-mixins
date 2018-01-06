# postcss-js-mixins

Write CSS mixins in Javascript.

## Install

```
npm install --save-dev postcss-js-mixins
```

OR

```
yarn add --dev postcss-js-mixins
```

## Usage

In the CSS, include an at rule with the `js-mixin` keyword followed by parentheses containing the path to the JS file generating CSS. Optionally, also add a set of declarations that will be passed as an object to the JS function.

The file path resolves from the project root (i.e. the location of postcss.config.js and/or package.json). This can be overriden with the `rootDir` option passed via the PostCSS configuration (see below).

Each mixin should be a separate JS module exporting a single function in a dialect of Javascript your version of node understands. The function must return a string (the CSS).

### Example

#### CSS

```CSS
/* style.css */

body {
  color: red;
}

@js-mixin (mixins/makeColumns) {
  columnCount: 4;
}

main {
  overflow: auto;
}
```

#### Javascript

```Javascript
// ./mixins/makeColumns.js

module.exports = ({ columnCount }) => {
    let output = '';
    for (let i = 1; i <= columnCount; i += 1) {
        output += `
.col-${i} {
  width: ${100 / columnCount * i}%;
}
`;
    }

    return output;
};
```

### Options

#### rootDir

A path to prepend to the Javascript files when imported. The full path should be used. Defaults to the project root.
