import Node from './Node';
import { splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list';
export default class ListItem extends Node {
    get name() {
        return 'listitem';
    }
    get schema() {
        return {
            content: 'paragraph block*',
            defining: true,
            draggable: false,
            parseDOM: [{ tag: 'li' }],
            toDOM(node) { return ['li', { class: "list-item" }, 0]; },
        };
    }
    keys({ nodeType }) {
        return {
            Enter: splitListItem(nodeType),
            Tab: sinkListItem(nodeType),
            'Shift-Tab': liftListItem(nodeType),
        };
    }
    toMarkdown(state, node) {
        state.renderContent(node);
    }
    parseMarkdown() {
        return { block: "list_item" };
    }
}
