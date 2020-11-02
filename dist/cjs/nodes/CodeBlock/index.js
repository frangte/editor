"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const keymaps_js_1 = require("./keymaps.js");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_commands_1 = require("prosemirror-commands");
const parserules_1 = __importDefault(require("./parserules"));
class CodeBlock extends Node_1.default {
    get name() {
        return "codeblock";
    }
    get schema() {
        return {
            attrs: { lang: { default: "" }, lineNumbers: { default: false } },
            content: "text*",
            marks: "",
            group: "block",
            code: true,
            defining: true,
            parseDOM: [...parserules_1.default, { tag: "pre.codeblock", getAttrs(dom) { return { ...dom.dataset }; }, preserveWhitespace: "full" }, { tag: "pre", preserveWhitespace: "full" }],
            toDOM(node) { return ["pre", { class: "codeblock", ...node.attrs.lang && { "data-lang": node.attrs.lang } }, ["code", { spellcheck: "false" }, 0]]; },
        };
    }
    commands({ nodeType, schema }) {
        return () => prosemirror_commands_1.setBlockType(nodeType);
    }
    keys({ nodeType }) {
        return {
            "Shift-Ctrl-\\": prosemirror_commands_1.setBlockType(nodeType),
            "Tab": keymaps_js_1.lineIndent,
            "Shift-Tab": keymaps_js_1.lineUndent,
            "Enter": keymaps_js_1.newLine,
            "Ctrl-l": keymaps_js_1.toggleLineNumbers,
            "Backspace": keymaps_js_1.deleteCodeBlock,
        };
    }
    inputRules({ nodeType }) {
        return [
            prosemirror_inputrules_1.textblockTypeInputRule(/^```([^\s]*)[\s\n]$/, nodeType, match => ({ ...match[1] && { lang: match[1] } }))
        ];
    }
    toMarkdown(state, node) {
        state.write("```" + node.attrs.lang + "\n");
        state.text(node.textContent, false);
        state.ensureNewLine();
        state.write("```");
        state.closeBlock(node);
    }
    get markdownToken() {
        return "fence";
    }
    parseMarkdown() {
        return {
            block: "code_block",
            getAttrs: tok => ({ language: tok.info }),
        };
    }
}
exports.default = CodeBlock;
