"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const keymaps_js_1 = require("./keymaps.js");
const commands_1 = require("../../commands");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_commands_1 = require("prosemirror-commands");
const mathblock_nodeview_1 = __importDefault(require("./mathblock-nodeview"));
class MathBlock extends Node_1.default {
    get name() {
        return "mathblock";
    }
    get schema() {
        return {
            attrs: { lang: { default: "stex" } },
            content: "text*",
            marks: "",
            group: "block",
            code: true,
            defining: true,
            selectable: true,
            parseDOM: [{ tag: "div.mathblock" }],
            toDOM: (node) => ["div", { class: "mathblock" }, 0]
        };
    }
    get defaultOptions() {
        return {
            emptyText: "Mathblock"
        };
    }
    commands({ nodeType, schema }) {
        return () => commands_1.toggleBlockType(nodeType, schema.nodes.paragraph);
    }
    keys({ nodeType }) {
        return {
            "Shift-Ctrl-\\": prosemirror_commands_1.setBlockType(nodeType),
            "Tab": keymaps_js_1.lineIndent,
            "Shift-Tab": keymaps_js_1.lineUndent,
            "Enter": keymaps_js_1.newlineIndent,
            "Backspace": keymaps_js_1.deleteMathBlock
        };
    }
    inputRules({ nodeType }) {
        return [
            prosemirror_inputrules_1.textblockTypeInputRule(/^(\$\$\$)$/, nodeType),
        ];
    }
    toMarkdown(state, node) {
        state.write("$$\n");
        state.text(node.textContent, false);
        state.ensureNewLine();
        state.write("$$");
        state.closeBlock(node);
    }
    get markdownToken() {
        return "fence";
    }
    parseMarkdown() {
        return {
            block: "math_block",
            getAttrs: tok => ({ language: tok.info }),
        };
    }
    customNodeView(props) {
        return new mathblock_nodeview_1.default(props);
    }
}
exports.default = MathBlock;
