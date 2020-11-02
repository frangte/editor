  
import Node from "./Node";
import { toggleWrap } from "../commands";
import { wrappingInputRule } from "prosemirror-inputrules";
import type { NodeSpec } from "prosemirror-model";

export default class Blockquote extends Node {

  get name() {
    return "blockquote"
  }

  get schema(): NodeSpec {
    return {
      content: "block+",
      group: "block",
      parseDOM: [{tag: "blockquote"}],
      toDOM() { return ["blockquote", 0] },
    };
  }

  inputRules({nodeType}) {
    return [
      wrappingInputRule(/^>\s$/, nodeType)
    ];
  }

  commands({nodeType}) {
    return () => toggleWrap(nodeType);
  }

  keys({nodeType}) {
    return {
      "Mod-]": toggleWrap(nodeType),
    };
  }

  toMarkdown(state, node) {
    state.wrapBlock("> ", null, node, () => state.renderContent(node));
  }

  parseMarkdown() {
    return { block: "blockquote" };
  }
}