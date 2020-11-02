import Node from './Node'
import { Plugin } from 'prosemirror-state'
import type { Node as PMNode, NodeSpec } from "prosemirror-model";

export default class Figure extends Node {

  get name() {
    return "figure";
  }

  get schema(): NodeSpec {
    return {
      content: "image figcaption",
      group: "block",
      parseDOM: [{tag: "figure"}],
      toDOM: () => ["figure", 0],
    };
  }

  get plugins() {
    return [
      new Plugin ({
        appendTransaction: (transactions, oldState, newState) => {
          const tr = newState.tr
          let modified = false;
          // TODO: Iterate through transactions instead of descendants.
          newState.doc.descendants((node, pos, parent) => {
            if (node.type.name != "figure") return;
            const imageNode = node.firstChild;
            if (imageNode && imageNode.attrs.src === undefined && imageNode.attrs.alt === undefined) {
              tr.deleteRange(pos, pos + node.nodeSize);
              modified = true;
            }
          })
          if (modified) return tr;
        }
      })
    ];
  }
}
