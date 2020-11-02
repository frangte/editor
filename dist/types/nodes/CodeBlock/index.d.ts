import Node from '../Node';
import { lineIndent, lineUndent, newLine, deleteCodeBlock, toggleLineNumbers } from "./keymaps.js";
import type { NodeSpec } from "prosemirror-model";
export default class CodeBlock extends Node {
    get name(): string;
    get schema(): NodeSpec;
    commands({ nodeType, schema }: {
        nodeType: any;
        schema: any;
    }): () => (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    keys({ nodeType }: {
        nodeType: any;
    }): {
        "Shift-Ctrl-\\": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        Tab: typeof lineIndent;
        "Shift-Tab": typeof lineUndent;
        Enter: typeof newLine;
        "Ctrl-l": typeof toggleLineNumbers;
        Backspace: typeof deleteCodeBlock;
    };
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    toMarkdown(state: any, node: any): void;
    get markdownToken(): string;
    parseMarkdown(): {
        block: string;
        getAttrs: (tok: any) => {
            language: any;
        };
    };
}
//# sourceMappingURL=index.d.ts.map