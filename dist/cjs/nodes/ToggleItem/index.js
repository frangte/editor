"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const prosemirror_schema_list_1 = require("prosemirror-schema-list");
const prosemirror_schema_list_2 = require("prosemirror-schema-list");
const nodeview_1 = __importDefault(require("./nodeview"));
const keymaps_1 = require("./keymaps");
class ToggleItem extends Node_1.default {
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
            'Ctrl-l': keymaps_1.toggleToggled,
            Enter: prosemirror_schema_list_1.splitListItem(nodeType),
            Tab: prosemirror_schema_list_2.sinkListItem(nodeType),
            'Shift-Tab': prosemirror_schema_list_2.liftListItem(nodeType),
        };
    }
    customNodeView(props) {
        return new nodeview_1.default(props);
    }
}
exports.default = ToggleItem;
