import Node from './Node'
import type { Node as PMNode, NodeSpec } from "prosemirror-model";

export default class Figcaption extends Node {

  get name() {
    return "figcaption"
  }

  get schema(): NodeSpec {
    return {
      content: "inline*",
      group: "figure",
      // TODO: get image alt if figcaption not found using prosemirror-model
      parseDOM: [{tag: "figcaption"}],
      toDOM: () => ["figcaption", 0],
    };
  }
}