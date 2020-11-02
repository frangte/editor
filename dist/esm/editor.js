import { EditorState, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model';
import { MarkdownSerializer } from "prosemirror-markdown";
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { undoInputRule } from 'prosemirror-inputrules';
import { inputRules } from "./lib/inputrules";
import NodeInstance from "./nodes/Node";
import MarkInstance from "./marks/Mark";
export default class Editor {
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
        };
        this.nodes = this.createNodes();
        this.marks = this.createMarks();
        this.schema = this.createSchema();
        this.options.headless == false && this.initializeView();
    }
    initializeView() {
        this.plugins = this.createPlugins();
        this.keymaps = this.createKeymaps();
        this.inputRules = this.createInputRules();
        this.view = this.createEditorView();
        this.commands = this.createCommands();
    }
    createNodes() {
        return this.options.extensions
            .filter(extension => extension.type === "node")
            .reduce((nodes, node) => ({ ...nodes, [node.name]: node.schema }), {});
    }
    createMarks() {
        return this.options.extensions
            .filter(extension => extension.type === "mark")
            .reduce((marks, mark) => ({ ...marks, [mark.name]: mark.schema }), {});
    }
    createSchema() {
        return new Schema({ topNode: this.options.topNode, nodes: this.nodes, marks: this.marks });
    }
    createPlugins() {
        return this.options.extensions.filter(extension => extension.plugins)
            .reduce((plugins, extension) => [...plugins, ...extension.plugins], []);
    }
    createKeymaps() {
        const schema = this.schema;
        return this.options.extensions.filter(extension => extension.keys)
            .map(extension => extension.keys({
            schema,
            nodeType: extension.type === "node" ? schema[`${extension.type}s`][extension.name] : undefined,
            markType: extension.type === "mark" ? schema[`${extension.type}s`][extension.name] : undefined,
            mac: typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false
        }))
            .map(keys => keymap(keys));
    }
    createInputRules() {
        const schema = this.schema;
        return this.options.extensions.filter(extension => extension.inputRules)
            .reduce((inputRules, extension) => inputRules.concat(...extension.inputRules({
            schema,
            nodeType: extension.type === "node" ? schema[`${extension.type}s`][extension.name] : undefined,
            markType: extension.type === "mark" ? schema[`${extension.type}s`][extension.name] : undefined,
        })), []);
    }
    createCommands() {
        const schema = this.schema, view = this.view;
        return this.options.extensions.filter(extension => extension.commands)
            .reduce((commands, extension) => {
            const value = extension.commands({
                schema,
                nodeType: extension.type === "node" ? schema[`${extension.type}s`][extension.name] : undefined,
                markType: extension.type === "mark" ? schema[`${extension.type}s`][extension.name] : undefined,
            });
            const apply = (callback, attrs) => {
                callback(attrs)(view.state, view.dispatch, view);
                view.focus();
            };
            const handle = (name, command) => {
                if (Array.isArray(command)) {
                    commands[name] = attrs => command.forEach(callback => apply(callback, attrs));
                }
                else if (typeof command === 'function') {
                    commands[name] = attrs => apply(command, attrs);
                }
            };
            typeof value === 'function' ? handle(extension.name, value) : Object.entries(value).forEach(([name, command]) => handle(name, command));
            return commands;
        }, {});
    }
    createEditorView() {
        return new EditorView(this.options.place, {
            state: this.createEditorState(),
            nodeViews: this.createNodeViews(),
            attributes: state => ({ class: `ProseMirror-${this.options.topNode}` }),
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
                inputRules({ rules: this.inputRules }),
                ...this.plugins,
                ...this.keymaps,
                keymap({ Backspace: undoInputRule }),
                keymap(baseKeymap),
                dropCursor({ class: "ProseMirror-dropcursor" }),
                gapCursor(),
            ],
        });
    }
    createDoc(doc) {
        if (!doc || !doc.content) {
            return this.schema.nodes[this.options.topNode].createAndFill();
        }
        switch (doc.type) {
            case "JSON":
                return this.schema.nodeFromJSON(doc.content);
            case "HTML":
                const element = document.createElement('div');
                element.innerHTML = doc.content.trim();
                return DOMParser.fromSchema(this.schema).parse(element, this.options.parseOptions);
            case "Text":
                return this.schema.nodes[this.options.topNode].createAndFill();
            case "Markdown":
                return this.schema.nodes[this.options.topNode].createAndFill();
            default:
                return this.schema.nodes[this.options.topNode].createAndFill();
        }
    }
    createNodeViews() {
        return this.options.extensions.filter(ext => (ext instanceof NodeInstance || ext instanceof MarkInstance) && ext.customNodeView)
            .reduce((customNodeViews, extension) => ({
            [extension.name]: (node, view, getPos, decorations) => extension.customNodeView({ extension, node, view, getPos, decorations }),
            ...customNodeViews,
        }), {});
    }
    dispatchTransaction(transaction) {
        const newState = this.view.state.apply(transaction);
        this.view.updateState(newState);
        this.options.onUpdate({ transaction, state: newState });
    }
    createMarkdownSerializer() {
        const htmlSerializer = DOMSerializer.fromSchema(this.schema);
        const defaultToMarkdown = (state, node) => {
            state.text(node.textContent);
            state.ensureNewLine();
        };
        const nodes = Object.entries(this.nodes).reduce((items, [name, { toMarkdown }]) => ({
            ...items, [name]: toMarkdown || defaultToMarkdown
        }), {});
        const marks = Object.entries(this.marks).reduce((items, [name, { toMarkdown }]) => ({
            ...items, [name]: toMarkdown || defaultToMarkdown
        }), {});
        return new MarkdownSerializer(nodes, marks);
    }
    destroy() {
        this.view.destroy();
    }
    setContentAndSelection(content, selection) {
        let doc = this.createDoc(content), state = this.view.state;
        const newState = EditorState.create({ schema: state.schema, doc, selection, storedMarks: state.storedMarks, plugins: state.plugins });
        this.view.updateState(newState);
    }
    setSelection(from = 0, to = 0) {
        let { doc, tr } = this.view.state;
        from = Math.max(0, Math.min(from, doc.content.size)), to = Math.max(0, Math.min(to, doc.content.size));
        this.view.dispatch(tr.setSelection(TextSelection.create(doc, from, to)));
    }
    registerPlugin(plugin) {
        const plugins = [plugin, ...this.view.state.plugins];
        const newState = this.view.state.reconfigure({ plugins });
        this.view.updateState(newState);
    }
    get Text() {
        let doc = this.view.state.doc;
        return doc.textBetween(0, doc.content.size, "\n");
    }
    get HTML() {
        let doc = this.view.state.doc;
        let div = document.createElement('div');
        div.appendChild(DOMSerializer.fromSchema(this.schema).serializeFragment(doc.content));
        return div.innerHTML;
    }
    get JSON() {
        let doc = this.view.state.doc;
        return doc.toJSON();
    }
    get Markdown() {
        let doc = this.view.state.doc;
        let markdownSerializer = this.createMarkdownSerializer();
        return markdownSerializer.serialize(doc);
    }
    static JSONtoText(json) {
        return json.content ? json.content.reduce((text, child) => child.type == "text" ? (text + child.text) : (text + Editor.JSONtoText(child) + "\n"), "").trim() : "\n";
    }
}
