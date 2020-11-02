import type { MarkdownSerializerState } from "prosemirror-markdown";
import type { Node as PMNode, NodeSpec, NodeType, Schema } from "prosemirror-model";
import type { NodeView, EditorView, Decoration } from "prosemirror-view";
import Extension, { Command } from "../extensions/Extension";
export default abstract class Node extends Extension {
    constructor(options?: Record<string, any>);
    get type(): "node";
    abstract get schema(): NodeSpec;
    keys?({ nodeType, schema }: {
        nodeType: NodeType;
        schema: Schema;
    }): Function | Record<string, Function>;
    commands?({ nodeType, schema }: {
        nodeType: NodeType;
        schema: Schema;
    }): Record<string, Command> | Command;
    customNodeView?(props: CustomNodeViewProps): NodeView;
    get markdownToken(): string;
    toMarkdown(state: MarkdownSerializerState, node: PMNode): void;
    parseMarkdown(): void;
}
export declare type CustomNodeViewProps = {
    extension: Extension;
    node: PMNode;
    view: EditorView;
    getPos: () => number;
    decorations: Decoration[];
};
//# sourceMappingURL=Node.d.ts.map