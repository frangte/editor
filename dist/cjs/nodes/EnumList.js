"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const commands_1 = require("../commands");
class EnumList extends Node_1.default {
    get name() {
        return 'enumlist';
    }
    get schema() {
        return {
            attrs: { start: { default: 1 } },
            content: 'listitem+',
            group: 'block',
            parseDOM: [{ tag: "ol", getAttrs(dom) {
                        return { start: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1 };
                    } }],
            toDOM: node => ['ol', { class: "enum-list", start: node.attrs.start }, 0],
        };
    }
    commands({ nodeType, schema }) {
        return () => commands_1.toggleList(nodeType);
    }
    keys({ nodeType, schema }) {
        return {
            'Shift-Ctrl-9': commands_1.toggleList(nodeType),
        };
    }
    inputRules({ nodeType }) {
        return [
            prosemirror_inputrules_1.wrappingInputRule(/^(\d+)\.\s$/, nodeType, match => ({ start: +match[1] }), (match, node) => node.childCount + node.attrs.start === +match[1]),
        ];
    }
    toMarkdown(state, node) {
        const start = node.attrs.start || 1;
        const maxW = `${start + node.childCount - 1}`.length;
        const space = state.repeat(" ", maxW + 2);
        state.renderList(node, space, i => {
            const nStr = `${start + i}`;
            return state.repeat(" ", maxW - nStr.length) + nStr + ". ";
        });
    }
    parseMarkdown() {
        return { block: "started_list" };
    }
}
exports.default = EnumList;
