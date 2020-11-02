"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mark_1 = __importDefault(require("./Mark"));
const markInputRule_1 = __importDefault(require("../commands/markInputRule"));
const prosemirror_commands_1 = require("prosemirror-commands");
function backticksFor(node, side) {
    let m, len = 0;
    if (node.isText)
        while ((m = /`+/g.exec(node.text)) !== undefined)
            len = Math.max(len, m[0].length);
    let result = len > 0 && side > 0 ? " `" : "`";
    for (let i = 0; i < len; i++)
        result += "`";
    if (len > 0 && side < 0)
        result += " ";
    return result;
}
class Code extends Mark_1.default {
    get name() {
        return 'code';
    }
    get schema() {
        return {
            inclusive: false,
            toDOM() { return ["code", { "spellCheck": "false" }, 0]; },
            parseDOM: [{ tag: "code" }],
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule_1.default(/(?:`)([^`]+)(?:`)$/, markType),
        ];
    }
    keys({ markType }) {
        return {
            'Mod-e': prosemirror_commands_1.toggleMark(markType),
        };
    }
    get toMarkdown() {
        return {
            open(state, mark, parent, index) {
                return backticksFor(parent.child(index), -1);
            },
            close(state, mark, parent, index) {
                return backticksFor(parent.child(index - 1), 1);
            },
            escape: false,
        };
    }
    parseMarkdown() {
        return { mark: "code_inline" };
    }
}
exports.default = Code;
