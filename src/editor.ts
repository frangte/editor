import { EditorState, Plugin, Selection, TextSelection, Transaction } from 'prosemirror-state'
import { EditorView, Decoration } from 'prosemirror-view'
import type { NodeView } from 'prosemirror-view'
import { Schema, DOMParser, DOMSerializer, Node as PMNode, Mark as PMMark, NodeSpec, MarkSpec, SchemaSpec } from 'prosemirror-model'
import { MarkdownParser, MarkdownSerializer } from "prosemirror-markdown";
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import { undoInputRule, InputRule } from 'prosemirror-inputrules'
import { inputRules } from "./lib/inputrules"
import type Extension from "./extensions/Extension"
import NodeInstance from "./nodes/Node"
import MarkInstance from "./marks/Mark"

export default class Editor {

  view: EditorView;
  schema: Schema;
  plugins: Plugin[];
  keymaps: Plugin[];
  inputRules: InputRule[];
  nodes: { [name: string]: NodeSpec };
  marks: { [name: string]: MarkSpec };
  commands: Record<string, any>;

  options: {
    place: Node | ((p: Node) => void) | { mount: Node } | undefined;
    editorProps: Record<string, any>;
    editable: boolean;
    headless: boolean;
    extensions: Extension[];
    content: {type: string, content: any} | null;
    selection: Selection | null;
    topNode: string;
    parseOptions: Record<string, any>;
    onUpdate: Function;
    handleDOMEvents: {[name: string]: (this: unknown, view: EditorView<any>, event: Event) => boolean;}
  };

  constructor(options = {}) {

    this.options = {
      place: undefined,
      editorProps: {},
      editable: true,
      headless: false,
      extensions: [],
      content: undefined,
      topNode: 'doc',
      selection: null,
      parseOptions: {},
      onUpdate: () => null,
      handleDOMEvents: {},
      ...options
    }

    this.nodes = this.createNodes()
    this.marks = this.createMarks()
    this.schema = this.createSchema()

    /* If headless, no DOM component or interactivity with HTML. */
    this.options.headless == false && this.initializeView(); 
  }

  initializeView () {
    this.plugins = this.createPlugins()
    this.keymaps = this.createKeymaps()
    this.inputRules = this.createInputRules()
    this.view = this.createEditorView()
    this.commands = this.createCommands()
  }

  createNodes(): { [name: string]: NodeSpec } {
    return this.options.extensions
    .filter(extension => extension.type === "node")
    .reduce((nodes, node: NodeInstance) => ({...nodes, [node.name]: node.schema}), {})
  }

  createMarks(): { [name: string]: MarkSpec } {
    return this.options.extensions
    .filter(extension => extension.type === "mark")
    .reduce((marks, mark: MarkInstance) => ({...marks, [mark.name]: mark.schema}), {})
  }

  createSchema(): Schema {
    return new Schema({topNode: this.options.topNode, nodes: this.nodes, marks: this.marks});
  }

  createPlugins(): Plugin[] {
    return this.options.extensions.filter(extension => extension.plugins)
    .reduce((plugins, extension: Extension) => [...plugins, ...extension.plugins], [])
  }

  createKeymaps(): Plugin[] {
    const schema = this.schema
    return this.options.extensions.filter(extension => extension.keys)
    .map(extension => extension.keys({
      schema,
      nodeType: extension.type === "node" ? schema[`${extension.type}s`][extension.name] : undefined,
      markType: extension.type === "mark" ? schema[`${extension.type}s`][extension.name] : undefined,
      mac: typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false
    }))
    .map(keys => keymap(keys))
  }

  createInputRules(): InputRule[] {
    const schema = this.schema
    return this.options.extensions.filter(extension => extension.inputRules)
    .reduce((inputRules, extension) => inputRules.concat(...extension.inputRules({
      schema,
      nodeType: extension.type === "node" ? schema[`${extension.type}s`][extension.name] : undefined,
      markType: extension.type === "mark" ? schema[`${extension.type}s`][extension.name] : undefined,
    }))
    , [])
  }

  createCommands() {
    const schema = this.schema, view = this.view
    return this.options.extensions.filter(extension => extension.commands)
    .reduce((commands, extension) => {
      const value = extension.commands({
        schema,
        nodeType: extension.type === "node" ? schema[`${extension.type}s`][extension.name] : undefined,
        markType: extension.type === "mark" ? schema[`${extension.type}s`][extension.name] : undefined,
      })
      const apply = (callback, attrs) => {
        callback(attrs)(view.state, view.dispatch, view)
        view.focus()
      }
      // An individual command can be a function, or an array of commands to apply successively.
      const handle = (name, command) => {
        if (Array.isArray(command)) {
          commands[name] = attrs => command.forEach(callback => apply(callback, attrs))
        } else if (typeof command === 'function') {
          commands[name] = attrs => apply(command, attrs)
        }
      }
      // An extension can define a single command, or a Record<string, commands>.
      typeof value === 'function' ? handle(extension.name, value) : Object.entries(value).forEach(([name, command]) => handle(name, command))
      return commands
    }, {})
  }

