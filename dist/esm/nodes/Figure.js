import Node from './Node';
import { Plugin } from 'prosemirror-state';
export default class Figure extends Node {
    get name() {
        return "figure";
    }
    get schema() {
        return {
            content: "image figcaption",
            group: "block",
            parseDOM: [{ tag: "figure" }],
            toDOM: () => ["figure", 0],
        };
    }
    get plugins() {
        return [
            new Plugin({
                appendTransaction: (transactions, oldState, newState) => {
                    const tr = newState.tr;
                    let modified = false;
                    newState.doc.descendants((node, pos, parent) => {
                        if (node.type.name != "figure")
                            return;
                        const imageNode = node.firstChild;
                        if (imageNode && imageNode.attrs.src === undefined && imageNode.attrs.alt === undefined) {
                            tr.deleteRange(pos, pos + node.nodeSize);
                            modified = true;
                        }
                    });
                    if (modified)
                        return tr;
                }
            })
        ];
    }
}
