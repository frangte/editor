"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Extension_1 = __importDefault(require("./Extension"));
const prosemirror_state_1 = require("prosemirror-state");
class TrailingNode extends Extension_1.default {
    get name() {
        return 'trailingNode';
    }
    get defaultOptions() {
        return {
            node: 'paragraph',
        };
    }
    get plugins() {
        const plugin = new prosemirror_state_1.PluginKey(this.name);
        return [
            new prosemirror_state_1.Plugin({
                key: plugin,
                view: () => ({
                    update: view => {
                        const { state } = view;
                        const insertNodeAtEnd = plugin.getState(state);
                        if (!insertNodeAtEnd) {
                            return;
                        }
                        const { doc, schema, tr } = state;
                        const type = schema.nodes[this.options.node];
                        const transaction = tr.insert(doc.content.size, type.create());
                        view.dispatch(transaction);
                    },
                }),
                state: {
                    init: (_, state) => state.tr.doc.lastChild.type.name == "paragraph",
                    apply: (tr, prevState) => !tr.docChanged ? prevState : tr.doc.lastChild.type.name == "paragraph"
                },
            }),
        ];
    }
}
exports.default = TrailingNode;
