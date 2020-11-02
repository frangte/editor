import Node from './Node';
import { toggleList } from "../commands";
import { wrappingInputRule } from 'prosemirror-inputrules';
import { listInputRule } from "../commands";
export default class ItemList extends Node {
    get name() {
        return 'itemlist';
    }
    get schema() {
        return {
            content: 'listitem+',
            group: 'block',
            parseDOM: [{ tag: 'ul' }],
            toDOM(node) { return ['ul', { class: "item-list" }, 0]; },
            draggable: true,
        };
    }
    commands({ nodeType, schema }) {
        return () => toggleList(nodeType);
    }
    keys({ nodeType, schema }) {
        return {
            'Shift-Ctrl-8': toggleList(nodeType),
        };
    }
    toMarkdown(state, node) {
        state.renderList(node, "  ", () => "- ");
    }
    parseMarkdown() {
        return { block: "bullet_list" };
    }
    inputRules({ nodeType }) {
        return [
            listInputRule(/^([-+*])\s$/, nodeType),
            wrappingInputRule(/^([-+*])\s$/, nodeType),
        ];
    }
}
