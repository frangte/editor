import Node from "./Node";
import { chainCommands, exitCode } from 'prosemirror-commands'
import type { Node as PMNode, NodeSpec } from "prosemirror-model";

function exitAndInsert(nodeType) {
  return chainCommands(exitCode, (state, dispatch) => {
    dispatch(state.tr.replaceSelectionWith(nodeType.create()).scrollIntoView())
    return true
  });
}

/**
 * This is an adaption of the ProseMirror hardbreak node.
 * Source: https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
 */
export default class HardBreak extends Node {

  get name() {
    return 'hardbreak'
  }

  get schema(): NodeSpec {
    return {
      inline: true,
      group: "inline",
      selectable: false,
      parseDOM: [{tag: 'br'}],
      toDOM() { return ['br'] },
    }
  }

  keys({nodeType}) {
    return {
      'Mod-Enter': exitAndInsert(nodeType),
      'Shift-Enter': exitAndInsert(nodeType),
    }
  }
}