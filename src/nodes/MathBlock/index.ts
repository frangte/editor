import Node, { CustomNodeViewProps } from '../Node'
import { lineIndent, lineUndent, newlineIndent, deleteMathBlock } from "./keymaps.js"
import { toggleBlockType } from '../../commands'
import { textblockTypeInputRule } from 'prosemirror-inputrules'
import { setBlockType } from 'prosemirror-commands'
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import MathBlockView from "./mathblock-nodeview";

export default class MathBlock extends Node {

  get name() {
    return "mathblock";
  }

  get schema(): NodeSpec {
    return {
      attrs: { lang: { default: "stex" }},
      content: "text*",
      marks: "",
      group: "block",
      code: true,
      defining: true,
      selectable: true,
      parseDOM: [{ tag: "div.mathblock"}],
      toDOM: (node: PMNode) => ["div", {class: "mathblock"}, 0]
    };
  }

  get defaultOptions() {
    return {
      emptyText: "Mathblock"
    };
  }

  commands({nodeType, schema}) {
    return () => toggleBlockType(nodeType, schema.nodes.paragraph)
  }

  keys({nodeType}) {
    return {
      "Shift-Ctrl-\\": setBlockType(nodeType),
      "Tab": lineIndent,
      "Shift-Tab": lineUndent,
      "Enter": newlineIndent,
      "Backspace": deleteMathBlock
    }
  }

  inputRules({nodeType}) {
    return [
      textblockTypeInputRule(/^(\$\$\$)$/, nodeType),
    ];
  }

  toMarkdown(state, node) {
    state.write("$$\n");
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write("$$");
    state.closeBlock(node);
  }

  get markdownToken() {
    return "fence";
  }

  parseMarkdown() {
    return {
      block: "math_block",
      getAttrs: tok => ({ language: tok.info }),
    };
  }

  customNodeView(props: CustomNodeViewProps) {
    return new MathBlockView(props);
  }
}