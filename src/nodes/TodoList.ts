import Node from './Node'
import { toggleList } from "../commands"
import { wrappingInputRule } from 'prosemirror-inputrules'
import type { Node as PMNode, NodeSpec } from "prosemirror-model";

export default class TodoList extends Node {

  get name() {
    return 'todolist'
  }

  get schema(): NodeSpec {
    return {
      group: 'block',
      content: 'todoitem+',
      toDOM() { return ['ul', {class: 'todo-list'}, 0] },
      parseDOM: [{tag: 'ul.todo-list'}],
    }
  }

  commands({nodeType, schema}) {
    return () => toggleList(nodeType)
  }

  toMarkdown(state, node) {
    state.renderList(node, "  ", () => "- ");
  }

  parseMarkdown() {
    return { block: "checkbox_list" };
  }
}