  /**
   * Initialize the prosemirror-view; configure editor props of view here.
   * https://prosemirror.net/docs/ref/#view.EditorProps
   */
  createEditorView() {
    return new EditorView(this.options.place, {
      state: this.createEditorState(),
      nodeViews: this.createNodeViews(),
      attributes: state => ({class: `ProseMirror-${this.options.topNode}`}),
      handleDOMEvents: this.options.handleDOMEvents,
      dispatchTransaction: this.dispatchTransaction.bind(this),
    });
  }

  createEditorState() {
    return EditorState.create({
      schema: this.schema,
      doc: this.createDoc(this.options.content),
      selection: this.options.selection,
      plugins: [
        inputRules({rules: this.inputRules}),
        ...this.plugins,
        ...this.keymaps,
        keymap({Backspace: undoInputRule}),
        keymap(baseKeymap),
        // @ts-ignore
        dropCursor({class: "ProseMirror-dropcursor"}),
        gapCursor(),
      ],
    })
  }

  createDoc(doc: {type: string, content: any} | null): PMNode {
    if (!doc || !doc.content) { return this.schema.nodes[this.options.topNode].createAndFill() }
    switch (doc.type) {
      case "JSON":
        return this.schema.nodeFromJSON(doc.content);
      case "HTML":
        const element = document.createElement('div')
        element.innerHTML = doc.content.trim()
        return DOMParser.fromSchema(this.schema).parse(element, this.options.parseOptions)    
      case "Text": // TODO
        return this.schema.nodes[this.options.topNode].createAndFill() 
      case "Markdown": // TODO
        return this.schema.nodes[this.options.topNode].createAndFill() 
      default:
        return this.schema.nodes[this.options.topNode].createAndFill() 
    }
  }


  /**
   * Initialize custom NodeViews.
   * https://prosemirror.net/docs/ref/#view.EditorProps.nodeViews
   */
  createNodeViews() {
    return this.options.extensions.filter(ext => (ext instanceof NodeInstance || ext instanceof MarkInstance) && ext.customNodeView)
    .reduce((customNodeViews, extension: NodeInstance | MarkInstance) => ({
      [extension.name]: (node, view, getPos, decorations) => extension.customNodeView({extension, node, view, getPos, decorations}),
      ...customNodeViews, 
    }), {})
  }

  /**
   * Expose dispatchTransaction to allow for event handling of content.
   * TODO: replace this with an event emitter.
   * @param transaction 
   */
  dispatchTransaction(transaction: Transaction) {
    const newState = this.view.state.apply(transaction)
    this.view.updateState(newState)
    this.options.onUpdate({transaction, state: newState})
  }

  createMarkdownSerializer() {
    // Create a default 'toMarkdown' if does not exist on node or mark.
    const htmlSerializer = DOMSerializer.fromSchema(this.schema)
    const defaultToMarkdown = (state, node) => { 
      state.text(node.textContent) 
      state.ensureNewLine()
    };
    const nodes = Object.entries(this.nodes).reduce((items, [name, {toMarkdown}]) => ({
      ...items, [name]: toMarkdown || defaultToMarkdown}), {});
    const marks = Object.entries(this.marks).reduce((items, [name, {toMarkdown}]) => ({
      ...items, [name]: toMarkdown || defaultToMarkdown}), {});
    return new MarkdownSerializer(nodes, marks)
  }

  destroy() {
    this.view.destroy()
  }

  setContentAndSelection(content: {type: string, content: any} | null, selection: Selection | null) {
    let doc = this.createDoc(content), state = this.view.state;
    const newState = EditorState.create({schema: state.schema, doc, selection, storedMarks: state.storedMarks, plugins: state.plugins});
    this.view.updateState(newState)
  }

  setSelection(from = 0, to = 0): void {
    let { doc, tr } = this.view.state
    // Clamp from and to arguments in case of document change.
    from = Math.max(0, Math.min(from, doc.content.size)), to = Math.max(0, Math.min(to, doc.content.size))
    this.view.dispatch(tr.setSelection(TextSelection.create(doc, from, to)))
  }

  registerPlugin(plugin: Plugin) {
    const plugins = [plugin, ...this.view.state.plugins]
    const newState = this.view.state.reconfigure({plugins})
    this.view.updateState(newState)
  }

  get Text(): string {
    let doc = this.view.state.doc;
    return doc.textBetween(0, doc.content.size, "\n");
  }

  get HTML() {
    let doc = this.view.state.doc;
    let div = document.createElement('div')
    div.appendChild(DOMSerializer.fromSchema(this.schema).serializeFragment(doc.content))
    return div.innerHTML
  }

  get JSON() {
    let doc = this.view.state.doc;
    return doc.toJSON()
  }

  get Markdown(): string {
    let doc = this.view.state.doc;
    let markdownSerializer = this.createMarkdownSerializer();
    return markdownSerializer.serialize(doc)
  }

  static JSONtoText(json): string {
    return json.content ? json.content.reduce((text, child) => child.type == "text" ? (text + child.text) : (text + Editor.JSONtoText(child) + "\n"), "").trim() : "\n"
  }

}
