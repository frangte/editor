import Extension from "./Extension";
import { Plugin, PluginKey } from 'prosemirror-state';
export default class TrailingNode extends Extension {
    get name() {
        return 'trailingNode';
    }
    get defaultOptions() {
        return {
            node: 'paragraph',
        };
    }
    get plugins() {
        const plugin = new PluginKey(this.name);
        return [
            new Plugin({
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
