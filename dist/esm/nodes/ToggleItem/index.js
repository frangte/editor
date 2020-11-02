import Node from '../Node';
import { splitListItem } from "prosemirror-schema-list";
import { sinkListItem, liftListItem } from 'prosemirror-schema-list';
import CustomNodeView from "./nodeview";
import { toggleToggled } from './keymaps';
export default class ToggleItem extends Node {
    get name() {
        return "toggleitem";
    }
    get schema() {
        return {
            attrs: { toggled: { default: false } },
            content: "paragraph block*",
            draggable: true,
            parseDOM: [{
                    tag: `li.toggle-item`,
                    getAttrs: dom => ({ toggled: dom.getAttribute('data-toggled') === 'true' }),
                }],
            toDOM(node) {
                return ['li', { class: "toggle-item", 'data-toggled': node.attrs.toggled }, ['span', { class: 'toggle-checkbox', contenteditable: 'false' }], ['div', { class: 'toggle-content' }, 0]];
            },
        };
    }
    keys({ nodeType }) {
        return {
            'Ctrl-l': toggleToggled,
            Enter: splitListItem(nodeType),
            Tab: sinkListItem(nodeType),
            'Shift-Tab': liftListItem(nodeType),
        };
    }
    customNodeView(props) {
        return new CustomNodeView(props);
    }
}
