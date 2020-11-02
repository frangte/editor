import Extension from "./Extension";
import { Plugin, PluginKey } from 'prosemirror-state';
export default class FocusMode extends Extension {
    constructor(options) {
        super(options);
        this.pluginKey = new PluginKey('FocusMode');
    }
    get name() {
        return 'FocusMode';
    }
    keys() {
        return {
            "Shift-Ctrl-f": (state, dispatch) => {
                let focusMode = this.pluginKey.getState(state);
                dispatch(state.tr.setMeta('focusMode', !focusMode));
                return true;
            }
        };
    }
    commands() {
        return () => (state, dispatch) => {
            let focusMode = this.pluginKey.getState(state);
            dispatch(state.tr.setMeta('focusMode', !focusMode));
            return true;
        };
    }
    get plugins() {
        return [
            new Plugin({
                key: this.pluginKey,
                props: {
                    attributes(state) {
                        return this.getState(state) ? { class: "ProseMirror-focusmode" } : null;
                    }
                },
                state: {
                    init: (config, state) => true,
                    apply: (tr, oldState) => tr.getMeta('focusMode') !== undefined ? tr.getMeta('focusMode') : oldState,
                },
            }),
        ];
    }
}
