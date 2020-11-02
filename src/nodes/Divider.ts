import Node from './Node'
import { nodeInputRule } from '../commands'
import type { Node as PMNode, NodeSpec } from "prosemirror-model";

export default class Divider extends Node {

  get name() {
    return 'divider'
  }

  get schema(): NodeSpec {
    return {
      group: 'block',
      parseDOM: [{tag: 'hr'}],
      toDOM() { return ['hr'] },
    }
  }

  commands({nodeType}) {
    return () => (state, dispatch) => dispatch(state.tr.replaceSelectionWith(nodeType.create()).scrollIntoView())
  }

  inputRules({nodeType}) {
    return [
      nodeInputRule(/^(?:---|___\s|\*\*\*\s)$/, nodeType),
    ];
  }
}