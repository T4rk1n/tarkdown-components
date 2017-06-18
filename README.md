# tarkdown-components

Markdown and highlight.js related react components.

## Usage

### Highlight style manager

The highlight manager is a global object to manage the asynchronous loading of styles and languages. 
No style are loaded by default.

```javascript
import { highlightManager } from 'tarkdown-components'
// Check the ready state
if (highlightManager.ready) {
    // change highlight style
    highlightManager.loadHighlightStyle('obsidian')
    // list available style
    highlightManager.availableStyles.forEach(style => console.log(style))
}
```

### Table of content parser

Two parser are available to create a table of content. 
Use the result with the TableOfContent component.

```javascript
import { parseTocDom, parseTocMarkdown } from 'tarkdown-component'

// parse the dom for element of type in headings parameters
const defaultTocBuilderOptions = {
    headings: ['h1', 'h2', 'h3', 'h4', 'h5'],
    callback: (value) => value,
    addId: false
}
const domToc = parseTocDom(defaultTocBuilderOptions)
// parse a markdown string.
const mdToc = parseTocMarkdown('# title')
```

### Components

##### DangerousMarkdown

Dangerously set the inner html of a div once the markdown has been transformed into html by the remarkable lib.

##### highlightStyleSelector

A select component to change the loaded highlight style of the page.

##### TableOfContent

Take a toc as props made by the parsers.

##### MarkdownEditor

wip

## License

[MIT](./LICENSE)

## Credits

- [remarkable](https://github.com/jonschlinkert/remarkable)
- [highlight.js](https://github.com/isagalaev/highlight.js)

