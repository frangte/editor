import { EditorState, Plugin, Selection, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, Node as PMNode, NodeSpec, MarkSpec } from 'prosemirror-model';
import { MarkdownSerializer } from "prosemirror-markdown";
import { InputRule } from 'prosemirror-inputrules';
import type Extension from "./extensions/Extension";
export default class Editor {
    view: EditorView;
    schema: Schema;
    plugins: Plugin[];
    keymaps: Plugin[];
    inputRules: InputRule[];
    nodes: {
        [name: string]: NodeSpec;
    };
    marks: {
        [name: string]: MarkSpec;
    };
    commands: Record<string, any>;
    options: {
        place: Node | ((p: Node) => void) | {
            mount: Node;
        } | undefined;
        editorProps: Record<string, any>;
        editable: boolean;
        headless: boolean;
        extensions: Extension[];
        content: {
            type: string;
            content: any;
        } | null;
        selection: Selection | null;
        topNode: string;
        parseOptions: Record<string, any>;
        onUpdate: Function;
        handleDOMEvents: {
            [name: string]: (this: unknown, view: EditorView<any>, event: Event) => boolean;
        };
    };
    constructor(options?: {});
    initializeView(): void;
    createNodes(): {
        [name: string]: NodeSpec;
    };
    createMarks(): {
        [name: string]: MarkSpec;
    };
    createSchema(): Schema;
    createPlugins(): Plugin[];
    createKeymaps(): Plugin[];
    createInputRules(): InputRule[];
    createCommands(): {};
    createEditorView(): EditorView<any>;
    createEditorState(): EditorState<any>;
    createDoc(doc: {
        type: string;
        content: any;
    } | null): PMNode;
    createNodeViews(): {};
    dispatchTransaction(transaction: Transaction): void;
    createMarkdownSerializer(): MarkdownSerializer<any>;
    destroy(): void;
    setContentAndSelection(content: {
        type: string;
        content: any;
    } | null, selection: Selection | null): void;
    setSelection(from?: number, to?: number): void;
    registerPlugin(plugin: Plugin): void;
    get Text(): string;
    get HTML(): string;
    get JSON(): {
        [key: string]: any;
    };
    get Markdown(): string;
    static JSONtoText(json: any): string;
}
//# sourceMappingURL=editor.d.ts.map