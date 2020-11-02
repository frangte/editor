## editor

This is a rich text editor built upon the [ProseMirror](https://prosemirror.net/) framework.

It is based off [tiptap](https://tiptap.dev/) and [rich-markdown-editor](https://github.com/outline/rich-markdown-editor), 
but tries to stay agnostic to Vue and React.

### usage

> :construction: The recommended way to use this editor is to fork this repo and use it as a reference in building your own rich text editor. There is no substitute to learning [ProseMirror](https://prosemirror.net/docs/ref/).

To use with plain JavaScript, pass in the DOM element where you'd want to mount as `place` and
an array of extensions to use.

```js
import { Editor, Text, Paragraph, Doc } from "editor";

let place = document.querySelector("#mount")
let editor = new Editor({
  place,
  extensions: [
    new Text(),
    new Paragraph(),
    new Doc(), 
  ]
})
```

### similar libraries

- [tiptap](https://tiptap.dev/)
- [rich-markdown-editor](https://github.com/outline/rich-markdown-editor)
- [remirror](https://github.com/remirror/remirror)