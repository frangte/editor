import { setBlockType } from "prosemirror-commands";
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import Node from "./Node";

export default class Paragraph extends Node {

  get name() {
    return "paragraph";
  }

  get schema(): NodeSpec {
    return {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM() { return ["p", 0] },
    };
  }

  keys({nodeType}) {
    return {
      "Shift-Ctrl-0": setBlockType(nodeType),
    };
  }

  commands({nodeType}) {
    return () => setBlockType(nodeType);
  }

  toMarkdown(state, node: PMNode) {
    // render empty paragraphs as hard breaks to ensure that newlines are
    // persisted between reloads (this breaks from markdown tradition)
    if (
      node.textContent.trim() === "" &&
      node.childCount === 0 &&
      !state.inTable
    ) {
      state.write("\\\n");
    } else {
      state.renderInline(node);
      state.closeBlock(node);
    }
  }

  parseMarkdown() {
    return { block: "paragraph" };
  }
}