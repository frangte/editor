"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Extension_1 = __importDefault(require("./Extension"));
const prosemirror_state_1 = require("prosemirror-state");
class FocusMode extends Extension_1.default {
    constructor(options) {
        super(options);
        this.pluginKey = new prosemirror_state_1.PluginKey('FocusMode');
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
            new prosemirror_state_1.Plugin({
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
exports.default = FocusMode;
