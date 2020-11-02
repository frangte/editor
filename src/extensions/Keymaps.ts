import Extension from './Extension'
import { TextSelection } from "prosemirror-state"

function selectEntireTextblock(state, dispatch, view) {
  if (state.selection.empty === false) { return false }
  const $anchor = state.selection.$anchor 
  if ($anchor.parent.isTextblock === false) { return false }
  const nodeStart = $anchor.pos - $anchor.parentOffset, nodeEnd = nodeStart + $anchor.parent.content.size;
  dispatch(state.tr.setSelection(TextSelection.create(state.doc, nodeStart, nodeEnd)))
  return true;
}

/**
 * Define useful keymaps here.
 */
export default class Keymaps extends Extension {
  get name() {
    return 'keymaps'
  }
  keys() {
    return {
      "Mod-c": selectEntireTextblock,
      "Mod-x": selectEntireTextblock,
    }
  }
}