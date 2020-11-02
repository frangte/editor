import type { Decoration, NodeView, EditorView } from "prosemirror-view";
import type { Node as PMNode } from "prosemirror-model";
import Node, { CustomNodeViewProps } from "../Node";
export default class TodoItemView implements NodeView {
    dom: HTMLElement;
    contentDOM: HTMLElement;
    extension: Node;
    node: PMNode;
    view: EditorView;
    getPos: () => number;
    decorations: Decoration[];
    constructor(props: CustomNodeViewProps);
    update(node: PMNode, decorations: Decoration[]): boolean;
}
//# sourceMappingURL=nodeview.d.ts.map