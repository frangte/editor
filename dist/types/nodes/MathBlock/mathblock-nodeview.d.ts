import Node, { CustomNodeViewProps } from '../Node';
import type { Node as PMNode } from "prosemirror-model";
import type { Decoration, NodeView, EditorView } from 'prosemirror-view';
export default class MathBlockView implements NodeView {
    dom: HTMLElement;
    contentDOM: HTMLElement;
    extension: Node;
    node: PMNode;
    view: EditorView;
    getPos: () => number;
    decorations: Decoration[];
    render: HTMLElement;
    renderKatex(): void;
    constructor(props: CustomNodeViewProps);
    update(node: PMNode, decorations: Decoration[]): boolean;
}
//# sourceMappingURL=mathblock-nodeview.d.ts.map