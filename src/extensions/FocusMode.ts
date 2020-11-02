import Extension from "./Extension";
import type { EditorState, Transaction } from 'prosemirror-state';
import { Plugin, PluginKey } from 'prosemirror-state' 

/**
 * Adds ability to toggle the class 'ProseMirror-focusmode' onto the parent ProseMirror DOM node.
 * Note: This extension requires the Placeholder extension to be used in conjuction.
 */
export default class FocusMode extends Extension {

  pluginKey: PluginKey;

  constructor(options?) {
    super(options);
    this.pluginKey = new PluginKey('FocusMode');
  }

  get name() {
    return 'FocusMode';
  }

  keys() {
    return {
      "Shift-Ctrl-f": (state, dispatch) => {
        let focusMode = this.pluginKey.getState(state)
        dispatch(state.tr.setMeta('focusMode', !focusMode))
        return true;
      }
    };
  }

  commands() {
    return () => (state, dispatch) => {
      let focusMode = this.pluginKey.getState(state)
      dispatch(state.tr.setMeta('focusMode', !focusMode))
      return true;
    }
  }

  get plugins() {
    return [
      new Plugin({
        key: this.pluginKey,
        props: {
          attributes(state) {
            return this.getState(state) ? {class: "ProseMirror-focusmode"} : null;
          }
        },
        state: {
          init: (config: Object, state: EditorState) => true,
          apply: (tr: Transaction, oldState: EditorState) => tr.getMeta('focusMode') !== undefined ? tr.getMeta('focusMode') : oldState,
        },
      }),
    ];
  }
}