import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import Node from "./Node";
export default class Paragraph extends Node {
    get name(): string;
    get schema(): NodeSpec;
    keys({ nodeType }: {
        nodeType: any;
    }): {
        "Shift-Ctrl-0": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    };
    commands({ nodeType }: {
        nodeType: any;
    }): () => (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    toMarkdown(state: any, node: PMNode): void;
    parseMarkdown(): {
        block: string;
    };
}
//# sourceMappingURL=Paragraph.d.ts.map