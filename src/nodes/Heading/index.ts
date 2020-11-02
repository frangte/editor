import Node, { CustomNodeViewProps } from "../Node";
import { toggleBlockType } from '../../commands'
import { textblockTypeInputRule } from "prosemirror-inputrules"
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import HeadingNodeView from "./heading-nodeview"

export default class Heading extends Node {

  get name() {
    return 'heading'
  }

  get schema(): NodeSpec {
    return {
      attrs: {level: {default: 1}},
      content: "inline*",
      group: "block",
      defining: true,
      parseDOM: [
        {tag: "h1", attrs: {level: 1}},
        {tag: "h2", attrs: {level: 2}},
        {tag: "h3", attrs: {level: 3}},
        {tag: "h4", attrs: {level: 4}},
        {tag: "h5", attrs: {level: 5}},
        {tag: "h6", attrs: {level: 6}}
      ],
      toDOM(node: PMNode) { return ["h" + node.attrs.level, 0] },
      toMarkdown: this.toMarkdown
    }
  }

  get defaultOptions() {
    return {
      maxLevel: 6,
      modifyDOM: (node: PMNode, contentDOM: HTMLElement) => {
        let anchorSlug = node.textContent.replace(/[^a-zA-Z0-9\s]+/g,'').trim()
        anchorSlug === "" ? contentDOM.removeAttribute("id") : contentDOM.id = anchorSlug.replace(/\s+/g,'-');
      }
    };
  }

  commands({nodeType, schema}) {
    return attrs => toggleBlockType(nodeType, schema.nodes.paragraph, attrs)
  }

  inputRules({nodeType}) {
    return [
      textblockTypeInputRule(new RegExp("^(#{1," + this.options.maxLevel + "})\\s$"), nodeType, match => ({level: match[1].length}))
    ];
  }

  toMarkdown(state, node) {
    state.write(state.repeat("#", node.attrs.level) + " ")
    state.renderInline(node)
    state.closeBlock(node)
  }
}