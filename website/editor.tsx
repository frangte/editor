import React from "react"
import "./editor.css"

import { 
  Editor,
  Doc,
  Text,
  Title,
  TitleDoc,
  HardBreak,
  Blockquote,
  Divider,
  Paragraph,
  CodeBlock,
  MathBlock,
  Heading,
  Math,
  Figcaption,
  Figure,
  Image,
  ListItem,
  ItemList,
  EnumList,
  TodoItem,
  TodoList,
  ToggleItem,
  ToggleList,
  Highlight,
  TrailingNode,
  History,
  Placeholder,
  Bold,
  Code,
  Underline,
  Italic,
  Strike,
  Link,
  SyntaxHighlight,
  Punctuation,
  MarkdownDragDrop,
  Keymaps,
  FocusMode,
} from '../src'

import EditorContent from "./EditorContent"

import applyDevTools from "prosemirror-dev-tools"

interface EditorComponentProps {

}

interface EditorComponentState {
  editor: Editor;
}

export default class EditorComponent extends React.PureComponent<EditorComponentProps, EditorComponentState> {

  constructor(props: EditorComponentProps) {
    super(props)

    this.state = {
      editor: new Editor({
        onUpdate: (tr) => {
          localStorage.setItem('content', JSON.stringify(this.state.editor.JSON))
        },
        topNode: "titledoc",
        extensions: [

          new Text(),
          new Paragraph(),
          new Doc(), 

          new TitleDoc(),
          new Title(),
          new Punctuation(),
          // new Collaboration({ydoc: this.ydoc, prov: this.prov, user}),
          new Blockquote(),
          new CodeBlock(),
          new HardBreak(),
          new Divider(),
          new Heading(),


          new Math(),
          new MathBlock(),

          new ListItem(),
          new ItemList(),
          new EnumList(),

          new TodoItem(),
          new TodoList(),

          new ToggleItem(),
          new ToggleList(),
        
          new Figcaption(),
          new Image(),
          new Figure(),

          new Bold(),
          new Code(),
          new Strike(),
          new Italic(),
          new Underline(),
          new Link(),
          new Highlight(),
          
          new History(),
          //new TrailingNode({node: 'paragraph', notAfter: ['paragraph']}),
          //new MarkdownDragDrop(),
          new FocusMode(),
          new Placeholder(),
          new SyntaxHighlight(),
          new Keymaps()
        ]
      })
    }
  }

  componentDidMount() {
    applyDevTools(this.state.editor.view);
  }

  render () {
    return (
      <div className="editor">
        <EditorContent editor={this.state.editor}/>
      </div>
    )
  }
}