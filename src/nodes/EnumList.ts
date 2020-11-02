import Node from './Node'
import { wrappingInputRule } from 'prosemirror-inputrules'
import { toggleList } from "../commands"
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import { listInputRule } from "../commands";

export default class EnumList extends Node {

  get name() {
    return 'enumlist'
  }

  get schema(): NodeSpec {
    return {
      attrs: {start: {default: 1}},
      content: 'listitem+',
      group: 'block',
      parseDOM: [{tag: "ol", getAttrs(dom: HTMLElement) {
        return {start: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1}
      }}],
      toDOM: node => ['ol', {class: "enum-list", start: node.attrs.start }, 0],
    }
  }

  commands({nodeType, schema}) {
    return () => toggleList(nodeType)
  }

  keys({nodeType, schema}) {
    return {
      'Shift-Ctrl-9': toggleList(nodeType),
    }
  }

  inputRules({nodeType}) {
    return [
      wrappingInputRule(/^(\d+)\.\s$/, nodeType, match => ({ start: +match[1] }),
        (match, node) => node.childCount + node.attrs.start === +match[1],
      ),
    ]
  }

  toMarkdown(state, node) {
    const start = node.attrs.start || 1;
    const maxW = `${start + node.childCount - 1}`.length;
    const space = state.repeat(" ", maxW + 2);

    state.renderList(node, space, i => {
      const nStr = `${start + i}`;
      return state.repeat(" ", maxW - nStr.length) + nStr + ". ";
    });
  }

  parseMarkdown() {
    return { block: "started_list" };
  }
}